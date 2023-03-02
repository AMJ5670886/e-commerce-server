const express = require("express");
const router = express.Router();
const {check, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require("../models/User");
const config = require('../config/keys');

router.get('/',(req,res)=>{
    res.send("User route");
});

router.post('/',[
    check("name","Please enter name").not().isEmpty(),
    check("email","enter valid email").isEmail(),
    check("password","enter atleast 5 characters").isLength({min:5})
],async(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(200).json({errors: errors.array()});
    }
    try {
        const {name,email,password} = req.body;
        let user = await User.findOne({email:email});
        if(user){
            return res.status(400).json({errors:[{"msg":"User already exists.."}]})
        }
        user = new User({
            name,
            email,
            password
        });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password,salt);
        user.save();
        const payload = {
            id:user.id,
        };
        jwt.sign(
            payload,
            config.jwtSecret,
            {expiresIn: 3600*24},
            (err,token)=>{
                if(err) throw err;
                res.json({token})
            },
        )
    } catch (error) {
        res.status(500).send("Server Error..")
    }
});

module.exports = router;