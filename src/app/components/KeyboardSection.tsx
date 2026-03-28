import { motion, AnimatePresence } from 'motion/react';
import { useRef, useCallback, useEffect, useState, useMemo } from 'react';
import logoImage from '@/assets/2090cd551224404a5a02329a4590597a32d19a1f.png';
import { isSoundAllowed } from './SoundContext';
import { adaptiveVolume } from './adaptiveVolume';

// ---- Audio file sound effects ----
const _clickAudio = new Audio('/sounds/keyboard-click.mp3');
_clickAudio.volume = 0.15;

const _popAudios: HTMLAudioElement[] = [];
const POP_POOL_SIZE = 6; // pool of clones so overlapping pops work
for (let i = 0; i < POP_POOL_SIZE; i++) {
  const a = new Audio('/sounds/key-pop.mp3');
  a.volume = 0.06;
  _popAudios.push(a);
}
let _popIndex = 0;

function playClickSound() {
  if (!isSoundAllowed()) return;
  _clickAudio.currentTime = 0;
  _clickAudio.play().catch(() => {});
}

let _lastTickTime = 0;
function playTickSound() {
  if (!isSoundAllowed()) return;
  const now = performance.now();
  if (now - _lastTickTime < 50) return; // throttle overlapping pops
  _lastTickTime = now;
  const audio = _popAudios[_popIndex % POP_POOL_SIZE];
  _popIndex++;
  audio.volume = adaptiveVolume(0.06);
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

// Competitor/tool icons — bright glowing bg colors + original-color logos
const TOOL_KEYS: Record<string, { name: string; bg: string; glow: string; icon: string }> = {
  // Row 1 — cols 2, 5, 8, 11
  '1-2':  { name: 'zoho',      bg: '#E8333C', glow: 'rgba(232,51,60,0.5)',  icon: 'https://cdn-icons-png.flaticon.com/512/882/882704.png' },
  '1-5':  { name: 'jira',      bg: '#2684FF', glow: 'rgba(38,132,255,0.5)', icon: 'https://cdn-icons-png.flaticon.com/512/5968/5968875.png' },
  '1-8':  { name: 'trello',    bg: '#0079BF', glow: 'rgba(0,121,191,0.5)',  icon: 'https://cdn-icons-png.flaticon.com/512/6124/6124995.png' },
  '1-11': { name: 'slack',     bg: '#4A154B', glow: 'rgba(74,21,75,0.5)',   icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111615.png' },
  // Row 2 — cols 1, 4, 9, 12
  '2-1':  { name: 'asana',     bg: '#F06A6A', glow: 'rgba(240,106,106,0.5)', icon: 'https://cdn-icons-png.flaticon.com/512/15466/15466163.png' },
  '2-4':  { name: 'notion',    bg: '#2B2B2B', glow: 'rgba(120,120,120,0.4)', icon: 'https://cdn-icons-png.flaticon.com/512/15099/15099809.png' },
  '2-9':  { name: 'monday',    bg: '#FF3D57', glow: 'rgba(255,61,87,0.5)',  icon: 'https://cdn-icons-png.flaticon.com/512/15466/15466230.png' },
  '2-12': { name: 'teams',     bg: '#6264A7', glow: 'rgba(98,100,167,0.5)', icon: 'https://cdn-icons-png.flaticon.com/512/906/906349.png' },
  // Row 3 — cols 3, 8, 11
  '3-3':  { name: 'clickup',   bg: '#7B68EE', glow: 'rgba(123,104,238,0.5)', icon: 'https://cdn-icons-png.flaticon.com/512/15466/15466107.png' },
  '3-8':  { name: 'basecamp',  bg: '#1D9464', glow: 'rgba(29,148,100,0.5)', icon: 'https://cdn-icons-png.flaticon.com/512/5968/5968804.png' },
  '3-11': { name: 'linear',    bg: '#5E6AD2', glow: 'rgba(94,106,210,0.5)', icon: 'https://cdn-icons-png.flaticon.com/512/15466/15466189.png' },
  // Row 4 — cols 1, 5, 10
  '4-1':  { name: 'todoist',   bg: '#E44332', glow: 'rgba(228,67,50,0.5)',  icon: 'https://cdn-icons-png.flaticon.com/512/15466/15466293.png' },
  '4-5':  { name: 'airtable',  bg: '#18BFFF', glow: 'rgba(24,191,255,0.5)', icon: 'https://cdn-icons-png.flaticon.com/512/15466/15466056.png' },
  '4-10': { name: 'github',    bg: '#333333', glow: 'rgba(140,140,140,0.4)', icon: 'https://cdn-icons-png.flaticon.com/512/733/733553.png' },
};

const COMPARISON_COMPETITORS = [
  { name: 'Talio', icon: logoImage, isTalio: true },
  { name: 'Jira', icon: TOOL_KEYS['1-5'].icon, isTalio: false },
  { name: 'Asana', icon: TOOL_KEYS['2-1'].icon, isTalio: false },
  { name: 'Slack', icon: TOOL_KEYS['1-11'].icon, isTalio: false },
];

const COMPARISON_FEATURES = [
  { name: 'Unified workspace',     values: [true, false, false, false] },
  { name: 'AI-powered automation', values: [true, false, false, false] },
  { name: 'Built-in team chat',    values: [true, false, false, true] },
  { name: 'Project management',    values: [true, true, true, false] },
  { name: 'HR & Payroll',          values: [true, false, false, false] },
];

// Pre-computed fallen positions — keys push outward from center + fall down
const FALLEN_POSITIONS: Record<string, { x: number; y: number; rotate: number }> = {};
for (let row = 1; row <= 4; row++) {
  for (let col = 1; col <= 12; col++) {
    const key = `${row}-${col}`;
    const dx = col - 6.5; // distance from center column
    const dy = row - 2.5; // distance from center row
    const seed = row * 13 + col * 7;
    const jitterX = ((seed * 17) % 40) - 20;
    const jitterY = ((seed * 23) % 30) - 15;
    FALLEN_POSITIONS[key] = {
      x: Math.round(dx * 45 + jitterX),
      y: Math.round(100 + Math.abs(dy) * 35 + Math.abs(dx) * 12 + jitterY),
      rotate: ((seed * 31) % 40) - 20,
    };
  }
}

function Key({
  social,
  row,
  col,
  mousePos,
  gridRef,
  collapsed,
  inView,
}: {
  social?: { name: string; bg: string; glow: string; icon: string };
  row: number;
  col: number;
  mousePos: { x: number; y: number };
  gridRef: React.RefObject<HTMLDivElement | null>;
  collapsed: boolean;
  inView: boolean;
}) {
  const keyRef = useRef<HTMLDivElement>(null);
  const [glow, setGlow] = useState(0);
  const [angle, setAngle] = useState(0);

  // --- Smooth pop via direct DOM manipulation (no React re-renders) ---
  const targetPop = useRef(0);
  const currentPop = useRef(0);
  const rafId = useRef<number>(0);
  const wasPopping = useRef(false);

  const bgStyle = social
    ? { backgroundColor: social.bg }
    : {};

  const waveDelay = (row - 1) * 0.08 + (col - 1) * 0.04;
  const fallen = FALLEN_POSITIONS[`${row}-${col}`];

  // Compute pop values from currentPop and write directly to DOM
  const applyPop = useCallback(() => {
    const el = keyRef.current;
    if (!el || collapsed) return;
    // Skip pop effect for icon/social keys — keep them static
    if (social) return;
    const p = currentPop.current;
    const bZ = 8;
    const bS = 1;
    const z = bZ + p * 40;
    const s = bS + p * 0.12;
    const sd = Math.round(6 + p * 14);
    const sb = Math.round(12 + p * 20);
    el.style.transform = `translateZ(${z}px) scale(${s})`;
  }, [social, collapsed]);

  useEffect(() => {
    let running = true;
    const tick = () => {
      if (!running) return;
      const diff = targetPop.current - currentPop.current;
      if (Math.abs(diff) > 0.002) {
        currentPop.current += diff * 0.1;
        applyPop();
      } else if (currentPop.current !== targetPop.current) {
        currentPop.current = targetPop.current;
        applyPop();
      }
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);
    return () => { running = false; cancelAnimationFrame(rafId.current); };
  }, [applyPop]);

  useEffect(() => {
    if (collapsed) return;
    if (!keyRef.current || (mousePos.x === 0 && mousePos.y === 0)) {
      setGlow(0);
      targetPop.current = 0;
      return;
    }
    const rect = keyRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = mousePos.x - cx;
    const dy = mousePos.y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const maxGlowDist = 180;
    setGlow(Math.max(0, 1 - dist / maxGlowDist));
    setAngle(Math.atan2(dy, dx) * (180 / Math.PI));

    const maxPopDist = 200;
    const newPop = Math.max(0, 1 - dist / maxPopDist);
    targetPop.current = newPop;
    // Play tick when key crosses into pop zone
    const isPopping = newPop > 0.15;
    if (isPopping && !wasPopping.current && !social) {
      playTickSound();
    }
    wasPopping.current = isPopping;
  }, [mousePos, collapsed, social]);

  const showGlow = glow > 0.05 && !social;
  const glowBorder = showGlow
    ? `linear-gradient(${angle + 90}deg, rgba(127,179,167,${glow * 0.8}), rgba(147,130,220,${glow * 0.6}), rgba(127,179,167,${glow * 0.4}))`
    : undefined;

  const shadowDepth = Math.round(6 + currentPop.current * 14);
  const shadowBlur = Math.round(12 + currentPop.current * 20);

  // Idle icon float
  const isIdleIcon = social && currentPop.current < 0.05 && !collapsed;
  const collapseDelay = waveDelay * 0.5;

  // Entrance wave delay
  const entranceDelay = 0.5 + (row - 1) * 0.1 + (col - 1) * 0.04;

  // Whether entrance has completed
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    if (!inView || entered) return;
    const t = setTimeout(() => setEntered(true), (entranceDelay + 0.8) * 1000);
    return () => clearTimeout(t);
  }, [inView, entranceDelay, entered]);

  return (
    <motion.div
      ref={keyRef}
      initial={{ opacity: 0, y: 80, scale: 0.5 }}
      animate={
        !inView
          ? { opacity: 0, y: 80, scale: 0.5 }
          : collapsed
            ? {
                opacity: 0.7,
                x: fallen.x,
                y: fallen.y,
                rotate: fallen.rotate,
                scale: social ? 0.9 : 0.6,
              }
            : {
                opacity: 1,
                x: 0,
                y: 0,
                rotate: 0,
                scale: 1,
              }
      }
      transition={
        !inView
          ? { duration: 0 }
          : collapsed
            ? { duration: 0.9, delay: collapseDelay, type: 'spring', stiffness: 60, damping: 12, mass: 1.2 }
            : { duration: 0.8, delay: entranceDelay, ease: [0.16, 1, 0.3, 1] }
      }
      className="rounded-[14px] flex items-center justify-center relative"
      style={{
        background: glowBorder || (!social ? '#1A1A1A' : undefined),
        padding: glowBorder ? '1.5px' : undefined,
        boxShadow: !social
          ? (showGlow
              ? `0 ${shadowDepth}px ${shadowBlur}px rgba(0,0,0,.35), 0 0 ${glow * 24}px rgba(127,179,167,${glow * 0.5})`
              : `0 4px 0 rgba(0,0,0,0.2), 0 ${shadowDepth}px ${shadowBlur}px rgba(0,0,0,.25)`)
          : undefined, // social keys' boxShadow is written directly by applyPop
        border: !social && !glowBorder ? '1px solid rgba(255,255,255,0.06)' : social ? '1px solid rgba(255,255,255,0.25)' : undefined,
        transformStyle: 'preserve-3d',
        animation: isIdleIcon && entered && !collapsed ? 'iconFloat 4s ease-in-out infinite' : undefined,
        animationDelay: isIdleIcon ? `${waveDelay * 3}s` : undefined,
        ...bgStyle,
      }}
    >
      {glowBorder && (
        <div
          className="absolute inset-[1.5px] rounded-[12.5px] z-0"
          style={{ background: 'rgba(18,18,18,0.95)' }}
        />
      )}
      {social && (
        <img
          src={social.icon}
          alt={social.name}
          className="w-[36px] h-[36px] object-contain relative z-10"
          loading="lazy"
        />
      )}
    </motion.div>
  );
}

export function KeyboardSection() {
  const isGap = (row: number, col: number) =>
    (row === 2 || row === 3) && (col === 6 || col === 7);

  const gridRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showComparison, setShowComparison] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (showComparison) return;
    setMousePos({ x: e.clientX, y: e.clientY });
  }, [showComparison]);

  const handleMouseLeave = useCallback(() => {
    setMousePos({ x: 0, y: 0 });
  }, []);

  const handleTalioClick = useCallback(() => {
    playClickSound();
    setShowComparison(true);
    setMousePos({ x: 0, y: 0 });
  }, []);

  const handleClose = useCallback(() => {
    setShowComparison(false);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-20 md:py-28 bg-black overflow-hidden flex flex-col justify-center"
      style={{ scrollSnapAlign: 'start' }}
    >
      <style>{`
        @keyframes edgeWave {
          0% { opacity: 0.7; background-position: 200% 0; }
          50% { opacity: 1; background-position: -200% 0; }
          100% { opacity: 0.7; background-position: 200% 0; }
        }
        @keyframes talioFloat {
          0%, 100% { transform: translateZ(80px) scale(1.12); }
          50% { transform: translateZ(95px) scale(1.15); }
        }
        @keyframes iconFloat {
          0%, 100% { transform: translateZ(50px) scale(1.08); }
          50% { transform: translateZ(58px) scale(1.10); }
        }
        @keyframes tooltipBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>

      {/* Heading */}
      <div className="flex flex-col items-center text-center  px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 text-sm font-semibold text-purple-400 uppercase tracking-widest mb-10"
        >
          Integrations
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-10 leading-[1.05] tracking-tighter text-center"
        >
          Replace Your Entire Stack
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-2xl text-center"
        >
          One platform to replace Jira, Trello, Asana, and dozens more. Everything your team needs, unified.
        </motion.p>
      </div>

      {/* Keyboard + scattered keys (always rendered, animate between states) */}
      <div
        className="relative flex items-center justify-center px-4"
        style={{ transform: 'translate(40px, -30px)' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="relative"
          style={{
            perspective: '900px',
            perspectiveOrigin: '50% 70%',
          }}
        >
          {/* "Click me" tooltip — 3D styled, centered above Talio key */}
          <AnimatePresence>
            {!showComparison && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.4, delay: 1.2 }}
                className="absolute z-40 pointer-events-none"
                style={{ top: '5%', left: '42%', transform: 'translateX(-50%)' }}
              >
                <div style={{ animation: 'tooltipBounce 2s ease-in-out infinite', perspective: '600px' }}>
                  <div
                    className="px-6 py-3 rounded-xl text-base font-extrabold tracking-wide"
                    style={{
                      background: '#ffffff',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15), 0 4px 0 rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,1), 0 0 20px rgba(127,179,167,0.15)',
                      border: '1px solid rgba(0,0,0,0.06)',
                      transform: 'rotateX(8deg)',
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    <span
                      className="text-lg font-semibold"
                      style={{
                        backgroundImage: 'linear-gradient(90deg, #0ea5e9, #8b5cf6, #ec4899)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        display: 'inline-block',
                      }}
                    >
                      Click me
                    </span>
                  </div>
                  <div
                    className="w-3 h-3 mx-auto -mt-1.5 rotate-45"
                    style={{
                      background: '#ffffff',
                      boxShadow: '4px 4px 8px rgba(0,0,0,0.1)',
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {/* Edge lighting wave overlay — hidden when collapsed */}
          <motion.div
            animate={{ opacity: showComparison ? 0 : 1 }}
            transition={{ duration: 0.5 }}
            className="absolute -inset-[14px] rounded-[28px] pointer-events-none z-20"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(127,179,167,0) 15%, rgba(127,179,167,0.5) 35%, rgba(167,150,235,0.4) 50%, rgba(127,179,167,0.5) 65%, rgba(127,179,167,0) 85%, transparent 100%)',
              backgroundSize: '200% 100%',
              animation: 'edgeWave 20s cubic-bezier(0.4, 0, 0.2, 1) infinite',
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude',
              WebkitMaskComposite: 'xor',
              padding: '2.5px',
              transform: 'rotateX(48deg) rotateZ(-8deg)',
              transformStyle: 'preserve-3d',
            }}
          />
          <div
            ref={gridRef}
            className="relative grid gap-[7px]"
            style={{
              gridTemplateColumns: 'repeat(12, minmax(56px, 96px))',
              gridAutoRows: 'minmax(56px, 96px)',
              transform: 'rotateX(48deg) rotateZ(-8deg)',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Rows 1-4 */}
            {[1, 2, 3, 4].map(row =>
              Array.from({ length: 12 }, (_, c) => {
                const col = c + 1;
                if (isGap(row, col)) return null;
                const social = TOOL_KEYS[`${row}-${col}`];
                return (
                  <Key
                    key={`r${row}-${col}`}
                    social={social}
                    row={row}
                    col={col}
                    mousePos={mousePos}
                    gridRef={gridRef}
                    collapsed={showComparison}
                    inView={inView}
                  />
                );
              })
            )}

            {/* Center gap placeholder */}
            <div style={{ gridColumn: '6 / span 2', gridRow: '2 / span 2' }} />

            {/* Talio Logo — clickable, white default, black bg + glow on hover */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: -60 }}
              animate={showComparison
                ? { opacity: 0, scale: 0, y: 40, backgroundColor: '#ffffff' }
                : { opacity: 1, scale: 1, y: 0, backgroundColor: '#ffffff' }
              }
              whileHover={{
                backgroundColor: '#000000',
                boxShadow: '0 0 60px rgba(127,179,167,0.7), 0 0 120px rgba(127,179,167,0.35), 0 16px 48px rgba(0,0,0,0.5)',
                border: '1px solid rgba(127,179,167,0.5)',
              }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={handleTalioClick}
              className="flex items-center justify-center rounded-[20px] z-10 cursor-pointer relative group"
              style={{
                gridColumn: '6 / span 2',
                gridRow: '2 / span 2',
                backgroundColor: '#ffffff',
                border: '1px solid rgba(255,255,255,0.25)',
                boxShadow: '0 16px 48px rgba(127,179,167,0.5), 0 0 100px rgba(127,179,167,0.25), 0 8px 20px rgba(0,0,0,0.4)',
                transform: 'translateZ(80px) scale(1.12)',
                transformStyle: 'preserve-3d',
                animation: showComparison ? undefined : 'talioFloat 3s ease-in-out infinite',
              }}
            >
              <img src={logoImage} alt="Talio" className="w-[60px] md:w-[80px]" />
            </motion.div>

            {/* Spacebar */}
            <motion.div
              animate={showComparison
                ? { opacity: 0, y: 200 }
                : { opacity: 1, y: 0 }
              }
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[14px] h-[78px]"
              style={{
                gridColumn: '4 / span 6',
                background: '#1A1A1A',
                boxShadow: '0 4px 0 rgba(0,0,0,0.2), 0 6px 12px rgba(0,0,0,.25)',
                border: '1px solid rgba(255,255,255,0.06)',
                transform: 'translateZ(6px)',
                transformStyle: 'preserve-3d',
              }}
            />
          </div>
        </div>
      </div>

      {/* Comparison table overlay */}
      <AnimatePresence>
        {showComparison && (
          <motion.div
            key="comparison"
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 40 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 flex items-center justify-center px-4 md:px-8 z-30"
          >
            <div className="relative w-full max-w-3xl rounded-3xl bg-zinc-900/90 border border-white/10 backdrop-blur-xl p-8 md:p-10 mt-[4em]">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-colors z-10"
              >
                ✕
              </button>

              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">1 tool to do it all</h3>
                <div className="text-gray-400 text-sm">Save time &amp; money. Just get Talio.</div>
              </div>

              {/* Comparison Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left py-4 px-3 text-gray-500 text-sm font-normal w-[40%]" />
                      {COMPARISON_COMPETITORS.map((c) => (
                        <th key={c.name} className="py-4 px-3 text-center">
                          <div className="flex items-center justify-center">
                            <img
                              src={c.icon}
                              alt={c.name}
                              className={`w-8 h-8 object-contain ${c.isTalio ? '' : 'opacity-60'}`}
                            />
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARISON_FEATURES.map((feature, i) => (
                      <motion.tr
                        key={feature.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.08, duration: 0.4 }}
                        className="border-t border-white/5"
                      >
                        <td className="py-4 px-3 text-gray-300 text-sm">{feature.name}</td>
                        {feature.values.map((val, j) => (
                          <td key={j} className="py-4 px-3 text-center">
                            {val ? (
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-bold">✓</span>
                            ) : (
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500/15 text-red-400/80 text-sm font-bold">✗</span>
                            )}
                          </td>
                        ))}
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
