require('dotenv').config()

const express = require('express')

const jwt = require('jsonwebtoken')

const User = require('../models/userModel')
const Blacklist = require('../models/blacklistModel')
const cookieParser = require('cookie-parser')

const Verify = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;

        if (!accessToken) return res.sendStatus(401);
        const checkBlacklist = await Blacklist.findOne({token: accessToken})

        if (checkBlacklist) {
            return res.status(401).json({
                message: 'Session Expired'
            })
        }
    
        jwt.verify(accessToken, process.env.SECRET_ACCESS_TOKEN, async (err, decoded) => {
            if (err) {
                return res.status(401).json({message: 'Session expired'})
            }
    
            const { id } = decoded;
            const user = await User.findById(id);
            const {password, ...data } = user._doc;
            req.user = data;
            next();
        })
    }
    catch(e) {
        res.status(500).json({
            status: 'error',
            code: 500,
            data: [],
            message: 'Server Explosion'
        });
    }

}

const VerifyRole = async (req, res, next) => {
    try {
        const user = req.user;
        const { roles } = user;

        if (!roles.includes('Admin')) {
            return res.status(401).json({
                status: 'failed',
                message: 'Authorization Failed'
            });
        }
        next();
    }
    catch(e) {
        res.status(500).json({
            status: 'error',
            code: 500,
            data: [],
            message: 'Sever Explosion'
        });
    }
}

module.exports = {Verify, VerifyRole}