const express = require('express');
const mongoose= require ('mongoose');
const cors= require('cors');

const app= express();
const PORT= 3000;

app.use(cors());
app.use(express.json());

//Routes
app.get('/', (req,res)=>{
  res.send('Welcome to Recipe Social API');
});
app.listen(PORT,()=>{
  console.log(`RECIPE APP on port ${PORT}`);

})

//connecting to mongo
mongoose.connect("mongodb://localhost:27017/recipesDB")
  .then(()=>console.log("Connected to MongoDB"))
  .catch((err)=> console.error("MongoDB connection error:",err));

