import mongoose from "mongoose"

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required:true,
        maxlength: 2000
    },

    //who wrote it 
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true,
        index: true
     },
     //where it exist 
     post: {
        type: mongoose.Schema.Types.ObjectId, 
        ref:'Post',
        required: true,
        index: true
     },
     //owner of post
     postUser:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true 
     },
     //threading
     replyTo:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default:null,
        index:true
     },
     likes:{
        type:[{type: mongoose.Schema.Types.ObjectId,
        ref: 'User'}],
        default: []

     }


},
{timestamps:true}
);
// so u can sort by newest comments 
commentSchema.index({ post: 1, createdAt: -1 });

export default mongoose.model('Comment', commentSchema);
