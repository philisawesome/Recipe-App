const mongoose= require ('mongoose');

const userSchema= new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        maxLength: 25
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true

    },
    password:{
        type:String,
        required:true

    },
    name:{
        type:String,
        required:false,
        trim:true,
        maxLength: 25

    }



});

module.exports= mongoose.model("User", userSchema);