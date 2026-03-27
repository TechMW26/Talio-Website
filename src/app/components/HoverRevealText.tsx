import { motion } from 'motion/react';
import { useState, useRef, useEffect } from 'react';

interface HoverRevealTextProps {
  text: string;
  className?: string;
  enableCustomCursor?: boolean;
}

export function HoverRevealText({ text, className = '', enableCustomCursor = false }: HoverRevealTextProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (enableCustomCursor) {
      const currentRef = containerRef.current;
      if (currentRef) {
        const handleMouseMove = (e: MouseEvent) => {
          const rect = currentRef.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const cursor = document.getElementById('custom-cursor');
          if (cursor) {
            cursor.style.transform = `translate(${x}px, ${y}px)`;
          }
        };
        currentRef.addEventListener('mousemove', handleMouseMove);
      }
      return () => {
        if (currentRef) {
          currentRef.removeEventListener('mousemove', handleMouseMove);
        }
      };
    }
  }, [enableCustomCursor]);

  return (
    <div className={`inline-flex ${className}`} ref={containerRef} style={{ position: 'relative' }}>
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          className="relative inline-block cursor-default"
          style={{ 
            display: char === ' ' ? 'inline' : 'inline-block',
            minWidth: char === ' ' ? '0.3em' : 'auto'
          }}
        >
          {/* Hidden text that reveals on hover */}
          <motion.span
            initial={{ opacity: 0.3 }}
            animate={{
              opacity: hoveredIndex === index ? 1 : 0.3,
              color: hoveredIndex === index 
                ? 'rgb(0, 0, 0)' 
                : 'rgb(156, 163, 175)',
              scale: hoveredIndex === index ? 1.5 : 1,
              y: hoveredIndex === index ? -2 : 0,
              fontWeight: hoveredIndex === index ? 700 : 400,
            }}
            transition={{
              duration: 0.3,
              ease: [0.16, 1, 0.3, 1]
            }}
            className="relative z-10"
          >
            {char}
          </motion.span>
          
          {/* Glow effect on hover */}
          {hoveredIndex === index && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.6, scale: 1.5 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-md -z-10 rounded-full"
            />
          )}
        </motion.span>
      ))}
    </div>
  );
}