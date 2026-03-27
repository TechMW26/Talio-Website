import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface AnimatedButtonProps {
  label: string;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export function AnimatedButton({
  label,
  variant = 'primary',
  size = 'md',
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  icon,
  fullWidth = false,
}: AnimatedButtonProps) {
  const sizeClasses = {
    sm: 'px-8 py-3.5 text-sm',
    md: 'px-8 py-4 text-base',
    lg: 'px-8 md:px-12 py-6 md:py-8 text-base md:text-lg',
  };

  const isPrimary = variant === 'primary';

  return (
    <MagneticButton>
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`
          relative overflow-hidden rounded-full font-semibold
          shadow-xl transition-all duration-500 group
          disabled:opacity-70 disabled:cursor-not-allowed
          ${sizeClasses[size]}
          ${isPrimary
            ? 'bg-white text-black hover:shadow-2xl hover:shadow-white/20'
            : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:shadow-2xl hover:shadow-white/10'
          }
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          <span className="flex overflow-hidden">
            {label.split('').map((char, i) => (
              <span key={i} className="relative inline-flex flex-col h-[1.5em] overflow-hidden">
                <span
                  className="group-hover:-translate-y-full transition-transform duration-500 ease-[0.22,1,0.36,1]"
                  style={{ transitionDelay: `${i * 0.025}s` }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
                <span
                  className="absolute top-0 left-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.22,1,0.36,1]"
                  style={{ transitionDelay: `${i * 0.025}s` }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              </span>
            ))}
          </span>
          {icon || <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
        </span>
        <div
          className={`absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out ${isPrimary ? 'bg-gradient-to-r from-purple-600 to-blue-600' : 'bg-white'}`}
        />
        {/* For secondary: change text to dark when gradient slides in */}
        {!isPrimary && (
          <span className="absolute inset-0 z-10 flex items-center justify-center gap-2 text-black opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200 pointer-events-none">
            <span className="flex overflow-hidden">
              {label.split('').map((char, i) => (
                <span key={i} className="relative inline-flex flex-col h-[1.5em] overflow-hidden">
                  <span
                    className="translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.22,1,0.36,1]"
                    style={{ transitionDelay: `${i * 0.025}s` }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                </span>
              ))}
            </span>
            {icon || <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
          </span>
        )}
      </button>
    </MagneticButton>
  );
}

function MagneticButton({ children }: { children: React.ReactNode }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPosition({ x: x * 0.3, y: y * 0.3 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative"
    >
      <motion.div
        animate={{ x: position.x, y: position.y }}
        transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
