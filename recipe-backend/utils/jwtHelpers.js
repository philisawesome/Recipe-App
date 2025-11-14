const jwt = require('jsonwebtoken');
import { accessTokenSecret, refreshTokenSecret } from "../config";

function createAccessToken(payload){
    return jwt.sign(payload, accessTokenSecret, {expiresIn:"15m"});
}

function createRefreshToken(payload){
    return jwt.sign(payload, refreshTokenSecret, {expiresIn:"30d"});
}

module.exports= {createAccessToken, createRefreshToken};
