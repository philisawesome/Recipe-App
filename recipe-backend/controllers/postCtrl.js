const Posts= require("../models/postModel");
const Comments = require("../models/commentModel");
const Users = require("../models/userModel");
const mongoose = require("mongoose");


function pagination(q, {defaultLimit = 9, maxLimit = 50}= {}){
    const page = Math.max(parseInt(q.page) || 1 , 1 );
    const limit = Math.min(Math.max(parseInt(q.limit) || defaultLimit, 1), maxLimit);
    const skip = (page-1) * limit;
    return {page, limit, skip};

}


async function createPost(req, res){
    try {
        const {content = '', images = []} = req.body || {};
        if(!Array.isArray(images) || images.length === 0) {
            return res.status(200).json({error:'Please add photo(s)'});
        }
        const newPost = await Posts.create({
            content,
            images,
            user: req.user._id
            });

        res.status(201).json({
            msg: 'Post created successfully.',
            newPost: {...newPost.toObject(), user: req.user}
        });

    }catch(err){
        console.error(err);
        res.status(500).json({error: 'Server Error'});
    }
}

//feed of me + following
async function getPosts(req, res){
    try{
        const {page, limit, skip}= pagination(req.query);
        const ids = [...(req.user.following || []), req.user._id];

        const posts = await Posts.find ( {user:{$in: ids}})
            .sort({createdAt: -1})
            .skip(skip)
            .limit(limit)
            .populate('user likes', 'avatar username')
            .populate ({
                path: 'comments', 
                options: {sort: {createdAt: -1}, limit: 2},
                select: 'content user createdAt',
                populate: {path: 'user', select: 'avatar username'}
            })
            .lean();
            // if posts === limit there are more ppost
            const hasMore = posts.length === limit;
            res.status(200).json({
                msg:'Successful',
                page,
                limit,
                hasMore,
                result: posts.length,
                posts

            });
    }catch(err){
        console.error(err);
        res.status(500).json({error: 'Server Error'});

    }

}

async function updatePost(req, res){
    try{
        const {content , images } = req.body

        const post = await Posts.findOneAndUpdate(
            {_id: req.params.id , user: req.user._id},
            {content , images},
            {new: true, runValidators: true}
        )
            .populate('user likes', 'avatar username')
            .populate({
                path: 'comments',
                options: {sort: {createdAt: -1}, limit: 2},
                select: 'content user createdAt',
                populate:{path: 'user', select: 'avatar username '}

            }); 

            if (!post) return res.status(404).json({error:"Post does not exist or not yours."});

            res.status(200).json({
                msg:'Post updated successfully',
                newPost: post
            });

    }catch(err){
        console.error(err);
        res.status(500).json({error: 'Server Error'});

    }
}
async function likePost(req, res){
    try {
        const updated = await Posts.findOneAndUpdate(
            {_id: req.params.id},
            {$addToSet: {likes: req.user._id}},
            {new:true}
        );
        if (!updated) return res.status(404).json({error: 'Post does not exist.'});
        res.status(200).json({msg: 'Post liked successfully'});

    }catch(err){
        console.error(err);
        res.status(500).json({error:'Server Error'});
    }
}

async function unLikePost(req, res){
    try{
        const updated = await Posts.findOneAndUpdate(
            {_id: req.params.id},
            {$pull:{likes: req.user._id}},
            {new:true}
        )
        if(!updated){
            return res.status(404).json({error:'Post dont not exist.'});

        }
        res.status(200).json({msg:'Post unliked successfully'});
    }catch(err) {
        console.error(err);
        res.status(500).json({error:'Server Error'});
    } 

}

//post by user
async function getUserPosts(req, res){
    try{
        const {page, limit, skip} = pagination(req.query);
        if(!mongoose.isValidObjectId(req.params.id)){
            return res.status(400).json({error:'Invalid user id.'});

        }

        const posts = await Posts.find({user: req.params.id})
            .sort({createdAt:-1})
            .skip(skip)
            .limit(limit)
            .lean();

            const hasMore = posts.length === limit; 

            res.status(200).json({page, limit, hasMore, result: posts.length,posts});


    }catch(err){
        console.error(err);
        res.status(500).json({error:'Server Error'});
    }

}

// get a singular post 

async function getPost(req, res){
    try{
        if (!mongoose.isValidObjectId(req.params.id)){
            return res.status(404).json({error:'post not found'});
        }

        const commentLimit = Math.min(parseInt(req.query.commentsLimit) || 10, 50);

        const post =  await Posts.findById(req.params.id)
        .populate('user likes', 'avatar username ')
        .populate({
            path:'comments',
            options:{sort:{createdAt: -1}, limit: commentLimit},
            select:'content user createdAt',
            populate:{path:'user', select:'username avatar'}
        })
        .lean();

        if(!post) return res.status(404).json({error:'Post does not exist.'});

        res.status(200).json({
            post,
            commentsReturned: post.comments?.length || 0 

        });
    }catch(err){
        console.error(err)
        res.status(500).json({error:'Server Error'});
    }


}
//random post
async function getPostDiscover (req, res){
    try {
        const exclude = [...(req.user.following || [] ), req.user._id];
        const size = parseInt(req.query.num || '8' );

        const posts = await Posts.aggregate([
            {$match: {user: {$nin: exclude}}},
            {$sample:{ size }}

        ]);
        res.status(200).json({
            msg: 'Success',
            result: posts.length,
            posts
        });

    }catch(err){
        console.error(err);
        res.status(500).json({error: 'Server Error'});
    }

}

async function deletePost(req, res){
    try{
        const post = await Posts.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });
        if (!post){
            return res.status(404).json ({error:'Post does not exist or is not yours'});

        }
        await Comments.deleteMany({ post: post._id});
        res.status(200).json({
            msg:'Post deleted successfully',
            deletedPost:{...post.toObject(), user:req.user}
        })

    }catch(err){
        console.error(err);
        res.status(500).json({error:'Server Error'});
    }
}

async function savePost(req,res){
    try{
        const updated = await Users.findOneAndUpdate(
            {_id: req.user._id},
            {$addToSet:{saved:req.params.id}},
            {new:true}
        );
        if(!updated){
            return res.status(404).json({error:'User not found'}); 
        }
        res.status(200).json({msg:'Post saved successfully'});
    }
    catch(err){
        console.error(err);
        res.status(500).json({error:'Server Error'});
    }

}

async function unSavePost(req,res){
    try{
        const updated = await Users.findOneAndUpdate(
            {_id: req.user._id},
            {$pull: {saved:req.params.id}},
            {new:true}
        )
        if(!updated){
            return res.status(404).json({error:'User not found'});
        }
        res.status(200).json({msg:'Post unsaved successfully'});

    }catch(err){
        console.error(err);
        res.status(500).json({error:'Server Error'});
    }

}

async function getSavedPost(req,res){
    try{
        const {page, skip, limit } = pagination(req.query);
        const ids = req.user.saved || [];
        
        if (!ids.length){
            return res.status(200).json({
                page,
                limit,
                hasMore: false , 
                result: 0 ,
                savedPosts: []
            })
        }

        const savedPosts = await Posts.find ({_id: {$in: ids}})
            .sort({createdAt: -1})
            .skip(skip)
            .limit(limit)
            .lean();

        const hasMore = savedPosts.length === limit;

        res.json({page , limit , hasMore , result: savedPosts.length, savedPosts})

    }catch(err){
        console.error(err);
        res.status(500).json({error: 'Server Error'});
    }


}

module.exports = {
    createPost, 
    getPosts,
    updatePost,
    likePost, 
    unLikePost,
    getUserPosts,
    getPost,
    getPostDiscover, 
    deletePost,
    savePost, 
    unSavePost,
    getSavedPost
    
}