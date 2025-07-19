const express = require('express');
const mongoose= require ('mongoose');
const cors= require('cors');
const config = require('./config');

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
app.post('/api/register', (req,res)=>{



});
app.post('/api/login', (req,res)=>{


});

app.get('/api/profile', (req,res)=>{


});

