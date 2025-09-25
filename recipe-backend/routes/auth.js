const router = require('express').Router();
const authCtrl = require('../controllers/authCtrl');
const auth = require('../middleware/auth');

//registration route 
router.post('/register',authCtrl.register);

router.post('/login',authCtrl.login)

router.post('/logout',authCtrl.logout);

router.post('/refresh_token',authCtrl.generateAccessToken);



module.exports= router;