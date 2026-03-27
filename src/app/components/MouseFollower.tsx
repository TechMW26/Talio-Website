import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export function MouseFollower() {
  // Don't render on touch/mobile devices
  const isTouch = typeof window !== 'undefined' && !window.matchMedia('(pointer: fine)').matches;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Two spring configs — orb1 is faster, orb2 is lazier
  const orb1X = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const orb1Y = useSpring(mouseY, { stiffness: 50, damping: 20 });
  const orb2X = useSpring(mouseX, { stiffness: 30, damping: 25 });
  const orb2Y = useSpring(mouseY, { stiffness: 30, damping: 25 });

  useEffect(() => {
    if (isTouch) return;
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [mouseX, mouseY, isTouch]);

  if (isTouch) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <motion.div
        style={{ x: orb1X, y: orb1Y, translateX: -100, translateY: -100 }}
        className="absolute w-64 h-64 bg-gray-900 rounded-full blur-3xl opacity-5 will-change-transform"
      />
      <motion.div
        style={{ x: orb2X, y: orb2Y, translateX: 50, translateY: 50 }}
        className="absolute w-96 h-96 bg-gray-700 rounded-full blur-3xl opacity-5 will-change-transform"
      />
    </div>
  );
}
