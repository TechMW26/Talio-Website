import { motion } from 'motion/react';

type BillingMode = 'monthly' | 'annual';

type PricingBillingToggleProps = {
  billing: BillingMode;
  onChange: (nextBilling: BillingMode) => void;
  layoutId: string;
  className?: string;
};

export function PricingBillingToggle({
  billing,
  onChange,
  layoutId,
  className = '',
}: PricingBillingToggleProps) {
  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div
        role="group"
        aria-label="Billing frequency"
        className="inline-grid w-full max-w-[22rem] grid-cols-2 rounded-full border border-white/10 bg-white/[0.03] p-1 shadow-[0_1rem_2.5rem_-1.75rem_rgba(0,0,0,0.85)]"
      >
        {(['monthly', 'annual'] as BillingMode[]).map((option) => {
          const isActive = billing === option;

          return (
            <button
              key={option}
              type="button"
              aria-pressed={isActive}
              onClick={() => onChange(option)}
              className={`relative rounded-full px-6 py-3 text-sm font-medium transition-colors duration-300 ${
                isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId={layoutId}
                  className="absolute inset-0 rounded-full border border-white/8 bg-[#20283d] shadow-[0_0.625rem_1.875rem_rgba(96,165,250,0.14)]"
                  transition={{ type: 'spring', stiffness: 420, damping: 34, mass: 0.8 }}
                />
              )}

              <span className="relative z-10 capitalize">{option}</span>
            </button>
          );
        })}
      </div>

      <motion.div
        animate={{
          opacity: billing === 'annual' ? 1 : 0.72,
          scale: billing === 'annual' ? 1 : 0.98,
        }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className={`rounded-full border px-4 py-1.5 text-center text-xs font-semibold uppercase tracking-[0.16em] ${
          billing === 'annual'
            ? 'border-green-500/30 bg-green-500/12 text-green-400'
            : 'border-white/10 bg-white/[0.03] text-gray-500'
        }`}
      >
        20% off with annual billing
      </motion.div>
    </div>
  );
}