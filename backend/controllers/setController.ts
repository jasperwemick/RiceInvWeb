import Set from '../models/setModel';
import { Request, Response } from "express";
import { setsSchema } from '../types/validation';

export const createOneBracketSet = async (req : Request, res : Response) => {
    try {
        const post = await Set.create({
            ...req.body
        })
        const result = await post.save()

        res.json(result)
    }
    catch(e) {
        console.log('Error at POST /set', e)
    }
}

export const upsertOneBracketSet = async (req : Request, res : Response) => {
    const num = req.params.num
    const tag = req.params.tag

    const options = { upsert: true, new: true, setDefaultsOnInsert: true };

    try {
        const result = await Set.findOneAndUpdate(
            {gameTag: tag, setID: num}, 
            {...req.body, upperSeedProfiles: req.body.upperSeedIDs, lowerSeedProfiles: req.body.lowerSeedIDs}, 
            options
        )
        res.json(result)
    }
    catch(e) {
        console.log('Error at PUT /set/:tag/:num', e)
    }
}


export const upsertManyBracketSets = async (req : Request, res : Response) => {
    const tag = req.params.tag
    const options = {upsert: true, new: true, setDefaultsOnInsert: true};

    try {
        const parsedBody = setsSchema.safeParse(req.body);
        if (!parsedBody.success) {
            return res.status(400).json({ error: parsedBody.error.flatten() });
        }
        
        parsedBody.data.forEach( async (set) => {
            try {
                if (set) {
                    await Set.findOne({gameTag: tag, setID: set.setID}).then(
                        async (doc) => {
                            // try {
                            //     if (doc) {
                            //         await Set.findOneAndUpdate(
                            //             {gameTag: tag, setID: set.setID}, 
                            //             {
                            //                 ...set, 
                            //                 upperSeedProfiles: (doc.upperSeedProfiles.length === 0 ? set.upperSeedIDs : doc.upperSeedProfiles), 
                            //                 lowerSeedProfiles: (doc.lowerSeedProfiles.length === 0 ? set.lowerSeedIDs : doc.lowerSeedProfiles)
                            //             }, 
                            //             options
                            //         )
                            //     }
                            //     else {
                            //         await Set.findOneAndUpdate(
                            //             {gameTag: tag, setID: set.setID}, 
                            //             {
                            //                 ...set, 
                            //                 upperSeedProfiles: set.upperSeedIDs, 
                            //                 lowerSeedProfiles: set.lowerSeedIDs
                            //             }, 
                            //             options
                            //         )
                            //     }
    
                            // }
                            // catch(e) {
                            //     console.log('Error at Put, upsertManyBracketSets', e)
                            // }
                        }
                    )
                }
            }
            catch(e) {
                console.log('Error at Put, upsertManyBracketSets', e)
            }
        });

        res.json()
    }
    catch(e) {
        console.log('Error at PUT /set/:tag/', e)
    }
}

export const deleteOneBracketSet = async (req : Request, res : Response) => {
    const num = req.params.num
    const tag = req.params.tag


    try {
        const result = await Set.findOneAndDelete({gameTag: tag, setID: num})
        res.json(result)
    }
    catch(e) {
        console.log('Error at DELETE /set/:tag/:num', e)
    }
}