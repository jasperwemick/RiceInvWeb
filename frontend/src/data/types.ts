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

export enum colorsEnum {
    singles,
    duos,
    triples,
    five,
    other
}

export interface Game {
    _id : string;
    name : string;

}

export interface GameMode {
    _id : string;
    gameId : string;
    mode : colorsEnum;
}


export interface GameStats {
    player : string;
    gameModeId : string;
    matchWins : number;
    matchLoses : number;
    setWins : number;
    setLoses : number;
    placing : number;
    rating : () => number;
    final : () => number;
}
