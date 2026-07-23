import express, { Request, Response } from "express";
import Profile from "../models/profileModel";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import multer from 'multer';
import sharp from 'sharp';
import { gameProfileSchema } from "../types/validation";

if (!process.env.ACCESS_KEY || !process.env.SECRET_KEY || !process.env.BUCKET_REGION) {
    throw new Error("Missing S3 bucket access info");
}

const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY
    },
    region: process.env.BUCKET_REGION
});

export const getAllProfiles = async (req : Request, res : Response) => {
    try {
        const profiles = await Profile.find()

        for (let profile of profiles) {
            const params = {
                Bucket: process.env.BUCKET_NAME,
                Key: profile.imageName,
            }
            const command = new GetObjectCommand(params)
            const url = await getSignedUrl(s3, command, { expiresIn: 600 })
    
            profile.imageUrl = url
        }
        
        res.json(profiles)
    }
    catch(e) {
        console.log("Error at GET /: ", e)
    }
}

export const getAllProfilesNoImage = async (req : Request, res : Response) => {
    try {
        const profiles = await Profile.find()
        res.json(profiles)
    }
    catch(e) {
        console.log("Error at GET /default/noimg: ", e)
    }
}

export const getProfileById = async (req : Request, res : Response) => {
    const id = req.params.id;
    try {
        const profile = await Profile.findById(id);
        if (!profile) {
            throw new Error("Failed to get profile");
        }
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: profile.imageName,
        }
    
        const command = new GetObjectCommand(params);
        const url = await getSignedUrl(s3, command, { expiresIn: 600 })
    
        profile.imageUrl = url
    
        res.json(profile);
    }
    catch(e) {
        console.log("Error at GET /default/:id ", e)
    }
}

export const createNewProfile = async (req : Request, res : Response) => {
    try {
        if (!req.file) {
            throw new Error("image file not found for new profile");
        }

        const buffer = await sharp(req.file.buffer).resize({height: 500, width: 400, fit: "contain"}).toBuffer();
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: req.file.originalname,
            Body: buffer,
            ContentType: req.file.mimetype
        }
    
        const command = new PutObjectCommand(params);
        await s3.send(command);

        const post = await Profile.create({
            name : req.body.name,
            user : req.body.user,
            aliases : req.body.aliases,
            description : req.body.description,
            imageName : req.file.originalname,
            gameProfiles : req.body.gameProfiles
        });

        const result = await post.save();
        res.json(result);
    }
    catch(e) {
        console.log("Error at POST /: ", e)
    }
}

export const createNewGameProfile = async (req : Request, res : Response) => {
    const parsed = gameProfileSchema.safeParse(req.body)
    const pid = req.params.pid;
    
    if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.message });
    }
    try {
        const profile = await Profile.findById(pid);

        if (!profile) {
            return res.status(404).json({ message : 'Profile not found' });
        }

        profile.gameProfiles.push(parsed.data);
        await profile.save();
    }
    catch(e) {
        console.log("Error at POST /profile/:pid/game-profile");
        res.status(500).json({ message : 'Game profile cannot be created' })
    }
}

export const deleteNewProfile = async (req : Request, res : Response) => {
    const id = req.params.id;
    try {
        const profile = await Profile.findById(id);
        if (!profile) {
            throw new Error("Failed to get profile");
        }

        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: profile.imageName
        }
    
        const command = new DeleteObjectCommand(params);
        await s3.send(command);
    
        const response = await profile.deleteOne();
        res.json(response);
    }
    catch(e) {
        console.log("Error at DELETE /:id: ", e)
    }
}

export const updateNewProfile = async (req : Request, res : Response) => {
    const id = req.params.id;
    try {
        const profile = await Profile.findById(id);
        if (!profile) {
            throw new Error("Failed to get profile");
        }
        const result = await profile.updateOne({ ...req.body });
        res.json(result);
    }
    catch(e) {
        console.log("Error at PATCH /:id: ", e)
    }
}

export const createNewProfileImage = async (req : Request, res : Response) => {
    
    try {
        if (!req.file) {
            throw new Error("image file not found for new profile");
        }
        const buffer = await sharp(req.file.buffer).resize({height: 500, width: 400, fit: "contain"}).toBuffer();
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: req.file.originalname,
            Body: buffer,
            ContentType: req.file.mimetype
        }
    
        const command = new PutObjectCommand(params);
        const response = await s3.send(command);
    
        res.json(response);
    }
    catch(e) {
        console.log("Error at POST /images: ", e)
    }
}

export const deleteProfileImage = async (req : Request, res : Response) => {
    const id = req.params.id;

    try {
        const profile = await Profile.findById(id);
        if (!profile) {
            throw new Error("Failed to get profile");
        }
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: profile.imageName
        }
    
        const command = new DeleteObjectCommand(params);
        const response = await s3.send(command);
        res.json(response);
    }
    catch(e) {
        console.log("Error at DELETE /:id/images: ", e)
    }
}

export const patchProfileImage = async (req : Request, res : Response) => {
    const id = req.params.id;
    try {
        const profile = await Profile.findById(id);
        if (!profile) {
            throw new Error("Failed to get profile");
        }
        if (!req.file) {
            throw new Error("image file not found for new profile");
        }
        const result = await profile.updateOne({
            imageName: req.file.originalname
        })
        res.json(result);
    }
    catch(e) {
        console.log("Error at PATCH /:id/images: ", e)
    }
}