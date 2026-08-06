import Posts from "../models/postModel.js";
import Comments from "../models/commentModel.js";
import Users from "../models/userModel.js";
import mongoose from "mongoose";

const isId = v => mongoose.isValidObjectId(v);

export async function createComment (req, res){
    try{
        const {postId, content = '', reply = null} = req.body ?? {};

        if(!isId(postId)){
            return res.status(400).json({error:'Post does not exist'});       
        }
        if(!content.trim()){
            return res.status(400).json({error:'Content is required'});
        }

        const post = await Posts.findById(postId);
        if (!post){
            return res.status(404).json({error:'Post does not exist'});
        }
        if(reply){
            if (!isId(reply)){
                return res.status(400).json({error:'Invalid parent comment ID'});
            }
            const parent = await Comments.findById(reply).select('post');
            if(!parent) return res.status(404).json({error:'Comment does not exist.'});
			await Comments.findOneAndUpdate(
				{_id: reply},
				{$inc: { numReplies: 1}}
			)

            if(String(parent.post)!== String(post._id)){
                return res.status(400).json({error:'Parent comments belongs to a different post'});
            }
        }
        let newComment = await Comments.create({
            user: req.user._id,
            content:content.trim(),
            replyTo: reply || null, 
            post: post._id,
            postUser: post.user
        }) 

		const user = await Users.findById(req.user._id)
			.select('username avatar');

		newComment.user = user

        await Posts.updateOne({_id:post._id}, {$addToSet:{comments:newComment._id}});
    
        res.status(201).json({msg:'Comment created.', comment:newComment});



    }catch(err){
        console.error(err);
        res.status(500).json({error:'Server Error'});
    }
}

// populate 'liked' comments by this user
// todo show if any of your following has liked this post
export function commentsWithLikedField(comments, user) {
	if (!user) return comments;

	return comments.map(({likes, ...comment}) => ({
		...comment,
		liked: likes.some((id) => id.equals(user._id)),
	}))
}

export async function getReplies(req, res) {
	// todo paginate
	try {
		if (!isId(req.params.id)) 
			return res.status(400).json({ error: "Invalid comment id." });

		let replies = await Comments.find({
			replyTo: req.params.id,
		})
        .populate('user', 'username avatar')
		.sort({createdAt: -1})
		.lean();

		replies = commentsWithLikedField(replies, req.user)	

		res.json(replies)
	} catch (err) {
        console.error(err);
        res.status(500).json({error: 'Server Error'});
    }
}

export async function updateComment(req,res) {
    try{
        const {content = ''}  =req.body || {};
        if (!isId(req.params.id)) return res.status(400).json({ error: "Invalid comment id." });

        if(!content.trim()){
            res.status(400).json({error:'Content is required'});
        }
        const comment = await Comments.findOneAndUpdate(
            {_id: req.params.id, user:req.user._id},
            {content:content.trim()},
            {new:true, runValidators: true}
        );

        if(!comment){
           return res.status(404).json({error:'comment not found'});
        }

        res.json({
            msg:'Comment successfully updated',
            newComment: comment
        })



    }catch(err){
        console.error(err);
        res.status(500).json({error:'Server Error'})
    }
}
//delete by comment author OR post owner
export async function deleteComment(req,res){
    try{
        if (!isId(req.params.id)) return res.status(400).json({ error: "Invalid comment id." });

        const comment = await Comments.findOneAndDelete({
            _id: req.params.id,
            $or:[{ user: req.user._id}, {postUser: req.user._id}]
        });

        if(!comment){
            return res.status(404).json({error:'Comment not foun or not authorized.'});

        }

        await Comments.deleteMany({replyTo: comment._id});

        await Posts.updateOne({ _id: comment.post}, {$pull: {comments:comment._id}});

        res.status(200).json({msg:'Comment deleted successfully.'});


    }catch(err){
        console.error(err);
        res.status(500).json({error:'Server Error'});
    }



}


export async function likeComment(req,res){
    try{
        if (!isId(req.params.id)) return res.status(400).json({ error: "Invalid comment id." });

        const updated = await Comments.findOneAndUpdate(
            {_id: req.params.id, likes: { $ne: req.user._id }},
            {$addToSet: {likes: req.user._id}, $inc: {numLikes: 1}},
            {new:true}
        );

        if (!updated){
            return res.status(404).json({msg:'Comment does Not exist.'});

        }
        res.status(200).json({ msg: 'Comment liked successfully.'});

    }catch(err){
        console.error(err);
        res.status(500).json({msg: err.message});
    }
}

export async function unLikeComment (req, res){
    try{
        if (!isId(req.params.id)) return res.status(400).json({ error: "Invalid comment id." });

        const updated = await Comments.findOneAndUpdate(
            {_id: req.params.id, likes: { $eq: req.user._id }},
            {$pull: {likes: req.user._id}, $inc: {numLikes: -1}},
            {new:true}
        );
        if (!updated){
            return res.status(404).json({error:'Comment not found.'});

        } 
        res.status(200).json({msg:'Comment unliked successfully.'});

    }catch(err){
        console.error(err);
        res.status(500).json({error: 'Server Error'});
    }

 
}
export default {
	createComment:createComment,
    updateComment:updateComment, 
    deleteComment:deleteComment,
    likeComment:likeComment,
    unLikeComment:unLikeComment,
    getReplies:getReplies,
}
