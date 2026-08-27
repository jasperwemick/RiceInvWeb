export interface GameModeProfile {
    _id : string;
    mode : string;
    rank : number;
}

export interface GameProfile {
    _id : string;
    gameId : string;
    gameModeProfiles : GameModeProfile[];
}

export interface Profile {
    def : 'Profile';
    _id : string;
    name : string;
    description : string;
    imageName : string;
    imageUrl : string;
    aliases : string[];
    gameProfiles : GameProfile[];
}

export interface FlatGameProfile { 
    _id : string;
    playerName : string;
    gameName : 'brawl' | 'LoL' | 'Valorant' | 'Rocket';
    gameModes : GameModeProfile[]
}

export interface FlatBrawlGameProfile extends FlatGameProfile {

}

export interface User {
    username : string;
    roles : string[];
    profileId : string;
}

export interface UserAuth extends User {
    message : string;
    status : string;
}

export interface GameMode {
    _id : string;
    mode : 'singles' | 'duos' | 'triples' | 'five' | 'other';
    description : string;
    teamSize : number;
}

export interface Game {
    _id : string;
    name : string;
    fullName : string;
    description : string;
    gameModes : GameMode[];
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


export interface Team {
    def : 'Team';
    name : string;
    members : Profile[]
}

export interface Tournament {
    name : string;
    gameMode : string;
    participants : string[] | Profile[] | Team[];
}

export interface TournamentMatch {
    matchNumber : number;
    matchSet : string;
    winningTeam : Team;
    duration : number;
}

export interface TournamentSet {
    setId : number;
    bestOf : number;
    stage ? : TournamentStage;
    stageOrder : number;
    subStageOrder : number;
    setName ? : string;
    participants : Profile[] | Team[];
    participantType : string;
    parents ? : string[];
    lowerSetID ? : number;
    nextSetID ? : number;
}

export interface Stage {
    stage : string;
    formats : string[];
}

export interface TournamentStage {
    tournament ? : string | Tournament;
    order : number;
    stageType : string;
    format : string;
    stageName ? : string;
}

export interface TournamentSubStage {
    stage : number;
    name : string;
    format : string;
    members : Profile[] | Team[];
    qualificationSlots ? : number;
}

export interface TimeRange {
    year : number;
    month : number;
    day : number;
    range : boolean[];
}

export interface RiceEvent {
    _id: string;
    name: string;
    description: string;
    year: number;
    month: number;
    day: number;
    group: string;
    duration: number;
    timeRanges: TimeRange[];
    participants: Profile[];
    ready: boolean;
    finished: boolean;
}

export interface TimeEntry {
    user : string;
    profileId : string;
    year : number;
    month : number;
    day : number;
    timeRange : boolean[];
}

export interface CalendarDay {
    dayNum : number;
    currentMonth : boolean;
    date : Date;
    month : number;
    number : number;
    selected : boolean;
    year : number;
}

export interface TimeIntervalData {
    strength : number;
    players : string[];
}

export interface TimeEntryConfig {
    opacity : number;
    rangeType : 'AM' | 'PM' | 'BOTH';
}