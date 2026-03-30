import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

type MobileTone = 'blue' | 'violet' | 'emerald' | 'amber' | 'slate';

function cx(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(' ');
}

const labelTones: Record<MobileTone, string> = {
  blue: 'border-sky-400/20 bg-sky-400/10 text-sky-200',
  violet: 'border-violet-400/20 bg-violet-400/10 text-violet-200',
  emerald: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200',
  amber: 'border-amber-300/20 bg-amber-300/10 text-amber-100',
  slate: 'border-white/10 bg-white/5 text-gray-200',
};

const stageTones: Record<MobileTone, { shell: string; glowA: string; glowB: string }> = {
  blue: {
    shell: 'border-sky-500/20 bg-gradient-to-br from-[#0b1325] via-[#0d162d] to-[#140d23]',
    glowA: 'bg-sky-500/18',
    glowB: 'bg-violet-500/12',
  },
  violet: {
    shell: 'border-violet-500/20 bg-gradient-to-br from-[#130d24] via-[#18112e] to-[#091422]',
    glowA: 'bg-violet-500/18',
    glowB: 'bg-fuchsia-500/12',
  },
  emerald: {
    shell: 'border-emerald-500/20 bg-gradient-to-br from-[#08141a] via-[#0b1d22] to-[#0d1725]',
    glowA: 'bg-emerald-500/18',
    glowB: 'bg-cyan-500/12',
  },
  amber: {
    shell: 'border-amber-400/20 bg-gradient-to-br from-[#191105] via-[#151420] to-[#0c1621]',
    glowA: 'bg-amber-400/16',
    glowB: 'bg-orange-500/10',
  },
  slate: {
    shell: 'border-white/10 bg-gradient-to-br from-[#0a101d] via-[#0d1321] to-[#0a0f18]',
    glowA: 'bg-white/10',
    glowB: 'bg-slate-400/10',
  },
};

interface MobilePageShellProps {
  children: ReactNode;
  className?: string;
}

export function MobilePageShell({ children, className }: MobilePageShellProps) {
  return <div className={cx('min-h-screen bg-[#050816] text-white', className)}>{children}</div>;
}

interface MobileViewportProps {
  children: ReactNode;
  className?: string;
}

export function MobileViewport({ children, className }: MobileViewportProps) {
  return <div className={cx('mx-auto w-full max-w-[28rem] px-4 sm:px-5', className)}>{children}</div>;
}

interface MobileSectionProps {
  children: ReactNode;
  className?: string;
  compact?: boolean;
}

export function MobileSection({ children, className, compact = false }: MobileSectionProps) {
  return <section className={cx('relative overflow-hidden py-16 md:py-20', compact && 'py-12 md:py-16', className)}>{children}</section>;
}

interface MobileHeadingBlockProps {
  eyebrow: string;
  title: ReactNode;
  subtitle: string;
  tone?: MobileTone;
  centered?: boolean;
  className?: string;
}

export function MobileHeadingBlock({
  eyebrow,
  title,
  subtitle,
  tone = 'blue',
  centered = false,
  className,
}: MobileHeadingBlockProps) {
  return (
    <div className={cx('flex flex-col px-1', centered && 'items-center text-center', className)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className={cx(
          'inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em]',
          labelTones[tone],
        )}
      >
        {eyebrow}
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className={cx('mt-6 text-[2.35rem] font-bold leading-[0.98] tracking-[-0.04em] text-white', centered && 'text-center')}
      >
        {title}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className={cx('mt-5 max-w-xl text-sm leading-relaxed text-slate-400', centered && 'text-center')}
      >
        {subtitle}
      </motion.p>
    </div>
  );
}

interface MobileHeroStageProps {
  children: ReactNode;
  tone?: MobileTone;
  className?: string;
}

export function MobileHeroStage({ children, tone = 'blue', className }: MobileHeroStageProps) {
  const palette = stageTones[tone];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={cx(
        'relative overflow-hidden rounded-[32px] border p-4 shadow-[0_28px_90px_rgba(0,0,0,0.35)]',
        palette.shell,
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className={cx('absolute -left-10 top-0 h-28 w-28 rounded-full blur-3xl', palette.glowA)} />
        <div className={cx('absolute right-0 top-10 h-24 w-24 rounded-full blur-3xl', palette.glowB)} />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_45%,rgba(255,255,255,0.03))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_40%)]" />
      </div>
      <div className="relative">{children}</div>
    </motion.div>
  );
}

interface MobilePanelProps {
  children: ReactNode;
  className?: string;
}

export function MobilePanel({ children, className }: MobilePanelProps) {
  return (
    <div
      className={cx(
        'rounded-[28px] border border-white/10 bg-white/[0.04] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-sm',
        className,
      )}
    >
      {children}
    </div>
  );
}

interface MobileMetricBadgeProps {
  value: string;
  label: string;
  tone?: MobileTone;
}

export function MobileMetricBadge({ value, label, tone = 'slate' }: MobileMetricBadgeProps) {
  return (
    <div className={cx('rounded-2xl border px-3 py-2', labelTones[tone])}>
      <span className="block text-sm font-semibold text-white">{value}</span>
      <span className="mt-0.5 block text-[10px] uppercase tracking-[0.16em] text-slate-300">{label}</span>
    </div>
  );
}

interface MobileLinkProps {
  to: string;
  children: ReactNode;
  className?: string;
}

export function MobilePrimaryLink({ to, children, className }: MobileLinkProps) {
  return (
    <Link
      to={to}
      className={cx(
        'inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-sm font-semibold text-black transition hover:bg-slate-100',
        className,
      )}
    >
      <span>{children}</span>
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

export function MobileSecondaryLink({ to, children, className }: MobileLinkProps) {
  return (
    <Link
      to={to}
      className={cx(
        'inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-6 py-4 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.08]',
        className,
      )}
    >
      <span>{children}</span>
    </Link>
  );
}