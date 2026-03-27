import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX } from 'lucide-react';
import { useSound } from './SoundContext';

export function SoundDisclaimer() {
  const { dismissed, accept, decline } = useSound();

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
          style={{ backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', background: 'rgba(0,0,0,0.6)' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/[0.06]"
            style={{
              background: 'linear-gradient(145deg, rgba(20,20,28,0.97) 0%, rgba(12,12,18,0.98) 100%)',
              boxShadow: '0 50px 120px rgba(0,0,0,0.7), 0 0 80px rgba(139,92,246,0.08), inset 0 1px 0 rgba(255,255,255,0.04)',
            }}
          >
            {/* Glow accents */}
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-violet-500/15 blur-[60px] pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full bg-blue-500/10 blur-[50px] pointer-events-none" />

            {/* Animated sound wave ring */}
            <div className="flex justify-center pt-10 pb-2">
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-0 rounded-full border border-violet-400/30"
                  style={{ margin: '-14px' }}
                />
                <motion.div
                  animate={{ scale: [1, 1.25, 1], opacity: [0.2, 0, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="absolute inset-0 rounded-full border border-blue-400/20"
                  style={{ margin: '-8px' }}
                />
                <div
                  className="relative w-16 h-16 rounded-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(59,130,246,0.15))',
                    boxShadow: '0 0 30px rgba(139,92,246,0.15), inset 0 1px 0 rgba(255,255,255,0.06)',
                  }}
                >
                  <Volume2 className="w-7 h-7 text-violet-300" strokeWidth={1.8} />
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="px-8 pt-5 pb-2 text-center">
              <h3 className="text-xl font-bold text-white tracking-tight mb-3">
                Immersive Sound Effects
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                This website uses subtle sound effects to enhance your
                browsing experience. You can always change this later.
              </p>
            </div>

            {/* Buttons */}
            <div className="px-8 pt-6 pb-8 flex flex-col gap-3">
              {/* Primary: Awesome */}
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 8px 40px rgba(139,92,246,0.3), 0 0 20px rgba(139,92,246,0.15)' }}
                whileTap={{ scale: 0.98 }}
                onClick={accept}
                className="relative w-full py-3.5 rounded-2xl font-semibold text-sm text-white overflow-hidden cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed, #6366f1, #3b82f6)',
                  boxShadow: '0 4px 24px rgba(139,92,246,0.25), inset 0 1px 0 rgba(255,255,255,0.12)',
                }}
              >
                {/* Shimmer */}
                <div
                  className="absolute inset-0 opacity-30 pointer-events-none"
                  style={{
                    background: 'linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
                    backgroundSize: '250% 100%',
                    animation: 'shimmer-slide 3s ease-in-out infinite',
                  }}
                />
                <span className="relative flex items-center justify-center gap-2">
                  <Volume2 className="w-4 h-4" />
                  Awesome!
                </span>
              </motion.button>

              <style>{`
                @keyframes shimmer-slide {
                  0% { background-position: 200% 0; }
                  100% { background-position: -200% 0; }
                }
              `}</style>

              {/* Secondary: Continue Without Effects */}
              <motion.button
                whileHover={{ scale: 1.01, backgroundColor: 'rgba(255,255,255,0.06)' }}
                whileTap={{ scale: 0.98 }}
                onClick={decline}
                className="w-full py-3 rounded-2xl font-medium text-sm text-zinc-500 hover:text-zinc-300 transition-colors border border-white/[0.04] cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.02)' }}
              >
                <span className="flex items-center justify-center gap-2">
                  <VolumeX className="w-4 h-4" />
                  Continue Without Effects
                </span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
