const  { Router } = require('express');
const router = Router();
const jwt = require('jsonwebtoken');
const config = require('../config');
const verifyToken = require('./verifyToken');
const User = require('../models/User')
router.post('/signup', async (req, res, next) => {
    const {username, email, password} = req.body;
    console.log(username, email, password);
    const user  = new User ({
        username:username,
        email:email,
        password:password
    });
    user.password = await user.encryptPassword(user.password);
    await user.save();
    console.log(user);
    const token = jwt.sign({
        id: user._id,
    },
    config.secret,
    {
        expiresIn: 60 * 60 * 24
    })
    res.json({auth: true, token: token});
});
router.get('/me',verifyToken, async (req, res, next) => {
    const user  = await User.findById(req.userId, {password: 0});
    if(!user){
        return res.status(404).send('No user found')
    }
    res.json(user);
});
router.post('/signin', async (req, res, next) => {
    const {email, password} = req.body;
    const user = await User.findOne({email: email});
    if(!user){
        return res.status(404).send("The email doesn't exists");
    }
    const passwordIsValid = await user.validatePassword(password);
    if(!passwordIsValid){
        return res.status(401).json({auth: false, token: null})
    }
    const token = jwt.sign({id: user._id}, config.secret, {
        expiresIn: 60 * 60 * 24
    })
    res.json({auth: true, token: token});
});

module.exports = router;