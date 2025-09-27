require('dotenv').config();

module.exports={
    port: process.env.PORT || 4000,
    mongoURI: process.env.MONGO_URI,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || 'default_secret',
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || 'default_secret'
};