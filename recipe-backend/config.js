import dotenv from 'dotenv'
dotenv.config()

export const port= process.env.PORT || 4000
export const mongoURI= process.env.MONGO_URI || "mongodb://localhost:27017/recipeDB"
export const accessTokenSecret= process.env.ACCESS_TOKEN_SECRET || 'default_secret'
export const refreshTokenSecret= process.env.REFRESH_TOKEN_SECRET || 'default_secret'
export const node_env= process.env.NODE_ENV || "dev"
export const frontend_url = process.env.FRONTEND_URL ||  "http://localhost:4000"

export default {
    port: process.env.PORT || 4000,
    mongoURI: process.env.MONGO_URI || "mongodb://localhost:27017/recipeDB",
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || 'default_secret',
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || 'default_secret',
	node_env: process.env.NODE_ENV || "dev",
    frontend_url: process.env.FRONTEND_URL || "http://localhost:4000",
    
};
