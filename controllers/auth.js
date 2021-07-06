const User= require("../models/user");
const {check,validationResult}= require("express-validator");
var jwt= require("jsonwebtoken");
var expressJwt= require("express-jwt")
exports.signup=(req,res)=>{

   const errors=validationResult(req);
   if(!errors.isEmpty()) {
       return  res.status(422).json({
           error: errors.array()[0].msg,
           param: errors.array()[0].param
       })
   }
    const user= new User(req.body);
    user.save((err,user)=>{
        if(err){
            return res.status(400).json({
                err: "NOT ABLE TO SAVE USER IN DB"
            })
        }

        res.json({
            name:user.name,
         email:user.email,
         id:user._id,
        });


    });
}



exports.signin=(req,res)=>{
    const{email,password}= req.body;
    const errors=validationResult(req);
   if(!errors.isEmpty()) {
       return  res.status(422).json({
           error: errors.array()[0].msg,
           param: errors.array()[0].param
       })
   }

   User.findOne({email},(err,user)=>{
if(err || !user){
     return res.status(400).json({
    error: "User email does not exist",
})}

if(!user.authenticate(password)){
return res.status(401).json({
    error:"EMAIL AND PASSWORD DO NOT MATCH",
})
}
//create a token
const token=jwt.sign({
    _id: user._id
},process.env.secret)
//put token in cookie
res.cookie("token",token,{expire:new Date()+9999})
//send response to frontend
const {_id,name,email,role} = user;
return res.json({token,user:{_id,name,email,role}});
   })
}

exports.signout=(req,res)=>{
    res.clearCookie("token")
    res.json({
        message:"User signed out successfully",
    });
};

//protected routes
exports.isSignedIn= expressJwt({
    secret:process.env.secret,
    userProperty: "auth"
});


//middleware custom
exports.isAuthenticated=(req,res,next)=>{
    let checker=req.profile && req.auth && req.profile._id == req.auth._id;
    if(!checker){
        return res.status(403).json({
            error:"Access denied"
        })
    }
    next();
}
exports.isAdmin=(req,res,next)=>{
    if(req.profile.role===0){
       return res.status(403).json({
error:"You are not an admin"
        })
    }
    next();
}