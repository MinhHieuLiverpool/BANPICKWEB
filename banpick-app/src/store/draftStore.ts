import type { Lane } from '../types';

// ── Shared data types ──────────────────────────────────────────────────────
export interface PickData {
    championFileName: string | null;
    playerName: string;
    lane: Lane;
}

export interface BanData {
    championFileName: string | null;
}

export interface TeamState {
    shortName: string;
    score: number;
    picks: PickData[];
    bans: BanData[];
}

export interface DraftAction {
    team: 'blue' | 'red';
    phase: 'ban' | 'pick';
    slot: number;
    label: string;
}

// ── AoV draft sequence ─────────────────────────────────────────────────────
export const DRAFT_SEQUENCE: DraftAction[] = [
    // BAN PHASE 1
    { team: 'blue', phase: 'ban', slot: 0, label: 'BAN' },
    { team: 'red', phase: 'ban', slot: 0, label: 'BAN' },
    { team: 'blue', phase: 'ban', slot: 1, label: 'BAN' },
    { team: 'red', phase: 'ban', slot: 1, label: 'BAN' },
    // PICK PHASE 1
    { team: 'blue', phase: 'pick', slot: 0, label: 'TOP1' },
    { team: 'red', phase: 'pick', slot: 0, label: 'TOP2' },
    { team: 'red', phase: 'pick', slot: 1, label: 'JGL2' },
    { team: 'blue', phase: 'pick', slot: 1, label: 'JGL1' },
    { team: 'blue', phase: 'pick', slot: 2, label: 'MID1' },
    { team: 'red', phase: 'pick', slot: 2, label: 'MID2' },
    // BAN PHASE 2
    { team: 'red', phase: 'ban', slot: 2, label: 'BAN' },
    { team: 'blue', phase: 'ban', slot: 2, label: 'BAN' },
    { team: 'red', phase: 'ban', slot: 3, label: 'BAN' },
    { team: 'blue', phase: 'ban', slot: 3, label: 'BAN' },
    // PICK PHASE 2
    { team: 'red', phase: 'pick', slot: 3, label: 'ADL2' },
    { team: 'blue', phase: 'pick', slot: 3, label: 'ADL1' },
    { team: 'blue', phase: 'pick', slot: 4, label: 'SUP1' },
    { team: 'red', phase: 'pick', slot: 4, label: 'SUP2' },
];

export function getPhaseName(idx: number): string {
    if (idx < 4) return 'BAN PHASE 1';
    if (idx < 10) return 'PICK PHASE 1';
    if (idx < 14) return 'BAN PHASE 2';
    return 'PICK PHASE 2';
}

// ── Team helpers ───────────────────────────────────────────────────────────
export const SLOT_LANES: Lane[] = ['DSL', 'JG', 'MID', 'ADL', 'SUP'];

export const TEAMS = ['1S', 'BOX', 'FPL', 'FPT', 'GAM', 'SGP', 'SPN', 'TS'] as const;
export type TeamShort = typeof TEAMS[number];

export const MATCH_TITLE = 'GROUP\nSTAGE 1';
export const BEST_OF = 5;

const DEFAULT_NAMES = ['SGP KHOA', 'SGP BANG', 'SGP FISH', 'SGP YIWEIZ', 'SGP YULTAN'];

export function emptyTeam(shortName: string): TeamState {
    return {
        shortName,
        score: 0,
        picks: Array.from({ length: 5 }, (_, i) => ({
            championFileName: null,
            playerName: DEFAULT_NAMES[i],
            lane: SLOT_LANES[i],
        })),
        bans: Array.from({ length: 4 }, () => ({ championFileName: null })),
    };
}

// ── Shared broadcast state ─────────────────────────────────────────────────
export interface SharedDraftState {
    screen: 'setup' | 'draft';
    blue: TeamState;
    red: TeamState;
    actionIndex: number;
    timeLeft: number;
    /** fileName of currently previewed (not yet locked) champion */
    selectedChamp: string | null;
}

export const STORAGE_KEY = 'banpick_draft_state';
export const CHANNEL_NAME = 'banpick_draft';

export function createChannel() {
    return new BroadcastChannel(CHANNEL_NAME);
}

export function saveState(state: SharedDraftState) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* ignore */ }
}

export function loadState(): SharedDraftState | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as SharedDraftState) : null;
    } catch { return null; }
}
