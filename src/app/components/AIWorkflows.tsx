import { motion, useInView, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react';
import React, { useRef, type MouseEvent } from 'react';
import { Sparkles, Zap, Brain, Shield, FileCheck, Clock, Target, Pencil, Link2, Heart, ClipboardList, ShieldCheck, BarChart3, BellRing } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/* ── Brand logos (silhouette-style placeholders using text) ── */
const BRAND_NAMES = ['Apple', 'Google', 'Amazon', 'Slack', 'Nike', 'Shopify'];

/* ── Card definitions ── */
interface CardDef {
  icon: LucideIcon;
  title: string;
  desc: string;
  color: string;
  glow: string;
}

const LEFT_CARDS: CardDef[] = [
  { icon: Pencil,   title: 'Value-first copy detected',       desc: 'Opening with benefit boosts click-through rate.',            color: '#a78bfa', glow: 'rgba(167,139,250,0.15)' },
  { icon: Sparkles, title: 'Social proof integration tested',  desc: 'Adding reviews increased clicks by 27%.',                   color: '#60a5fa', glow: 'rgba(96,165,250,0.15)' },
  { icon: Link2,    title: 'CTA contrast optimized',          desc: 'High-contrast buttons increase click-through by 19%.',      color: '#818cf8', glow: 'rgba(129,140,248,0.15)' },
  { icon: Heart,    title: 'Emotional triggers analyzed',     desc: 'Content with emotion-driven headlines converts 2x better.', color: '#f472b6', glow: 'rgba(244,114,182,0.15)' },
];

const RIGHT_CARDS: CardDef[] = [
  { icon: Zap,           title: 'Best-performing hooks saved',   desc: 'Templates with 38% higher CTR.',                     color: '#fbbf24', glow: 'rgba(251,191,36,0.15)' },
  { icon: ShieldCheck,   title: 'Visual hierarchy optimized',    desc: 'Hero image placement increases engagement by 22%.',  color: '#34d399', glow: 'rgba(52,211,153,0.15)' },
  { icon: ClipboardList, title: 'Whitespace usage optimized',    desc: 'Balanced spacing increases conversion.',              color: '#a78bfa', glow: 'rgba(167,139,250,0.15)' },
  { icon: BellRing,      title: 'A/B test results compiled',     desc: 'Variant B outperforms by 31% in conversions.',       color: '#fb923c', glow: 'rgba(251,146,60,0.15)' },
];

/* ── Insight Card component ── */
function InsightCard({ card, side, index, isInView }: { card: CardDef; side: 'left' | 'right'; index: number; isInView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: side === 'left' ? -40 : 40 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.5 + index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, scale: 1.03 }}
      className={`flex items-start gap-3.5 px-5 py-4 rounded-2xl border backdrop-blur-2xl cursor-default ${side === 'left' ? 'flex-row-reverse text-right' : ''}`}
      style={{
        background: 'rgba(18,18,22,0.7)',
        borderColor: `${card.color}18`,
        boxShadow: `0 2px 16px rgba(0,0,0,0.25), 0 0 0 1px ${card.color}08`,
        transition: 'box-shadow 0.3s ease',
      }}
      onHoverStart={() => {}}
    >
      {/* Glow icon */}
      <div className="relative shrink-0 mt-0.5">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${card.color}12` }}>
          <card.icon className="w-4 h-4" style={{ color: card.color }} />
        </div>
        <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ backgroundColor: card.color }} />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ backgroundColor: card.color }} />
        </span>
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-white leading-tight">{card.title}</p>
        <p className="text-[11px] text-zinc-500 leading-snug mt-1">{card.desc}</p>
      </div>
    </motion.div>
  );
}

/* ── MIRA Dashboard with 3D tilt ── */
function MiraDashboard({ isInView, centerY, mobile }: { isInView: boolean; centerY: any; mobile?: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateY = useSpring(mx, { stiffness: 150, damping: 20 });
  const rotateX = useSpring(my, { stiffness: 150, damping: 20 });

  function handleMouse(e: MouseEvent<HTMLDivElement>) {
    if (!cardRef.current || mobile) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    mx.set(x * 12);
    my.set(-y * 8);
  }

  function handleLeave() { mx.set(0); my.set(0); }

  return (
    <motion.div
      style={{ y: mobile ? 0 : centerY, perspective: 1200 }}
      className={`relative z-10 flex justify-center ${mobile ? 'mb-2' : ''}`}
    >
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[450px] bg-gradient-to-b from-violet-500/20 via-blue-500/12 to-cyan-400/8 rounded-full blur-[100px] pointer-events-none" />

      {/* Pulsing rings */}
      {!mobile && [0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border pointer-events-none"
          style={{ borderColor: 'rgba(139,92,246,0.06)' }}
          initial={{ width: 200, height: 200, opacity: 0 }}
          animate={isInView ? { width: [200, 550], height: [200, 550], opacity: [0.4, 0] } : {}}
          transition={{ duration: 4, delay: 1 + i * 1.2, repeat: Infinity, ease: 'easeOut' }}
        />
      ))}

      <motion.div
        ref={cardRef}
        onMouseMove={handleMouse}
        onMouseLeave={handleLeave}
        style={{ rotateX: mobile ? 0 : rotateX, rotateY: mobile ? 0 : rotateY, transformStyle: 'preserve-3d' }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-[280px] md:w-[320px] rounded-[32px] border overflow-hidden"
          style={{
            background: 'linear-gradient(170deg, rgba(28,28,34,0.97) 0%, rgba(12,12,16,0.98) 100%)',
            borderColor: 'rgba(255,255,255,0.07)',
            boxShadow: '0 40px 100px rgba(0,0,0,0.55), 0 0 80px rgba(139,92,246,0.08), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        >
          {/* Gradient bar */}
          <div className="h-[2px] w-full bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-500" />

          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-5 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-sm font-bold text-white block leading-tight">MIRA AI</span>
                <span className="text-[10px] text-zinc-500">Workforce Intelligence</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <span className="flex h-1.5 w-1.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold">Live</span>
            </div>
          </div>

          <div className="mx-5 h-px bg-white/[0.04]" />

          {/* Analysis */}
          <div className="px-6 py-5">
            <p className="text-zinc-500 text-[10px] font-semibold uppercase tracking-[0.2em] mb-4">Workflow Analysis</p>

            {/* Score ring */}
            <div className="flex items-center justify-center mb-5">
              <div className="relative w-[130px] h-[130px]">
                <svg viewBox="0 0 130 130" className="w-full h-full">
                  <circle cx="65" cy="65" r="54" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="8" />
                  <motion.circle
                    cx="65" cy="65" r="54" fill="none"
                    stroke="url(#scoreGrad2)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 54}
                    strokeDashoffset={2 * Math.PI * 54}
                    animate={isInView ? { strokeDashoffset: 2 * Math.PI * 54 * 0.04 } : {}}
                    transition={{ duration: 2.5, delay: 0.8, ease: 'easeOut' }}
                    transform="rotate(-90 65 65)"
                  />
                  <defs>
                    <linearGradient id="scoreGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="50%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.span
                    className="text-4xl font-extrabold text-white tracking-tight"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 1.2 }}
                  >
                    96<span className="text-lg text-violet-400 font-bold">%</span>
                  </motion.span>
                  <span className="text-[10px] text-zinc-600 font-medium">efficiency</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-2">
              {[
                { icon: FileCheck, label: 'Tasks auto-assigned', value: '47', color: '#8b5cf6' },
                { icon: Clock, label: 'Hours saved this week', value: '18.5', color: '#3b82f6' },
                { icon: Shield, label: 'Compliance score', value: '100%', color: '#10b981' },
                { icon: Target, label: 'Bottlenecks resolved', value: '12', color: '#f59e0b' },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 1.4 + i * 0.1, duration: 0.5 }}
                  className="flex items-center justify-between py-2 px-3 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.02)' }}
                >
                  <div className="flex items-center gap-2">
                    <item.icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                    <span className="text-[11px] text-zinc-400">{item.label}</span>
                  </div>
                  <span className="text-[11px] font-bold text-white">{item.value}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="px-6 pb-5 pt-1">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500/10 to-blue-500/10 border border-violet-500/15">
              <Zap className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-[11px] text-violet-300 font-medium">4 new suggestions ready</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export function AIWorkflows() {
  const sectionRef = useRef(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const centerY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section ref={sectionRef} className="relative py-20 md:py-28 bg-black overflow-hidden">
      {/* ── Background ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-gradient-to-b from-violet-600/8 via-blue-500/5 to-transparent rounded-full blur-[120px]" />
      </div>

      <div ref={ref} className="relative max-w-[1400px] mx-auto px-6 md:px-8 lg:px-12">
        {/* ── Heading ── */}
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 uppercase tracking-widest mb-10"
          >
            <Sparkles className="w-4 h-4" />
            AI Workflows
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-10 leading-[1.05] tracking-tighter text-center"
          >
            AI trained on millions of{' '}
            <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400">
              workforce insights
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-2xl text-center"
          >
            MIRA learns from the best-performing teams worldwide. Every suggestion is backed by real data from top-performing organizations.
          </motion.p>
        </div>

        {/* ── Brand logos row ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center justify-center gap-8 md:gap-14 mt-12 mb-4"
        >
          {BRAND_NAMES.map((name, i) => (
            <motion.span
              key={name}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 0.35 } : {}}
              transition={{ delay: 0.4 + i * 0.08 }}
              className="text-sm md:text-base font-bold text-white uppercase tracking-[0.2em] select-none"
            >
              {name}
            </motion.span>
          ))}
        </motion.div>

        {/* ── SVG Branch Lines with flowing dots ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className="flex justify-center mt-6 md:mt-8 -mb-4"
        >
          <svg viewBox="0 0 600 160" className="w-full max-w-[600px] h-auto" fill="none">
            {/* Branch paths */}
            {[
              { d: 'M300,10 C300,55 80,75 40,155',  color: '#ec4899', delay: 0.5  },
              { d: 'M300,10 C300,45 180,85 140,155', color: '#8b5cf6', delay: 0.6  },
              { d: 'M300,10 C300,60 295,105 300,155', color: '#06b6d4', delay: 0.7 },
              { d: 'M300,10 C300,45 420,85 460,155', color: '#3b82f6', delay: 0.6  },
              { d: 'M300,10 C300,55 520,75 560,155', color: '#10b981', delay: 0.5  },
            ].map(({ d, color, delay }, i) => (
              <g key={i}>
                {/* Static trail */}
                <motion.path
                  d={d} stroke={color} strokeWidth="1.5" strokeOpacity="0.2"
                  initial={{ pathLength: 0 }} animate={isInView ? { pathLength: 1 } : {}}
                  transition={{ duration: 1.5, delay, ease: 'easeOut' }}
                />
                {/* Flowing dot (fast to slow) */}
                <circle r="3" fill={color} opacity="0.8">
                  <animateMotion
                    dur="3s"
                    repeatCount="indefinite"
                    begin={`${delay}s`}
                    keyPoints="0;1"
                    keyTimes="0;1"
                    calcMode="spline"
                    keySplines="0.4 0 0.2 1"
                  >
                    <mpath href={`#flowPath${i}`} />
                  </animateMotion>
                </circle>
                {/* Glow for flowing dot */}
                <circle r="6" fill={color} opacity="0.2">
                  <animateMotion
                    dur="3s"
                    repeatCount="indefinite"
                    begin={`${delay}s`}
                    keyPoints="0;1"
                    keyTimes="0;1"
                    calcMode="spline"
                    keySplines="0.4 0 0.2 1"
                  >
                    <mpath href={`#flowPath${i}`} />
                  </animateMotion>
                </circle>
                <path id={`flowPath${i}`} d={d} fill="none" />
              </g>
            ))}
            {/* Center origin dot */}
            <circle cx="300" cy="10" r="4" fill="#8b5cf6" opacity="0.7" />
            <circle cx="300" cy="10" r="8" fill="#8b5cf6" opacity="0.15" />
            {/* End dots */}
            {[40, 140, 300, 460, 560].map((cx, i) => (
              <circle key={i} cx={cx} cy="155" r="2.5" fill={['#ec4899','#8b5cf6','#06b6d4','#3b82f6','#10b981'][i]} opacity="0.35" />
            ))}
          </svg>
        </motion.div>

        {/* ── Three-column layout: Cards | MIRA Dashboard | Cards ── */}
        <div className="hidden md:grid grid-cols-[1fr_auto_1fr] items-center gap-6 lg:gap-10 max-w-[1100px] mx-auto mt-2">
          {/* Left column */}
          <div className="flex flex-col gap-4">
            {LEFT_CARDS.map((card, i) => (
              <InsightCard key={card.title} card={card} side="left" index={i} isInView={isInView} />
            ))}
          </div>

          {/* Center: MIRA Dashboard */}
          <MiraDashboard isInView={isInView} centerY={centerY} />

          {/* Right column */}
          <div className="flex flex-col gap-4">
            {RIGHT_CARDS.map((card, i) => (
              <InsightCard key={card.title} card={card} side="right" index={i} isInView={isInView} />
            ))}
          </div>
        </div>

        {/* ── Mobile layout ── */}
        <div className="md:hidden mt-6">
          <MiraDashboard isInView={isInView} centerY={centerY} mobile />
          <div className="flex gap-3 overflow-x-auto pb-4 mt-6 snap-x snap-mandatory scrollbar-hide px-2">
            {[...LEFT_CARDS, ...RIGHT_CARDS].slice(0, 6).map((card) => (
              <div key={card.title} className="snap-center shrink-0 w-[260px]">
                <InsightCard card={card} side="right" index={0} isInView={isInView} />
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="mt-12 md:mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <p className="text-gray-300 text-sm md:text-base font-light tracking-wide">
              Customize workflows to match your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 font-medium">
                unique business processes
              </span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}