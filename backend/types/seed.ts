import mongoose from "mongoose";

export interface GameModeSeed {
    mode : string;
    description : string;
}

export interface GameSeed {
    name : string;
    fullName : string;
    description : string;
    gameModes : GameModeSeed[];
}

export const allPlayerIds : string[] = [
    '657e303a6bf375754615775c', // Kevin Lee
    '65791e9479e6998e4df5da3a', // Keaton Boodlal
    '657e36226bf37575461577b9', // Kevin Dong
    '66d9e46c6826d629c026d65b', // Ian Cooper
    '657e36756bf37575461577be', // Ryan Bellinghoven
    '657922cedfd98f52eb92243a', // Neil Patel
    '657e30136bf3757546157757', // Kevin Lizarazu
    '657923b3dfd98f52eb922444', // Noah Woods
    '657e31bc6bf3757546157772', // Paolo Cruz
    '66ccd8eaedab991d9539b23d', // Ethan Paitsel
    '657e30876bf3757546157761', // Tai Phan
    '6579236ddfd98f52eb92243f', // John Mason
    '657e30d16bf3757546157766', // Long Phan
    '6579213bdfd98f52eb922421', // Ron Yue
    '65792113dfd98f52eb92241c', // Noah Seaman
    '657920c0dfd98f52eb922417', // Luc Phan
    '657e31746bf375754615776b', // Caleb Eubank
    '65791c0c79e6998e4df5da2c', // Jasper Emick
    '65792084dfd98f52eb92240e', // Kien Tran
]

export interface PlayerStatSeed {
    game : string;
    gameMode : string;
    playerProfile : string;
}

export interface BrawlStatSeed extends PlayerStatSeed {
    game : 'Brawl';
    gameMode : '1v1' | '2v2';
    legend ? : string;
    damage ? : number;
    kills : number;
    stocks ? : number;
}

export interface LoLStatSeed extends PlayerStatSeed {
    game : 'LoL';
    gameMode : 'ARAM' | 'Rift';
    role ? : 'Top' | 'Mid' | 'ADC' | 'Support' | 'Jungle';
    kills : number;
    deaths : number;
    assists : number;
    damage ? : number;
    cs ? : number;
    gold : number;
    vision ? : number;
    level : number;
}

export interface ValorantStatSeed extends PlayerStatSeed {
    game : 'Valorant';
    gameMode : '5v5';
    agent : string;
    acs : number;
    kills : number;
    deaths : number;
    assists : number;
    adr : number;
    hsPercent : number;
    kast : number;
    fk : number;
    fd : number;
    mk : number;
}

export interface RocketStatSeed extends PlayerStatSeed {
    game : 'Rocket';
    gameMode : '1v1' | '3v3';
    score : number;
    goals : number;
    received : number;
    assists : number;
    saves : number;
    shots : number;
}

export type AnyStatSeed = BrawlStatSeed | LoLStatSeed | ValorantStatSeed | RocketStatSeed

export interface MatchSeed {
    matchNumber : number;
    winner : string;
    winnerType : 'Profile' | 'Team'
    playerStats : AnyStatSeed[];
}

export interface BrawlMatchSeed extends MatchSeed {
    game : 'Brawl';
    map : string;
}

export interface LoLMatchSeed extends MatchSeed {
    game : 'LoL';
    time : number;
}

export interface ValorantMatchSeed extends MatchSeed {
    game : 'Valorant';
    map : 'Split' | 'Bind' | 'Haven' | 'Ascent' | 'Pearl' | 'Sunset' | 'Lotus' | 'Corrode' | 'Icebox' | 'Fracture' | 'Abyss' | 'Breeze' | 'Summit';
    rounds : number;
    version : string;
}

export interface RocketMatchSeed extends MatchSeed {
    game : 'Rocket';
    map : string;
}

export type AnyMatchSeed = BrawlMatchSeed | LoLMatchSeed | ValorantMatchSeed | RocketMatchSeed;

export interface TeamSeed {
    name : string;
    game : string;
    members : string[];
    placing ? : number;
}

export interface SetSeed {
    setId : number;
    bestOf : number;
    stage : 'Group' | 'Gauntlet' | 'Playoffs';
    stageName : string;
    setName : string;
    participants : string[];
    participantType : 'Profile' | 'Team';
    parents : number[];
    lowerSetID : number;
    nextSetID : number;
    matches : AnyMatchSeed[];
}

export interface TournamentSeed {
    name : string;
    game : string;
    gameMode : string;
    participants : string[];
    participantType : 'Profile' | 'Team';
    sets : SetSeed[];
}