import { motion, useInView, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react';
import React, { useRef, useEffect, type MouseEvent } from 'react';
import { Link } from 'react-router';
import {
  Smartphone, MapPin, Fingerprint, Clock, Bell, ChevronRight, TrendingUp,
  Users, Shield, CalendarCheck, Activity, Gauge, Wifi, Zap, Eye,
  BarChart3, Lock, Globe, Server, Cpu, Database, FileCheck,
  ScanFace, Radio, Landmark, CloudUpload, Timer, PersonStanding,
  ShieldCheck, Sparkles, BellRing, CircleDot,
  MapPinCheck, Layers, CalendarClock,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { isSoundAllowed } from './SoundContext';

/* ─── Flow Node ─── */
interface FlowNode {
  id: string;
  icon: LucideIcon;
  label: string;
  desc: string;
  color: string;
  /** percentage-based position (0-100) */
  x: number;
  y: number;
  parentId: string | null;
  delay: number;
}

/* ─── 32 nodes scattered symmetrically across the FULL viewport ─── */
const NODES: FlowNode[] = [
  // ── LEFT TREE ──
  { id: 'l1',  icon: Shield,         label: 'Security Hub',     desc: 'Tamper-proof system',  color: '#a78bfa', x: 20, y: 3,   parentId: null,  delay: 0.30 },
  { id: 'l2',  icon: Lock,           label: 'Anti-Spoof',       desc: 'Liveness detection',   color: '#818cf8', x: 5,  y: 11,  parentId: 'l1',  delay: 0.46 },
  { id: 'l3',  icon: MapPin,         label: 'GPS Verified',     desc: 'Location-locked',      color: '#a78bfa', x: 28, y: 14,  parentId: 'l1',  delay: 0.52 },
  { id: 'l4',  icon: Globe,          label: 'Geo-Fencing',      desc: 'Auto-detect zones',    color: '#818cf8', x: 2,  y: 22,  parentId: 'l2',  delay: 0.64 },
  { id: 'l5',  icon: Fingerprint,    label: 'Biometric',        desc: 'Face ID & prints',     color: '#60a5fa', x: 24, y: 26,  parentId: 'l3',  delay: 0.70 },
  { id: 'l6',  icon: Wifi,           label: 'Wi-Fi Anchor',     desc: 'Office network lock',  color: '#c084fc', x: 8,  y: 33,  parentId: 'l4',  delay: 0.82 },
  { id: 'l7',  icon: ScanFace,       label: 'Face Match',       desc: '99.7% accuracy',       color: '#38bdf8', x: 20, y: 38,  parentId: 'l5',  delay: 0.88 },
  { id: 'l8',  icon: Server,         label: 'VPN Blocked',      desc: '3 blocked today',      color: '#fb7185', x: 1,  y: 44,  parentId: 'l6',  delay: 1.00 },
  { id: 'l9',  icon: Radio,          label: 'Beacon Detect',    desc: 'BLE proximity',        color: '#c084fc', x: 26, y: 48,  parentId: 'l7',  delay: 1.04 },
  { id: 'l10', icon: Users,          label: 'Team Active',      desc: '48 / 52 online',       color: '#60a5fa', x: 6,  y: 55,  parentId: 'l8',  delay: 1.14 },
  { id: 'l11', icon: PersonStanding, label: 'Geo Check-In',     desc: 'Walk-in verified',     color: '#a78bfa', x: 22, y: 60,  parentId: 'l9',  delay: 1.18 },
  { id: 'l12', icon: TrendingUp,     label: 'On-Time Rate',     desc: '97.3%',                color: '#34d399', x: 2,  y: 67,  parentId: 'l10', delay: 1.28 },
  { id: 'l13', icon: CloudUpload,    label: 'Cloud Sync',       desc: 'Real-time backup',     color: '#818cf8', x: 19, y: 72,  parentId: 'l11', delay: 1.32 },
  { id: 'l14', icon: Database,       label: 'Attendance Logs',  desc: '2.4k this month',      color: '#60a5fa', x: 7,  y: 80,  parentId: 'l12', delay: 1.42 },
  { id: 'l15', icon: ShieldCheck,    label: 'Audit Trail',      desc: 'Immutable records',    color: '#a3e635', x: 24, y: 85,  parentId: 'l13', delay: 1.46 },
  { id: 'l16', icon: Landmark,       label: 'Compliance',       desc: 'Labor law ready',      color: '#fbbf24', x: 3,  y: 92,  parentId: 'l14', delay: 1.54 },

  // ── LEFT NEAR-PHONE (close to center) ──
  { id: 'lp1', icon: MapPinCheck,    label: 'Zone Verified',    desc: 'Inside office area',   color: '#a78bfa', x: 35, y: 42,  parentId: 'l7',  delay: 0.95 },
  { id: 'lp2', icon: Layers,         label: 'Multi-Site',       desc: '12 locations',         color: '#60a5fa', x: 33, y: 56,  parentId: 'lp1', delay: 1.12 },
  { id: 'lp3', icon: CalendarClock,  label: 'Shift Planner',    desc: 'Auto-schedule',        color: '#34d399', x: 36, y: 70,  parentId: 'lp2', delay: 1.28 },

  // ── RIGHT TREE ──
  { id: 'r1',  icon: Bell,           label: 'Notifications',    desc: 'Smart alerts',         color: '#34d399', x: 80, y: 3,   parentId: null,  delay: 0.34 },
  { id: 'r2',  icon: Zap,            label: 'Smart Nudge',      desc: 'Context-aware',        color: '#fb923c', x: 95, y: 11,  parentId: 'r1',  delay: 0.48 },
  { id: 'r3',  icon: Clock,          label: 'Live Hours',       desc: 'Real-time tracker',    color: '#34d399', x: 72, y: 14,  parentId: 'r1',  delay: 0.54 },
  { id: 'r4',  icon: Activity,       label: 'Active Time',      desc: '7h 45m today',         color: '#2dd4bf', x: 98, y: 22,  parentId: 'r2',  delay: 0.66 },
  { id: 'r5',  icon: CalendarCheck,  label: 'Shifts Active',    desc: '3 running now',        color: '#facc15', x: 76, y: 26,  parentId: 'r3',  delay: 0.72 },
  { id: 'r6',  icon: Cpu,            label: 'Idle Detect',      desc: 'Auto-pause',           color: '#34d399', x: 92, y: 33,  parentId: 'r4',  delay: 0.84 },
  { id: 'r7',  icon: Eye,            label: 'Screen Watch',     desc: 'Focus tracking',       color: '#38bdf8', x: 80, y: 38,  parentId: 'r5',  delay: 0.90 },
  { id: 'r8',  icon: Timer,          label: 'Break Timer',      desc: 'Auto-scheduled',       color: '#fb923c', x: 98, y: 44,  parentId: 'r6',  delay: 1.02 },
  { id: 'r9',  icon: FileCheck,      label: 'Compliance',       desc: '100% adherence',       color: '#a3e635', x: 74, y: 48,  parentId: 'r7',  delay: 1.06 },
  { id: 'r10', icon: Gauge,          label: 'Overtime Alert',   desc: '2.5 h exceeded',       color: '#fb923c', x: 94, y: 55,  parentId: 'r8',  delay: 1.16 },
  { id: 'r11', icon: Sparkles,       label: 'AI Insights',      desc: 'Pattern analysis',     color: '#c084fc', x: 78, y: 60,  parentId: 'r9',  delay: 1.20 },
  { id: 'r12', icon: BarChart3,      label: 'Analytics',        desc: 'Weekly insights',      color: '#34d399', x: 98, y: 67,  parentId: 'r10', delay: 1.30 },
  { id: 'r13', icon: BellRing,       label: 'Late Alerts',      desc: '3 triggered today',    color: '#fb7185', x: 81, y: 72,  parentId: 'r11', delay: 1.34 },
  { id: 'r14', icon: Database,       label: 'Shift Logs',       desc: '120 this week',        color: '#fbbf24', x: 93, y: 80,  parentId: 'r12', delay: 1.44 },
  { id: 'r15', icon: Smartphone,     label: 'Mobile Punch',     desc: 'One-tap check-in',     color: '#60a5fa', x: 76, y: 85,  parentId: 'r13', delay: 1.48 },
  { id: 'r16', icon: CircleDot,      label: 'Geo-Stamp',        desc: 'Location logged',      color: '#2dd4bf', x: 97, y: 92,  parentId: 'r14', delay: 1.56 },

  // ── RIGHT NEAR-PHONE (close to center) ──
  { id: 'rp1', icon: Fingerprint,    label: 'Quick Auth',       desc: 'Instant verify',       color: '#fb923c', x: 65, y: 42,  parentId: 'r7',  delay: 0.97 },
  { id: 'rp2', icon: Activity,       label: 'Live Status',      desc: 'Real-time feed',       color: '#38bdf8', x: 67, y: 56,  parentId: 'rp1', delay: 1.14 },
  { id: 'rp3', icon: TrendingUp,     label: 'Productivity',     desc: '+12% this week',       color: '#a3e635', x: 64, y: 70,  parentId: 'rp2', delay: 1.30 },
];

/* ─── SVG connector paths (S-curves) ─── */
const CONNECTIONS = NODES.filter(n => n.parentId).map((child, i) => {
  const parent = NODES.find(n => n.id === child.parentId)!;
  const midY = (parent.y + child.y) / 2;
  return {
    id: `pay-${parent.id}-${child.id}`,
    d: `M ${parent.x},${parent.y} C ${parent.x},${midY} ${child.x},${midY} ${child.x},${child.y}`,
    color: child.color,
    delay: parent.delay + 0.12,
    index: i,
  };
});

/* ─── Pop sound (trimmed reverb) ─── */
const popPool: HTMLAudioElement[] = [];
let _popCount = 0;
function playPop() {
  _popCount++;
  if (_popCount % 2 !== 0) return; // alternate cards only
  if (!isSoundAllowed()) return;
  try {
    let audio = popPool.find(a => a.paused);
    if (!audio) {
      audio = new Audio('/sounds/pop-reverb.mp3');
      audio.volume = 0.015;
      popPool.push(audio);
    }
    audio.currentTime = 0;
    audio.play().catch(() => {});
  } catch {}
}

/* ─── PopNode ─── */
function PopNode({ node, sectionInView, ...rest }: { node: FlowNode; sectionInView: boolean; key?: string }) {
  const hasPopped = useRef(false);

  useEffect(() => {
    if (sectionInView && !hasPopped.current) {
      hasPopped.current = true;
      const timer = setTimeout(() => playPop(), node.delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [sectionInView, node.delay]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.15 }}
      animate={sectionInView ? { opacity: 1, scale: 1 } : {}}
      transition={{
        delay: node.delay,
        duration: 0.45,
        scale: { type: 'spring', stiffness: 520, damping: 16, delay: node.delay },
        opacity: { duration: 0.3, delay: node.delay },
      }}
      whileHover={{
        scale: 1.12,
        y: -5,
        boxShadow: `0 18px 50px ${node.color}30, 0 0 24px ${node.color}20`,
      }}
      className="absolute flex items-center gap-2 px-3 py-2.5 rounded-xl border backdrop-blur-2xl cursor-default z-10 whitespace-nowrap"
      style={{
        left: `${node.x}%`,
        top: `${node.y}%`,
        transform: 'translate(-50%, -50%)',
        background: 'rgba(10,10,14,0.82)',
        borderColor: `${node.color}20`,
        boxShadow: `0 4px 20px ${node.color}06, inset 0 1px 0 rgba(255,255,255,0.04)`,
      }}
    >
      <div
        className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full"
        style={{ background: node.color, boxShadow: `0 0 6px ${node.color}` }}
      >
        <div className="absolute inset-0 rounded-full animate-ping opacity-25" style={{ background: node.color }} />
      </div>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${node.color}12` }}>
        <node.icon className="w-3.5 h-3.5" style={{ color: node.color }} strokeWidth={2.5} />
      </div>
      <div>
        <p className="text-[12px] font-semibold text-white leading-tight">{node.label}</p>
        <p className="text-[10px] text-zinc-500 leading-tight">{node.desc}</p>
      </div>
    </motion.div>
  );
}

/* ─── SVG Connector overlay with moving gradient pulses ─── */
function ConnectorLines({ isInView }: { isInView: boolean }) {
  return (
    <>
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-[5]"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          {CONNECTIONS.map(conn => (
            <linearGradient key={`grad-${conn.id}`} id={`grad-${conn.id}`} gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={conn.color} stopOpacity="0">
                <animate attributeName="offset" values="-0.3;1.0" dur={`${2 + (conn.index % 5) * 0.4}s`} begin={`${conn.delay + 0.8}s`} repeatCount="indefinite" />
              </stop>
              <stop offset="15%" stopColor={conn.color} stopOpacity="0.6">
                <animate attributeName="offset" values="-0.15;1.15" dur={`${2 + (conn.index % 5) * 0.4}s`} begin={`${conn.delay + 0.8}s`} repeatCount="indefinite" />
              </stop>
              <stop offset="30%" stopColor={conn.color} stopOpacity="0">
                <animate attributeName="offset" values="0;1.3" dur={`${2 + (conn.index % 5) * 0.4}s`} begin={`${conn.delay + 0.8}s`} repeatCount="indefinite" />
              </stop>
            </linearGradient>
          ))}
        </defs>
        {CONNECTIONS.map(conn => (
          <g key={conn.id}>
            {/* Static faint line */}
            <motion.path
              d={conn.d}
              stroke={conn.color}
              strokeWidth="1"
              strokeOpacity="0.08"
              vectorEffect="non-scaling-stroke"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : {}}
              transition={{ duration: 1.2, delay: conn.delay, ease: 'easeOut' }}
            />
            {/* Animated gradient overlay */}
            <motion.path
              d={conn.d}
              stroke={`url(#grad-${conn.id})`}
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : {}}
              transition={{ duration: 1.2, delay: conn.delay, ease: 'easeOut' }}
            />
          </g>
        ))}
      </svg>
    </>
  );
}

/* ─── 3D Phone Tilt ─── */
function Phone3D({ phoneY, isInView, children }: { phoneY: any; isInView: boolean; children: React.ReactNode }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rotateX = useSpring(useMotionValue(0), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 150, damping: 20 });

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    rotateY.set(x * 12);
    rotateX.set(-y * 8);
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 80, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-20"
      style={{ perspective: 1200 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { rotateX.set(0); rotateY.set(0); }}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[520px] bg-gradient-to-b from-violet-500/25 via-blue-500/15 to-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />
      <motion.div style={{ y: phoneY, rotateX, rotateY, transformStyle: 'preserve-3d' }} className="relative">
        {children}
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════ */
export function PayrollSection() {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const phoneY = useTransform(scrollYProgress, [0, 1], [20, -20]);

  return (
    <section ref={containerRef} className="relative bg-black overflow-clip pt-16 md:pt-24">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.025]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <motion.div style={{ y: bgY }} className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-gradient-to-br from-violet-600/10 via-blue-500/8 to-transparent rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-emerald-500/6 via-transparent to-transparent rounded-full blur-[100px]" />
      </div>

      <div ref={ref} className="relative w-full">

        {/* ═══ Desktop: Full-viewport flowchart ═══ */}
        <div className="hidden md:block relative" style={{ height: 'clamp(800px, 100vh, 1100px)' }}>

          {/* SVG connector lines */}
          <ConnectorLines isInView={isInView} />

          {/* Flowchart nodes */}
          {NODES.map(node => (
            <PopNode key={node.id} node={node} sectionInView={isInView} />
          ))}

          {/* Heading (overlaid, z-30) */}
          <div className="absolute top-[2%] left-1/2 -translate-x-1/2 z-30 flex flex-col items-center text-center w-full max-w-3xl px-4">
            {/* Strong dark backdrop so heading is always readable */}
            <div className="absolute inset-0 -z-10" style={{
              background: 'radial-gradient(ellipse 120% 160% at center, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.7) 50%, transparent 100%)',
              margin: '-20px -80px',
              filter: 'blur(30px)',
            }} />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 text-sm font-semibold text-purple-400 uppercase tracking-widest mb-6"
            >
              <Smartphone className="w-4 h-4" />
              Mobile Attendance
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-5 leading-[1.05] tracking-tighter"
            >
              One Tap.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-blue-400 to-emerald-400">
                Checked In.
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-2xl"
            >
              Clock in from anywhere — GPS verified, biometric secured. No hardware, no queues.
            </motion.p>
          </div>

          {/* Phone (centered, pushed lower to clear headings, z-20) */}
          <div className="absolute top-[58%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <Phone3D phoneY={phoneY} isInView={isInView}>
              <div className="absolute -bottom-6 left-1/2 w-[65%] h-[30px] rounded-[50%] blur-2xl" style={{ background: 'radial-gradient(ellipse, rgba(0,0,0,0.5) 0%, transparent 70%)', transform: 'translateX(-50%)' }} />
              <div className="relative w-[260px] md:w-[280px] lg:w-[310px]" style={{ transformStyle: 'preserve-3d' }}>
                <div className="relative rounded-[52px]" style={{ transformStyle: 'preserve-3d', background: 'linear-gradient(145deg, #a1a1aa 0%, #71717a 15%, #52525b 50%, #71717a 85%, #a1a1aa 100%)', padding: '3px' }}>
                  <div className="absolute inset-0 rounded-[52px]" style={{ transform: 'translateZ(-8px)', background: 'linear-gradient(145deg, #3f3f46, #27272a)', boxShadow: '0 30px 80px rgba(0,0,0,0.7), 0 12px 40px rgba(0,0,0,0.5)' }} />
                  <div className="relative rounded-[50px] bg-[#1a1a1e] overflow-hidden" style={{ padding: '10px', boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.08), inset 0 -1px 2px rgba(0,0,0,0.3)' }}>
                    <div className="relative rounded-[42px] overflow-hidden bg-black">
                      <div className="absolute top-[10px] left-1/2 -translate-x-1/2 z-20">
                        <div className="relative w-[126px] h-[37px] bg-black rounded-full flex items-center justify-between px-[14px]">
                          <div className="w-[10px] h-[10px] rounded-full bg-[#1c1c1e] relative">
                            <div className="absolute inset-[1.5px] rounded-full bg-gradient-to-br from-[#2a2a2e] to-[#0c0c0e]" />
                            <div className="absolute inset-[3px] rounded-full bg-[#0a0a0c]" />
                            <div className="absolute top-[1px] left-[2px] w-[2px] h-[2px] rounded-full bg-blue-400/30" />
                          </div>
                          <div className="flex items-center gap-[6px]">
                            <div className="w-[4px] h-[4px] rounded-full bg-[#1c1c1e]" />
                            <div className="w-[6px] h-[6px] rounded-full bg-[#1c1c1e] border border-[#2a2a2e]/50" />
                          </div>
                        </div>
                      </div>
                      <div className="relative aspect-[9/19.5] w-full overflow-hidden">
                        <img src="/payroll-app.jpg" alt="Talio Check-In App" className="w-full h-full object-cover object-top" />
                        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(115deg, rgba(255,255,255,0.07) 0%, transparent 25%, transparent 60%, rgba(255,255,255,0.03) 100%)' }} />
                      </div>
                      <div className="absolute bottom-[8px] left-1/2 -translate-x-1/2 w-[120px] h-[4px] rounded-full bg-white/20 z-20" />
                    </div>
                  </div>
                </div>
                <div className="absolute left-[-3px] top-[100px] w-[4px] h-[28px] rounded-l-sm" style={{ background: 'linear-gradient(to right, #71717a, #52525b)', boxShadow: '-2px 0 4px rgba(0,0,0,0.4)' }} />
                <div className="absolute left-[-3px] top-[144px] w-[4px] h-[52px] rounded-l-sm" style={{ background: 'linear-gradient(to right, #71717a, #52525b)', boxShadow: '-2px 0 4px rgba(0,0,0,0.4)' }} />
                <div className="absolute left-[-3px] top-[204px] w-[4px] h-[52px] rounded-l-sm" style={{ background: 'linear-gradient(to right, #71717a, #52525b)', boxShadow: '-2px 0 4px rgba(0,0,0,0.4)' }} />
                <div className="absolute right-[-3px] top-[160px] w-[4px] h-[68px] rounded-r-sm" style={{ background: 'linear-gradient(to left, #71717a, #52525b)', boxShadow: '2px 0 4px rgba(0,0,0,0.4)' }} />
              </div>
            </Phone3D>
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 1.5 }}
            className="absolute bottom-[2%] left-1/2 -translate-x-1/2 z-30"
          >
            <div className="absolute inset-0 -z-10" style={{
              background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.9) 0%, transparent 100%)',
              margin: '-12px -40px',
              filter: 'blur(20px)',
            }} />
            <Link to="/features/attendance">
              <motion.span whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }} className="group inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
                See how attendance works
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.span>
            </Link>
          </motion.div>
        </div>

        {/* ═══ Mobile: stacked layout ═══ */}
        <div className="md:hidden py-20 px-6">
          <div className="flex flex-col items-center text-center mb-10">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 text-sm font-semibold text-purple-400 uppercase tracking-widest mb-6">
              <Smartphone className="w-4 h-4" />
              Mobile Attendance
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.1 }} className="text-3xl font-bold text-white mb-5 leading-[1.1] tracking-tighter">
              One Tap.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-blue-400 to-emerald-400">Checked In.</span>
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="text-base text-gray-400 font-light leading-relaxed max-w-sm">
              Clock in from anywhere — GPS verified, biometric secured.
            </motion.p>
          </div>

          <div className="flex justify-center mb-8">
            <Phone3D phoneY={phoneY} isInView={isInView}>
              <div className="relative w-[240px]" style={{ transformStyle: 'preserve-3d' }}>
                <div className="relative rounded-[44px]" style={{ background: 'linear-gradient(145deg, #a1a1aa 0%, #71717a 15%, #52525b 50%, #71717a 85%, #a1a1aa 100%)', padding: '3px' }}>
                  <div className="relative rounded-[42px] bg-[#1a1a1e] overflow-hidden" style={{ padding: '8px', boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.08)' }}>
                    <div className="relative rounded-[36px] overflow-hidden bg-black">
                      <div className="relative aspect-[9/19.5] w-full overflow-hidden">
                        <img src="/payroll-app.jpg" alt="Talio Check-In App" className="w-full h-full object-cover object-top" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Phone3D>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-4 -mx-6 px-6 snap-x snap-mandatory scrollbar-hide">
            {NODES.slice(0, 8).map((node, i) => (
              <motion.div key={node.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl border backdrop-blur-xl shrink-0 snap-center"
                style={{ background: 'rgba(12,12,16,0.8)', borderColor: `${node.color}20`, minWidth: '190px' }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${node.color}12` }}>
                  <node.icon className="w-3.5 h-3.5" style={{ color: node.color }} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-white leading-tight">{node.label}</p>
                  <p className="text-[10px] text-zinc-500 leading-tight mt-0.5">{node.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <Link to="/features/attendance">
              <motion.span whileHover={{ scale: 1.04 }} className="group inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
                See how attendance works
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}