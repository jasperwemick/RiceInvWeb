require('dotenv').config()

const express = require('express')

const jwt = require('jsonwebtoken')

const User = require('../models/userModel')
const Blacklist = require('../models/blacklistModel')
const cookieParser = require('cookie-parser')

const Verify = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            throw {
                status: 401,
                message: 'Invalid Session'
            }
        }

        const checkBlacklist = await Blacklist.findOne({token: accessToken})

        if (checkBlacklist) {
            throw {
                status: 401,
                message: 'Session Expired'
            }
        }
    
        jwt.verify(accessToken, process.env.SECRET_ACCESS_TOKEN, async (err, decoded) => {
            if (err) {
                throw {
                    status: 401,
                    message: 'Session Expired'
                }
            }
    
            const { id } = decoded;
            const user = await User.findById(id);
            const {password, ...data } = user._doc;
            req.user = data;
            next();
        })
    }
    catch(e) {
        if (e?.status != null) {
            res.status(e.status).json({
                data: [],
                message: e.message
            });
        }
        else {
            res.status(500).json({
                data: [],
                message: 'Server Explosion'
            });
        }
    }

}

const VerifyRole = async (req, res, next) => {
    try {
        const user = req.user;
        const { roles } = user;

        if (!roles.includes('Admin')) {
            throw {
                status: 401,
                message: 'Authorization Failed'
            };
        }
        next();
    }
    catch(e) {
        if (e?.status != null) {
            res.status(e.status).json({
                data: [],
                message: e.message
            });
        }
        else {
            res.status(500).json({
                data: [],
                message: 'Server Explosion'
            });
        }
    }
}

module.exports = {Verify, VerifyRole}