const Users = require("../models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { createAccessToken, createRefreshToken } = require("../utils/jwtHelpers");


async function register(req, res){
    try{
        const {username, email, password, name}= req.body;
    
    //normalizing inputs
        const normalizedUsername= (username || "").toLowerCase().trim().replace(/\s+/g,"");
        const normalizedEmail= (email || "").toLowerCase().trim();
    
    //validation 
        if(!normalizedUsername || !normalizedEmail || !password){
            return res.status(400).json({error:"Username, Email, Password are required!"});
        } 
    //what username must be 
        if(!/^[a-z0-9_]{3,20}$/.test(normalizedUsername)){
            return res.status(400).json({error:"Username must be 3-20 chars:a-z, 0-9, _ only."})
        }
    //test for exisiting
        const user_name= await Users.findOne({
            username: normalizedUsername
        });
        if (user_name){
            return res.status(400).json({error:"This Username is already taken!"})
        }
        
        const user_email= await Users.findOne({
            email:normalizedEmail
        })
        if(user_email){
            return res.status(400).json({error:"This Email is already in use!"})
        }
    //checking passowrd
        const hasUpper= /[A-Z]/.test(password);
        const hasSpecial = /[!@#$%^&*()\-_=+[{\]}\\|;:'",.<>/?`~]/.test(password);
        const longEnough= password.length >= 8;

        if(!longEnough || !hasUpper || !hasSpecial){
            return res.status(400).json({error: "Password must contain at least 8 characters, 1 uppercase, and 1 special character"})
        }
    //Hash password 
        const passwordHash= await bcrypt.hash(password,12);
    
    //create user
        const newUser= new Users({
            name,
            username: normalizedUsername,
            email:normalizedEmail,
            password: passwordHash
        });

        await newUser.save();

    //issue token using helper function
        const access_token= createAccessToken({ id: newUser._id});
        const refresh_token= createRefreshToken({ id: newUser._id});

    //adding refresh cookie for security 
        res.cookie("refresh_token", refresh_token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            path: "/api/refresh_token",
            maxAge: 30 * 24 * 60 * 60 *1000

        });

    //sending newly created user 
        return res.status(201).json({
            msg:"Registered Successfully!",
            access_token,
            user:{
                _id:newUser._id.toString(),
                name:newUser.name,
                username: newUser.username,
                email: newUser.email,
                createdAt: newUser.createdAt

            }
        });

    } catch(err){
        if (err.code === 11000) {
            const k = Object.keys(err.keyPattern || {})[0] || "field";
            return res.status(400).json({ error: `This ${k} is already taken.` });
  }
    console.error(err);
    return res.status(500).json({ error: "Server error." });
    }

};

async function login (req, res){
    try{
        //grabs username n password
        const {username: rawUsername = "", password = ""}= req.body ?? {};
        const normalizedUsername = rawUsername.toLowerCase().trim().replace(/\s+/g, "");

        //querys database
        const user = await Users.findOne({
            username: normalizedUsername
       }).select("+password");
       if (!user){
            return res.status(401).json({
            error:"Username or Password is incorrect"
        });
       }

       //matching password vs hashpassword
       const isMatch = await bcrypt.compare(password, user.password)
       if(!isMatch){
            return res.status(401).json({
                error:"Username or Password is incorrect"
            });
    
       }
       //creates tokens
        const access_token= createAccessToken({ id: user._id});
        const refresh_token= createRefreshToken({ id: user._id});

        res.cookie("refresh_token", refresh_token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            path: "/api/refresh_token",
            maxAge: 30 * 24 * 60 * 60 *1000

        });
        return res.status(200).json({
            msg:"Login successful",
            access_token,
            user:{
                _id: user._id.toString(),
                name: user.name,
                username: user.username,
                email:user.email,
                createdAt:user.createdAt
            }
            
        });





    }catch(err){
        console.error(err);
        return res.status(500).json({error: "Server Error"});
    }



}
async function logout(req, res){
    try{
        res.clearCookie("refresh_token",{
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            path: "/api/refresh_token",

        });
        return res.status(200).json({msg:"Logged out successfully."});


    } catch(err){
        console.error(err);
        return res.status(500).json({error:"Server error."});
    }



}

async function generateAccessToken(req, res){
    try{
        //grabs cookie from browser
        const rf_token= req.cookies.refresh_token;
        if (!rf_token){
            return res.status(401).json({error:"Please login again."});
        
        }
        //verfies token with the secret
        jwt.verify(rf_token,process.env.REFRESH_TOKEN_SECRET,async(err,decoded)=>{

            //if fails
            if(err){
                const msg = err.name === "TokenExpiredError"
                    ? "Refresh token expired. Please login again."
                    : "Invalid refresh token.";
                return res.status(401).json({ error: msg });

            }

            //if passes
            try {
                const user = await Users.findById(decoded.id).select("-password");
                if (!user) return res.status(404).json({ error: "User does not exist." });

                const access_token = createAccessToken({ id: decoded.id });
                return res.status(200).json({ access_token });
            }catch (e) {
                console.error(e);
                return res.status(500).json({ error: "Server error." });
            }
        });
    }catch(err){
        console.error(err);
        return res.status(500).json({error:"Server error."});
    }

}
        


    
    





module.exports= {
    register,
    login,
    logout,
    generateAccessToken

};
