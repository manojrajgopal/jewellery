'use client';

import { ReactNode, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

interface CinematicLetterboxProps {
  children: ReactNode;
  /** Words on the title card. Kept short — it is a slate, not a paragraph. */
  slate?: string;
  /** Second line on the slate: a reel number, a date, a place. */
  slateNote?: string;
  className?: string;
  /** Height of the bars at full close, as a fraction of the scene. */
  barHeight?: number;
  /** Show the frame counter and reel marks in the corners. */
  hud?: boolean;
}

/**
 * Wraps a section so that scrolling into it feels like a cut to a different
 * format: bars close from both edges, a slate rises and lifts away, and the frame
 * inside desaturates and settles as though it were being projected.
 *
 * The bars are driven by scroll rather than by an entry trigger for one reason —
 * they have to *open again* on the way out. A section that stays letterboxed
 * after the visitor has left it makes every following section look cropped, which
 * is the single most common way this device is got wrong.
 *
 * Nothing here transforms the children's layout box: the bars are overlays and
 * the frame effect is a filter. That keeps sticky positioning, anchors and
 * focus scrolling inside the section working exactly as they did before it was
 * wrapped.
 */
export default function CinematicLetterbox({
  children,
  slate,
  slateNote,
  className = '',
  barHeight = 0.11,
  hud = true,
}: CinematicLetterboxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Closed across the middle of the pass, open at both ends.
  const bars = useTransform(scrollYProgress, [0, 0.18, 0.82, 1], [0, 1, 1, 0]);
  const barPx = useTransform(bars, (v) => `${v * barHeight * 100}%`);

  // The slate is a beat, not a state: it exists for a fifth of the pass.
  const slateOpacity = useTransform(scrollYProgress, [0.14, 0.24, 0.34, 0.44], [0, 1, 1, 0]);
  const slateY = useTransform(scrollYProgress, [0.14, 0.44], [24, -28]);
  const slateTrack = useTransform(scrollYProgress, [0.14, 0.44], ['0.5em', '0.26em']);

  // Grade: cool and flat on the way in, correct in the middle, flat again out.
  const grade = useTransform(
    scrollYProgress,
    [0, 0.2, 0.5, 0.8, 1],
    [
      'saturate(0.72) contrast(1.02) brightness(0.94)',
      'saturate(0.9) contrast(1.05) brightness(0.98)',
      'saturate(1.02) contrast(1.06) brightness(1)',
      'saturate(0.9) contrast(1.05) brightness(0.98)',
      'saturate(0.72) contrast(1.02) brightness(0.94)',
    ]
  );

  const counter = useTransform(scrollYProgress, (v) => String(Math.round(v * 240)).padStart(4, '0'));

  if (reduced) {
    return <div className={`relative ${className}`}>{children}</div>;
  }

  return (
    <div ref={ref} className={`relative isolate-blend ${className}`}>
      <motion.div style={{ filter: grade }} className="relative">
        {children}
      </motion.div>

      {/* Bars. Fixed to the scene's own edges rather than the viewport, so two
          letterboxed sections in a row never fight over the same overlay. */}
      <motion.span
        aria-hidden="true"
        style={{ height: barPx }}
        className="letterbox-bar pointer-events-none absolute inset-x-0 top-0 z-40 bg-ink-950"
      />
      <motion.span
        aria-hidden="true"
        style={{ height: barPx }}
        className="letterbox-bar pointer-events-none absolute inset-x-0 bottom-0 z-40 bg-ink-950"
      />

      {slate && (
        <motion.div
          aria-hidden="true"
          style={{ opacity: slateOpacity, y: slateY }}
          className="pointer-events-none absolute inset-x-0 top-[14%] z-40 flex flex-col items-center text-center"
        >
          <motion.span
            style={{ letterSpacing: slateTrack }}
            className="font-accent text-xs uppercase text-gold-200/90 sm:text-sm"
          >
            {slate}
          </motion.span>
          {slateNote && (
            <span className="mt-2 font-sans text-[11px] font-light uppercase tracking-luxe text-cream-100/50">
              {slateNote}
            </span>
          )}
          <span className="mt-3 block h-px w-16 bg-gradient-to-r from-transparent via-gold-300/70 to-transparent" />
        </motion.div>
      )}

      {hud && (
        <>
          {/* Frame counter, bottom left. Reads as projection furniture and
              doubles as a genuine indication of progress through the scene. */}
          <motion.span
            aria-hidden="true"
            style={{ opacity: bars }}
            className="pointer-events-none absolute bottom-[calc(11%+0.75rem)] left-5 z-40 font-sans text-[10px] tracking-luxe text-cream-100/40 nums-tabular"
          >
            <motion.span>{counter}</motion.span>
            <span className="ml-2">FR</span>
          </motion.span>

          {/* Reel marks, bottom right. */}
          <motion.span
            aria-hidden="true"
            style={{ opacity: bars }}
            className="pointer-events-none absolute bottom-[calc(11%+0.75rem)] right-5 z-40 flex items-center gap-1.5"
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="block h-1.5 w-1.5 rounded-full bg-gold-200/50"
                style={{ animation: `breathe-soft ${1.6 + i * 0.4}s ease-in-out ${i * 0.2}s infinite` }}
              />
            ))}
          </motion.span>
        </>
      )}
    </div>
  );
}
