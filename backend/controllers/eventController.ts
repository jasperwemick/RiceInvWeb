import RiceEvent from '../models/riceEventsModel'
import mongoose from 'mongoose';
import { Request, Response } from "express";

export const getRiceEvents = async (req : Request, res : Response) => {

    const ready = req.query.ready
    const finished = req.query.finished === 'false' ? false : true

    try {
        if (ready !== undefined) {
            const events = await RiceEvent.find({ready: ready}).populate('participants.person').exec()
            res.json(events)
        }
        else if (finished !== undefined) {
            const events = await RiceEvent.find({finished: finished}).populate('participants.person').exec()
            res.json(events)
        }
        else {
            const events = await RiceEvent.find().populate('participants.person').exec()
            res.json(events)
        }
    }
    catch(e) {
        console.log('Error at GET /events', e)
    }
}

export const getMonthlyRiceEvents = async (req : Request, res : Response) => {

    const year = req.params.year
    const month = req.params.month

    try {
        const events = await RiceEvent.find({year: year, month: month}).populate('participants.person').exec()
        res.json(events)
    }
    catch(e) {
        console.log('Error at GET /events/:year/:month', e)
    }
}

export const getDailyRiceEvents = async (req : Request, res : Response) => {

    const year = req.params.year
    const month = req.params.month
    const day = req.params.day

    try {
        const events = await RiceEvent.find({year: year, month: month, day: day}).populate('participants.person').exec()
        res.json(events)
    }
    catch(e) {
        console.log('Error at GET /events/:year/:month/:day', e)
    }
}

export const getOneRiceEvents = async (req : Request, res : Response) => {

    const year = req.params.year
    const month = req.params.month
    const day = req.params.day
    const tag = req.params.tag

    try {
        const event = await RiceEvent.find({year: year, month: month, day: day, tag: tag}).populate('participants.person').exec()
        res.json(event)
    }
    catch(e) {
        console.log('Error at GET /events/:year/:month/:day/:tag', e)
    }
}

export const createRiceEvent = async (req : Request, res : Response) => {
    try {
        const post = await RiceEvent.create({
            ...req.body
        })
        const result = await post.save()

        res.json(result)
    }
    catch(e) {
        console.log('Error at POST /events', e)
    }
}

export const upsertOneRiceEvent = async (req : Request, res : Response) => {

    const id = req.params.tag

    const options = {upsert: true, new: true, setDefaultsOnInsert: true};

    try {

        const finalID = id === '0' ? new mongoose.Types.ObjectId() : id

        console.log(finalID)

        const result = await RiceEvent.findByIdAndUpdate(finalID, {...req.body, _id: finalID}, options)
        res.json(result)
    }
    catch(e) {
        console.log('Error at PUT /events/:id', e)
    }
}

export const deleteOneRiceEvent = async (req : Request, res : Response) => {

    const id = req.params.tag

    try {
        const result = await RiceEvent.findByIdAndDelete(id)
        res.json(result)
    }
    catch(e) {
        console.log('Error at DELETE /events/:id', e)
    }
}