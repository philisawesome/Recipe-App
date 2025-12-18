import mongoose from "mongoose";
import User from "../models/userModel.js";

//need this for the speical regex characters
function escapeRegex(str=""){
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function searchUser(req, res){
    try{
        const raw = (req.query.q ?? req.query.username ?? "").trim();
        if (!raw) return res.json({users: [] });
         const q= escapeRegex(raw.slice(0,30));

         const limit = Math.min(Number(req.query.limit) || 10, 20);

        const regex = new RegExp('^'+q, 'i');

        const users= await User.find({
            $or: [{username: regex}, {name:regex}],
        })
            .select("username name avatar -password")
            .limit(limit)
            .lean();
            
        return res.status(200).json({users});

    }catch(err){
        console.error(err);
        return res.status(500).json({error: "Server Error"});
    }
}
/**
 * GET /api/profile/me
 * Uses auth middleware that attaches full user to req.user
 */
export async function getMyProfile(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    // req.user came from auth middleware with -password selected
    return res.json({ user: req.user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Error" });
  }
}

/**
 * GET /api/profile/:id
 */
export async function getTheirProfile(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Not valid Id" });
    }

    const user = await User.findById(id)
      .select("-password")
      .populate("followers following", "username avatar name")
      .lean();

    if (!user) return res.status(404).json({ error: "Requested user is not found" });
    return res.json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Error" });
  }
}

/**
 * POST /api/profile/:id/follow
 */
export async function followUser(req, res) {
  try {
    const targetId = req.params.id;
    const meId = req.user?._id?.toString();

    if (!mongoose.isValidObjectId(targetId)) {
      return res.status(400).json({ error: "Not valid Id" });
    }
    if (!meId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    if (targetId === meId) {
      return res.status(400).json({ error: "You can't follow yourself" });
    }

    const [target, me] = await Promise.all([
      User.findByIdAndUpdate(
        targetId,
        { $addToSet: { followers: meId } },
        { new: true, select: "_id followers following" }
      ).lean(),
      User.findByIdAndUpdate(
        meId,
        { $addToSet: { following: targetId } },
        { new: true, select: "_id followers following" }
      ).lean()
    ]);

    if (!target) return res.status(404).json({ error: "User does not exist" });
    if (!me) return res.status(401).json({ error: "Authenticated user not found" });

    return res.json({
      message: "Followed",
      myFollowing: me.following.length,
      theirFollowers: target.followers.length
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server Error" });
  }
}

/**
 * POST /api/profile/:id/unfollow
 */
export async function unfollowUser(req, res) {
  try {
    const targetId = req.params.id;
    const meId = req.user?._id?.toString();

    if (!mongoose.isValidObjectId(targetId)) {
      return res.status(400).json({ error: "Not valid Id" });
    }
    if (!meId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    if (targetId === meId) {
      return res.status(400).json({ error: "You can't unfollow yourself" });
    }

    const [target, me] = await Promise.all([
      User.findByIdAndUpdate(
        targetId,
        { $pull: { followers: meId } },
        { new: true, select: "_id followers following" }
      ).lean(),
      User.findByIdAndUpdate(
        meId,
        { $pull: { following: targetId } },
        { new: true, select: "_id followers following" }
      ).lean()
    ]);

    if (!target) return res.status(404).json({ error: "User does not exist" });
    if (!me) return res.status(401).json({ error: "Authenticated user not found" });

    return res.json({
      message: "Unfollowed",
      myFollowing: me.following.length,
      theirFollowers: target.followers.length
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server Error" });
  }
}

/*
 * GET /api/profile/:id/followers?skip=0&limit=10
 */
export async function getFollowers(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Not valid Id" });
    }
    const skip = Number(req.query.skip) || 0;
    const limit = Math.min(Number(req.query.limit) || 10, 50);

    const [user, counted] = await Promise.all([
      User.findById(id)
        .select("followers")
        .populate({
          path: "followers",
          select: "username avatar name",
          options: { skip, limit }
        })
        .lean(),
      User.aggregate([
        { $match: { _id: id } },
        { $project: { _id: 0, total: { $size: "$followers" } } }
      ])
    ]);

    if (!user) return res.status(404).json({ error: "User not found" });

    const total = counted[0]?.total ?? 0;
    const pageSize = user.followers.length;
    const hasMore = skip + pageSize < total;

    return res.json({
      users: user.followers,
      pageSize,
      total,
      skip,
      limit,
      hasMore
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Error" });
  }
}


/**
 * GET /api/profile/:id/following?skip=0&limit=10
 */
export async function getFollowing(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Not valid Id" });
    }
    const skip = Number(req.query.skip) || 0;
    const limit = Math.min(Number(req.query.limit) || 10, 50);

    const [user, counted] = await Promise.all([
      User.findById(id)
        .select("following")
        .populate({
          path: "following",
          select: "username avatar name",
          options: { skip, limit }
        })
        .lean(),
      User.aggregate([
        { $match: { _id: id } },
        { $project: { _id: 0, total: { $size: "$following" } } }
      ])
    ]);

    if (!user) return res.status(404).json({ error: "User not found" });

    const total = counted[0]?.total ?? 0;
    const pageSize = user.following.length;
    const hasMore = skip + pageSize < total;

    return res.json({
      users: user.following,
      pageSize,
      total,
      skip,
      limit,
      hasMore
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Error" });
  }
}

export default {
  searchUser:searchUser,
  getMyProfile:getMyProfile,
  getTheirProfile:getTheirProfile,
  followUser:followUser,
  unfollowUser:unfollowUser,
  getFollowers:getFollowers,
  getFollowing:getFollowing,
};
