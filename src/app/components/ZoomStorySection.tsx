import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { ArrowRight, Sparkles, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

export function ZoomStorySection() {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Phase 1: Zoom animation (0 to 0.3 of scroll) - now fills entire viewport
  const zoomProgress = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const scale = useTransform(zoomProgress, [0, 1], [0.2, 1]);
  const borderRadius = useTransform(zoomProgress, [0, 1], [24, 0]);
  
  // Phase 2: Content reveal (0.3 to 1 of scroll)
  const contentProgress = useTransform(scrollYProgress, [0.3, 0.4, 0.6, 0.8], [0, 1, 1, 1]);
  const labelOpacity = useTransform(scrollYProgress, [0.3, 0.45], [0, 1]);
  const labelY = useTransform(scrollYProgress, [0.3, 0.45], [30, 0]);
  
  const headingOpacity = useTransform(scrollYProgress, [0.35, 0.5], [0, 1]);
  const headingY = useTransform(scrollYProgress, [0.35, 0.5], [40, 0]);
  
  const paragraph1Opacity = useTransform(scrollYProgress, [0.4, 0.55], [0, 1]);
  const paragraph1Y = useTransform(scrollYProgress, [0.4, 0.55], [30, 0]);
  
  const paragraph2Opacity = useTransform(scrollYProgress, [0.45, 0.6], [0, 1]);
  const paragraph2Y = useTransform(scrollYProgress, [0.45, 0.6], [30, 0]);
  
  const paragraph3Opacity = useTransform(scrollYProgress, [0.5, 0.65], [0, 1]);
  const paragraph3Y = useTransform(scrollYProgress, [0.5, 0.65], [30, 0]);
  
  const buttonOpacity = useTransform(scrollYProgress, [0.55, 0.7], [0, 1]);
  const buttonY = useTransform(scrollYProgress, [0.55, 0.7], [30, 0]);
  
  const stat1Opacity = useTransform(scrollYProgress, [0.45, 0.6], [0, 1]);
  const stat1X = useTransform(scrollYProgress, [0.45, 0.6], [50, 0]);
  
  const stat2Opacity = useTransform(scrollYProgress, [0.5, 0.65], [0, 1]);
  const stat2X = useTransform(scrollYProgress, [0.5, 0.65], [50, 0]);
  
  const stat3Opacity = useTransform(scrollYProgress, [0.55, 0.7], [0, 1]);
  const stat3X = useTransform(scrollYProgress, [0.55, 0.7], [50, 0]);

  const stats = [
    { value: '500+', label: 'Enterprise Signups', icon: TrendingUp, opacity: stat1Opacity, x: stat1X },
    { value: '50K+', label: 'Active Users', icon: Users, opacity: stat2Opacity, x: stat2X },
    { value: '15+', label: 'Years of Legacy', icon: Sparkles, opacity: stat3Opacity, x: stat3X }
  ];

  return (
    <div ref={containerRef} className="relative bg-gradient-to-br from-gray-900 via-gray-950 to-blue-950/30 -mt-1" style={{ height: '400vh', position: 'relative' }}>
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
          <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-gray-900/95 to-gray-950/95 backdrop-blur-xl border border-white/10 shadow-2xl">
            {/* Checkered Grid Background - More Prominent */}
            <div className="absolute inset-0 opacity-[0.15]">
              <div className="absolute inset-0" style={{
                backgroundImage: `linear-gradient(to right, #fff 2px, transparent 2px), linear-gradient(to bottom, #fff 2px, transparent 2px)`,
                backgroundSize: '60px 60px'
              }} />
            </div>

            {/* Content Container */}
            <div className="relative h-full flex items-center justify-center px-8 md:px-16 lg:px-24 py-12 md:py-16">
              {/* Content Grid */}
              <div className="relative grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center max-w-[1400px] w-full">
                {/* Left Column - Text Content */}
                <div className="space-y-6 md:space-y-8">
                  {/* Label */}
                  <motion.div
                    style={{ opacity: labelOpacity, y: labelY }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-500/20"
                  >
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-semibold text-blue-400 uppercase tracking-wider">
                      Our Vision
                    </span>
                  </motion.div>

                  {/* Heading */}
                  <motion.h3
                    style={{ opacity: headingOpacity, y: headingY }}
                    className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight tracking-tight"
                  >
                    Transforming Work{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                      Together
                    </span>
                  </motion.h3>

                  {/* Paragraphs */}
                  <motion.p
                    style={{ opacity: paragraph1Opacity, y: paragraph1Y }}
                    className="text-base md:text-lg lg:text-xl text-gray-300 leading-relaxed font-light"
                  >
                    We believe that workforce management should empower teams, not burden them. That's why we built Talio - to make managing your team effortless.
                  </motion.p>

                  <motion.p
                    style={{ opacity: paragraph2Opacity, y: paragraph2Y }}
                    className="text-sm md:text-base lg:text-lg text-gray-400 leading-relaxed font-light"
                  >
                    From intelligent scheduling to real-time analytics, every feature is designed to help you focus on what matters most - your people and your mission.
                  </motion.p>

                  <motion.p
                    style={{ opacity: paragraph3Opacity, y: paragraph3Y }}
                    className="text-sm md:text-base lg:text-lg text-gray-400 leading-relaxed font-light"
                  >
                    Join thousands of organizations who trust Talio to streamline their operations and unlock their team's full potential.
                  </motion.p>

                  {/* CTA Button */}
                  <motion.div style={{ opacity: buttonOpacity, y: buttonY }}>
                    <Button className="bg-white text-black hover:bg-gray-200 px-6 md:px-8 py-5 md:py-6 text-base md:text-lg rounded-full group shadow-xl transition-all duration-300">
                      <span className="flex items-center gap-2">
                        Learn Our Story
                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Button>
                  </motion.div>
                </div>

                {/* Right Column - Stats Cards */}
                <div className="space-y-4 md:space-y-6">
                  {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <motion.div
                        key={stat.label}
                        style={{ opacity: stat.opacity, x: stat.x }}
                        className="relative group"
                      >
                        <div className="relative p-5 md:p-6 lg:p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-[1.02]">
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