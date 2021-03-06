var express= require("express");
const { check } = require('express-validator');
var router= express.Router();
var {signout,signup,signin,isSignedIn}=require("../controllers/auth");

router.post("/signup", [
     check("name","Name should be atleast 3 characters!").isLength({min:3}),
    check("email","email is required").isEmail(),
    check("password","Password too short").isLength({min:3}),
],
signup);

router.post("/signin", [
   
    check("email","email is required").isEmail(),
    check("password","password field is required").isLength({min:3}),
],
signin);

router.get("/signout",signout);
router.get("/isSignedIn",isSignedIn,(req,res)=>{
    res.json(req.auth);
});

module.exports=router;