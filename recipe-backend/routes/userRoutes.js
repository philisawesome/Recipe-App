import express from "express"
const router = express.Router()
import multer from "multer"

import { multiUpload } from "../middleware/s3.js"
const upload = multer({storage: multer.memoryStorage()})
import auth from "../middleware/auth.js"
import userCtrl from "../controllers/userCtrl.js"

router.get('/search', userCtrl.searchUser);

router.get('/profile/me', auth, userCtrl.getMyProfile);

router.get('/profile/:id', userCtrl.getTheirProfile);
router.get('/username/:username', userCtrl.getTheirProfileByUsername);

router.post('/profile/:id/follow', auth,userCtrl.followUser);
router.delete('/profile/:id/unfollow', auth, userCtrl.unfollowUser);


router.get('/profile/:id/followers', auth, userCtrl.getFollowers);
router.get('/profile/:id/following', auth, userCtrl.getFollowing);
router.patch('/profilePic/setProfilePic', auth,upload.array('photo', 1), 
        multiUpload, userCtrl.setProfilePic)
export default router
