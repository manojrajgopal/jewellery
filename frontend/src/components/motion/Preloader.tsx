'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * First-visit curtain: the AURUM monogram draws itself in gold, a progress
 * hairline fills, then two panels part vertically to reveal the page.
 * Shown once per tab session so internal navigation stays instant.
 */
export default function Preloader() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem('aurum-intro') === '1';
    } catch {
      seen = false;
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (seen || reduced) return;

    setVisible(true);
    document.body.style.overflow = 'hidden';

    let frame = 0;
    let raf = 0;
    const tick = () => {
      frame += 1;
      // Ease toward 100 over roughly 2s, never stalling at a round number.
      setProgress((p) => Math.min(100, p + Math.max(0.6, (100 - p) * 0.035)));
      if (frame < 200) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const done = window.setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = '';
      try {
        sessionStorage.setItem('aurum-intro', '1');
      } catch {
        /* session storage unavailable — the intro simply replays */
      }
    }, 2400);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(done);
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[200] flex items-center justify-center"
          exit={{ pointerEvents: 'none' }}
        >
          {/* Parting panels */}
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 bg-canvas"
            exit={{ y: '-100%' }}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/2 bg-canvas"
            exit={{ y: '100%' }}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
          />

          {/* Seam glow */}
          <motion.div
            className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-gold-400 to-transparent"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />

          <motion.div
            className="relative z-10 flex flex-col items-center"
            exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.4 } }}
          >
            {/* Monogram — stroke draws, then fills */}
            <svg width="132" height="132" viewBox="0 0 100 100" className="mb-8" aria-hidden="true">
              <defs>
                <linearGradient id="aurum-intro-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgb(var(--gold-200))" />
                  <stop offset="50%" stopColor="rgb(var(--gold-500))" />
                  <stop offset="100%" stopColor="rgb(var(--gold-700))" />
                </linearGradient>
              </defs>
              {/* Diamond outline */}
              <motion.path
                d="M50 8 L88 42 L50 92 L12 42 Z"
                fill="none"
                stroke="url(#aurum-intro-gold)"
                strokeWidth="1.5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              />
              {/* Facets */}
              <motion.path
                d="M12 42 H88 M50 8 L32 42 L50 92 M50 8 L68 42 L50 92"
                fill="none"
                stroke="url(#aurum-intro-gold)"
                strokeWidth="0.8"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.65 }}
                transition={{ duration: 1.3, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
            </svg>

            <motion.span
              initial={{ opacity: 0, letterSpacing: '0.9em' }}
              animate={{ opacity: 1, letterSpacing: '0.42em' }}
              transition={{ duration: 1.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="font-accent text-2xl uppercase text-gradient-static pl-[0.42em]"
            >
              Aurum
            </motion.span>

            {/* Progress hairline */}
            <div className="mt-8 h-px w-44 overflow-hidden bg-line">
              <motion.div
                className="h-full origin-left bg-gradient-to-r from-gold-700 via-gold-300 to-gold-500"
                style={{ scaleX: progress / 100 }}
              />
            </div>
            <span className="mt-3 font-sans text-[10px] uppercase tracking-luxer text-faint tabular-nums">
              {Math.round(progress)}%
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
