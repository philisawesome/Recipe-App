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
            return res.status(400).json({error:'Please add photo(s)'});
        }
        const newPost = await Posts.create({
            content,
            images,
            user: req.iser._id
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
                result: post.length,
                posts

            });
    }catch(err){
        console.error(err);
        res.status(500).json({error: 'Server Error'});

    }

}

async function updatePost(req, res){

    
}