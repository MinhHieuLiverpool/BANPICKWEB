import { getChampImageUrl, getTeamLogoUrl, getLaneIconUrl, CHAMPIONS } from '../data/champions';
import type { ChampionData } from '../data/champions';
import { useState, useEffect } from 'react';
import {
    type PickData, type BanData, type TeamState as TeamData,
    type DraftAction as Action, type TeamShort,
    DRAFT_SEQUENCE as sequence, getPhaseName,
    TEAMS, emptyTeam, MATCH_TITLE, BEST_OF,
    type SharedDraftState, createChannel, saveState,
} from '../store/draftStore';

// Phase boundaries for display
// (getPhaseName imported from draftStore)

// Slot index → AoV lane mapping
// (SLOT_LANES imported from draftStore)

// Available teams (must match LOGOTEAM file names)
// (TEAMS, TeamShort, emptyTeam imported from draftStore)

const matchTitle = MATCH_TITLE;
const bestOf = BEST_OF;

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

// ====== SETUP SCREEN ======
function SetupScreen({ onStart, transparent }: { onStart: (blue: string, red: string) => void; transparent?: boolean }) {
    const [blueTeam, setBlueTeam] = useState<TeamShort>('GAM');
    const [redTeam, setRedTeam]   = useState<TeamShort>('SGP');

    return (
        <div className={`w-screen h-screen flex flex-col items-center justify-center gap-10 ${transparent ? 'bg-transparent' : 'bg-[rgba(5,5,15,0.98)]'}`}>
            <div
                className="text-4xl font-bold uppercase tracking-[6px] text-white"
                style={{ fontFamily: "'Oswald', sans-serif", textShadow: '0 0 20px rgba(156,39,176,0.8)' }}
            >CHAMPION DRAFT</div>

            <div className="flex items-start gap-16">
                {/* Blue team */}
                <div className="flex flex-col items-center gap-4">
                    <span className="text-[#64b5f6] font-bold tracking-widest uppercase text-sm" style={{ fontFamily: "'Oswald', sans-serif" }}>🔵 BLUE TEAM</span>
                    <div className="grid grid-cols-4 gap-2">
                        {TEAMS.map(t => (
                            <button key={t} onClick={() => setBlueTeam(t)}
                                className={`flex flex-col items-center gap-1 p-2 rounded border-2 transition-all duration-150 ${
                                    blueTeam === t
                                        ? 'border-[#64b5f6] bg-[#1a73e8]/20 scale-105 shadow-[0_0_12px_rgba(100,181,246,0.5)]'
                                        : 'border-white/10 bg-white/5 hover:border-white/30'
                                }`}
                            >
                                <img src={getTeamLogoUrl(t, 'C')} alt={t} className="w-12 h-12 object-contain" />
                                <span className="text-[11px] font-semibold text-white/80" style={{ fontFamily: "'Oswald', sans-serif" }}>{t}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* VS divider */}
                <div className="flex flex-col items-center gap-2 pt-8">
                    <div className="text-5xl font-bold text-white/20" style={{ fontFamily: "'Oswald', sans-serif" }}>VS</div>
                </div>

                {/* Red team */}
                <div className="flex flex-col items-center gap-4">
                    <span className="text-[#ef5350] font-bold tracking-widest uppercase text-sm" style={{ fontFamily: "'Oswald', sans-serif" }}>🔴 RED TEAM</span>
                    <div className="grid grid-cols-4 gap-2">
                        {TEAMS.map(t => (
                            <button key={t} onClick={() => setRedTeam(t)}
                                className={`flex flex-col items-center gap-1 p-2 rounded border-2 transition-all duration-150 ${
                                    redTeam === t
                                        ? 'border-[#ef5350] bg-[#e53935]/20 scale-105 shadow-[0_0_12px_rgba(239,83,80,0.5)]'
                                        : 'border-white/10 bg-white/5 hover:border-white/30'
                                }`}
                            >
                                <img src={getTeamLogoUrl(t, 'C')} alt={t} className="w-12 h-12 object-contain" />
                                <span className="text-[11px] font-semibold text-white/80" style={{ fontFamily: "'Oswald', sans-serif" }}>{t}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Preview row */}
            <div className="flex items-center gap-8">
                <div className="flex flex-col items-center gap-2">
                    <img src={getTeamLogoUrl(blueTeam, 'C')} alt={blueTeam} className="w-20 h-20 object-contain drop-shadow-lg" />
                    <span className="text-[#64b5f6] font-bold text-xl tracking-widest" style={{ fontFamily: "'Oswald', sans-serif" }}>{blueTeam}</span>
                </div>
                <button
                    onClick={() => onStart(blueTeam, redTeam)}
                    disabled={blueTeam === redTeam}
                    className={`px-12 py-3 rounded font-bold uppercase tracking-widest text-lg transition-all duration-200 ${
                        blueTeam === redTeam
                            ? 'bg-white/10 text-white/30 cursor-not-allowed'
                            : 'bg-gradient-to-r from-[#1a73e8] via-[#9c27b0] to-[#e53935] text-white shadow-[0_0_24px_rgba(156,39,176,0.6)] hover:shadow-[0_0_36px_rgba(156,39,176,0.9)] hover:scale-105'
                    }`}
                    style={{ fontFamily: "'Oswald', sans-serif" }}
                >
                    {blueTeam === redTeam ? 'CHỌN 2 ĐỘI KHÁC NHAU' : '▶ BẮT ĐẦU DRAFT'}
                </button>
                <div className="flex flex-col items-center gap-2">
                    <img src={getTeamLogoUrl(redTeam, 'C')} alt={redTeam} className="w-20 h-20 object-contain drop-shadow-lg" />
                    <span className="text-[#ef5350] font-bold text-xl tracking-widest" style={{ fontFamily: "'Oswald', sans-serif" }}>{redTeam}</span>
                </div>
            </div>
        </div>
    );
}


function BanCard({ ban, filled, previewChamp }: { ban: BanData; filled: boolean; previewChamp?: ChampionData | null }) {
    return (
        <div
            className={[
                'relative w-[58px] h-[58px] shrink-0 overflow-hidden transition-colors duration-300',
                filled
                    ? 'bg-[rgba(10,10,20,0.7)]'
                    : previewChamp
                        ? 'bg-[rgba(10,10,20,0.7)] shadow-[0_0_10px_rgba(234,179,8,0.6)]'
                        : 'bg-[rgba(10,10,20,0.7)]',
            ].join(' ')}
        >
            {/* Preview state: champion not yet locked */}
            {!filled && previewChamp && (
                <>
                    <img
                        className="w-full h-full object-cover opacity-60"
                        src={getChampImageUrl(previewChamp, 'ban')}
                        alt={previewChamp.displayName}
                    />
                    <div className="absolute inset-0 animate-pulse pointer-events-none z-[1] ring-2 ring-yellow-400 ring-inset" />
                </>
            )}
            {/* Locked state — zoom-fade-ban animation keyed on fileName */}
            {ban.championFileName && (
                <>
                    <img
                        key={ban.championFileName}
                        className="w-full h-full object-cover animate-zoom-fade-ban"
                        src={getChampImageUrl(ban.championFileName, 'ban_gray')}
                        alt={ban.championFileName}
                    />
                    {/* white flash + glow ring */}
                    <div className="absolute inset-0 pointer-events-none z-[3] animate-champ-flash bg-white" />
                    <div className="absolute inset-0 pointer-events-none z-[3] animate-champ-glow rounded" style={{ boxShadow: 'inset 0 0 0 3px rgba(229,57,53,0.95), 0 0 24px 8px rgba(229,57,53,0.7)' }} />
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
            {/* ban.png frame overlay */}
            <img
                src="/assets/layout/ban.png"
                alt=""
                className="absolute inset-0 w-full h-full object-cover pointer-events-none z-[5]"
                draggable={false}
            />
        </div>
    );
}

// ====== PICK CARD ======
function PickCard({ pick, side, previewChamp }: { pick: PickData; side: 'blue' | 'red'; previewChamp?: ChampionData | null }) {
    const isBlue = side === 'blue';
    const borderBottom = isBlue ? '3px solid #1a73e8' : '3px solid #e53935';
    const playerBarBg = isBlue ? bluePlayerBar : redPlayerBar;
    const blurImg = isBlue ? '/assets/layout/blur/orangeblur.png' : '/assets/layout/blur/redblur.png';

    const displayChamp: ChampionData | null = pick.championFileName
        ? (CHAMPIONS.find(c => c.fileName === pick.championFileName) ?? null)
        : (previewChamp ?? null);
    const isPreview = !pick.championFileName && !!previewChamp;

    return (
        <div
            className={`relative w-[174px] shrink-0 overflow-hidden`}
            style={{
                borderBottom: isPreview ? '3px solid #eab308' : borderBottom,
                boxShadow: isPreview ? 'inset 0 0 20px rgba(234,179,8,0.25)' : undefined,
            }}
        >
            {/* PICK.png — slot background */}
            <img
                src="/assets/layout/PICK.png"
                alt=""
                className="absolute inset-0 w-full h-full object-cover pointer-events-none z-[0]"
                draggable={false}
            />
            {/* blur color at bottom */}
            <img
                src={blurImg}
                alt=""
                className="absolute bottom-0 left-0 right-0 w-full h-2/3 object-cover object-bottom pointer-events-none z-[1]"
                draggable={false}
            />

            {displayChamp ? (
                <>
                    <img
                        key={pick.championFileName ?? ('preview-' + displayChamp.fileName)}
                        className={`absolute inset-0 w-full h-full object-cover block z-[2] ${
                            isPreview ? 'opacity-60' : 'animate-zoom-fade-lock'
                        }`}
                        style={{ objectPosition: 'center 20%' }}
                        src={getChampImageUrl(displayChamp, 'pick')}
                        alt={displayChamp.displayName}
                    />
                    {isPreview && (
                        <div className="absolute inset-0 animate-pulse pointer-events-none z-[2] ring-2 ring-yellow-400 ring-inset" />
                    )}
                    {!isPreview && (
                        <>
                            <div className="absolute inset-0 pointer-events-none z-[4] animate-champ-flash bg-white" />
                            <div className="absolute inset-0 pointer-events-none z-[4] animate-champ-glow" style={{ boxShadow: 'inset 0 0 0 3px rgba(255,220,0,0.95), 0 0 40px 12px rgba(255,200,0,0.5)' }} />
                        </>
                    )}
                </>
            ) : null}

            {/* lane icon */}
            <img
                className="absolute top-[6px] w-5 h-5 opacity-80 z-[3]"
                style={{
                    [isBlue ? 'left' : 'right']: '6px',
                    filter: 'brightness(0) invert(1) drop-shadow(0 1px 4px rgba(0,0,0,0.8))',
                }}
                src={getLaneIconUrl(pick.lane)}
                alt={pick.lane}
            />

            {/* player name bar */}
            <div
                className="absolute bottom-0 left-0 right-0 py-2 px-1.5 text-center text-white uppercase tracking-[2px] z-[3]"
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
export default function BanPickOverlay({ transparent = false }: { transparent?: boolean }) {
    const [screen, setScreen] = useState<'setup' | 'draft'>('setup');
    const [blue, setBlue] = useState<TeamData>(emptyTeam('GAM'));
    const [red, setRed]   = useState<TeamData>(emptyTeam('SGP'));
    const [pool, setPool] = useState(CHAMPIONS);
    const [actionIndex, setActionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [selectedChamp, setSelectedChamp] = useState<ChampionData | null>(null);

    // For OBS overlay mode: make the page background transparent
    useEffect(() => {
        if (transparent) {
            document.body.style.background = 'transparent';
            document.documentElement.style.background = 'transparent';
        }
        return () => {
            document.body.style.background = '';
            document.documentElement.style.background = '';
        };
    }, [transparent]);

    const currentAction = sequence[actionIndex] as Action | undefined;

    // All hooks must be declared before any conditional return
    useEffect(() => {
        if (screen !== 'draft') return;
        setTimeLeft(60);
        setSelectedChamp(null);
        const id = setInterval(() => {
            setTimeLeft((t) => {
                if (t <= 1) {
                    if (actionIndex < sequence.length - 1) {
                        setActionIndex((i) => i + 1);
                        setSelectedChamp(null);
                    }
                    return 60;
                }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(id);
    }, [actionIndex, screen]);

    // Broadcast state to overlay window whenever anything changes
    useEffect(() => {
        const state: SharedDraftState = {
            screen,
            blue,
            red,
            actionIndex,
            timeLeft,
            selectedChamp: selectedChamp?.fileName ?? null,
        };
        saveState(state);
        const ch = createChannel();
        ch.postMessage(state);
        ch.close();
    }, [screen, blue, red, actionIndex, timeLeft, selectedChamp]);

    if (screen === 'setup') {
        return (
            <SetupScreen transparent={transparent} onStart={(b, r) => {
                setBlue(emptyTeam(b));
                setRed(emptyTeam(r));
                setPool(CHAMPIONS);
                setActionIndex(0);
                setTimeLeft(60);
                setSelectedChamp(null);
                setScreen('draft');
            }} />
        );
    }

    function commitSelection(champ: ChampionData) {
        if (!currentAction) return;
        const { team, phase, slot } = currentAction;
        const setter = team === 'blue' ? setBlue : setRed;
        setter((prev) => {
            const next = { ...prev };
            const arr = phase === 'ban' ? [...next.bans] : [...next.picks];
            arr[slot] = { ...arr[slot], championFileName: champ.fileName };
            return phase === 'ban' ? { ...next, bans: arr } : { ...next, picks: arr as PickData[] };
        });
        setPool((p) => p.filter((c) => c.fileName !== champ.fileName));
        setSelectedChamp(null);
        if (actionIndex < sequence.length - 1) setActionIndex((i) => i + 1);
    }

    function handleChampionSelect(champ: ChampionData) {
        if (!currentAction) return;
        // First click always previews; second click on same champ locks it
        if (selectedChamp?.fileName === champ.fileName) {
            commitSelection(champ);
        } else {
            setSelectedChamp(champ);
        }
    }

    function handleLock() {
        if (!selectedChamp || !currentAction) return;
        commitSelection(selectedChamp);
    }

    const done = !currentAction;
    const phaseName = actionIndex < sequence.length ? getPhaseName(actionIndex) : 'Completed';
    const teamTag = currentAction
        ? (currentAction.team === 'blue' ? `🔵 ${blue.shortName}` : `🔴 ${red.shortName}`)
        : '';
    const phaseLabel = done
        ? '✅ Draft Complete'
        : `${teamTag}  ·  ${phaseName}  ·  ${currentAction!.label}`;

    // timer progress bar width %
    const timerPct = (timeLeft / 60) * 100;
    const timerColor = timeLeft > 20 ? '#22c55e' : timeLeft > 10 ? '#f59e0b' : '#ef4444';

    return (
        <div className={`relative w-screen h-screen overflow-hidden ${transparent ? 'bg-transparent' : 'bg-[rgba(10,10,20,0.97)]'}`}>

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
                {/* LOCK button — visible whenever a champion is selected (ban or pick) */}
                {currentAction && (
                    <button
                        onClick={handleLock}
                        disabled={!selectedChamp}
                        className={[
                            'mt-2 px-8 py-1.5 rounded font-bold uppercase tracking-widest text-sm transition-all duration-200',
                            selectedChamp
                                ? 'bg-yellow-500 hover:bg-yellow-400 text-black shadow-[0_0_16px_rgba(234,179,8,0.7)] cursor-pointer'
                                : 'bg-white/10 text-white/30 cursor-not-allowed',
                        ].join(' ')}
                        style={{ fontFamily: "'Oswald', sans-serif" }}
                    >
                        {selectedChamp ? `🔒 LOCK IN — ${selectedChamp.displayName}` : '🔒 SELECT A CHAMPION'}
                    </button>
                )}
            </div>

            {/* ── CHAMPION POOL ── */}
            <div
                className="absolute left-0 right-0 overflow-y-auto"
                style={{ top: '165px', bottom: '330px', background: transparent ? 'rgba(5,5,15,0.75)' : '#0a0a14' }}
            >
                {!done && (
                    <div className="grid gap-1 p-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))' }}>
                        {pool.map((champ) => {
                            const isSelected = selectedChamp?.fileName === champ.fileName;
                            return (
                                <button
                                    key={champ.fileName}
                                    onClick={() => handleChampionSelect(champ)}
                                    className={[
                                        'group flex flex-col items-center text-white/80 hover:text-white rounded p-1 transition-all duration-150 cursor-pointer',
                                        isSelected
                                            ? 'bg-yellow-500/20 ring-2 ring-yellow-400 scale-105'
                                            : 'hover:bg-white/10',
                                    ].join(' ')}
                                >
                                    <img
                                        className="w-14 h-14 object-cover rounded group-hover:scale-105 transition-transform duration-150"
                                        src={getChampImageUrl(champ, 'ban')}
                                        alt={champ.displayName}
                                    />
                                    <span className={`text-[10px] mt-0.5 leading-tight text-center truncate w-full ${isSelected ? 'text-yellow-300 font-semibold' : ''}`}>{champ.displayName}</span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ── BAN SECTION ── */}
            <div className="absolute left-0 right-0 flex items-center z-[6]" style={{ bottom: '252px', height: '72px' }}>
                {/* blue bans (left) */}
                <div className="absolute left-4 flex items-center gap-[5px]">
                    {blue.bans.map((b, i) => (
                        <BanCard
                            key={i} ban={b} filled={!!b.championFileName}
                            previewChamp={currentAction?.team === 'blue' && currentAction?.phase === 'ban' && currentAction?.slot === i ? selectedChamp : null}
                        />
                    ))}
                </div>
                {/* red bans (right, reversed) */}
                <div className="absolute right-4 flex flex-row-reverse items-center gap-[5px]">
                    {red.bans.map((b, i) => (
                        <BanCard
                            key={i} ban={b} filled={!!b.championFileName}
                            previewChamp={currentAction?.team === 'red' && currentAction?.phase === 'ban' && currentAction?.slot === i ? selectedChamp : null}
                        />
                    ))}
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
                <div className="flex flex-row shrink-0">
                    {blue.picks.map((p, i) => (
                        <PickCard
                            key={i} pick={p} side="blue"
                            previewChamp={currentAction?.team === 'blue' && currentAction?.phase === 'pick' && currentAction?.slot === i ? selectedChamp : null}
                        />
                    ))}
                </div>

                {/* Center panel */}
                <div
                    className="relative flex flex-col items-center justify-center flex-1 z-10 animate-fade-in-up"
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
                <div className="flex flex-row-reverse shrink-0">
                    {red.picks.map((p, i) => (
                        <PickCard
                            key={i} pick={p} side="red"
                            previewChamp={currentAction?.team === 'red' && currentAction?.phase === 'pick' && currentAction?.slot === i ? selectedChamp : null}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

