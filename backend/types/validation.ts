import mongoose from "mongoose";
import z from "zod";

const objectIdSchema = z.string().refine(
    (val) => mongoose.Types.ObjectId.isValid(val),
    { message: "Invalid ObjectId" }
)

export const setSchema = z.object({
    setID : z.number(),
    gameTag : z.string(),
    upperSeedProfiles : z.array(objectIdSchema).min(1),
    upperSeedWins : z.number(),
    lowerSeedProfiles : z.array(objectIdSchema).min(1),
    lowerSeedWins : z.number(),
    bestOf : z.number(),
    parents : z.array(z.string()),
    lowerSetID : z.number(),
    nextSetID : z.number(),
    upperSeedIDs : z.array(z.number()),
    lowerSeedIDs : z.array(z.number()),
})

export const setsSchema = z.array(setSchema).min(1)

export type setsBody = z.infer<typeof setSchema>