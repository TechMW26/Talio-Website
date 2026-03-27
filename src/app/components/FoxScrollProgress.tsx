import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import foxMascot from '@/assets/6966dd6bb9e98b4e32d6852e29b51847da2ba9cd.png';

export function FoxScrollProgress() {
  const { scrollYProgress } = useScroll();
  
  // Transform scroll progress to fox position (appears when scrolling)
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0.5, 1, 1, 0.5]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  
  return (
    <motion.div
      style={{ opacity, scale }}
      className="fixed bottom-8 right-8 z-50 pointer-events-none"
    >
      <div className="relative">
        {/* Circular Progress Ring */}
        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
          {/* Background Circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="rgba(109, 189, 187, 0.2)"
            strokeWidth="4"
            fill="none"
          />
          {/* Progress Circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            stroke="url(#foxGradient)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            style={{
              pathLength: scrollYProgress,
            }}
            strokeDasharray="283"
            strokeDashoffset="0"
          />
          <defs>
            <linearGradient id="foxGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6DBDBB" />
              <stop offset="100%" stopColor="#4FD1C5" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Fox in Center */}
        <motion.div
          style={{ rotate }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <motion.img
            src={foxMascot}
            alt="Scroll Progress"
            className="w-12 h-12 object-contain"
            animate={{
              y: [0, -3, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
        
        {/* Glow Effect */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-gradient-to-br from-teal-300/30 to-cyan-300/30 rounded-full blur-xl -z-10"
        />
      </div>
    </motion.div>
  );
}
