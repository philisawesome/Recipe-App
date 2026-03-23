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
  },
  {
    userIndex: 0,
    title: "Chocolate Lava Cake",
    ingredients: ["100g dark chocolate", "100g butter", "2 eggs", "60g sugar", "30g flour"],
    instructions: ["Melt chocolate and butter together.", "Whisk in eggs and sugar.", "Fold in flour.", "Pour into greased ramekins.", "Bake at 220°C for 12 minutes and serve immediately."],
    content: "Crispy outside, gooey inside. Perfect every time.",
    images: [`${url}/blank.jpg`],
  },
  {
    userIndex: 1,
    title: "Smoked BBQ Brisket",
    ingredients: ["2kg beef brisket", "2 tbsp salt", "2 tbsp black pepper", "1 tbsp garlic powder", "Wood chips for smoking"],
    instructions: ["Rub brisket with salt, pepper, and garlic powder.", "Preheat smoker to 110°C.", "Smoke brisket for 12 hours.", "Wrap in butcher paper at 165°F internal.", "Rest for 1 hour before slicing."],
    content: "Low and slow is the only way. Worth every hour.",
    images: [`${url}/blank.jpg`],
  },
  {
    userIndex: 1,
    title: "BBQ Baby Back Ribs",
    ingredients: ["1 rack baby back ribs", "BBQ sauce", "Brown sugar", "Paprika", "Garlic powder", "Onion powder"],
    instructions: ["Remove membrane from ribs.", "Coat with dry rub and let sit 1 hour.", "Grill on low heat for 3 hours.", "Brush with BBQ sauce in last 30 minutes.", "Slice and serve."],
    content: "Fall-off-the-bone ribs that will impress any crowd.",
    images: [`${url}/blank.jpg`],
  },
  {
    userIndex: 2,
    title: "Vegan Buddha Bowl",
    ingredients: ["1 cup brown rice", "1 cup chickpeas", "1 avocado", "1 cup kale", "Tahini dressing", "Lemon juice"],
    instructions: ["Cook brown rice and set aside.", "Roast chickpeas at 200°C for 25 minutes.", "Massage kale with lemon juice.", "Assemble bowl with rice, chickpeas, kale, and avocado.", "Drizzle tahini dressing on top."],
    content: "Nutritious, colorful, and filling. A weekly staple.",
    images: [`${url}/blank.jpg`],
  },
  {
    userIndex: 2,
    title: "Avocado Toast",
    ingredients: ["2 slices sourdough bread", "1 ripe avocado", "Red pepper flakes", "Lemon juice", "Salt and pepper"],
    instructions: ["Toast sourdough bread until golden.", "Mash avocado with lemon juice, salt, and pepper.", "Spread avocado on toast.", "Top with red pepper flakes.", "Serve immediately."],
    content: "Simple, quick, and endlessly customizable.",
    images: [`${url}/blank.jpg`],
  },
  {
    userIndex: 3,
    title: "Homemade Lasagna",
    ingredients: ["12 lasagna sheets", "500g ground beef", "500ml tomato sauce", "300g ricotta", "200g mozzarella", "Parmesan"],
    instructions: ["Cook lasagna sheets and set aside.", "Brown ground beef and mix with tomato sauce.", "Layer pasta, meat sauce, and ricotta in a baking dish.", "Top with mozzarella and Parmesan.", "Bake at 180°C for 45 minutes."],
    content: "A hearty lasagna that tastes even better the next day.",
    images: [`${url}/blank.jpg`],
  },
  {
    userIndex: 3,
    title: "Mushroom Risotto",
    ingredients: ["300g Arborio rice", "250g mixed mushrooms", "1L vegetable broth", "1 onion", "3 cloves garlic", "50g Parmesan", "White wine"],
    instructions: ["Sauté onion and garlic until soft.", "Add mushrooms and cook until golden.", "Toast Arborio rice for 2 minutes.", "Add white wine and stir until absorbed.", "Gradually add broth one ladle at a time, stirring constantly.", "Finish with Parmesan and butter."],
    content: "Creamy and earthy. Patience is the secret ingredient.",
    images: [`${url}/blank.jpg`],
  },
];

const populate = async () => {
	await mongoose.connect(mongoURI);
	console.log("Connected to MongoDB");

	//await User.deleteMany({});
  	//await Post.deleteMany({});

	const insertedUsers = await User.insertMany(mockUsers);

	const posts = mockPosts.map(({ userIndex, ...post }) => ({
	  ...post,
	  user: insertedUsers[userIndex]._id,
	}));

	await Post.insertMany(posts);

	console.log("Successfully populated mock data")
	await mongoose.disconnect();
}

populate().catch((err) => {
	console.log(err)
	mongoose.disconnect()	
})
