'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface Burst {
  id: number;
  x: number;
  y: number;
  /** Rays get random angles so no two bursts are identical. */
  rays: { angle: number; length: number; delay: number }[];
}

let counter = 0;

/**
 * A facet burst wherever the visitor clicks — eight rays of light and an
 * expanding ring, gone in under a second.
 *
 * Listens on the document rather than wrapping anything, so it costs nothing at
 * the component level and works over any element. Bursts are capped at three
 * concurrent so a rapid clicker cannot flood the DOM.
 */
export default function ClickSparkle() {
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const onDown = (e: PointerEvent) => {
      // Skip text selection drags and anything inside a scrollable control,
      // where a burst reads as an error rather than a flourish.
      if (e.button !== 0) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;

      const id = ++counter;
      const rays = Array.from({ length: 8 }, (_, i) => ({
        angle: i * 45 + (Math.random() - 0.5) * 22,
        length: 14 + Math.random() * 20,
        delay: Math.random() * 0.05,
      }));

      setBursts((prev) => [...prev.slice(-2), { id, x: e.clientX, y: e.clientY, rays }]);
      window.setTimeout(() => {
        setBursts((prev) => prev.filter((b) => b.id !== id));
      }, 900);
    };

    window.addEventListener('pointerdown', onDown);
    return () => window.removeEventListener('pointerdown', onDown);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[148]">
      <AnimatePresence>
        {bursts.map((burst) => (
          <motion.div
            key={burst.id}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute"
            style={{ left: burst.x, top: burst.y }}
          >
            {/* Expanding ring */}
            <motion.span
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 2.6, opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold-300/70"
            />
            {/* Core flash */}
            <motion.span
              initial={{ scale: 0.2, opacity: 1 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-gold-100 shadow-[0_0_14px_4px_rgb(var(--gold-300)/0.8)]"
            />
            {/* Rays */}
            {burst.rays.map((ray, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0.9, scaleY: 0.2 }}
                animate={{ opacity: 0, scaleY: 1 }}
                transition={{ duration: 0.55, delay: ray.delay, ease: [0.22, 1, 0.36, 1] }}
                className="absolute left-0 top-0 w-px origin-top bg-gradient-to-b from-gold-200 to-transparent"
                style={{
                  height: ray.length,
                  rotate: `${ray.angle}deg`,
                }}
              />
            ))}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
