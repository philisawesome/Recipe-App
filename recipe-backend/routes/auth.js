const router = require('express').Router();
const authCtrl = require('../controllers/authCtrl');
const auth = require('../middleware/auth');

//registration route 

router.post('/register', async (req, res)=>{
    const {username, email, password}= req.body;

    try{
        //checks to see if username or email is already in use
        let newUser= await User.findOne({
             $or: [ {username}, {email} ]
            });
        if(newUser){
           return res.status(400).json({error:"Username or email is already in use"});
        }
         newUser = new User ({username, email, password});

        //hashes password
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);

         await newUser.save();

         //asigns token to user
         const payload = {
            user: { id: newUser.id}
         };
         jwt.sign( payload, config.jwtSecret, {expiresIn: 3600},
            (err, token)=>{
                if(err) throw(err);
                res.status(200).json({token});

            });
     }catch(err) {
        console.error(err.message);
        res.status(500).json({error: "Server Error"});
     }
         
});

//login route

router.post('/login', async (req,res)=>{
    const {username, password} = req.body;

    try{
        //checking if user and password
        let user= await User.findOne({username});
        if(!user || !(await bcrypt.compare(password, user.password))){
            return res.status(401).json({error: "Invalid credentials"});

        }
        //creating token 
        const payload ={
            user: {id: user.id}
        };
        jwt.sign(payload, config.jwtSecret,{expiresIn: 3600},
            (err,token)=>{
                if(err) throw(err);
                res.status(200).json({token});
            });
            
    }catch(err){
        console.error(err.message);
        res.status(500).json({error:"Server Error"});
    }

});
module.exports= router;