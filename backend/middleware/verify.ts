import { configDotenv } from "dotenv";
import { NextFunction, Request, Response } from 'express';

import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';

import User, { UserDoc } from '../models/userModel'
import Blacklist from '../models/blacklistModel'
import cookieParser from 'cookie-parser'
import { Document } from "mongoose";

configDotenv();

export const Verify = async (req : Request, res : Response, next : NextFunction) => {
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

        if (!process.env.SECRET_ACCESS_TOKEN) {
            throw {
                message : 'Missing secret token'
            }
        }
    
        jwt.verify(accessToken, process.env.SECRET_ACCESS_TOKEN, async (err : VerifyErrors | null, decoded : string | JwtPayload | undefined) => {
            if (err) {
                throw {
                    status: 401,
                    message: 'Session Expired'
                }
            }
            
            if (!decoded || typeof decoded === "string") {
                throw {
                    message: 'Failed to decode payload'
                }
            }
            
            const { id } = decoded;
            const user = await User.findById<UserDoc>(id).populate('profile');
            const {password, ...data } = user?.toObject();
            req.user = data;
            next();
        })
    }
    catch(e : unknown) {
        if (e instanceof Error) {
            res.json({
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

export const VerifyRole = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            throw {
                message : 'User validation failed'
            }
        }
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
        if (e instanceof Error) {
            res.json({
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