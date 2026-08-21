'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion';

interface ScrollPathDrawProps {
  /** SVG path data. Coordinates are in the given viewBox space. */
  d: string;
  viewBox?: string;
  className?: string;
  strokeWidth?: number;
  /** Scroll window over which the stroke completes. */
  offset?: [string, string];
  /** A glowing bead that rides the head of the stroke. */
  bead?: boolean;
  /** Secondary ghost stroke behind the live one. */
  ghost?: boolean;
  children?: React.ReactNode;
}

/**
 * A vector line that draws itself as the section scrolls past — used for the
 * necklace contour in the heritage rail and the flowing rule under chapter
 * headings.
 *
 * The stroke is `pathLength`-normalised, so the same component works for any
 * path regardless of its real arc length: 0 → 1 always means empty → complete.
 *
 * The bead is placed by sampling `getPointAtLength` on the real path rather than
 * by CSS `offsetPath`. That costs one DOM read per frame but keeps the bead
 * welded to the stroke head in viewBox space — CSS offset units and viewBox
 * units are not the same space once `preserveAspectRatio` has scaled things.
 */
export default function ScrollPathDraw({
  d,
  viewBox = '0 0 100 100',
  className = '',
  strokeWidth = 0.6,
  offset = ['start 85%', 'end 35%'],
  bead = true,
  ghost = true,
  children,
}: ScrollPathDrawProps) {
  const ref = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const beadRef = useRef<SVGCircleElement>(null);
  const [reduced, setReduced] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as never,
  });
  const progress = useSpring(scrollYProgress, { stiffness: 400, damping: 38, mass: 0.3 });

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  // Follow the stroke head. Written imperatively because the value comes from
  // path geometry, which no motion value can express on its own.
  useMotionValueEvent(progress, 'change', (v) => {
    const path = pathRef.current;
    const dot = beadRef.current;
    if (!path || !dot) return;
    const total = path.getTotalLength();
    if (!total) return;
    const p = path.getPointAtLength(total * Math.min(Math.max(v, 0), 1));
    dot.setAttribute('cx', String(p.x));
    dot.setAttribute('cy', String(p.y));
    dot.setAttribute('opacity', v > 0.01 && v < 0.99 ? '1' : '0');
  });

  return (
    <div ref={ref} className={`relative ${className}`}>
      <svg
        viewBox={viewBox}
        fill="none"
        aria-hidden="true"
        preserveAspectRatio="xMidYMid meet"
        className="h-full w-full overflow-visible"
      >
        <defs>
          <linearGradient id="spd-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgb(var(--gold-200))" />
            <stop offset="50%" stopColor="rgb(var(--gold-500))" />
            <stop offset="100%" stopColor="rgb(var(--gold-300))" />
          </linearGradient>
          <filter id="spd-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="0.7" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {ghost && (
          <path
            d={d}
            stroke="rgb(var(--hairline) / 0.13)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        )}

        <motion.path
          ref={pathRef}
          d={d}
          stroke="url(#spd-gold)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          filter="url(#spd-glow)"
          style={{ pathLength: reduced ? 1 : progress }}
        />

        {bead && !reduced && (
          <circle
            ref={beadRef}
            r={strokeWidth * 2.1}
            cx={-99}
            cy={-99}
            opacity={0}
            fill="rgb(var(--gold-100))"
            filter="url(#spd-glow)"
            className="transition-opacity duration-300"
          />
        )}
      </svg>

      {children}
    </div>
  );
}
