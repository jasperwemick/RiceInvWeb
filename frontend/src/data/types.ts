export interface GameModeProfile {
    _id : string;
    rank : number;
}

export interface GameProfile {
    _id : string;
    gameModeProfiles : GameModeProfile[];
}

export interface Profile {
    _id : string;
    name : string;
    description : string;
    imageName : string;
    imageURL : string;
    aliases : string[];
    gameProfiles : GameProfile[];
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

export interface Tournament {
    name : string;
    gameMode : string;
    players : string[] | Profile[];
}

export interface Team {
    name : string;
    tournament : string | Tournament;
    members : string[] | Profile[]
}

export interface TournamentMatch {
    matchNumber : number;
    matchSet : string;
    winningTeam : Team;
    duration : number;
}

export interface TournamentSet {
    setId : number;
    tournament : string | Tournament;
    bestOf : number;
    bracket : boolean;
    teams : Team[];
    parents : string[];
    lowerSetID : number;
    nextSetID : number;
    matches : TournamentMatch[];
}

