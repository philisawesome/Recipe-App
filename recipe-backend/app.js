import dotenv from 'dotenv'
dotenv.config()

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import config from './config.js';
import authRoutes from './routes/authRoutes.js';
import profRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import commentRoutes from './routes/commentRoutes.js';

export const app = express();

//middleware stuff??? 
app.use(cors({
  origin: 'http://localhost:4321',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser()); 

app.get('/healthz', (req, res) => res.send('healthy'));


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

export async function connectDatabase() {
	//connecting to mongo
	await mongoose.connect(config.mongoURI).then(()=>{
		console.log("Connected to MongoDB");
		app.listen(config.port,()=>{
			console.log(`RECIPE APP on http://localhost:${config.port}`);
		})
	})
}
