import mongoose from "mongoose";
import z from "zod";

const objectIdSchema = z.string().refine(
    (val) => mongoose.Types.ObjectId.isValid(val),
    { message: "Invalid ObjectId" }
)

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

// ---------------------- Profiles ----------------------

const profileGameModeBaseSchema = z.object({
    gameModeId : objectIdSchema,
    rank : z.number()
})

// ---------------------- Brawl ----------------------


const brawl1v1ModeSchema = profileGameModeBaseSchema.extend({
    mode : z.literal('1v1')
})

const brawl2v2ModeSchema = profileGameModeBaseSchema.extend({
    mode : z.literal('2v2')
})

const brawlGameModeSchema = z.discriminatedUnion('mode', [
    brawl1v1ModeSchema,
    brawl2v2ModeSchema
]);

const brawlProfileSchema = z.object({
    game : z.literal('Brawl'),
    gameModes : z.array(brawlGameModeSchema)
})

// ---------------------- LoL ----------------------

const riftModeSchema = profileGameModeBaseSchema.extend({
    mode: z.literal('Rift'),
});

const aramModeSchema = profileGameModeBaseSchema.extend({
    mode: z.literal('ARAM'),
});

const leagueGameModeSchema = z.discriminatedUnion('mode', [
    riftModeSchema,
    aramModeSchema,
]);

const leagueProfileSchema = z.object({
    game: z.literal('LoL'),
    gameModes: z.array(leagueGameModeSchema).default([]),
});

// ---------------------- Valorant ----------------------

const val5v5ModeSchema = profileGameModeBaseSchema.extend({
    mode : z.literal('5v5')
})

const valorantGameModeSchema = z.discriminatedUnion('mode', [
    val5v5ModeSchema
])

const valorantProfileSchema = z.object({
    game : z.literal('Valorant'),
    gameModes : z.array(valorantGameModeSchema).default([])
})

// ---------------------- Rocket ----------------------

const rocket1v1ModeSchema = profileGameModeBaseSchema.extend({
    mode : z.literal('1v1')
})

const rocket3v3ModeSchema = profileGameModeBaseSchema.extend({
    mode : z.literal('3v3')
})

const rocketGameModeSchema = z.discriminatedUnion('mode', [
    rocket1v1ModeSchema,
    rocket3v3ModeSchema
])

const rocketProfileSchema = z.object({
    game : z.literal('Rocket'),
    gameModes : z.array(rocketGameModeSchema)
})

export const gameProfileSchema = z.discriminatedUnion('game', [
    brawlProfileSchema,
    leagueProfileSchema,
    valorantProfileSchema,
    rocketProfileSchema
]);

export const createProfileSchema = z.object({
    name: z.string().min(1),
    user : z.string().min(1),
    aliases : z.array(z.string()),
    description : z.string(),
    imageName: z.string().optional(),
});

export const profileSchema = z.object({
    name: z.string().min(1),
    user : z.string().min(1),
    aliases : z.array(z.string()),
    description : z.string(),
    imageName : z.string().optional(),
    imageUrl : z.string().optional(),
    gameProfiles : z.array(gameProfileSchema)
});

export const profilesSchema = z.array(profileSchema);

// ---------------------- Games ----------------------

export const gameModeSchema = z.object({
    
});

type CreateProfileBody = z.infer<typeof createProfileSchema>;