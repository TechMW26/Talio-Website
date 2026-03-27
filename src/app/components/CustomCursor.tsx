import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isDarkBackground, setIsDarkBackground] = useState(false);
  const [mouseSpeed, setMouseSpeed] = useState(0);
  const [cursorScale, setCursorScale] = useState(1);
  const lastPositionRef = useRef({ x: 0, y: 0 });
  const lastTimeRef = useRef(Date.now());

  useEffect(() => {
    const checkBackgroundColor = (element: HTMLElement | null) => {
      if (!element) return false;
      
      let currentEl: HTMLElement | null = element;
      while (currentEl) {
        const style = window.getComputedStyle(currentEl);
        const bgColor = style.backgroundColor;
        
        // Parse RGB/RGBA
        const match = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (match) {
          const [_, r, g, b] = match.map(Number);
          const alpha = parseFloat(style.backgroundColor.split(',')[3]) || 1;
          
          // If purely transparent, keep going up
          if (alpha === 0 || bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent') {
            currentEl = currentEl.parentElement;
            continue;
          }

          // Calculate brightness (YIQ formula)
          const brightness = (r * 299 + g * 587 + b * 114) / 1000;
          return brightness < 128;
        }
        
        // If we hit document/body and no color found, assume light unless dark mode class
        if (currentEl === document.body || currentEl === document.documentElement) {
            return document.documentElement.classList.contains('dark');
        }
        
        currentEl = currentEl.parentElement;
      }
      return false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const currentTime = Date.now();
      const timeDelta = currentTime - lastTimeRef.current;
      
      if (timeDelta > 0) {
        // Calculate distance moved
        const dx = e.clientX - lastPositionRef.current.x;
        const dy = e.clientY - lastPositionRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Calculate speed (pixels per millisecond)
        const speed = distance / timeDelta;
        
        // Update speed state
        setMouseSpeed(speed);
        
        // Calculate cursor scale based on speed (macOS effect)
        // Speed threshold: 0.5 px/ms = slow, 2+ px/ms = fast
        const speedScale = Math.min(1 + (speed * 1.2), 4); // Max 4x scale, highly sensitive
        setCursorScale(speedScale);
      }
      
      setMousePosition({ x: e.clientX, y: e.clientY });
      lastPositionRef.current = { x: e.clientX, y: e.clientY };
      lastTimeRef.current = currentTime;
      
      if (!isVisible) setIsVisible(true);
      
      const target = e.target as HTMLElement;
      setIsDarkBackground(checkBackgroundColor(target));
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      const isButton = target.tagName === 'BUTTON' || target.closest('button');
      const isLink = target.tagName === 'A' || target.closest('a');
      const isInput = target.tagName === 'INPUT' || target.closest('input') || target.tagName === 'TEXTAREA';
      const isClickable = target.classList.contains('cursor-pointer') || window.getComputedStyle(target).cursor === 'pointer';
      
      if (isButton || isLink || isClickable) {
        setIsHovering(true);
        if (target.classList.contains('cursor-grab') || target.closest('.cursor-grab')) {
          setCursorText('DRAG');
        } else if (target.getAttribute('data-cursor')) {
          setCursorText(target.getAttribute('data-cursor') || '');
        } else {
          setCursorText('');
        }
      } else {
        setIsHovering(false);
        setCursorText('');
      }

      if (isInput) {
         setIsHovering(false);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    document.body.style.cursor = 'none';

    // Reset scale gradually when mouse stops moving
    const scaleResetInterval = setInterval(() => {
      setCursorScale((prev) => {
        if (prev > 1) {
          return Math.max(1, prev - 0.05); // Gradually return to normal
        }
        return 1;
      });
    }, 16); // ~60fps

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.body.style.cursor = 'auto';
      clearInterval(scaleResetInterval);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  // Adaptive bright colors based on background
  const cursorDotColor = isDarkBackground 
    ? 'bg-white' 
    : 'bg-white';
  
  const cursorRingColor = isDarkBackground
    ? 'border-white/60 bg-white/10'
    : 'border-white/60 bg-white/10';
  
  const cursorRingHoverColor = isDarkBackground
    ? 'border-white/70 bg-white/15'
    : 'border-white/70 bg-white/15';

  return (
    <>
      {/* Main Cursor Dot with Speed Scale */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99999]"
        animate={{
          x: mousePosition.x - 3,
          y: mousePosition.y - 3,
          scale: (isClicking ? 0.8 : 1) * cursorScale, // Apply speed scale
        }}
        transition={{ 
          type: "spring", 
          stiffness: 1000, 
          damping: 50, 
          mass: 0.1,
          scale: { type: "spring", stiffness: 400, damping: 30 } // Smooth scale transition
        }}
      >
        <div className={`
          w-1.5 h-1.5 rounded-full 
          ${cursorDotColor}
          shadow-[0_0_15px_rgba(255,255,255,0.5)]
          transition-all duration-150
        `} />
      </motion.div>

      {/* Interactive Ring with Speed Scale */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99998]"
        animate={{
          x: mousePosition.x - (isHovering ? 24 : 10),
          y: mousePosition.y - (isHovering ? 24 : 10),
          width: isHovering ? 48 : 20,
          height: isHovering ? 48 : 20,
          opacity: 1,
          scale: cursorScale, // Apply speed scale to ring
        }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 25, 
          mass: 0.4,
          scale: { type: "spring", stiffness: 400, damping: 30 } // Smooth scale transition
        }}
      >
        <div className={`
          w-full h-full rounded-full 
          border-[1.5px]
          flex items-center justify-center
          transition-all duration-200
          ${isHovering ? cursorRingHoverColor : cursorRingColor}
          backdrop-blur-[2px]
          shadow-[0_0_20px_rgba(255,255,255,0.3)]
        `}>
          <AnimatePresence>
            {isHovering && cursorText && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-[8px] font-bold tracking-widest uppercase text-white"
              >
                {cursorText}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}