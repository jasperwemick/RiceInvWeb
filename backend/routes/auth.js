require('dotenv').config()

const express = require('express')
const bcrypt = require('bcrypt')

const router = express.Router()
const multer = require('multer')

const User = require('../models/userModel')
const Blacklist = require('../models/blacklistModel')

const storage = multer.memoryStorage()
const upload = multer({ storage: storage})

const { Verify, VerifyRole } = require('../middleware/verify')

router.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Headers', ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'].join(', '));
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Method', ['POST', 'GET', 'DELETE', 'OPTIONS'].join(', '));
    next();
});

router.post("/login", upload.none(), async (req, res) => {
    const { username } = req.body;
    try {
        const user = await User.findOne({ username }).select('+password');
        if (!user) {
            res.status(401).json({
                status: 'failed',
                data: [],
                message: 'Invalid Username or Password!!!'
            })
            return;
        }

        const isValid = await bcrypt.compare(
            `${req.body.password}`,
            user.password
        );
        if (!isValid) {
            res.status(401).json({
                status: 'failed',
                data: [],
                message: 'Invalid Username or Password!!!'
            })
            return;
        }

        let options = {
            maxAge: 30 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: "None",
        }
        const token = user.generateAccessJWT();
        res.cookie("accessToken", token, options);
        res.status(200).json({
            status: 'success',
            message: 'Login Successful'
        });
    }
    catch(e) {
        return res.status(500).json({
            status: 'error',
            code: 500,
            data: [],
            message: 'Server Explosion'
        })
    }
    res.end();
});

router.get('/user', Verify, (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Session Verified',
        roles: req.user.roles,
        user: req.user.username
    })
})

router.get('/admin', Verify, VerifyRole, (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Admin Access Granted'
    })
})

router.get('/logout', async (req, res) => {
    try {
        const accessToken = req.headers.cookie;
        if (!accessToken) {
            return res.sendStatus(204);
        }
        const checkBlacklist = await Blacklist.findOne({token: accessToken})

        if (checkBlacklist) {
            return res.sendStatus(204);
        }

        const post = await Blacklist.create({
            token: accessToken
        });

        await post.save();

        let options = {
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: "None",
        }
        res.clearCookie("accessToken", options)
        res.status(200).json({
            message: 'Logout successful'
        });
    }
    catch(e) {
        res.status(500).json({
            status: 'error',
            message: 'Server Explosion'
        });
    }
})


module.exports = router