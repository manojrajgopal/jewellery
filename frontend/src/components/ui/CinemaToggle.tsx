'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Clapperboard, Film } from 'lucide-react';

import { useCinema } from '@/components/providers/CinemaProvider';

/**
 * Switches the projection layer on and off. Hidden entirely for reduced-motion
 * visitors — offering a control that is already refusing to do anything is
 * worse than not offering it.
 */
export default function CinemaToggle({ className = '' }: { className?: string }) {
  const { cinema, toggleCinema, mounted, reduced } = useCinema();

  if (!mounted || reduced) return null;

  return (
    <button
      onClick={toggleCinema}
      aria-label={cinema ? 'Turn off cinema mode' : 'Turn on cinema mode'}
      aria-pressed={cinema}
      title={cinema ? 'Cinema mode on' : 'Cinema mode off'}
      className={`group relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border transition-colors duration-300 ${
        cinema
          ? 'border-gold-500/50 text-accent'
          : 'border-hairline text-muted hover:border-gold-500/40 hover:text-accent'
      } ${className}`}
    >
      {/* Fill that sweeps in behind the icon when the mode is on */}
      <AnimatePresence>
        {cinema && (
          <motion.span
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0 }}
            transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
            className="absolute inset-0 origin-bottom bg-gold-500/12"
          />
        )}
      </AnimatePresence>

      {/* The icon crossfades and turns, so the state change is legible without
          reading the label. */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={cinema ? 'on' : 'off'}
          initial={{ opacity: 0, rotate: -35, scale: 0.7 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 35, scale: 0.7 }}
          transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          {cinema ? (
            <Clapperboard size={15} strokeWidth={1.7} />
          ) : (
            <Film size={15} strokeWidth={1.7} />
          )}
        </motion.span>
      </AnimatePresence>

      {/* Running indicator */}
      {cinema && (
        <motion.span
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute right-1 top-1 h-1 w-1 rounded-full bg-accent"
        />
      )}
    </button>
  );
}
