'use client';

import { AnimatePresence, motion } from 'framer-motion';

import { useCinema } from '@/components/providers/CinemaProvider';

/**
 * The projection layer: film grain, a soft vignette, faint scanlines and
 * letterbox bars. Everything here is decoration, so it is pointer-transparent
 * and aria-hidden, and it sits above the page but below the chrome.
 *
 * The strengths are CSS variables set by `data-cinema` (see globals.css), not
 * props — that is what lets the head script grade the very first paint. This
 * component only mounts and unmounts the layers.
 */
export default function FilmGrain() {
  const { cinema, mounted } = useCinema();

  // Before mount the attribute is already correct, so rendering nothing for one
  // frame is invisible; rendering the layers would risk a mismatch instead.
  if (!mounted) return null;

  return (
    <AnimatePresence>
      {cinema && (
        <motion.div
          key="projection"
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          // z-[140] — over the page and the route-transition panels, under the
          // custom cursor (150) and the intro curtain (200), so the grain never
          // sits on top of the pointer.
          className="pointer-events-none fixed inset-0 z-[140] overflow-hidden"
        >
          {/* Colour grade. A backdrop-filter here rather than a filter on the
              page wrapper: a filtered ancestor becomes the containing block for
              its fixed descendants, which would tear every modal rendered
              inside <main> off the viewport. */}
          <div className="cinema-grade absolute inset-0" />

          {/* Grain — one cached noise tile, jittered by transform */}
          <div className="film-grain absolute mix-blend-overlay" />

          {/* Scanlines */}
          <div className="scanlines absolute inset-0" />

          {/* A single bright line sweeping down the frame, the way a telecine
              scan does. Long period so it reads as an accident, not a loop. */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="animate-scanline absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-gold-100/[0.045] to-transparent" />
          </div>

          {/* Vignette */}
          <div className="vignette-cinema absolute inset-0" />

          {/* Letterbox bars. Height is a token so it can animate from zero when
              cinema mode is switched on. */}
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
            className="letterbox-bar absolute inset-x-0 top-0"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
            className="letterbox-bar absolute inset-x-0 bottom-0"
          />

          {/* Frame corners — the crop marks of a viewfinder */}
          {(
            [
              'left-4 top-8 border-l border-t',
              'right-4 top-8 border-r border-t',
              'bottom-8 left-4 border-b border-l',
              'bottom-8 right-4 border-b border-r',
            ] as const
          ).map((pos, i) => (
            <motion.span
              key={pos}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 0.3, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.06 }}
              className={`absolute hidden h-6 w-6 border-gold-300/70 md:block ${pos}`}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
