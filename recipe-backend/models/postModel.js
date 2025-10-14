const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    content: {
        type: String, 
        trim:true,
        maxlength:2000
    },
    images: {
        type: [String],
        required: true, 
        default: [],
        validate: {
            validator: arr => Array.isArray(arr) && arr.length > 0,
            message: 'At least one image is required'
        }
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    likes: {
        type: [{type:mongoose.Schema.Types.ObjectId, ref:'User'}], 
        default: []
    },
    comments:{
        type:[{type:mongoose.Schema.Types.ObjectId, ref:'Comment'}],
        default:[]

    },








},
{timestamps: true}


);
//so you can sort post by newest 
postSchema.index({ user: 1, createdAt: -1 });


module.exports = mongoose.model("Post", postSchema);
