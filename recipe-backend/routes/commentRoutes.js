const router = require('express').Router();
const auth = require('../middleware/auth');
const commentCtrl = require('../controllers/commentCtrl');


router.post('/comment',auth , commentCtrl.createComment);

router.route('/comment/:id')
    .patch(auth, commentCtrl.updateComment)
    .delete(auth,commentCtrl.deleteComment);

router.patch('/comment/:id/like', auth , commentCtrl.likeComment);
router.patch('/comment/:id/unLike', auth , commentCtrl.unLikeComment);