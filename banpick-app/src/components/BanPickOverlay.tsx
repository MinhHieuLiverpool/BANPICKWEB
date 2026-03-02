import { getChampImageUrl, getTeamLogoUrl, getLaneIconUrl, CHAMPIONS } from '../data/champions';
import type { Lane } from '../types';
import { useState, useEffect } from 'react';

interface PickData {
    championFileName: string | null;
    playerName: string;
    lane: Lane;
}

interface BanData {
    championFileName: string | null;
}

interface TeamData {
    shortName: string;
    score: number;
    picks: PickData[];
    bans: BanData[];
}

interface Action {
    team: 'blue' | 'red';
    phase: 'ban' | 'pick';
    slot: number;
    label: string; // position label e.g. "TOP1", "JGL2"
}

// AoV competitive draft order
// Positions: Blue 1-5 (TOP→SUP), Red 6-10 (SUP→TOP reversed for display)
// Ban slots 1-8: Blue ban 1-4 (left), Red ban 1-4 (right, reversed display)
// Pick slots: Blue 0-4 (TOP,JGL,MID,ADL,SUP), Red 0-4 (TOP,JGL,MID,ADL,SUP - shown reversed)
const sequence: Action[] = [
    // ── BAN PHASE 1 ──
    { team: 'blue', phase: 'ban',  slot: 0, label: 'BAN' },
    { team: 'red',  phase: 'ban',  slot: 0, label: 'BAN' },
    { team: 'blue', phase: 'ban',  slot: 1, label: 'BAN' },
    { team: 'red',  phase: 'ban',  slot: 1, label: 'BAN' },
    // ── PICK PHASE 1 ──
    { team: 'blue', phase: 'pick', slot: 0, label: 'TOP1'  },
    { team: 'red',  phase: 'pick', slot: 0, label: 'TOP2'  },
    { team: 'red',  phase: 'pick', slot: 1, label: 'JGL2'  },
    { team: 'blue', phase: 'pick', slot: 1, label: 'JGL1'  },
    { team: 'blue', phase: 'pick', slot: 2, label: 'MID1'  },
    { team: 'red',  phase: 'pick', slot: 2, label: 'MID2'  },
    // ── BAN PHASE 2 ──
    { team: 'red',  phase: 'ban',  slot: 2, label: 'BAN' },
    { team: 'blue', phase: 'ban',  slot: 2, label: 'BAN' },
    { team: 'red',  phase: 'ban',  slot: 3, label: 'BAN' },
    { team: 'blue', phase: 'ban',  slot: 3, label: 'BAN' },
    // ── PICK PHASE 2 ──
    { team: 'red',  phase: 'pick', slot: 3, label: 'ADL2'  },
    { team: 'blue', phase: 'pick', slot: 3, label: 'ADL1'  },
    { team: 'blue', phase: 'pick', slot: 4, label: 'SUP1'  },
    { team: 'red',  phase: 'pick', slot: 4, label: 'SUP2'  },
];

// Phase boundaries for display
function getPhaseName(idx: number): string {
    if (idx < 4)  return 'BAN PHASE 1';
    if (idx < 10) return 'PICK PHASE 1';
    if (idx < 14) return 'BAN PHASE 2';
    return 'PICK PHASE 2';
}

const emptyTeam = (name: string): TeamData => ({
    shortName: name,
    score: 0,
    picks: Array.from({ length: 5 }, () => ({ championFileName: null, playerName: '', lane: 'DSL' as Lane })),
    bans: Array.from({ length: 4 }, () => ({ championFileName: null })),   // 4 bans per team
});

const matchTitle = 'GROUP\nSTAGE 1';
const bestOf = 5;

// ---- gradient helpers (too verbose for className) ----
const accentLineStyle = {
    background: 'linear-gradient(90deg, transparent 0%, #1a73e8 10%, #9c27b0 50%, #e53935 90%, transparent 100%)',
    boxShadow: '0 0 12px rgba(156,39,176,0.7), 0 0 25px rgba(156,39,176,0.7)',
} as const;

const bluePickEmptyBg = 'linear-gradient(180deg, rgba(13,71,161,0.2) 0%, rgba(10,10,20,0.85) 100%)';
const redPickEmptyBg  = 'linear-gradient(180deg, rgba(183,28,28,0.2) 0%, rgba(10,10,20,0.85) 100%)';
const bluePlayerBar   = 'linear-gradient(to top, rgba(13,71,161,0.92) 0%, rgba(13,71,161,0.3) 60%, transparent 100%)';
const redPlayerBar    = 'linear-gradient(to top, rgba(183,28,28,0.92) 0%, rgba(183,28,28,0.3) 60%, transparent 100%)';
const banDiagOverlay  = 'linear-gradient(to bottom right, transparent 45%, rgba(229,57,53,0.35) 45%, rgba(229,57,53,0.35) 55%, transparent 55%)';
const centerTopBar    = 'linear-gradient(90deg, #1a73e8, #9c27b0, #e53935)';
const centerPanelBg   = 'rgba(5,5,15,0.95)';

// ====== BAN CARD ======
function BanCard({ ban, filled }: { ban: BanData; filled: boolean }) {
    return (
        <div
            className={[
                'relative w-[58px] h-[58px] shrink-0 rounded overflow-hidden transition-transform duration-300',
                filled
                    ? 'border-2 border-white/10 bg-[rgba(10,10,20,0.7)] animate-fade-in-scale'
                    : 'border-2 border-dashed border-white/15 bg-[rgba(10,10,20,0.7)]',
            ].join(' ')}
        >
            {ban.championFileName && (
                <>
                    <img
                        className="w-full h-full object-cover grayscale-[60%] brightness-50"
                        src={getChampImageUrl(ban.championFileName, 'ban')}
                        alt={ban.championFileName}
                    />
                    {/* diagonal red overlay */}
                    <div className="absolute inset-[-1px] pointer-events-none z-[1]" style={{ background: banDiagOverlay }} />
                    {/* X mark */}
                    <div
                        className="absolute inset-0 flex items-center justify-center pointer-events-none z-[2] text-[34px] font-bold"
                        style={{ fontFamily: "'Oswald', sans-serif", color: 'rgba(229,57,53,0.9)', textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}
                    >
                        ✕
                    </div>
                </>
            )}
        </div>
    );
}

// ====== PICK CARD ======
function PickCard({ pick, side }: { pick: PickData; side: 'blue' | 'red' }) {
    const isBlue = side === 'blue';
    const borderBottom = isBlue ? '3px solid #1a73e8' : '3px solid #e53935';
    const emptyBg = isBlue ? bluePickEmptyBg : redPickEmptyBg;
    const playerBarBg = isBlue ? bluePlayerBar : redPlayerBar;
    const animClass = pick.championFileName
        ? isBlue ? 'animate-slide-in-left' : 'animate-slide-in-right'
        : '';

    return (
        <div
            className={`relative flex-1 min-w-0 overflow-hidden ${animClass}`}
            style={{
                borderBottom,
                background: pick.championFileName ? undefined : emptyBg,
            }}
        >
            {pick.championFileName ? (
                <img
                    className="w-full h-full object-cover block"
                    style={{ objectPosition: 'center 20%' }}
                    src={getChampImageUrl(pick.championFileName, 'ban')}
                    alt={pick.championFileName}
                />
            ) : null}

            {/* lane icon */}
            <img
                className="absolute top-[6px] w-5 h-5 opacity-80 z-[2]"
                style={{
                    [isBlue ? 'left' : 'right']: '6px',
                    filter: 'brightness(0) invert(1) drop-shadow(0 1px 4px rgba(0,0,0,0.8))',
                }}
                src={getLaneIconUrl(pick.lane)}
                alt={pick.lane}
            />

            {/* player name bar */}
            <div
                className="absolute bottom-0 left-0 right-0 py-2 px-1.5 text-center text-white uppercase tracking-[2px] z-[2]"
                style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontSize: '15px',
                    fontWeight: 600,
                    textShadow: '0 2px 6px rgba(0,0,0,0.9)',
                    background: playerBarBg,
                }}
            >
                {pick.playerName}
            </div>
        </div>
    );
}

// ====== MAIN COMPONENT ======
export default function BanPickOverlay() {
    const [blue, setBlue] = useState<TeamData>(emptyTeam('BLUE'));
    const [red, setRed]   = useState<TeamData>(emptyTeam('RED'));
    const [pool, setPool] = useState(CHAMPIONS);
    const [actionIndex, setActionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);

    const currentAction = sequence[actionIndex] as Action | undefined;

    useEffect(() => {
        setTimeLeft(60);
        const id = setInterval(() => {
            setTimeLeft((t) => {
                if (t <= 1) {
                    if (actionIndex < sequence.length - 1) setActionIndex((i) => i + 1);
                    return 60;
                }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(id);
    }, [actionIndex]);

    function pick(fileName: string) {
        if (!currentAction) return;
        const { team, phase, slot } = currentAction;
        const setter = team === 'blue' ? setBlue : setRed;
        setter((prev) => {
            const next = { ...prev };
            const arr = phase === 'ban' ? [...next.bans] : [...next.picks];
            arr[slot] = { ...arr[slot], championFileName: fileName };
            return phase === 'ban' ? { ...next, bans: arr } : { ...next, picks: arr as PickData[] };
        });
        setPool((p) => p.filter((c) => c.fileName !== fileName));
        if (actionIndex < sequence.length - 1) setActionIndex((i) => i + 1);
    }

    const done = !currentAction;
    const phaseName = actionIndex < sequence.length ? getPhaseName(actionIndex) : 'Completed';
    const teamTag = currentAction
        ? (currentAction.team === 'blue' ? '🔵 BLUE' : '🔴 RED')
        : '';
    const phaseLabel = done
        ? '✅ Draft Complete'
        : `${teamTag}  ·  ${phaseName}  ·  ${currentAction!.label}`;

    // timer progress bar width %
    const timerPct = (timeLeft / 60) * 100;
    const timerColor = timeLeft > 20 ? '#22c55e' : timeLeft > 10 ? '#f59e0b' : '#ef4444';

    return (
        <div className="relative w-screen h-screen overflow-hidden bg-[rgba(10,10,20,0.97)]">

            {/* ── TOP: timer + phase label ── */}
            <div className="absolute top-0 left-0 right-0 z-20 flex flex-col items-center pt-3 pb-2 bg-[rgba(5,5,15,0.85)]">
                <div
                    className="text-base font-semibold tracking-widest uppercase text-white/80 mb-1"
                    style={{ fontFamily: "'Oswald', sans-serif" }}
                >
                    {phaseLabel}
                </div>
                <div
                    className="text-5xl font-bold leading-none mb-2"
                    style={{ fontFamily: "'Oswald', sans-serif", color: timerColor, textShadow: `0 0 20px ${timerColor}88` }}
                >
                    {done ? '—' : `${timeLeft}s`}
                </div>
                {/* progress bar */}
                <div className="w-64 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${timerPct}%`, background: timerColor }}
                    />
                </div>
            </div>

            {/* ── CHAMPION POOL ── */}
            <div
                className="absolute left-0 right-0 overflow-y-auto"
                style={{ top: '120px', bottom: '330px', background: '#0a0a14' }}
            >
                {!done && (
                    <div className="grid gap-1 p-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))' }}>
                        {pool.map((champ) => (
                            <button
                                key={champ.fileName}
                                onClick={() => pick(champ.fileName)}
                                className="group flex flex-col items-center text-white/80 hover:text-white rounded p-1 hover:bg-white/10 transition-all duration-150 cursor-pointer"
                            >
                                <img
                                    className="w-14 h-14 object-cover rounded group-hover:scale-105 transition-transform duration-150"
                                    src={getChampImageUrl(champ.fileName, 'ban')}
                                    alt={champ.displayName}
                                />
                                <span className="text-[10px] mt-0.5 leading-tight text-center truncate w-full">{champ.displayName}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* ── BAN SECTION ── */}
            <div className="absolute left-0 right-0 flex items-center z-[6]" style={{ bottom: '252px', height: '72px' }}>
                {/* blue bans (left) */}
                <div className="absolute left-4 flex items-center gap-[5px]">
                    {blue.bans.map((b, i) => <BanCard key={i} ban={b} filled={!!b.championFileName} />)}
                </div>
                {/* red bans (right, reversed) */}
                <div className="absolute right-4 flex flex-row-reverse items-center gap-[5px]">
                    {red.bans.map((b, i) => <BanCard key={i} ban={b} filled={!!b.championFileName} />)}
                </div>
            </div>

            {/* ── PURPLE ACCENT LINE ── */}
            <div
                className="absolute left-0 right-0 h-[3px] z-[5]"
                style={{ bottom: '245px', ...accentLineStyle }}
            />

            {/* ── BOTTOM BAR (picks + center) ── */}
            <div className="absolute bottom-0 left-0 right-0 flex z-[4]" style={{ height: '245px' }}>

                {/* Blue picks */}
                <div className="flex flex-1 flex-row min-w-0">
                    {blue.picks.map((p, i) => <PickCard key={i} pick={p} side="blue" />)}
                </div>

                {/* Center panel */}
                <div
                    className="relative flex flex-col items-center justify-center shrink-0 w-[280px] z-10 animate-fade-in-up"
                    style={{ background: centerPanelBg, borderLeft: '1px solid rgba(255,255,255,0.08)', borderRight: '1px solid rgba(255,255,255,0.08)' }}
                >
                    {/* top rainbow bar */}
                    <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: centerTopBar }} />

                    {/* match title */}
                    <div
                        className="text-center text-xl font-bold uppercase tracking-[3px] leading-[1.15] mb-3"
                        style={{ fontFamily: "'Oswald', sans-serif", color: '#ffd700', textShadow: '0 0 10px rgba(255,215,0,0.4)' }}
                    >
                        {matchTitle.split('\n').map((l, i) => <div key={i}>{l}</div>)}
                    </div>

                    {/* scores */}
                    <div className="flex items-center gap-3">
                        <img className="w-[52px] h-[52px] object-contain drop-shadow-lg" src={getTeamLogoUrl(blue.shortName, 'C')} alt={blue.shortName} />
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-[40px] text-[#64b5f6] min-w-[30px] text-center"
                                style={{ fontFamily: "'Oswald', sans-serif", textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                                {blue.score}
                            </span>
                            <div className="flex flex-col items-center gap-0.5">
                                <span className="text-[11px] text-white/50">▶</span>
                                <span
                                    className="text-[13px] font-medium tracking-[2px] uppercase text-white/50 bg-white/5 px-2 py-0.5 rounded"
                                    style={{ fontFamily: "'Oswald', sans-serif" }}
                                >
                                    BO{bestOf}
                                </span>
                            </div>
                            <span className="font-bold text-[40px] text-[#ef5350] min-w-[30px] text-center"
                                style={{ fontFamily: "'Oswald', sans-serif", textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                                {red.score}
                            </span>
                        </div>
                        <img className="w-[52px] h-[52px] object-contain drop-shadow-lg" src={getTeamLogoUrl(red.shortName, 'C')} alt={red.shortName} />
                    </div>
                </div>

                {/* Red picks */}
                <div className="flex flex-1 flex-row-reverse min-w-0">
                    {red.picks.map((p, i) => <PickCard key={i} pick={p} side="red" />)}
                </div>
            </div>
        </div>
    );
}

