import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { mongoURI } from "./config.js";
import User from "./models/userModel.js";

const targetUsername = process.argv[2];
const count = Number(process.argv[3]) || 25;

if (!targetUsername) {
  console.error("Usage: npm run seed -- <username> [count]");
  process.exit(1);
}

const avatars = [
  "https://i.pravatar.cc/150?img=1",
  "https://i.pravatar.cc/150?img=2",
  "https://i.pravatar.cc/150?img=3",
  "https://i.pravatar.cc/150?img=4",
  "https://i.pravatar.cc/150?img=5",
];

async function seed() {
  await mongoose.connect(mongoURI);

  const target = await User.findOne({ username: targetUsername.toLowerCase() });
  if (!target) {
    console.error(`No user found with username "${targetUsername}"`);
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash("MockPassword1!", 12);
  const mockUserIds = [];
  const runId = Date.now().toString(36).slice(-5);

  for (let i = 0; i < count; i++) {
    const suffix = `${runId}${i}`;
    const mockUser = await User.create({
      username: `mock_${suffix}`,
      email: `mock_follower_${suffix}@example.com`,
      password: passwordHash,
      name: `Mock Follower ${i + 1}`,
      avatar: avatars[i % avatars.length],
    });
    mockUserIds.push(mockUser._id);
  }

  await User.updateOne(
    { _id: target._id },
    { $addToSet: { followers: { $each: mockUserIds } } },
  );

  await User.updateMany(
    { _id: { $in: mockUserIds } },
    { $addToSet: { following: target._id } },
  );

  console.log(`Added ${count} mock followers to "${target.username}".`);
  await mongoose.disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
