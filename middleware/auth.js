const jwt = require('jsonwebtoken');
const config = require('../config/keys');

module.exports = function(req,res,next){
    const token = req.header('x-auth-token');

    if(!token){
        return res.status(401).json({msg:"User have no authorization"});
    }
    try {
        const decoded = jwt.verify(token,config.jwtSecret);
        req.user = decoded;
        next();
    } catch (error) {
        console.error(error.message);
        return res.status(401).json({msg:"Invalid Token"});
    }
    
}
