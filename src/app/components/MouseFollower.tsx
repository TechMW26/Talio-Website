import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export function MouseFollower() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Floating orbs that follow mouse */}
      <motion.div
        animate={{
          x: mousePosition.x - 100,
          y: mousePosition.y - 100,
        }}
        transition={{
          type: "spring",
          stiffness: 50,
          damping: 20,
        }}
        className="absolute w-64 h-64 bg-gray-900 rounded-full blur-3xl opacity-5"
      />
      <motion.div
        animate={{
          x: mousePosition.x + 50,
          y: mousePosition.y + 50,
        }}
        transition={{
          type: "spring",
          stiffness: 30,
          damping: 25,
        }}
        className="absolute w-96 h-96 bg-gray-700 rounded-full blur-3xl opacity-5"
      />
    </div>
  );
}
