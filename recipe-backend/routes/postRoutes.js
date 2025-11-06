const router = require('express').Router();
const auth = require('../middleware/auth');
const postCtrl = require('../controllers/postCtrl'); 

router.route('/posts')
    .post(auth, postCtrl.createPost)
    .get(auth, postCtrl.getPosts);
router.route('/post/:id')
    .patch(auth, postCtrl.updatePost)
    .get(auth, postCtrl.getPost)
    .delete(auth, postCtrl.deletePost);

router.patch('/post/:id/like', postCtrl.likePost);
router.patch('/post/:id/unlike', auth, postCtrl.unLikePost);

router.get('/userPosts/:id', auth, postCtrl.getUserPosts);

router.get('/postDiscover', auth , postCtrl.getPostDiscover);

router.patch('/savePost/:id', auth, postCtrl.savePost);
router.patch('/unsavePost/:id', auth, postCtrl.unSavePost);
router.get('/getSavedPost', auth, postCtrl.getSavedPost);

module.exports = router;


