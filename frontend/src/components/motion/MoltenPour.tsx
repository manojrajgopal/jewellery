'use client';

import { useId, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';

interface MoltenPourProps {
  /** The word the metal fills. One word reads best; two is the limit. */
  word: string;
  /** Line under it, in small caps. */
  note?: string;
  className?: string;
  /** Show the crucible lip and the falling stream above the word. */
  stream?: boolean;
}

/**
 * A word cast in gold: molten metal pours from a crucible and fills the letters
 * from the bottom as the section is scrolled.
 *
 * The fill is an SVG text element used as its own mask, so the metal is clipped to
 * the glyph outlines with no images and no duplicated markup. Two gradients are
 * stacked inside it — a vertical body for the metal and a hot horizontal band
 * that travels — because still molten gold reads as plastic, and the moving
 * highlight is what makes a static gradient look like liquid.
 *
 * The stream and the pool are separate layers on the same scroll progress. Both
 * run slightly *ahead* of the fill: metal has to arrive before it can accumulate,
 * and reversing that order is what makes most fill animations feel wrong without
 * anyone being able to say why.
 *
 * The word is also rendered as ordinary text for a screen reader, and that is the
 * copy a reduced-motion visitor gets — with the metal applied as a flat gradient
 * rather than a pour.
 */
export default function MoltenPour({
  word,
  note,
  className = '',
  stream = true,
}: MoltenPourProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const maskId = `pour-mask-${uid}`;
  const bodyId = `pour-body-${uid}`;
  const hotId = `pour-hot-${uid}`;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'center 0.42'],
  });
  const p = useSpring(scrollYProgress, { stiffness: 400, damping: 38, mass: 0.3 });

  // The metal surface climbs from below the baseline to above the cap height.
  const fillY = useTransform(p, [0, 1], [104, -4]);
  // The stream exists only while metal is actually being delivered.
  const streamOpacity = useTransform(p, [0, 0.08, 0.86, 1], [0, 1, 1, 0]);
  const streamScale = useTransform(p, [0, 0.2, 1], [0.2, 1, 1]);
  const poolWidth = useTransform(p, [0, 1], ['8%', '68%']);
  const glow = useTransform(p, [0, 1], [0, 1]);

  const viewW = 1000;
  const viewH = 260;
  // In user-space units rather than percent: an SVG <rect> y offset animated as a
  // percentage resolves against the viewBox in ways that differ between engines.
  // Hoisted out of the JSX below, which sits inside a conditional branch.
  const fillOffset = useTransform(fillY, (v) => (v / 100) * viewH);

  return (
    <div ref={ref} className={`relative isolate-blend ${className}`}>
      {stream && !reduced && (
        <div className="relative mx-auto mb-2 h-24 w-full max-w-md">
          {/* The crucible lip. Drawn as a trapezoid so it reads as a vessel seen
              slightly from below, which is where the viewer is. */}
          <span
            aria-hidden="true"
            className="molten-body clip-ingot absolute left-1/2 top-0 h-6 w-40 -translate-x-1/2 rotate-180 rounded-sm shadow-[0_10px_30px_-14px_rgb(var(--gold-500)/0.7)]"
          />
          {/* The stream. Scaled from the lip downward, with a slight taper via
              the width gradient — a constant-width stream looks like a bar. */}
          <motion.span
            aria-hidden="true"
            style={{ opacity: streamOpacity, scaleY: streamScale }}
            className="molten-hot absolute left-1/2 top-5 h-20 w-2.5 origin-top -translate-x-1/2 rounded-full"
          >
            <span className="molten-body absolute inset-0 rounded-full" />
          </motion.span>
          {/* Sparks. Three is enough to imply heat; more reads as a firework. */}
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              aria-hidden="true"
              style={{ opacity: streamOpacity }}
              animate={{
                y: [0, 26 + i * 8],
                x: [0, (i - 1) * 14],
                opacity: [0.9, 0],
              }}
              transition={{ duration: 1.1 + i * 0.3, repeat: Infinity, delay: i * 0.35 }}
              className="absolute left-1/2 top-16 h-1 w-1 rounded-full bg-gold-100 shadow-[0_0_8px_2px_rgb(var(--gold-300)/0.8)]"
            />
          ))}
        </div>
      )}

      <svg
        viewBox={`0 0 ${viewW} ${viewH}`}
        className="w-full"
        role="img"
        aria-label={word}
      >
        <defs>
          <linearGradient id={bodyId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(var(--gold-100))" />
            <stop offset="28%" stopColor="rgb(var(--gold-300))" />
            <stop offset="62%" stopColor="rgb(var(--gold-500))" />
            <stop offset="100%" stopColor="rgb(var(--gold-800))" />
          </linearGradient>

          <linearGradient id={hotId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgb(255 255 255 / 0)" />
            <stop offset="45%" stopColor="rgb(255 250 232 / 0.85)" />
            <stop offset="55%" stopColor="rgb(255 255 255 / 0.95)" />
            <stop offset="100%" stopColor="rgb(255 255 255 / 0)" />
          </linearGradient>

          <mask id={maskId} maskUnits="userSpaceOnUse">
            <text
              x="50%"
              y="72%"
              textAnchor="middle"
              fill="#fff"
              className="font-display"
              style={{ fontSize: 190, fontWeight: 500, letterSpacing: '-0.02em' }}
            >
              {word}
            </text>
          </mask>
        </defs>

        {/* The unfilled letterform: an outline, so the word is legible before any
            metal arrives rather than being a blank space. */}
        <text
          x="50%"
          y="72%"
          textAnchor="middle"
          fill="none"
          stroke="rgb(var(--gold-500) / 0.34)"
          strokeWidth={1.4}
          className="font-display"
          style={{ fontSize: 190, fontWeight: 500, letterSpacing: '-0.02em' }}
        >
          {word}
        </text>

        <g mask={`url(#${maskId})`}>
          {reduced ? (
            <rect x={0} y={0} width={viewW} height={viewH} fill={`url(#${bodyId})`} />
          ) : (
            <>
              {/* The body of the metal, its top edge climbing with scroll. */}
              <motion.rect
                x={0}
                width={viewW}
                height={viewH * 2}
                fill={`url(#${bodyId})`}
                style={{ y: fillOffset }}
              />
              {/* The hot band. Runs on its own clock, not on scroll: the metal is
                  hot whether or not anyone is scrolling. */}
              <motion.rect
                x={-viewW}
                y={0}
                width={viewW}
                height={viewH}
                fill={`url(#${hotId})`}
                animate={{ x: [-viewW, viewW * 1.2] }}
                transition={{ duration: 4.6, repeat: Infinity, repeatDelay: 0.9, ease: 'linear' }}
                style={{ mixBlendMode: 'screen' }}
              />
            </>
          )}
        </g>
      </svg>

      {/* The pool. Widens under the word as metal accumulates, and glows in
          proportion to how much has arrived. */}
      {!reduced && (
        <motion.span
          aria-hidden="true"
          style={{ width: poolWidth, opacity: glow }}
          className="molten-hot mx-auto block h-2 max-w-3xl rounded-full"
        >
          <span className="molten-body absolute inset-0 rounded-full shadow-[0_0_40px_-6px_rgb(var(--gold-400)/0.85)]" />
        </motion.span>
      )}

      {note && (
        <p className="mt-6 text-center font-accent text-[11px] uppercase tracking-luxer text-muted">
          {note}
        </p>
      )}
    </div>
  );
}
