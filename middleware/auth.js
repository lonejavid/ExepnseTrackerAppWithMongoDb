const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticate = async (req, res, next) => {
    try {
        //console.log("this is the request headers=",req.headers)
        const token = req.headers.authentication;  // Correct way to access headers
        const user = jwt.verify(token, '786bismullah745javs234kop0988322bz');
        const email=user.email
        console.log("this is user found in middleware",user)
        await User.findOne({ email }).then(use => {
            req.user = use;
            next();
        });
    } catch (error) {
        console.log("this is the error i got",error)
        return res.status(401).json({ message: "error occurred" });
    }
}
module.exports = { authenticate };
