import express from "express"
const router = express.Router()
import auth from "../middleware/auth.js"
import commentCtrl from "../controllers/commentCtrl.js"

router.post('/comment',auth , commentCtrl.createComment);

router.route('/comment/:id')
    .patch(auth, commentCtrl.updateComment)
    .delete(auth,commentCtrl.deleteComment);

router.patch('/comment/:id/like', auth , commentCtrl.likeComment);
router.patch('/comment/:id/unLike', auth , commentCtrl.unLikeComment);

export default router
