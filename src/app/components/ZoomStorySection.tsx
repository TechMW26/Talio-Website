import { motion, useScroll, useTransform, useMotionValueEvent } from 'motion/react';
import { useRef, useState, useEffect, useCallback } from 'react';
import { Sparkles, TrendingUp, Users } from 'lucide-react';
import { AnimatedButton } from '@/app/components/AnimatedButton';

// Animated grid with gradient lines that warp near the mouse
function WarpGrid({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -1000, y: -1000 });
  const rafId = useRef(0);
  const mounted = useRef(true);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !mounted.current) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = rect.width;
    const h = rect.height;

    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    }

    ctx.clearRect(0, 0, w, h);

    const spacing = 60;
    const mx = mouse.current.x - rect.left;
    const my = mouse.current.y - rect.top;
    const warpRadius = 120;
    const warpStrength = 18;

    // Draw vertical lines
    for (let x = 0; x <= w; x += spacing) {
      ctx.beginPath();
      for (let y = 0; y <= h; y += 4) {
        const dx = x - mx;
        const dy = y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let px = x;
        if (dist < warpRadius) {
          const factor = (1 - dist / warpRadius) * warpStrength;
          px += (dx / (dist || 1)) * factor;
        }
        if (y === 0) ctx.moveTo(px, y);
        else ctx.lineTo(px, y);
      }
      // Gradient stroke — blue to purple
      const gradient = ctx.createLinearGradient(x, 0, x, h);
      gradient.addColorStop(0, 'rgba(96, 165, 250, 0.25)');
      gradient.addColorStop(0.5, 'rgba(168, 85, 247, 0.25)');
      gradient.addColorStop(1, 'rgba(96, 165, 250, 0.25)');
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = 0; y <= h; y += spacing) {
      ctx.beginPath();
      for (let x = 0; x <= w; x += 4) {
        const dx = x - mx;
        const dy = y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let py = y;
        if (dist < warpRadius) {
          const factor = (1 - dist / warpRadius) * warpStrength;
          py += (dy / (dist || 1)) * factor;
        }
        if (x === 0) ctx.moveTo(x, py);
        else ctx.lineTo(x, py);
      }
      const gradient = ctx.createLinearGradient(0, y, w, y);
      gradient.addColorStop(0, 'rgba(168, 85, 247, 0.25)');
      gradient.addColorStop(0.5, 'rgba(96, 165, 250, 0.25)');
      gradient.addColorStop(1, 'rgba(168, 85, 247, 0.25)');
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Draw brighter intersection dots
    for (let x = 0; x <= w; x += spacing) {
      for (let y = 0; y <= h; y += spacing) {
        const dx = x - mx;
        const dy = y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let px = x, py = y;
        if (dist < warpRadius) {
          const factor = (1 - dist / warpRadius) * warpStrength;
          px += (dx / (dist || 1)) * factor;
          py += (dy / (dist || 1)) * factor;
        }
        const brightness = dist < warpRadius ? 0.5 + (1 - dist / warpRadius) * 0.5 : 0.3;
        ctx.beginPath();
        ctx.arc(px, py, dist < warpRadius ? 2 : 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168, 130, 255, ${brightness})`;
        ctx.fill();
      }
    }

    rafId.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    mounted.current = true;
    rafId.current = requestAnimationFrame(draw);

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    return () => {
      mounted.current = false;
      cancelAnimationFrame(rafId.current);
      window.removeEventListener('mousemove', onMove);
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: '100%', height: '100%' }}
    />
  );
}

export function ZoomStorySection() {
  const containerRef = useRef(null);
  const [contentReady, setContentReady] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Phase 1: Zoom animation (0 to 0.4 of scroll) - fills entire viewport
  const zoomProgress = useTransform(scrollYProgress, [0, 0.4], [0, 1]);
  const scale = useTransform(zoomProgress, [0, 1], [0.2, 1]);
  const borderRadius = useTransform(zoomProgress, [0, 1], [24, 0]);

  // Bidirectional content trigger — animate in AND out on scroll
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (v >= 0.35 && !contentReady) setContentReady(true);
    if (v < 0.28 && contentReady) setContentReady(false);
  });

  const stats = [
    { value: 'AI-first', label: 'Product direction', icon: TrendingUp },
    { value: 'Daily-use', label: 'Operating model', icon: Users },
    { value: 'One stack', label: 'Platform philosophy', icon: Sparkles }
  ];

  return (
    <div ref={containerRef} className="relative bg-black -mt-1" style={{ height: '200vh', position: 'relative' }}>
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            style={{ opacity: useTransform(scrollYProgress, [0, 0.3], [0.3, 0.1]) }}
            className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-600/30 to-purple-600/20 rounded-full blur-3xl"
          />
          <motion.div
            style={{ opacity: useTransform(scrollYProgress, [0, 0.3], [0.3, 0.1]) }}
            className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-purple-600/30 to-pink-600/20 rounded-full blur-3xl"
          />
        </div>

        {/* Zoom Box - Fills entire viewport */}
        <motion.div
          style={{ 
            scale,
            opacity: useTransform(zoomProgress, [0, 0.5], [0, 1]),
            borderRadius
          }}
          className="absolute inset-0"
        >
          {/* Main Content Box */}
          <div className="relative w-full h-full overflow-hidden bg-transparent border border-white/10 shadow-2xl">
            {/* Animated Warp Grid Background — blurs during zoom, sharpens when fully expanded */}
            <motion.div
              className="absolute inset-0 opacity-80"
              style={{ filter: useTransform(zoomProgress, [0, 0.85, 1], ['blur(6px)', 'blur(2px)', 'blur(0px)']) }}
            >
              <WarpGrid className="absolute inset-0" />
            </motion.div>

            {/* Content Container */}
            <div className="relative h-full flex items-center justify-center px-8 md:px-16 lg:px-24 py-12 md:py-16">
              {/* Content Grid */}
              <div className="relative grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center max-w-[1400px] w-full">
                {/* Left Column - Text Content */}
                <div className="space-y-6 md:space-y-8">
                  {/* Label */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={contentReady ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0, ease: [0.16, 1, 0.3, 1] }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-500/20"
                  >
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-semibold text-blue-400 uppercase tracking-wider">
                      Our Vision
                    </span>
                  </motion.div>

                  {/* Heading */}
                  <motion.h3
                    initial={{ opacity: 0, y: 40 }}
                    animate={contentReady ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight tracking-tight"
                  >
                    Transforming Work{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                      Together
                    </span>
                  </motion.h3>

                  {/* Paragraphs */}
                  <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={contentReady ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="text-base md:text-lg lg:text-xl text-gray-300 leading-relaxed font-light"
                  >
                    We believe daily work systems should empower teams, not burden them. That's why we built Talio to bring productivity visibility, coordination, and HR workflows into one operating layer.
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={contentReady ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="text-sm md:text-base lg:text-lg text-gray-400 leading-relaxed font-light"
                  >
                    From intelligent scheduling to real-time analytics, every feature is designed to help you focus on what matters most - your people and your mission.
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={contentReady ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="text-sm md:text-base lg:text-lg text-gray-400 leading-relaxed font-light"
                  >
                    Talio is built for organizations that want fewer tools, faster managers, and better day-to-day operational clarity.
                  </motion.p>

                  {/* CTA Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={contentReady ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <AnimatedButton label="Learn Our Story" size="md" />
                  </motion.div>
                </div>

                {/* Right Column - Stats Cards */}
                <div className="space-y-4 md:space-y-6">
                  {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, x: 50 }}
                        animate={contentReady ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.4 + index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                        className="relative group"
                      >
                        <div className="relative p-5 md:p-6 lg:p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-[1.02]">
                          {/* Icon */}
                          <div className="absolute top-5 md:top-6 right-5 md:right-6">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center">
                              <Icon className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                            </div>
                          </div>

                          {/* Value */}
                          <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 tracking-tight pr-14 md:pr-16">
                            {stat.value}
                          </div>

                          {/* Label */}
                          <div className="text-sm md:text-base lg:text-lg text-gray-400 font-light">
                            {stat.label}
                          </div>

                          {/* Hover Gradient */}
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-600/0 to-purple-600/0 group-hover:from-blue-600/5 group-hover:to-purple-600/5 transition-all duration-500 pointer-events-none" />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}