const express = require("express");
const router = express.Router();
const {check, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const User = require('../models/User');
const config = require('../config/keys');

router.get('/',auth,async(req,res)=>{
    const user = await User.findById(req.user.id).select("-password");
    res.json({user});
});

router.post('/',[
    check("email","email is required").isEmail(),
    check("password","password is required").exists()
],async(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    try {
        const {email,password} = req.body;
        let user = await User.findOne({email:email});
        if(!user){
            return res.status(400).json({errors:[{"msg":"Invalid user or password"}]})
        }
        const match = await bcrypt.compare(password,user.password);
        if(!match){
            return res.status(400).json({errors:[{"msg":"Invalid user or password"}]})
        }
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