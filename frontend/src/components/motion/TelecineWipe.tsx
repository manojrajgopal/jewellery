'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

import { cueDot, easeMachine } from '@/lib/motion';

interface TelecineWipeProps {
  className?: string;
  /** The reel number this change-over leads into. Printed, not decorative. */
  reel?: number;
  /** Label for the reel — what the next stretch of page is about. */
  label?: string;
  /** Direction the change-over travels. */
  direction?: 'left' | 'right';
}

/**
 * A reel change.
 *
 * The site's dividers are ornamental rules and gold marks: they say "a new
 * section" the way a paragraph break does. This says it the way a projection
 * booth does, and it is the only divider on the site that carries information —
 * the reel number and its label tell a visitor how far into the run they are and
 * what the next stretch is about, which on pages this long is a real service
 * rather than a flourish.
 *
 * The mechanism is a change-over exactly as it was actually done. Two cue dots
 * appear in the top-right corner: the first is the projectionist's warning to
 * start the second machine, the second is the cut itself, and they are eight
 * seconds apart on film — compressed here, but kept in the right order and the
 * right corner, because a cue dot anywhere else on the frame is meaningless.
 * Then the change-over band sweeps, which is what the audience sees when the
 * dowser opens on one lamp while it closes on the other.
 *
 * The band is a *narrow bright wipe*, not a fade. A fade between reels is a
 * modern digital convention; an optical change-over passes both images at once
 * for a fraction of a second, so the join is brighter than either side of it.
 * Getting that one detail right is what stops this reading as a generic shimmer.
 *
 * Under a reduced-motion preference the dots and the band go and the printed
 * reel line stays — which is the useful half anyway.
 */
export default function TelecineWipe({
  className = '',
  reel,
  label,
  direction = 'right',
}: TelecineWipeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20% 0px -20% 0px' });
  const reduced = useReducedMotion();

  const run = inView && !reduced;
  const fromLeft = direction === 'right';

  return (
    <div
      ref={ref}
      role="separator"
      aria-label={label ? `Reel ${reel ?? ''} — ${label}` : 'Section change'}
      className={`relative isolate-blend overflow-hidden py-10 ${className}`}
    >
      {/* The film path this happens on. Thin, and it is the thing the band
          travels along rather than a decorative rule under it. */}
      <div className="relative mx-auto flex h-px max-w-6xl items-center bg-line/50">
        {run && (
          <motion.span
            aria-hidden="true"
            initial={{ x: fromLeft ? '-30%' : '130%', opacity: 0 }}
            animate={{ x: fromLeft ? '130%' : '-30%', opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.15, ease: easeMachine.blade, times: [0, 0.12, 0.8, 1] }}
            className="absolute top-1/2 h-[3px] w-[22%] -translate-y-1/2 rounded-full bg-[linear-gradient(90deg,transparent,rgb(var(--gold-100)),rgb(var(--gold-300)),transparent)] blur-[0.5px] blend-screen"
          />
        )}
      </div>

      {/* Cue dots, top right, in the order a projectionist would see them. */}
      {run && (
        <div aria-hidden="true" className="absolute right-6 top-4 flex gap-2 md:right-12">
          {[0, 1].map((i) => (
            <motion.span
              key={i}
              variants={cueDot}
              initial="hidden"
              animate="visible"
              transition={{ delay: i * 0.34 }}
              className="block h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_10px_2px_rgb(var(--gold-400)/0.6)]"
            />
          ))}
        </div>
      )}

      {(reel !== undefined || label) && (
        <div className="mx-auto mt-6 flex max-w-6xl items-center gap-4 px-6 md:px-0">
          {reel !== undefined && (
            <span className="nums-instrument font-accent text-[10px] uppercase tracking-luxe text-accent">
              Reel {String(reel).padStart(2, '0')}
            </span>
          )}
          <span aria-hidden="true" className="h-px flex-1 bg-line/40" />
          {label && (
            <span className="font-accent text-[10px] uppercase tracking-luxe text-faint">
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
