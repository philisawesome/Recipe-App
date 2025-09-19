const Users = require('../models/Users');
const jwt = require('jsonwebtoken');

async function auth (req,res, next){
    try{

        const authHeader = req.header("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({error:"No token provided"});
        }

        const token= authHeader.split(" ")[1];

        let decoded;
        try{
            decoded= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);

        }catch(err){
            return res.status(401).json({error:"Token is invalid or expired."});
        }

        const user= await Users.findById(decoded.id).select("-password").lean();
        if (!user){
            return res.status(401).json({error:"User not found."});

        }
        //returns authenticated user to the requested user
        req.user= user;
        next();



    }catch(err){
        console.error("Auth middleware error:",err);
        return res.status(500).json({error:"Server error."});


    }




}



module.exports={
    auth
};
