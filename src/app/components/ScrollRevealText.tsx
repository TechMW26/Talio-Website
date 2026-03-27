import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

interface ScrollRevealTextProps {
  children: string;
  className?: string;
}

export function ScrollRevealText({ children, className = '' }: ScrollRevealTextProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "start 0.5"]
  });

  const words = children.split(' ');

  return (
    <p ref={ref} className={`relative ${className}`}>
      {words.map((word, index) => {
        const start = index / words.length;
        const end = start + (1 / words.length);
        
        return (
          <Word key={index} progress={scrollYProgress} range={[start, end]}>
            {word}
          </Word>
        );
      })}
    </p>
  );
}

function Word({ children, progress, range }: any) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  const color = useTransform(
    progress,
    range,
    ["rgba(115, 115, 115, 1)", "rgba(255, 255, 255, 1)"]
  );

  return (
    <span className="relative inline-block mr-[0.25em]">
      <motion.span
        style={{ opacity, color }}
        className="inline-block"
      >
        {children}
      </motion.span>
    </span>
  );
}

interface ScrollRevealHeadingProps {
  children: string;
  className?: string;
}

export function ScrollRevealHeading({ children, className = '' }: ScrollRevealHeadingProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "start 0.4"]
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0.3, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.98, 1]);

  return (
    <motion.h2
      ref={ref}
      style={{ opacity, scale }}
      className={`relative ${className}`}
    >
      {children}
    </motion.h2>
  );
}