'use client';

import { useId, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';

type Curve = 'swell' | 'dip' | 'wave' | 'arch' | 'rise';

interface TypeOnPathProps {
  text: string;
  /** Which curve the baseline follows. */
  curve?: Curve;
  className?: string;
  /** Type size, in the SVG's own user units (viewBox is 1000 wide). */
  size?: number;
  /** Show the curve itself, drawn by the scroll. */
  showRule?: boolean;
  /** Slide the text along the curve as the section scrolls past. */
  travel?: boolean;
  /** Where the text starts along the path, as a percentage. */
  start?: number;
  /** Letter-spacing in user units. */
  tracking?: number;
}

/**
 * Baselines, on a 1000 × 260 box. Each is a single cubic so the tangent never
 * kinks — a compound path with a join in it makes the glyphs at the join lurch,
 * and on a long word that is the only thing anybody notices.
 */
const CURVES: Record<Curve, string> = {
  // A shallow swell, cresting in the middle.
  swell: 'M 20 190 C 260 90, 740 90, 980 190',
  // The inverse: sags in the middle, like a chain hung between two posts.
  dip: 'M 20 90 C 260 220, 740 220, 980 90',
  // One full period, so the line reads as fabric rather than as a curve.
  wave: 'M 20 150 C 200 40, 340 250, 520 145 S 840 40, 980 150',
  // A near-semicircle — type around the top of an arch.
  arch: 'M 40 240 C 120 40, 880 40, 960 240',
  // A straight climb from bottom-left to top-right.
  rise: 'M 20 230 C 320 200, 660 90, 980 50',
};

/**
 * Type set along a curve, with the curve drawn by the scroll.
 *
 * `textPath` rather than per-glyph rotation, for the same reason `CircularText`
 * uses it: rotating each character individually leaves every glyph sitting on
 * its own tilted baseline, and the letterforms visibly disagree with each other
 * along the arc. A real text path keeps them on one continuous baseline and
 * lets the renderer do the kerning.
 *
 * Two things are scroll-linked. The rule under the type draws itself using the
 * usual `pathLength`-normalised dash trick, and — optionally — the text's own
 * `startOffset` slides along the path, which produces a rare effect on the web:
 * type that is moving *along a curve* rather than translating. It is worth the
 * spring, because the offset is a percentage of arc length and a raw scroll
 * value applied to it stutters on trackpads.
 *
 * The rule and the type read the same entry out of CURVES, so a change to a
 * curve moves both and they cannot drift apart.
 */
export default function TypeOnPath({
  text,
  curve = 'swell',
  className = '',
  size = 76,
  showRule = true,
  travel = false,
  start = 4,
  tracking = 2,
}: TypeOnPathProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const pathId = `top-path-${uid}`;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 92%', 'end 30%'],
  });

  const smooth = useSpring(scrollYProgress, { stiffness: 400, damping: 38, mass: 0.3 });

  const draw = useTransform(reduced ? scrollYProgress : smooth, [0, 0.85], [0, 1]);
  // Hoisted out of the JSX: the rule is conditional, and a hook inside a
  // conditional branch is a hook that sometimes does not run.
  const dashOffset = useTransform(draw, (v) => 1 - v);
  const offset = useTransform(
    reduced ? scrollYProgress : smooth,
    [0, 1],
    [`${start - 6}%`, `${start + 6}%`]
  );

  return (
    <div ref={ref} className={`relative w-full ${className}`}>
      <svg
        viewBox="0 0 1000 260"
        className="w-full overflow-visible"
        role="img"
        aria-label={text}
      >
        <defs>
          <path id={pathId} d={CURVES[curve]} fill="none" />
          <linearGradient id={`${pathId}-ink`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgb(var(--gold-600))" />
            <stop offset="42%" stopColor="rgb(var(--gold-300))" />
            <stop offset="58%" stopColor="rgb(var(--gold-100))" />
            <stop offset="100%" stopColor="rgb(var(--gold-500))" />
          </linearGradient>
        </defs>

        {showRule && (
          // Drawn as its own path rather than as a <use> of the defs one:
          // `pathLength` normalisation is a property of a geometry element and
          // is ignored on a reference, so a <use> here would draw all at once.
          <motion.path
            d={CURVES[curve]}
            stroke="rgb(var(--accent))"
            strokeOpacity={0.32}
            strokeWidth={1}
            fill="none"
            pathLength={1}
            strokeDasharray="1 1"
            style={{ strokeDashoffset: dashOffset }}
          />
        )}

        <text
          fill={`url(#${pathId}-ink)`}
          className="font-display"
          fontSize={size}
          letterSpacing={tracking}
          style={{ fontStyle: 'italic' }}
        >
          {/* startOffset is animated as a percentage string, which framer
              interpolates fine — but only on the attribute, not on a style, so
              this is a motion.textPath rather than a styled child. */}
          <motion.textPath
            href={`#${pathId}`}
            startOffset={travel && !reduced ? offset : `${start}%`}
          >
            {text}
          </motion.textPath>
        </text>
      </svg>
    </div>
  );
}
