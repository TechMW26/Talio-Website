import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { Clock, Users, BarChart3, Shield, Zap, Globe } from 'lucide-react';

export function Features() {
  const targetRef = useRef<HTMLDivElement>(null);
  
  // Scroll progress for horizontal card movement
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Separate scroll progress for background color - triggers when section enters viewport
  const { scrollYProgress: backgroundProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"]
  });

  // Map vertical scroll to horizontal movement
  // We start at 1% and move to -75% to reveal all cards in the row
  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-75%"]);

  // Background fade effect: fade in when section enters, stay black during card scroll, fade out when cards finish
  const backgroundOpacity = useTransform(
    backgroundProgress,
    [0, 0.15, 0.75, 0.9],
    [0, 1, 1, 0]
  );

  // Text color transitions synchronized with background
  const labelColor = useTransform(
    backgroundProgress,
    [0, 0.15, 0.75, 0.9],
    ['rgb(147, 51, 234)', 'rgb(192, 132, 252)', 'rgb(192, 132, 252)', 'rgb(147, 51, 234)']
  );

  const headingColor = useTransform(
    backgroundProgress,
    [0, 0.15, 0.75, 0.9],
    ['rgb(0, 0, 0)', 'rgb(255, 255, 255)', 'rgb(255, 255, 255)', 'rgb(0, 0, 0)']
  );

  const descriptionColor = useTransform(
    backgroundProgress,
    [0, 0.15, 0.75, 0.9],
    ['rgb(107, 114, 128)', 'rgb(209, 213, 219)', 'rgb(209, 213, 219)', 'rgb(107, 114, 128)']
  );

  const features = [
    {
      icon: Clock,
      title: "Time Tracking",
      description: "Automatic time tracking with intelligent insights.",
      color: "from-purple-500 to-pink-500",
      image: "https://images.unsplash.com/photo-1661626753732-f9f5dfd1fc16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aW1lJTIwbWFuYWdlbWVudCUyMGNsb2NrfGVufDF8fHx8MTc2ODkwNDQ2NHww&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      icon: Users,
      title: "Team Management",
      description: "Seamless collaboration tools for teams.",
      color: "from-blue-500 to-cyan-500",
      image: "https://images.unsplash.com/photo-1758518729685-f88df7890776?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjB0ZWFtJTIwY29sbGFib3JhdGlvbnxlbnwxfHx8fDE3Njg4NzA1ODN8MA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      icon: BarChart3,
      title: "Analytics",
      description: "Deep insights into team performance.",
      color: "from-green-500 to-emerald-500",
      image: "https://images.unsplash.com/photo-1608222351212-18fe0ec7b13b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGFuYWx5dGljcyUyMGRhc2hib2FyZHxlbnwxfHx8fDE3Njg4ODY5MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      icon: Shield,
      title: "Security",
      description: "Enterprise-grade security built-in.",
      color: "from-orange-500 to-red-500",
      image: "https://images.unsplash.com/photo-1696013910376-c56f76dd8178?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWN1cml0eSUyMHNoaWVsZCUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzY4OTA0NDY0fDA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      icon: Zap,
      title: "Automation",
      description: "Automate repetitive tasks effortlessly.",
      color: "from-yellow-500 to-orange-500",
      image: "https://images.unsplash.com/photo-1636887902905-b3b696d5afc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWdodG5pbmclMjBlbmVyZ3klMjBzcGVlZHxlbnwxfHx8fDE3Njg5MDQ0NjV8MA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      icon: Globe,
      title: "Global Access",
      description: "Work from anywhere in the world.",
      color: "from-indigo-500 to-purple-500",
      image: "https://images.unsplash.com/photo-1761292630740-d821dc203975?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnbG9iYWwlMjBuZXR3b3JrJTIwY29ubmVjdGlvbnxlbnwxfHx8fDE3Njg3OTk3MzN8MA&ixlib=rb-4.1.0&q=80&w=1080"
    }
  ];

  return (
    <section id="features" ref={targetRef} className="relative h-[300vh] bg-black transition-colors duration-500" style={{ position: 'relative' }}>
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
        
        {/* Animated Black Background Overlay */}
        <motion.div
          className="absolute inset-0 bg-black -z-20"
          style={{ opacity: backgroundOpacity }}
        />

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-20 px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <motion.span
              className="text-sm font-semibold uppercase tracking-widest mb-10 text-center"
              style={{
                color: labelColor
              }}
            >
              Features
            </motion.span>
            <motion.h2
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-10 leading-[1.05] text-center"
              style={{
                color: headingColor
              }}
            >
              Powerful Capabilities
            </motion.h2>
            <motion.p
              className="text-lg md:text-xl font-light leading-relaxed max-w-2xl text-center"
              style={{
                color: descriptionColor
              }}
            >
              Scroll to explore what makes Talio different.
            </motion.p>
          </motion.div>
        </div>

        {/* Horizontal Scroll Track */}
        <div className="w-full relative z-10">
          <motion.div 
            style={{ x }} 
            className="flex gap-8 px-8 md:px-20 w-max"
          >
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} />
            ))}
          </motion.div>
        </div>

        {/* Decorative Background */}
        <motion.div
          className="absolute inset-0 pointer-events-none -z-10"
          style={{ opacity: backgroundOpacity }}
        >
          <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl" />
        </motion.div>
      </div>
    </section>
  );
}

function FeatureCard({ feature }: { feature: any }) {
  const Icon = feature.icon;

  return (
    <div
      className="relative w-[350px] md:w-[450px] h-[420px] rounded-[2.5rem] overflow-hidden group shrink-0"
    >
      {/* Full Image Background */}
      <img 
        src={feature.image} 
        alt={feature.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
      />
      
      {/* Dark Gradient Overlay for Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-90" />
      
      {/* Glassmorphic Top Badge */}
      <div className="absolute top-6 left-6 z-10">
        <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
          <span className="text-xs font-semibold text-white tracking-wider uppercase">
            Feature
          </span>
        </div>
      </div>

      {/* Content Section - Fully Contained */}
      <div className="absolute bottom-0 left-0 right-0 p-10 z-10">
        <div className="relative">
          <h3 className="text-4xl font-bold text-white mb-4 tracking-tight leading-none">
            {feature.title}
          </h3>
          
          <p className="text-lg text-gray-200 leading-relaxed font-light mb-8 max-w-sm">
            {feature.description}
          </p>

          <div className="flex items-center gap-3 text-white font-semibold text-sm group/btn cursor-pointer">
            <span className="border-b border-transparent group-hover/btn:border-white transition-colors duration-300">
              Explore More
            </span>
            <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center group-hover/btn:bg-white group-hover/btn:text-black transition-all duration-300">
              <svg 
                width="14" 
                height="14" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="transition-transform group-hover/btn:translate-x-0.5"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}