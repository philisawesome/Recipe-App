import express from "express"
const router = express.Router();
import authCtrl from '../controllers/authCtrl.js';


//registration route 
router.post('/register',authCtrl.register);

router.post('/login',authCtrl.login);

router.post('/logout',authCtrl.logout);

router.post('/refresh_token',authCtrl.generateAccessToken);

export default router
