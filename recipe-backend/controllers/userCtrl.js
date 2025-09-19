const mongoose = require("mongoose");
const Users = require("../models/Users");
const User= require("../models/Users");


async function getMyProfile(req, res){
    try{   
        const user= await User.findById(req.user.id).select('-password');
        
        if(!user){
            return res.status(404).json({ error: "User not found"});

        }
        res.json({user});
    } catch(err){
        console.error(err.message);
        res.status(500).json({error:"Server Error"});
    }


};

async function getTheirProfile(req, res){
    try{
        const user = await Users.findById(req.params.id)
        .select('-password')
        .populate('followers following', 'username avatar name')

        if(!user){
            return res.status(404).json({error: "requested user is not found"});
        }

        res.json({user});

    }catch(err){
        console.error(err.message);
        res.status(500).json({error:"Server Error"});
    }


};


async function followUser (req, res){
    
    try{
        const targetId= req.params.id;
        const meId= req.user.id;

        if(!mongoose.isValidObjectId(targetId)){
            return res.status(400).json({error:"Not valid Id"});
        }
        if(targetId=== meId){
            return res.status(400).json({error:"You can't follow yourself"});
        }

        const [target, me] = await Promise.all([

            User.findByIdAndUpdate(
                targetId,
                {$addToSet: {followers: meId} },
                {new: true, select:'_id followers following'}
            ),
            User.findByIdAndUpdate(
                meId,
                {$addToSet: {following: targetId}},
                {new: true, select:'_id followers following'}
            )

        ]);
        if(!target){
            return res.status(404).json({error:"User does not exist"});
        }
       return res.json({
            message: 'Followed',
            myFollowing: me.following.length,
            theirFollowers:target.followers.length

        });

    }catch(error){
        console.error(error);
        return res.status(500).json({error:"Server Error"});
    }

};


async function unfollowUser (req, res){
    try{
        const targetId= req.params.id;
        const meId= req.user.id;

        if(!mongoose.isValidObjectId(targetId)){
            return res.status(400).json({error:"Not Valid Id"});
        }
        if(targetId=== meId){
            return res.status(400).json({error: "You can't unfollow yourself"});
        }

        const [target, me]= await Promise.all([
            User.findByIdAndUpdate(
                targetId,
                {$pull: {followers: meId}},
                {new:true, select: '_id followers following'}


            ),
            User.findByIdAndUpdate(
                meId,
                {$pull: {following: targetId}},
                {new:true, select: '_id followers following'}
            )


        ]);

        if(!target){
            return res.status(404).json({error: "User does not exist"});
        }

        return res.json({
            message:"Unfollowed",
            myFollowing: me.following.length,
            theirFollowers: target.followers.length
            
        });

    }catch(error){
        console.error(error);
        return res.status(500).json({error: "Server Error"});
    }


};


async function getFollowers(req,res){
    try{
        const {skip = 0, limit = 10} = req.query;
        const user = await User.findById(req.params.id)
            .select('followers')
            .populate({
                path: 'followers',
                select:'username avatar name',
                options: {skip:Number(skip), limit: Number(limit)}
            })
            .lean();

        if (!user){
            return res.status(404).json({error: "User not found"});
        }

        return res.json({
            user: user.followers,
            result:user.followers.length

        });
    }catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server Error' });
  }

};
async function getFollowing(req,res){
    try{
        const {skip = 0, limit = 10} = req.query;
        const user = await User.findById(req.params.id)
            .select('followeing')
            .populate({
                path: 'following',
                select:'username avatar name',
                options: {skip:Number(skip), limit: Number(limit)}
            })
            .lean();

        if (!user){
            return res.status(404).json({error: "User not found"});
        }

        return res.json({
            user: user.following,
            result:user.following.length

        });
    }catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server Error' });
  }

};





module.exports = { 
    getMyProfile,
    getTheirProfile,
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing
   

 };

