import { AnimatePresence, motion } from 'motion/react';

type PricingChangeConfettiProps = {
  triggerKey: number;
  colors?: string[];
  className?: string;
};

const PARTICLES = [
  { x: -54, y: -44, rotate: -42, size: 0.5, delay: 0 },
  { x: -32, y: -56, rotate: -74, size: 0.375, delay: 0.04 },
  { x: -12, y: -48, rotate: 34, size: 0.625, delay: 0.08 },
  { x: 14, y: -54, rotate: -28, size: 0.4375, delay: 0.12 },
  { x: 36, y: -46, rotate: 58, size: 0.5, delay: 0.06 },
  { x: 54, y: -32, rotate: 76, size: 0.375, delay: 0.1 },
  { x: -42, y: -18, rotate: 18, size: 0.4375, delay: 0.02 },
  { x: 42, y: -20, rotate: -18, size: 0.4375, delay: 0.14 },
  { x: -20, y: -68, rotate: 92, size: 0.3125, delay: 0.16 },
  { x: 24, y: -70, rotate: -96, size: 0.3125, delay: 0.18 },
];

const DEFAULT_COLORS = ['bg-white', 'bg-purple-400', 'bg-pink-400'];

export function PricingChangeConfetti({
  triggerKey,
  colors = DEFAULT_COLORS,
  className = '',
}: PricingChangeConfettiProps) {
  if (triggerKey === 0) {
    return null;
  }

  return (
    <AnimatePresence mode="sync">
      <motion.div
        key={triggerKey}
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      >
        {PARTICLES.map((particle, index) => {
          const colorClassName = colors[index % colors.length];
          const width = `${particle.size}rem`;
          const height = `${particle.size}rem`;

          return (
            <motion.span
              key={`${triggerKey}-${index}`}
              className={`absolute left-1/2 top-1/2 rounded-full ${colorClassName}`}
              style={{ width, height }}
              initial={{ x: 0, y: 8, scale: 0, opacity: 0 }}
              animate={{
                x: particle.x,
                y: particle.y,
                rotate: particle.rotate,
                scale: [0, 1, 0.75],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 0.95,
                delay: particle.delay,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          );
        })}
      </motion.div>
    </AnimatePresence>
  );
}