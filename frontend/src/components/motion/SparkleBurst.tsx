'use client';

import { AnimatePresence, motion } from 'framer-motion';

interface SparkleBurstProps {
  /** Flip to true to fire the burst; reset to false to allow another. */
  active: boolean;
  count?: number;
  className?: string;
}

/**
 * A radial spray of four-point gold stars — fired on confirmations
 * (appointment booked, newsletter joined) instead of a plain alert.
 */
export default function SparkleBurst({ active, count = 18, className = '' }: SparkleBurstProps) {
  const shards = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2;
    // Deterministic spread — no Math.random, so SSR and client agree.
    const distance = 70 + ((i * 37) % 90);
    return {
      id: i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      scale: 0.5 + ((i * 13) % 60) / 100,
      delay: ((i * 7) % 20) / 100,
    };
  });

  return (
    <div className={`pointer-events-none absolute inset-0 z-30 flex items-center justify-center ${className}`}>
      <AnimatePresence>
        {active &&
          shards.map((s) => (
            <motion.span
              key={s.id}
              initial={{ opacity: 0, x: 0, y: 0, scale: 0, rotate: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
                x: s.x,
                y: s.y,
                scale: [0, s.scale, s.scale * 0.7, 0],
                rotate: 180,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, delay: s.delay, ease: [0.22, 1, 0.36, 1] }}
              className="absolute"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z"
                  fill="rgb(var(--gold-300))"
                />
              </svg>
            </motion.span>
          ))}
      </AnimatePresence>
    </div>
  );
}
