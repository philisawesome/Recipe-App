// Populates mongodb with 4 users and 8 posts
// Does not delete any data
//
// run with "node populate-db.js"

import mongoose from "mongoose"
import { mongoURI } from "../recipe-backend/config.js"
import User from "../recipe-backend/models/userModel.js";
import Post from "../recipe-backend/models/postModel.js";

const url = "http://stovetop.cc/content"

const mockUsers = [
  {
    username: "chefmaria",
    email: "maria.rossi@example.com",
    password: "pass",
    name: "Maria Rossi",
    avatar: `${url}/avatars/blank.jpg`,
  },
  {
    username: "bbqking_dan",
    email: "daniel.torres@example.com",
    password: "pass",
    name: "Daniel Torres",
    avatar: `${url}/avatars/blank.jpg`,
  },
  {
    username: "veganvibes_sam",
    email: "samantha.lee@example.com",
    password: "pass",
    name: "Samantha Lee",
    avatar: `${url}/avatars/blank.jpg`,
  },
  {
    username: "pastapro_luke",
    email: "lucas.bianchi@example.com",
    password: "pass",
    name: "Lucas Bianchi",
    avatar: `${url}/avatars/blank.jpg`,
  },
];

// userIndex refers to the index in mockUsers above
const mockPosts = [
  {
    userIndex: 0,
    title: "Spaghetti Carbonara",
    ingredients: ["200g spaghetti", "100g pancetta", "2 eggs", "50g Pecorino Romano", "Black pepper"],
    instructions: ["Boil spaghetti until al dente.", "Fry pancetta until crispy.", "Whisk eggs and cheese together.", "Toss pasta with pancetta off heat.", "Add egg mixture and toss quickly. Serve."],
    content: "A true Roman classic. No cream, just technique.",
    images: [`${url}/blank.jpg`],
	days: "a",
	hrs: "a",
	mins: "a",
	serving: "a",
	difficulty: "a"
  }
];

const populate = async () => {
	await mongoose.connect(mongoURI);
	console.log("Connected to MongoDB");

	//await User.deleteMany({});
  	await Post.deleteMany({});

	//const insertedUsers = await User.insertMany(mockUsers);

	for (let i=0; i<50; ++i) {
		await Post.insertOne(
			{
				...mockPosts[0],
				user: insertedUsers[0]._id
			}
		)
	}

	console.log("Successfully populated mock data")
	await mongoose.disconnect();
}

populate().catch((err) => {
	console.log(err)
	mongoose.disconnect()	
})
