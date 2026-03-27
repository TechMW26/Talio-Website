import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import React, { useState, useEffect, useRef } from 'react';
import { HoverRevealText } from '@/app/components/HoverRevealText';
import { SubtitleWithCursor } from '@/app/components/SubtitleWithCursor';

export function Hero() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const ref = useRef<HTMLElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Split text animation for each word
  const words = ["Manage Your Team", "Smarter with AI"];
  
  // State for looping disappear animation - seamless across all words
  const [disappearingIndex, setDisappearingIndex] = useState(-1);
  
  useEffect(() => {
    const totalChars = words.join('').length; // Total characters across all words
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      setDisappearingIndex(currentIndex);
      currentIndex = (currentIndex + 1) % (totalChars + 8); // +8 for pause between loops
      
      if (currentIndex >= totalChars) {
        setDisappearingIndex(-1); // Reset to show all chars during pause
      }
    }, 120); // Slightly faster for smoother effect
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={ref} className="relative min-h-[100vh] flex flex-col items-center justify-center overflow-hidden bg-black" style={{ position: 'relative' }}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <motion.div
          style={{
            x: mousePosition.x * 30,
            y: mousePosition.y * 30,
          }}
          className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] bg-gradient-to-br from-purple-500/20 via-blue-500/10 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          style={{
            x: mousePosition.x * -40,
            y: mousePosition.y * -40,
          }}
          className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-pink-500/15 via-purple-500/15 to-transparent rounded-full blur-3xl"
        />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.1] invert">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
            backgroundSize: '80px 80px'
          }} />
        </div>
      </div>

      <motion.div 
        style={{ y, scale }}
        className="relative max-w-[1600px] mx-auto px-6 md:px-8 lg:px-12 py-20 md:py-28 lg:py-36 z-10 w-full"
      >
        <div className="max-w-[95%] md:max-w-[90%] mx-auto text-center">
          {/* Floating Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12 flex justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-gray-900 to-gray-800 rounded-full border border-gray-700 shadow-lg shadow-purple-500/20 relative"
              style={{
                boxShadow: '0 0 20px rgba(168, 85, 247, 0.15), 0 0 40px rgba(59, 130, 246, 0.1)'
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
              />
              <span className="text-xs md:text-sm font-semibold tracking-wide text-gray-200">
                AI-Powered Workforce Management
              </span>
            </motion.div>
          </motion.div>

          {/* Main Headline - Massive & Split */}
          <div className="mb-10 flex flex-col items-center justify-center gap-2 md:gap-3 lg:gap-4">
            {words.map((word, wordIndex) => (
              <div key={wordIndex} className="w-full flex justify-center relative">
                <motion.h1
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 1.2,
                    delay: 0.3 + wordIndex * 0.15,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  className={`
                    text-[clamp(2.5rem,5.5vw,6rem)] font-bold tracking-tighter leading-[1.1] text-center
                    ${wordIndex === 0 ? 'text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-white z-10' : ''}
                    ${wordIndex === 1 ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 z-0' : ''}
                  `}
                >
                  {word}
                </motion.h1>
              </div>
            ))}
          </div>

          {/* Subheadline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl mx-auto text-center mb-16 px-4 flex justify-center"
          >
            <div className="text-base md:text-lg lg:text-xl xl:text-2xl font-light leading-relaxed tracking-tight text-gray-400">
              {"Talio revolutionizes workforce management with intelligent automation, real-time insights, and MIRA - your AI assistant that understands your business.".split(" ").map((word, i) => (
                <motion.span
                  key={i}
                  className="inline-block cursor-default mr-[0.25em]"
                  animate={{ color: "#9ca3af" }}
                  whileHover={{
                    color: "#ffffff",
                    textShadow: "0 0 1px #ffffff, 0 0 16px rgba(168, 85, 247, 0.5)"
                  }}
                  transition={{ duration: 0.15 }}
                >
                  {word}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6"
          >
          <MagneticButton>
            <Button className="bg-white text-black hover:bg-gray-200 px-8 md:px-12 py-6 md:py-8 text-base md:text-lg rounded-full group shadow-2xl shadow-white/20 hover:shadow-white/30 transition-all duration-500 relative overflow-hidden w-full sm:w-auto">
              <span className="relative z-10 flex items-center gap-2">
                Start Today
                <ArrowRight className="w-4 md:w-5 h-4 md:h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.5 }}
              />
            </Button>
          </MagneticButton>
          
          <MagneticButton>
            <Button 
              variant="outline" 
              className="px-8 md:px-12 py-6 md:py-8 text-base md:text-lg rounded-full border-2 border-gray-700 hover:border-white hover:bg-white transition-all duration-500 w-full sm:w-auto !text-black bg-white"
            >
              See Features
            </Button>
          </MagneticButton>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

// Magnetic Button Component
function MagneticButton({ children }: { children: React.ReactNode }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    setPosition({ x: x * 0.3, y: y * 0.3 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative"
    >
      <motion.div
        animate={{ x: position.x, y: position.y }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      >
        {children}
      </motion.div>
    </div>
  );
}