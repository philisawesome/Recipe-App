const router = require("express").Router();
const auth = require("../middleware/auth");
const userCtrl = require('../controllers/userCtrl'); 

router.get('/search', auth, userCtrl.searchUser);

router.get('/profile/me', auth, userCtrl.getMyProfile);

router.get('/profile/:id', auth, userCtrl.getTheirProfile);

router.post('/profile/:id/follow', auth,userCtrl.followUser);
router.delete('/profile/:id/unfollow', auth, userCtrl.unfollowUser);


router.get('/profile/:id/followers', auth, userCtrl.getFollowers);
router.get('/profile/:id/following', auth, userCtrl.getFollowing);

module.exports= router; 