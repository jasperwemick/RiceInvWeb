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

const statBaseSchema = z.object({
    profile : objectIdSchema,
    team : z.enum(['A', 'B'])
})

export const statBrawlSchema = statBaseSchema.extend({
    format : z.literal('Brawl'),
    legend : z.string(),
    damage : z.number(),
    kills : z.number(),
    stocks : z.number()
})

export const statLoLSchema = statBaseSchema.extend({
    format : z.literal('LoL'),
    role : z.enum(['Top', 'Mid', 'ADC', 'Support', 'Jungle']),
    kills : z.number(),
    deaths : z.number(),
    assists : z.number(),
    damage : z.number(),
    cs : z.number(),
    gold : z.number(),
    vision : z.number(),
    level : z.number()
})

export const statValorantSchema = statBaseSchema.extend({
    format : z.literal('Valorant'),
    agent : z.string(),
    acs : z.number(),
    kills : z.number(),
    deaths : z.number(),
    assists : z.number(),
    adr : z.number(),
    hsPercent : z.number(),
    kast : z.number(),
    fk : z.number(),
    fd : z.number(),
    mk : z.number()
})

export const statRocketSchema = statBaseSchema.extend({
    format : z.literal('Rocket'),
    score : z.number(),
    goals : z.number(),
    assists : z.number(),
    saves : z.number(),
    shots : z.number()
})


const statSchema = z.discriminatedUnion('format', [
    statBrawlSchema,
    statLoLSchema,
    statValorantSchema,
    statRocketSchema
])

export const matchBaseSchema = z.object({
    matchNumber : z.number(),
    teamAWin : z.boolean(),
    duration : z.number(),
    playerStats : z.array(statSchema)
})

export const matchBrawlSchema = matchBaseSchema.extend({
    format : z.literal('Brawl'),
    map : z.string()
})

export const matchLoLSchema = matchBaseSchema.extend({
    format : z.literal('LoL'),
    time : z.number()
})

export const matchValorantSchema = matchBaseSchema.extend({
    format : z.literal('Valorant'),
    map : z.string(),
    version : z.string()
})

export const matchRocketSchema = matchBaseSchema.extend({
    format : z.literal('Rocket'),
    map : z.string(),
})

const newMatchSchema = z.discriminatedUnion('format', [
    matchBrawlSchema,
    matchLoLSchema,
    matchValorantSchema,
    matchRocketSchema
])

const newSetsSchema = z.object({
    setId : z.number().min(0),
    bestOf : z.number().min(1),
    bracket : z.boolean(),
    parents : z.array(z.string()),
    lowerSetID : z.number(),
    nextSetID : z.number(),
    matches : z.array(newMatchSchema).min(1)
})

export const newTournamentSchema = z.object({
    name : z.string().min(1),
    gameMode : objectIdSchema,
    players : z.array(objectIdSchema).min(2),
    sets : z.array(newSetsSchema).min(1)
})

export type newTournamentBody = z.infer<typeof newTournamentSchema>

// --- Game mode variants (League example) ---

const summonersRiftModeSchema = z.object({
    mode: z.literal('Rift'),
});

const aramModeSchema = z.object({
    mode: z.literal('ARAM'),
});

const leagueGameModeSchema = z.discriminatedUnion('mode', [
    summonersRiftModeSchema,
    aramModeSchema,
]);

// --- Game profile variants ---

const leagueProfileSchema = z.object({
    game: z.literal('LoL'),
    gameModes: z.array(leagueGameModeSchema).default([]),
});

// add other games similarly, e.g. valorantProfileSchema

export const gameProfileSchema = z.discriminatedUnion('game', [
    leagueProfileSchema,
    // valorantProfileSchema,
]);

// --- Top-level create profile schema ---

export const createProfileSchema = z.object({
    name: z.string().min(1),
    user : z.string().min(1),
    aliases : z.array(z.string()),
    description : z.string(),
    imageName: z.string().optional(),
});

type CreateProfileBody = z.infer<typeof createProfileSchema>;