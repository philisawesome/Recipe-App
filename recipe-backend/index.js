require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors= require('cors');
const cookieParser = require('cookie-parser');
const config = require('./config');
const authRoutes= require('./routes/authRoutes');
const profRoutes= require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require ('./routes/commentRoutes');


const app= express();



//middleware stuff??? 
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser()); 




//connecting to mongo
mongoose.connect(config.mongoURI)
  .then(()=>{
    console.log("Connected to MongoDB");
  app.listen(config.port,()=>{
  console.log(`RECIPE APP on  http://localhost:${config.port}`);



})
  })
  .catch((err)=> console.error("MongoDB connection error:",err));


//Routes
app.get('/', (req,res)=>{
  res.send('Welcome to Recipe Social API');
});

//auth
app.use('/api/auth',authRoutes);

//profile 
app.use('/api',profRoutes);

//post
app.use('/api', postRoutes);

//comment 
app.use('/api', commentRoutes);


