const express = require('express');
const mongoose = require('mongoose');
const cors= require('cors');
const config = require('./config');
const authRoutes= require('./routes/auth');

const app= express();

//middleware stuff??? 
app.use(cors());
app.use(express.json());





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

app.get('/api/profile', (req,res)=>{


});

