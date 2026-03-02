import { useEffect, useState, useRef } from 'react';
import { getChampImageUrl, getTeamLogoUrl, getLaneIconUrl, CHAMPIONS } from '../data/champions';
import type { ChampionData } from '../data/champions';
import {
    type SharedDraftState, type TeamState, type PickData, type BanData,
    createChannel, loadState, saveState,
    DRAFT_SEQUENCE, emptyTeam, MATCH_TITLE, BEST_OF,
} from '../store/draftStore';

// ── gradient helpers ───────────────────────────────────────────────────────
const accentLineStyle = {
    background: '#ffffff',
} as const;
const centerPanelBg = 'rgba(5,5,15,0.92)';

// ── BanCard ────────────────────────────────────────────────────────────────
function BanCard({ ban, side, isActive, previewFileName }: {
    ban: BanData;
    side: 'blue' | 'red';
    isActive: boolean;
    previewFileName?: string | null;
}) {
    const preview = previewFileName
        ? CHAMPIONS.find(c => c.fileName === previewFileName) ?? null
        : null;
    const banBlurImg = side === 'blue' ? '/assets/layout/ban blur/orange.png' : '/assets/layout/ban blur/red.png';

    return (
        <div className={[
            'relative w-[75px] h-[75px] shrink-0 overflow-hidden',
            isActive && preview ? 'shadow-[0_0_10px_rgba(234,179,8,0.6)]' : '',
        ].join(' ')}>
            {/* Layer 0: ô ban — ban.png frame background */}
            <img
                src="/assets/layout/ban.png"
                alt=""
                className="absolute inset-0 w-full h-full object-cover pointer-events-none z-[0]"
                draggable={false}
            />
            {/* Layer 1: champban (preview) hoặc champban_gray (locked) */}
            {!ban.championFileName && preview && (
                <img className="absolute inset-0 w-full h-full object-cover z-[1]"
                    src={getChampImageUrl(preview, 'ban')} alt="" />
            )}
            {ban.championFileName && (() => {
                const cd = CHAMPIONS.find(c => c.fileName === ban.championFileName);
                return (<>
                    <img key={ban.championFileName}
                        className="absolute inset-0 w-full h-full object-cover z-[1]"
                        src={cd ? getChampImageUrl(cd, 'ban_gray') : getChampImageUrl(ban.championFileName, 'ban_gray')}
                        alt="" />
                    {/* X mark — two thin white diagonal lines */}
                    <div className="absolute inset-0 pointer-events-none z-[3]">
                        <div className="absolute top-0 left-0 w-full h-full" style={{ transform: 'rotate(45deg)' }}>
                            <div className="absolute top-1/2 left-0 w-[141%] h-[1px] bg-white/70" style={{ marginLeft: '-20%', marginTop: '-0.5px' }} />
                        </div>
                        <div className="absolute top-0 left-0 w-full h-full" style={{ transform: 'rotate(-45deg)' }}>
                            <div className="absolute top-1/2 left-0 w-[141%] h-[1px] bg-white/70" style={{ marginLeft: '-20%', marginTop: '-0.5px' }} />
                        </div>
                    </div>
                </>);
            })()}
            {/* Layer 2: blur — only show when slot is empty (no preview, no locked) */}
            {!ban.championFileName && !preview && (
                <img
                    src={banBlurImg}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none z-[2] opacity-50"
                    draggable={false}
                />
            )}
        </div>
    );
}

// ── PickCard ───────────────────────────────────────────────────────────────
function PickCard({ pick, side, isActive, previewFileName }: {
    pick: PickData;
    side: 'blue' | 'red';
    isActive: boolean;
    previewFileName?: string | null;
}) {
    const isBlue = side === 'blue';
    const blurImg = isBlue ? '/assets/layout/blur/orangeblur.png' : '/assets/layout/blur/redblur.png';

    const lockedChamp: ChampionData | null = pick.championFileName
        ? (CHAMPIONS.find(c => c.fileName === pick.championFileName) ?? null)
        : null;

    const previewChamp: ChampionData | null = (!lockedChamp && isActive && previewFileName)
        ? (CHAMPIONS.find(c => c.fileName === previewFileName) ?? null)
        : null;

    const displayChamp = lockedChamp ?? previewChamp;
    const isPreview = !!previewChamp && !lockedChamp;

    return (
        <div className="relative w-[170px] h-[236px] shrink-0 overflow-hidden"
            style={{
                borderRight: '1px solid rgba(255,255,255,0.15)',
                borderBottom: isPreview ? '3px solid #eab308' : '2px solid rgba(255,255,255,0.18)',
                boxShadow: isPreview ? 'inset 0 0 20px rgba(234,179,8,0.25)' : undefined,
            }}>
            {/* z-0: nền — PICK.png slot background */}
            <img
                src="/assets/layout/PICK.png"
                alt=""
                className="absolute inset-0 w-full h-full object-cover pointer-events-none z-[0]"
                draggable={false}
            />
            {/* z-1: ảnh — champion image */}
            {displayChamp && (<>
                <img
                    key={pick.championFileName ?? ('pre-' + displayChamp.fileName)}
                    className={`w-full h-full object-cover block absolute inset-0 z-[1] ${isPreview ? 'opacity-60' : 'animate-zoom-fade-lock'}`}
                    style={{ objectPosition: 'center 20%' }}
                    src={getChampImageUrl(displayChamp, 'pick')}
                    alt={displayChamp.displayName}
                />
                {isPreview && (
                    <div className="absolute inset-0 animate-pulse pointer-events-none z-[3] ring-2 ring-yellow-400 ring-inset" />
                )}
                {!isPreview && (<>
                    <div className="absolute inset-0 pointer-events-none z-[4] animate-champ-flash bg-white" />
                    <div className="absolute inset-0 pointer-events-none z-[4] animate-champ-glow"
                        style={{ boxShadow: 'inset 0 0 0 3px rgba(255,220,0,0.95), 0 0 40px 12px rgba(255,200,0,0.5)' }} />
                </>)}
            </>)}
            {/* z-2: blur — color blur on top of champion */}
            <img
                src={blurImg}
                alt=""
                className="absolute bottom-0 left-0 right-0 w-full h-2/3 object-cover object-bottom pointer-events-none z-[2]"
                draggable={false}
            />

            {/* Player name — at bottom, on blur layer */}
            <div className="absolute bottom-0 left-0 right-0 py-2 px-1 text-center text-white uppercase tracking-[2px] z-[5]"
                style={{ fontFamily: "'946 Latin Wide', sans-serif", fontSize: '14px', fontWeight: 400, textShadow: '0 2px 6px rgba(0,0,0,0.9)' }}>
                {pick.playerName}
            </div>

            {/* Lane icon — only when no champion locked */}
            {!lockedChamp && (
                <img className="absolute top-[8px] w-10 h-10 opacity-80 z-[3]"
                    style={{
                        [isBlue ? 'left' : 'right']: '8px',
                        filter: 'brightness(0) invert(1) drop-shadow(0 1px 4px rgba(0,0,0,0.8))',
                    }}
                    src={getLaneIconUrl(pick.lane)} alt={pick.lane} />
            )}

        </div>
    );
}

// ── Main overlay ───────────────────────────────────────────────────────────
export default function OverlayPage() {
    const defaultState: SharedDraftState = {
        screen: 'setup',
        blue: emptyTeam('GAM'),
        red: emptyTeam('SGP'),
        actionIndex: 0,
        timeLeft: 60,
        selectedChamp: null,
    };

    const [state, setState] = useState<SharedDraftState>(() => loadState() ?? defaultState);
    const [scale, setScale] = useState(1);
    const prevTimeLeftRef = useRef(state.timeLeft);
    const isTimerReset = state.timeLeft > prevTimeLeftRef.current;
    prevTimeLeftRef.current = state.timeLeft;

    // Scale 1920x1080 to fit viewport width exactly
    useEffect(() => {
        function updateScale() {
            setScale(window.innerWidth / 1920);
        }
        updateScale();
        window.addEventListener('resize', updateScale);
        return () => window.removeEventListener('resize', updateScale);
    }, []);

    // Transparent body for OBS
    useEffect(() => {
        document.body.style.background = 'transparent';
        document.documentElement.style.background = 'transparent';
        return () => {
            document.body.style.background = '';
            document.documentElement.style.background = '';
        };
    }, []);

    // Listen for live updates from control tab
    useEffect(() => {
        const ch = createChannel();
        ch.onmessage = (e: MessageEvent<SharedDraftState>) => {
            setState(e.data);
            saveState(e.data);
        };
        return () => ch.close();
    }, []);

    const { blue, red, actionIndex, selectedChamp } = state;
    const currentAction = state.screen === 'draft'
        ? DRAFT_SEQUENCE[actionIndex] as typeof DRAFT_SEQUENCE[number] | undefined
        : undefined;

    return (
        <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: 'transparent', position: 'relative' }}>
            <div style={{ width: 1920, height: 1080, transform: `scale(${scale})`, transformOrigin: 'bottom left', position: 'absolute', bottom: 0, left: 0, overflow: 'hidden' }}>

                {state.screen === 'setup' ? (
                    /* ── WAITING SCREEN ── */
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-white/30 text-2xl tracking-widest uppercase"
                            style={{ fontFamily: "'Oswald', sans-serif" }}>
                            Waiting for draft to start…
                        </div>
                    </div>
                ) : (
                    <>
                        {/* ── BAN SECTION ── */}
                        <div className="absolute left-0 right-0 flex items-center z-[6]" style={{ bottom: '260px', height: '72px' }}>
                            <div className="absolute left-4 flex items-center gap-[5px]">
                                {(blue as TeamState).bans.map((b, i) => (
                                    <BanCard key={i} ban={b} side="blue"
                                        isActive={currentAction?.team === 'blue' && currentAction?.phase === 'ban' && currentAction?.slot === i}
                                        previewFileName={currentAction?.team === 'blue' && currentAction?.phase === 'ban' && currentAction?.slot === i ? selectedChamp : null}
                                    />
                                ))}
                            </div>
                            <div className="absolute right-4 flex flex-row-reverse items-center gap-[5px]">
                                {(red as TeamState).bans.map((b, i) => (
                                    <BanCard key={i} ban={b} side="red"
                                        isActive={currentAction?.team === 'red' && currentAction?.phase === 'ban' && currentAction?.slot === i}
                                        previewFileName={currentAction?.team === 'red' && currentAction?.phase === 'ban' && currentAction?.slot === i ? selectedChamp : null}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* ── ACCENT BAR (white) + TIMER (yellow from center) ── */}
                        <div className="absolute left-0 right-0 h-[10px] z-[5]" style={{ bottom: '236px', ...accentLineStyle }}>
                            {/* Timer bar — smooth countdown, instant reset */}
                            <div className="absolute top-0 h-full" style={{
                                left: '50%',
                                width: `${state.timeLeft <= 1 ? 100 : ((60 - state.timeLeft) / 60) * 100}%`,
                                transform: 'translateX(-50%)',
                                background: '#ffd700',
                                transition: isTimerReset ? 'none' : 'width 1.1s linear',
                            }} />
                        </div>

                        {/* ── BOTTOM BAR ── */}
                        <div className="absolute bottom-0 left-0 right-0 flex z-[4]" style={{ height: '236px' }}>

                            {/* Blue picks */}
                            <div className="flex flex-row shrink-0">
                                {(blue as TeamState).picks.map((p, i) => (
                                    <PickCard key={i} pick={p} side="blue"
                                        isActive={currentAction?.team === 'blue' && currentAction?.phase === 'pick' && currentAction?.slot === i}
                                        previewFileName={currentAction?.team === 'blue' && currentAction?.phase === 'pick' && currentAction?.slot === i ? selectedChamp : null}
                                    />
                                ))}
                            </div>

                            {/* Center panel */}
                            <div className="relative flex flex-col items-center justify-center flex-1 z-10 px-2"
                                style={{ background: centerPanelBg, borderLeft: '1px solid rgba(255,255,255,0.08)', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
                                {/* Match title */}
                                <div className="text-center text-[14px] font-bold uppercase tracking-[2px] leading-[1.2] mb-2"
                                    style={{ fontFamily: "'Oswald', sans-serif", color: '#ffd700', textShadow: '0 0 10px rgba(255,215,0,0.4)' }}>
                                    {MATCH_TITLE.split('\n').map((l, i) => <div key={i}>{l}</div>)}
                                </div>
                                {/* Team logos + scores */}
                                <div className="flex items-center gap-1.5 w-full justify-center">
                                    <img className="w-[44px] h-[44px] object-contain drop-shadow-lg shrink-0"
                                        src={getTeamLogoUrl(blue.shortName, 'C')} alt={blue.shortName} />
                                    <span className="font-bold text-[36px] text-[#64b5f6] min-w-[24px] text-center"
                                        style={{ fontFamily: "'Oswald', sans-serif" }}>{blue.score}</span>
                                    <span className="text-[11px] font-medium tracking-[1px] uppercase text-white/50 bg-white/5 px-1.5 py-0.5 rounded"
                                        style={{ fontFamily: "'Oswald', sans-serif" }}>
                                        BO{BEST_OF}
                                    </span>
                                    <span className="font-bold text-[36px] text-[#ef5350] min-w-[24px] text-center"
                                        style={{ fontFamily: "'Oswald', sans-serif" }}>{red.score}</span>
                                    <img className="w-[44px] h-[44px] object-contain drop-shadow-lg shrink-0"
                                        src={getTeamLogoUrl(red.shortName, 'C')} alt={red.shortName} />
                                </div>
                            </div>

                            {/* Red picks */}
                            <div className="flex flex-row-reverse shrink-0">
                                {(red as TeamState).picks.map((p, i) => (
                                    <PickCard key={i} pick={p} side="red"
                                        isActive={currentAction?.team === 'red' && currentAction?.phase === 'pick' && currentAction?.slot === i}
                                        previewFileName={currentAction?.team === 'red' && currentAction?.phase === 'pick' && currentAction?.slot === i ? selectedChamp : null}
                                    />
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
