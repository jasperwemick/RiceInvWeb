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
            throw new Error('Invalid Session');
        }

        const checkBlacklist = await Blacklist.findOne({token: accessToken})
        if (checkBlacklist) {
            throw new Error('Session Expired');
        }

        if (!process.env.SECRET_ACCESS_TOKEN) {
            throw new Error('Missing Secret Token');
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
        next(e);
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
        next(e);
    }
}