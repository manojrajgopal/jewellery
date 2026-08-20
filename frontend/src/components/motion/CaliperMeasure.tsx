'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

import { caliperClose, dimensionFigure, dimensionRule } from '@/lib/motion';

interface CaliperMeasureProps {
  /** What is being measured. */
  label: string;
  /** The reading, in millimetres. */
  mm: number;
  /** How wide the jaws open on screen, as a fraction of the box. */
  span?: number;
  /** The tolerance the bench actually works to, in millimetres. */
  tolerance?: number;
  /** Why this measurement is the one that matters. */
  note?: string;
  className?: string;
}

/**
 * A vernier caliper closing onto something, and the number it reads.
 *
 * Everything on this site about making has so far been about heat, force or
 * light. This is about the other half of a bench, which is that nothing gets
 * made until somebody decides a number — and the numbers are startlingly small.
 * A claw is 0.8mm across at the tip. A bezel wall is 0.5mm. The difference
 * between a shank that lasts thirty years and one that wears through in eight
 * is about a fifth of a millimetre of section at the bottom of the ring, which
 * is a distance nobody can see and every bench can feel.
 *
 * Two conventions from technical drawing are kept because they are what make a
 * measurement read as a measurement rather than as a label:
 *
 *   - The dimension line is ruled *before* its figure is written. A number that
 *     arrives before its line has nothing to refer to, which is why
 *     `dimensionRule` and `dimensionFigure` are two exports with a built-in
 *     delay between them rather than one.
 *   - There is no overshoot on the closing jaw. A caliper that bounced off the
 *     work is a caliper whose reading you would have to take twice.
 *
 * The tolerance is printed as ± rather than as a range, and it is deliberately
 * a real one. ±0.05mm is what a good bench holds by hand and it is roughly the
 * thickness of a sheet of paper split in half.
 */
export default function CaliperMeasure({
  label,
  mm,
  span = 0.42,
  tolerance = 0.05,
  note,
  className = '',
}: CaliperMeasureProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: '-20% 0px -20% 0px' });
  const state = reduced || inView ? 'visible' : 'hidden';

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div className="relative overflow-hidden rounded-xl border border-hairline bg-canvas-alt px-5 py-8">
        {/* The beam, graduated. Ten major divisions and four minors between
            them, which is what a metric caliper beam actually carries. */}
        <div className="relative mx-auto h-20 w-full max-w-md">
          <div className="absolute inset-x-0 top-8 h-2 rounded-sm bg-[linear-gradient(180deg,rgb(var(--ink-200)),rgb(var(--ink-500)))]" />

          <div className="absolute inset-x-0 top-2 flex justify-between" aria-hidden="true">
            {Array.from({ length: 41 }, (_, i) => (
              <span
                key={i}
                className="block bg-ink-400/70"
                style={{ width: 1, height: i % 5 === 0 ? 10 : 5 }}
              />
            ))}
          </div>

          {/* Fixed jaw, at the left. */}
          <div className="caliper-jaw absolute left-0 top-[18px] h-10 w-3 rounded-sm" />

          {/* Sliding jaw, closing onto the work. */}
          <motion.div
            initial="hidden"
            animate={state}
            variants={reduced ? undefined : caliperClose(60)}
            className="absolute top-[18px] h-10 w-3 rounded-sm"
            style={{ left: `${span * 100}%` }}
          >
            <div className="caliper-jaw h-full w-full scale-x-[-1] rounded-sm" />
          </motion.div>

          {/* The work itself, sitting between the jaws. */}
          <div
            aria-hidden="true"
            className="absolute top-[22px] h-8 rounded-[2px] bg-[linear-gradient(180deg,rgb(var(--gold-300)),rgb(var(--gold-600))_50%,rgb(var(--gold-800)))] shadow-gold"
            style={{ left: 12, width: `calc(${span * 100}% - 12px)` }}
          />
        </div>

        {/* The dimension, drawn the way a drawing draws one: extension lines,
            then the rule between them, then the figure above it. */}
        <div className="relative mx-auto mt-2 w-full max-w-md">
          <motion.div
            initial="hidden"
            animate={state}
            variants={dimensionRule(0.5)}
            className="dimension-line origin-left"
            style={{ width: `${span * 100}%` }}
          />

          <motion.div
            initial="hidden"
            animate={state}
            variants={dimensionFigure(0.5)}
            className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1"
          >
            <span className="font-accent text-[10px] uppercase tracking-luxe text-faint">
              {label}
            </span>
            <span className="nums-instrument font-display text-3xl leading-none text-primary">
              {mm.toFixed(2)}
              <span className="ml-1 font-accent text-sm text-muted">mm</span>
            </span>
            <span className="nums-instrument font-accent text-[10px] uppercase tracking-luxe text-accent">
              ±{tolerance.toFixed(2)}
            </span>
          </motion.div>
        </div>
      </div>

      {note && (
        <p className="mt-4 max-w-xl font-sans text-sm font-light leading-relaxed text-muted">
          {note}
        </p>
      )}
    </div>
  );
}
