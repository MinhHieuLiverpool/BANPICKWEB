export type Lane = 'ADL' | 'DSL' | 'JG' | 'MID' | 'SUP';

export interface Champion {
    name: string;
    displayName: string;
    fileName: string; // actual file name in ASSETS folder
}

export interface Player {
    name: string;
    champion: string | null; // champion fileName
    lane: Lane;
}

export interface Team {
    name: string;
    shortName: string; // e.g. SGP, GAM
    logoVariant: string; // e.g. SGP_C
    players: Player[];
    score: number;
}

export interface BanPickState {
    blueTeam: Team;
    redTeam: Team;
    blueBans: string[]; // champion fileNames
    redBans: string[];  // champion fileNames
    matchTitle: string; // e.g. "GROUP STAGE 1"
    bestOf: number;     // e.g. 5
    currentPhase: 'ban' | 'pick' | 'done';
    currentTurn: 'blue' | 'red';
    currentSlot: number;
}
