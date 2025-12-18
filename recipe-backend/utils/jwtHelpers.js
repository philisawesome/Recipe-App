import jwt from 'jsonwebtoken';
import { accessTokenSecret, refreshTokenSecret } from "../config.js";

export function createAccessToken(payload){
    return jwt.sign(payload, accessTokenSecret, {expiresIn:"1d"});
}

export function createRefreshToken(payload){
    return jwt.sign(payload, refreshTokenSecret, {expiresIn:"30d"});
}
