export interface Profile {
    _id : string;
    name : string;
    description : string;
    imageName : string;
    imageURL : string;
    aliases : string[];
}

export interface GamerProfile {
    _id : string;
    profileId : string;
}

export interface User {
    username : string;
    roles : string[];
    profileId : string;
}

export interface Game {
    _id : string;
    name : string;
}

export interface GameMode {
    _id : string;
    gameId : string;
    mode : 'singles' | 'duos' | 'triples' | 'five' | 'other';
}

export interface GameStats {
    player : string;
    gameMode : GameMode;
    matchWins : number;
    matchLoses : number;
    setWins : number;
    setLoses : number;
    placing : number;
    rating : () => number;
    final : () => number;
}

export interface SetSchema {
    setID : number;
    gameTag : string;
    upperSeedIds : number[];
    upperSeedProfiles : Profile[];
    upperSeedWins : number;
    lowerSeedIds : number[];
    lowerSeedProfiles : Profile[];
    lowerSeedWins : number;
    bestOf : number;
    parents : string[];
    lowerSetID : number;
    nextSetID : number;
}