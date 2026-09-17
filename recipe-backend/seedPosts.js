import mongoose from "mongoose";
import axios from "axios";
import FormData from "form-data";
import { mongoURI, port } from "./config.js";
import User from "./models/userModel.js";

const targetUsername = process.argv[2];
const followAuthorCount = Number(process.argv[3]) || 3;
const notFollowAuthorCount = Number(process.argv[4]) || 3;

if (!targetUsername) {
  console.error(
    "Usage: npm run seed:posts -- <username> [followingAuthors] [notFollowingAuthors]",
  );
  process.exit(1);
}

const API_URL = `http://localhost:${port}/api`;
const PASSWORD = "MockPassword1!";

const authorPool = [
  ["chef_marco", "Marco Rossi", "https://i.pravatar.cc/150?img=12"],
  ["sara_bakes", "Sara Kim", "https://i.pravatar.cc/150?img=25"],
  ["priya_plants", "Priya Nair", "https://i.pravatar.cc/150?img=33"],
  ["dave_grills", "Dave Coleman", "https://i.pravatar.cc/150?img=41"],
  ["noodle_nina", "Nina Zhou", "https://i.pravatar.cc/150?img=52"],
  ["bakery_ben", "Ben Alvarez", "https://i.pravatar.cc/150?img=60"],
];

const recipePool = [
  {
    title: "Sunday Ragu",
    content: "Slow-simmered pork and beef ragu over pappardelle.",
    ingredients: [
      "1 lb pork shoulder",
      "1 lb ground beef",
      "1 onion, diced",
      "3 cloves garlic",
      "1 can crushed tomatoes",
      "1 cup red wine",
    ],
    instructions: [
      "Brown the meat in a heavy pot.",
      "Add onion and garlic, cook until soft.",
      "Deglaze with wine.",
      "Add tomatoes and simmer 3 hours.",
      "Serve over pappardelle.",
    ],
    days: "0",
    hrs: "3",
    mins: "30",
    serving: "6",
    difficulty: "Medium",
  },
  {
    title: "Weeknight Carbonara",
    content: "Guanciale, egg yolks, pecorino, no cream needed.",
    ingredients: [
      "200g spaghetti",
      "100g guanciale, diced",
      "2 egg yolks",
      "1 whole egg",
      "50g pecorino, grated",
      "Black pepper",
    ],
    instructions: [
      "Cook spaghetti in salted water.",
      "Render guanciale in a pan.",
      "Whisk eggs and cheese together.",
      "Toss hot pasta with guanciale off heat.",
      "Stir in egg mixture until creamy.",
    ],
    days: "0",
    hrs: "0",
    mins: "25",
    serving: "2",
    difficulty: "Easy",
  },
  {
    title: "Brown Butter Cookies",
    content: "Nutty brown butter and flaky salt make these next level.",
    ingredients: [
      "1 cup butter",
      "1 cup brown sugar",
      "1/2 cup white sugar",
      "2 eggs",
      "2 1/4 cup flour",
      "2 cups chocolate chips",
      "Flaky salt",
    ],
    instructions: [
      "Brown the butter and let it cool slightly.",
      "Cream with sugars.",
      "Beat in eggs.",
      "Fold in flour and chocolate chips.",
      "Bake at 375F for 11 minutes, top with flaky salt.",
    ],
    days: "0",
    hrs: "0",
    mins: "45",
    serving: "24",
    difficulty: "Easy",
  },
  {
    title: "Sourdough Loaf",
    content: "Day 2 of a 3-day starter-to-loaf process, worth it.",
    ingredients: [
      "500g bread flour",
      "350g water",
      "100g active starter",
      "10g salt",
    ],
    instructions: [
      "Mix flour, water, and starter, rest 1 hour.",
      "Add salt, perform stretch and folds every 30 min.",
      "Bulk ferment 4-6 hours.",
      "Shape and cold proof overnight.",
      "Bake in a Dutch oven at 450F.",
    ],
    days: "1",
    hrs: "6",
    mins: "0",
    serving: "1 loaf",
    difficulty: "Hard",
  },
  {
    title: "Coconut Chickpea Curry",
    content: "One pot, 30 minutes, deeply comforting.",
    ingredients: [
      "2 cans chickpeas",
      "1 can coconut milk",
      "2 tbsp curry powder",
      "1 onion, diced",
      "3 cloves garlic",
      "1 tbsp ginger",
    ],
    instructions: [
      "Saute onion, garlic, and ginger.",
      "Stir in curry powder until fragrant.",
      "Add chickpeas and coconut milk.",
      "Simmer 20 minutes.",
      "Serve over rice.",
    ],
    days: "0",
    hrs: "0",
    mins: "30",
    serving: "4",
    difficulty: "Easy",
  },
  {
    title: "Reverse Seared Tomahawk",
    content: "Low and slow in the smoker, seared hot to finish.",
    ingredients: [
      "1 tomahawk steak",
      "Kosher salt",
      "Cracked pepper",
      "2 tbsp butter",
      "2 sprigs rosemary",
    ],
    instructions: [
      "Season steak generously, rest uncovered 1 hour.",
      "Smoke at 225F until internal temp hits 115F.",
      "Rest while pan gets screaming hot.",
      "Sear all sides with butter and rosemary.",
      "Rest 10 minutes before slicing.",
    ],
    days: "0",
    hrs: "2",
    mins: "0",
    serving: "3",
    difficulty: "Medium",
  },
  {
    title: "Dan Dan Noodles",
    content: "Spicy sesame chili oil noodles with crispy pork.",
    ingredients: [
      "300g wheat noodles",
      "200g ground pork",
      "2 tbsp chili oil",
      "2 tbsp sesame paste",
      "2 tbsp soy sauce",
      "1 tbsp black vinegar",
    ],
    instructions: [
      "Crisp the pork in a hot wok.",
      "Whisk sesame paste, soy sauce, vinegar, and chili oil.",
      "Cook noodles and drain.",
      "Toss noodles with sauce.",
      "Top with crispy pork.",
    ],
    days: "0",
    hrs: "0",
    mins: "25",
    serving: "3",
    difficulty: "Easy",
  },
  {
    title: "Al Pastor Tacos",
    content: "Marinated pineapple pork, charred and stacked high.",
    ingredients: [
      "2 lb pork shoulder, sliced thin",
      "3 dried guajillo chiles",
      "1/2 pineapple, diced",
      "2 tbsp achiote paste",
      "Corn tortillas",
      "Onion and cilantro",
    ],
    instructions: [
      "Blend chiles, achiote, and pineapple into a marinade.",
      "Marinate pork at least 4 hours.",
      "Char pork on a hot griddle.",
      "Warm tortillas.",
      "Top with pineapple, onion, and cilantro.",
    ],
    days: "0",
    hrs: "4",
    mins: "30",
    serving: "6",
    difficulty: "Medium",
  },
];

function chunkAuthors(count, offset) {
  return authorPool.slice(offset, offset + count);
}

async function registerAuthor(runId, [handle, name, avatar]) {
  const username = `${handle}_${runId}`;
  const email = `${username}@example.com`;

  const res = await axios.post(`${API_URL}/auth/register`, {
    username,
    email,
    password: PASSWORD,
    name,
  });

  const { access_token, user } = res.data;
  await User.updateOne({ _id: user._id }, { avatar });

  return { id: user._id, username, token: access_token };
}

async function createRealPost(author, recipe) {
  const form = new FormData();
  form.append("title", recipe.title);
  form.append("content", recipe.content);
  for (const ing of recipe.ingredients) form.append("ingredients", ing);
  for (const step of recipe.instructions) form.append("instructions", step);
  form.append("days", recipe.days);
  form.append("hrs", recipe.hrs);
  form.append("mins", recipe.mins);
  form.append("serving", recipe.serving);
  form.append("difficulty", recipe.difficulty);

  await axios.post(`${API_URL}/posts`, form, {
    headers: {
      ...form.getHeaders(),
      Authorization: `Bearer ${author.token}`,
    },
  });
}

async function seed() {
  if (process.env.NODE_ENV !== "dev" && process.env.NODE_ENV !== "test") {
    console.error(
      `Refusing to run: NODE_ENV is "${process.env.NODE_ENV}". ` +
        `Start this script with NODE_ENV=dev so post creation uses the placeholder ` +
        `image bypass instead of a real S3 upload.`,
    );
    process.exit(1);
  }

  await mongoose.connect(mongoURI);

  const target = await User.findOne({ username: targetUsername.toLowerCase() });
  if (!target) {
    console.error(`No user found with username "${targetUsername}"`);
    process.exit(1);
  }

  const runId = Date.now().toString(36).slice(-5);
  const followHandles = chunkAuthors(followAuthorCount, 0);
  const notFollowHandles = chunkAuthors(
    notFollowAuthorCount,
    followAuthorCount,
  );

  console.log(`Registering ${followHandles.length} followed authors...`);
  const followAuthors = [];
  for (const handle of followHandles) {
    followAuthors.push(await registerAuthor(runId, handle));
  }

  console.log(`Registering ${notFollowHandles.length} non-followed authors...`);
  const notFollowAuthors = [];
  for (const handle of notFollowHandles) {
    notFollowAuthors.push(await registerAuthor(runId, handle));
  }

  await User.updateOne(
    { _id: target._id },
    { $addToSet: { following: { $each: followAuthors.map((a) => a.id) } } },
  );
  await User.updateMany(
    { _id: { $in: followAuthors.map((a) => a.id) } },
    { $addToSet: { followers: target._id } },
  );

  console.log("Creating posts via the real POST /api/posts endpoint...");
  let recipeIndex = 0;
  for (const author of [...followAuthors, ...notFollowAuthors]) {
    for (let i = 0; i < 2; i++) {
      const recipe = recipePool[recipeIndex % recipePool.length];
      recipeIndex++;
      await createRealPost(author, recipe);
    }
  }

  console.log(
    `Done. "${target.username}" now follows: ${followAuthors.map((a) => a.username).join(", ")}`,
  );
  console.log(
    `Not followed (will show up in Discover): ${notFollowAuthors.map((a) => a.username).join(", ")}`,
  );

  await mongoose.disconnect();
}

seed().catch((e) => {
  if (e.response) {
    console.error(`HTTP ${e.response.status} ${e.config?.url}:`, e.response.data);
  } else {
    console.error(e);
  }
  process.exit(1);
});
