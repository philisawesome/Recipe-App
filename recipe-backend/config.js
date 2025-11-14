require('dotenv').config();

module.exports={
    port: process.env.PORT || 4000,
    mongoURI: process.env.MONGO_URI || "mongodb://localhost:27017",
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || 'default_secret',
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || 'default_secret',
	node_env: process.env.NODE_ENV || "dev",
};
