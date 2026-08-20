'use client';

import { useId, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

type Join = 'ring' | 'bezel' | 'link' | 'claw' | 'shank';

interface SolderWeldPathProps {
  /** Which join is being made. */
  join?: Join;
  className?: string;
  /** Label under the drawing. */
  caption?: string;
  /** Seconds for the bead to travel the whole seam. */
  duration?: number;
  /** Repeat forever rather than welding once on entry. */
  loop?: boolean;
}

/**
 * The joins, as paths on a 200 × 200 box.
 *
 * `seam` is the line the solder actually runs along and `body` is the piece it
 * belongs to — kept separate because the whole point of the drawing is that the
 * bead travels the *join* rather than the outline. A single path for both would
 * send the spark round the outside of the ring, which is exactly the mistake
 * this is illustrating the absence of.
 */
const JOINS: Record<Join, { body: string; seam: string; label: string; note: string }> = {
  ring: {
    body: 'M 100 24 A 76 76 0 1 1 99.9 24',
    seam: 'M 100 24 L 100 44',
    label: 'A closed shank',
    note: 'The one join in the piece that carries the whole load. It is soldered, filed flush and then polished until it cannot be found.',
  },
  bezel: {
    body: 'M 46 74 L 154 74 L 154 132 L 46 132 Z',
    seam: 'M 46 74 L 46 132',
    label: 'A bezel wall',
    note: 'A strip bent round the stone and closed on one vertical seam. If the seam is not tight the wall springs open under burnishing.',
  },
  link: {
    body: 'M 40 100 A 34 34 0 1 1 108 100 A 34 34 0 1 1 176 100',
    seam: 'M 104 82 L 104 118',
    label: 'A link in a chain',
    note: 'Every link is closed individually. On a 45cm cable chain that is roughly 260 joins, each one hand-fed and each one a potential failure.',
  },
  claw: {
    body: 'M 70 160 L 82 60 M 130 160 L 118 60 M 82 60 Q 100 44 118 60',
    seam: 'M 82 60 Q 100 44 118 60',
    label: 'A claw to the head',
    note: 'The claw is soldered to the head, not to the shank. Getting the heat into the join without annealing the claw tip is the whole difficulty.',
  },
  shank: {
    body: 'M 56 44 L 56 156 M 144 44 L 144 156 M 56 100 L 144 100',
    seam: 'M 56 100 L 144 100',
    label: 'A cross-bar',
    note: 'Two verticals bridged by one bar. Both ends have to flow at the same moment or the bar sits proud on one side and cannot be filed level.',
  },
};

/**
 * A join being soldered.
 *
 * The mechanism is three coordinated things happening on the same timeline, and
 * missing any one of them makes it read as a line being drawn rather than as
 * metal being joined:
 *
 *  1. A bead of light travels the seam. It is a short dash with a large offset,
 *     animated by `strokeDashoffset` on a `pathLength`-normalised copy of the
 *     seam — which is the only way to get a moving point *along an arbitrary
 *     curve* in SVG without `offset-path` support.
 *  2. Behind it, the seam itself fills in permanently. The bead is the heat; the
 *     fill is the solder that has already flowed.
 *  3. A bloom sits under the bead and its radius pulses. Solder flows at a
 *     temperature the metal around it is also reaching, so the glow has to be
 *     wider than the line.
 *
 * The body of the piece is drawn cold and stays cold. That contrast is the
 * argument of the illustration: the join is the only part that was ever hot.
 */
export default function SolderWeldPath({
  join = 'ring',
  className = '',
  caption,
  duration = 2.4,
  loop = false,
}: SolderWeldPathProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: !loop, margin: '-18% 0px -18% 0px' });
  const reduced = useReducedMotion();
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const entry = JOINS[join];

  const run = reduced ? false : inView;

  return (
    <div ref={ref} className={`relative ${className}`}>
      <svg viewBox="0 0 200 200" className="w-full" role="img" aria-label={entry.label}>
        <defs>
          <radialGradient id={`weld-bloom-${uid}`}>
            <stop offset="0%" stopColor="rgb(var(--gold-100))" stopOpacity="0.9" />
            <stop offset="45%" stopColor="rgb(var(--gold-400))" stopOpacity="0.45" />
            <stop offset="100%" stopColor="rgb(var(--gold-500))" stopOpacity="0" />
          </radialGradient>
          <filter id={`weld-glow-${uid}`} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="2.4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* The cold body. */}
        <path
          d={entry.body}
          fill="none"
          stroke="rgb(var(--hairline))"
          strokeOpacity={0.4}
          strokeWidth={2.4}
          strokeLinecap="round"
        />

        {/* The seam, before it is made: dotted, because it is not a line yet. */}
        <path
          d={entry.seam}
          fill="none"
          stroke="rgb(var(--accent))"
          strokeOpacity={0.22}
          strokeWidth={1.4}
          strokeDasharray="2 4"
          strokeLinecap="round"
        />

        {/* The solder that has already flowed. Fills from the start of the seam
            to wherever the bead has reached, which is the same thing as a
            dashoffset animating from 1 to 0 on a normalised path. */}
        <motion.path
          d={entry.seam}
          fill="none"
          stroke="rgb(var(--gold-300))"
          strokeWidth={3}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1 1"
          initial={{ strokeDashoffset: 1 }}
          animate={run ? { strokeDashoffset: 0 } : reduced ? { strokeDashoffset: 0 } : undefined}
          transition={{
            duration,
            ease: 'linear',
            repeat: loop ? Infinity : 0,
            repeatDelay: loop ? 0.7 : 0,
          }}
          filter={`url(#weld-glow-${uid})`}
        />

        {/* The bead. A one-percent dash on the same normalised path, so it sits
            exactly at the head of the fill however the seam curves. */}
        <motion.path
          d={entry.seam}
          fill="none"
          stroke={`url(#weld-bloom-${uid})`}
          strokeWidth={14}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="0.02 0.98"
          initial={{ strokeDashoffset: 0.02 }}
          animate={run ? { strokeDashoffset: -0.98 } : undefined}
          transition={{
            duration,
            ease: 'linear',
            repeat: loop ? Infinity : 0,
            repeatDelay: loop ? 0.7 : 0,
          }}
        />

        <motion.path
          d={entry.seam}
          fill="none"
          stroke="rgb(var(--gold-100))"
          strokeWidth={4.5}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="0.012 0.988"
          initial={{ strokeDashoffset: 0.012, opacity: 0 }}
          animate={run ? { strokeDashoffset: -0.988, opacity: [0, 1, 1, 0] } : undefined}
          transition={{
            duration,
            ease: 'linear',
            repeat: loop ? Infinity : 0,
            repeatDelay: loop ? 0.7 : 0,
            // The keyframe times belong to opacity alone — the offset is a
            // scalar target, and a top-level `times` alongside it is ignored.
            opacity: {
              duration,
              ease: 'linear',
              times: [0, 0.06, 0.94, 1],
              repeat: loop ? Infinity : 0,
              repeatDelay: loop ? 0.7 : 0,
            },
          }}
          filter={`url(#weld-glow-${uid})`}
        />
      </svg>

      <p className="mt-3 font-accent text-[10px] uppercase tracking-luxe text-accent">
        {caption ?? entry.label}
      </p>
      <p className="mt-1.5 font-sans text-xs font-light leading-relaxed text-secondary">
        {entry.note}
      </p>
    </div>
  );
}
