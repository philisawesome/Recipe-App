const mongoose= require ('mongoose');

const userSchema= new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        maxLength: 25,
        lowercase: true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase: true


    },
    password:{
        type:String,
        required:true,
        select:false
        

    },
    name:{
        type:String,
        required:false,
        trim:true,
        maxLength: 25

    },
    avatar:{ type:String, 
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png" 
    },
    followers: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        default: []
    },
    following: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    default: []
    },  

    saved: {
        type: [{type:mongoose.Schema.Types.ObjectId, ref: "Post"}],
        default: []
    }
   
   
    




},
{timestamps: true}
);


module.exports= mongoose.model("User", userSchema);