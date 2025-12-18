import multer from "multer"
import { uploadPhotoS3 } from "../middleware/s3.js"
const upload = multer({storage: multer.memoryStorage()})

import express from "express"
const router = express.Router()
import auth from "../middleware/auth.js"
import postCtrl from "../controllers/postCtrl.js"

router.route('/posts')
    .post(
		auth,
		upload.single('file'), 
		uploadPhotoS3,
		postCtrl.createPost
	)
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

export default router
