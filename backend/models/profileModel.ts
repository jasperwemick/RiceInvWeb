import mongoose, { Document, Types } from "mongoose";

const Schema = mongoose.Schema;

export interface GameProfileBase {
    game : string;
    gameId : mongoose.Schema.Types.ObjectId;
    gameModes : Types.DocumentArray<GameModeProfileBase & Document>;
}

const gameProfileBaseSchema = new Schema<GameProfileBase>({
    game : {
        type : String,
        required : true
    },
    gameId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
})

export interface GameModeProfileBase {
    mode : string;
    gameModeId : mongoose.Schema.Types.ObjectId;
    rank : number;
    rating : number;
    ricePoints : number;
}

const gameModeProfileBaseSchema = new Schema<GameModeProfileBase>({
    mode : {
        type : String,
        required : true
    },
    gameModeId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    rank : {
        type : Number
    },
    rating : {
        type : Number
    },
    ricePoints : {
        type : Number
    }
});

// -------------------- Brawlhalla --------------------

interface GameModeBrawl1v1 extends GameModeProfileBase {
    mode : '1v1'
}

const gameModeBrawl1v1Schema = new Schema<GameModeBrawl1v1>({

}).add(gameModeProfileBaseSchema);

interface GameModeBrawl2v2 extends GameModeProfileBase {
    mode : '2v2'
}

const gameModeBrawl2v2Schema = new Schema<GameModeBrawl2v2>({

}).add(gameModeProfileBaseSchema);

type GameModeBrawl = GameModeBrawl1v1 | GameModeBrawl2v2

interface GameProfileBrawl extends GameProfileBase {
    game : 'Brawl';
    favoriteLegend : string;
    gameModes : Types.DocumentArray<GameModeBrawl & Document>;
}

const profileBrawlSchema = new Schema<GameProfileBrawl>({
    favoriteLegend : {
        type : String
    },
    gameModes : [{
        mode : { type : String, required : true }
    }]
}).add(gameProfileBaseSchema);

const gameModesBrawlPath = profileBrawlSchema.path('gameModes') as mongoose.Schema.Types.DocumentArray;
gameModesBrawlPath.discriminator('Brawl1v1', gameModeBrawl1v1Schema);
gameModesBrawlPath.discriminator('Brawl2v2', gameModeBrawl2v2Schema);


// -------------------- League Of Legends --------------------

interface GameModeRift extends GameModeProfileBase {
    mode : 'Rift';
}

const gameModeRiftSchema = new Schema<GameModeRift>({

}).add(gameModeProfileBaseSchema);

interface GameModeARAM extends GameModeProfileBase {
    mode : 'ARAM';
}

const gameModeAramSchema = new Schema<GameModeARAM>({

}).add(gameModeProfileBaseSchema);

type GameModeLoL = GameModeRift | GameModeARAM

interface GameProfileLoL extends GameProfileBase {
    game : 'LoL';
    favoriteChampion : string;
    gameModes : Types.DocumentArray<GameModeLoL & Document>;
}

const profileLoLSchema = new Schema<GameProfileLoL>({
    favoriteChampion : {
        type : String
    },
    gameModes : [{
        mode : { type : String, required : true }
    }]
}).add(gameProfileBaseSchema);;

const gameModesLoLPath = profileLoLSchema.path('gameModes') as mongoose.Schema.Types.DocumentArray
gameModesLoLPath.discriminator('Rift', gameModeRiftSchema);
gameModesLoLPath.discriminator('ARAM', gameModeAramSchema);

// -------------------- Valorant --------------------

interface GameModeVal5v5 extends GameModeProfileBase {
    mode : '5v5';
}

const gameModeVal5v5Schema = new Schema<GameModeVal5v5>({

}).add(gameModeProfileBaseSchema);

type GameModeValorant = GameModeVal5v5

interface GameProfileValorant extends GameProfileBase {
    game : 'Valorant';
    favoriteAgent : string;
    favoriteClass : 'Duelist' | 'Initiator' | 'Controller' | 'Sentinel'
    gameModes : Types.DocumentArray<GameModeValorant & Document>;
}

const profileValorantSchema = new Schema<GameProfileValorant>({
    favoriteAgent : {
        type : String
    },
    favoriteClass : {
        type : String
    },
    gameModes : [{
        mode : { type : String, required : true }
    }]
}).add(gameProfileBaseSchema);

const gameModesValorantPath = profileValorantSchema.path('gameModes') as mongoose.Schema.Types.DocumentArray
gameModesValorantPath.discriminator('Val5v5', gameModeVal5v5Schema);

// -------------------- Rocket League --------------------

interface GameModeRocket1v1 extends GameModeProfileBase {
    mode : '1v1';
}

const gameModeRocket1v1Schema = new Schema<GameModeRocket1v1>({

}).add(gameModeProfileBaseSchema);

interface GameModeRocket3v3 extends GameModeProfileBase {
    mode : '3v3';
}

const gameModeRocket3v3Schema = new Schema<GameModeRocket3v3>({

}).add(gameModeProfileBaseSchema);

type GameModeRocket = GameModeRocket1v1 | GameModeRocket3v3

interface GameProfileRocket extends GameProfileBase {
    game : 'Rocket';
    favoriteCar : string;
    gameModes : Types.DocumentArray<GameModeRocket & Document>;
}

const profileRocketSchema = new Schema<GameProfileRocket>({
    favoriteCar : {
        type : String
    },
    gameModes : [{
        mode : { type : String, required : true }
    }]
}).add(gameProfileBaseSchema);

const gameModesRocketPath = profileRocketSchema.path('gameModes') as mongoose.Schema.Types.DocumentArray
gameModesRocketPath.discriminator('1v1', gameModeRocket1v1Schema);
gameModesRocketPath.discriminator('3v3', gameModeRocket3v3Schema);

// -------------------- Base Profile --------------------

type GameProfile = GameProfileBrawl | GameProfileLoL | GameProfileValorant | GameProfileRocket

export interface ProfileDoc extends Document{
    name : string;
    user : string;
    aliases : string[];
    description : string;
    imageName : string;
    imageUrl : string;
    gameProfiles : Types.DocumentArray<GameProfile & Document>;
}

const profileSchema = new Schema<ProfileDoc>({
    name: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    aliases: [{
        type: String,
        required: true
    }],
    description: {
        type: String,
        required: true
    },
    imageName: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: false
    },
    gameProfiles : [{
        game : { type : String, required : true }
    }]
}, { timestamps: false });

const gameProfilesPath = profileSchema.path('gameProfiles') as mongoose.Schema.Types.DocumentArray;
gameProfilesPath.discriminator('Brawl', profileBrawlSchema);
gameProfilesPath.discriminator('LoL', profileLoLSchema);
gameProfilesPath.discriminator('Valorant', profileValorantSchema);
gameProfilesPath.discriminator('Rocket', profileRocketSchema);

export default mongoose.model('Profile', profileSchema);