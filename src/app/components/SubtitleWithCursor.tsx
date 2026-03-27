import { motion } from 'motion/react';
import { useState, useRef, useEffect } from 'react';

interface SubtitleWithCursorProps {
  text: string;
  className?: string;
}

export function SubtitleWithCursor({ text, className = '' }: SubtitleWithCursorProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const chars = text.split('');

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Calculate distance from mouse to each character
  const getCharProps = (index: number) => {
    if (!containerRef.current || !isHovering) {
      return { scale: 1, opacity: 0.6, color: 'rgb(156, 163, 175)', fontWeight: 300 };
    }

    const charElements = containerRef.current.querySelectorAll('.char-element');
    const charElement = charElements[index] as HTMLElement;
    
    if (!charElement) {
      return { scale: 1, opacity: 0.6, color: 'rgb(156, 163, 175)', fontWeight: 300 };
    }

    const rect = charElement.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    
    const charCenterX = rect.left + rect.width / 2 - containerRect.left;
    const charCenterY = rect.top + rect.height / 2 - containerRect.top;
    
    const distance = Math.sqrt(
      Math.pow(mousePosition.x - charCenterX, 2) + 
      Math.pow(mousePosition.y - charCenterY, 2)
    );

    // Proximity effect - scale and bold on hover
    const maxDistance = 120;
    const proximity = Math.max(0, 1 - distance / maxDistance);
    
    const scale = 1 + proximity * 0.08; // Slight scale increase: up to 1.08x when close
    const opacity = 0.6 + proximity * 0.4; // Opacity from 0.6 to 1
    const fontWeight = 300 + proximity * 400; // Font weight from 300 to 700 (bold)
    
    // Subtle color transition from gray to black
    const grayValue = Math.round(156 - proximity * 156);
    const color = `rgb(${grayValue}, ${grayValue}, ${grayValue})`;
    
    return { scale, opacity, color, fontWeight };
  };

  return (
    <div 
      ref={containerRef} 
      className={`relative inline-block ${className}`}
      style={{ cursor: 'none', position: 'relative' }}
    >
      {/* Custom Enlarged Cursor - Minimal */}
      {isHovering && (
        <motion.div
          className="pointer-events-none fixed z-50"
          animate={{
            x: mousePosition.x - 8,
            y: mousePosition.y - 8,
          }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 400,
            mass: 0.3
          }}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
          }}
        >
          <div className="w-4 h-4 rounded-full border border-black/40 bg-black/5" />
        </motion.div>
      )}

      {/* Text Characters */}
      <div className="inline-flex flex-wrap justify-center">
        {chars.map((char, index) => {
          const props = getCharProps(index);
          
          return (
            <motion.span
              key={index}
              className="char-element relative inline-block"
              animate={{
                scale: props.scale,
                opacity: props.opacity,
                color: props.color,
                fontWeight: props.fontWeight,
              }}
              transition={{
                duration: 0.3,
                ease: "easeOut"
              }}
              style={{ 
                display: char === ' ' ? 'inline' : 'inline-block',
                minWidth: char === ' ' ? '0.3em' : 'auto',
              }}
            >
              {char}
            </motion.span>
          );
        })}
      </div>
    </div>
  );
}