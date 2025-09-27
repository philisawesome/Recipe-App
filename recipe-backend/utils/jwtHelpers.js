const jwt = require('jsonwebtoken');

function createAccessToken(payload){
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn:"15m"});
    
}

function createRefreshToken(payload){
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET,{expiresIn:"30d"});
}




module.exports= {createAccessToken, createRefreshToken};