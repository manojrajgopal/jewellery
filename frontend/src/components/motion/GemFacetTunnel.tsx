'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

interface GemFacetTunnelProps {
  className?: string;
  /** Concentric facet rings. Each is one polygon, so cost is trivial. */
  rings?: number;
  /** Sides per ring. 8 reads as a brilliant crown, 6 as an emerald table. */
  sides?: number;
  /** Opacity multiplier. */
  intensity?: number;
  /** Rotate the whole tunnel as it recedes. */
  twist?: number;
}

/**
 * Falling into a stone — a tunnel of facet outlines that recedes as you scroll.
 *
 * The illusion is built from one idea: a ring's scale and its opacity are both
 * functions of a single "depth" value, and every ring shares that value offset
 * by its index. Advance the shared value by one and every ring takes the place
 * of the one in front of it, so the tunnel can run forever from a fixed number
 * of polygons. The seam is invisible because the outermost ring is already at
 * zero opacity when it is recycled.
 *
 * Scale is exponential rather than linear. Perspective is a reciprocal of
 * distance, so evenly-spaced rings in *depth* must be exponentially spaced in
 * *scale* — get that wrong and the tunnel reads as a set of nested outlines
 * rather than as a corridor.
 *
 * Pure SVG, one path per ring, no canvas and no per-frame JS: the whole thing is
 * driven by scroll-linked transforms the compositor can run on its own.
 */
export default function GemFacetTunnel({
  className = '',
  rings = 11,
  sides = 8,
  intensity = 0.55,
  twist = 34,
}: GemFacetTunnelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  /** One polygon, described once and reused at every scale. */
  const points = Array.from({ length: sides }, (_, i) => {
    // Rotated a half-step so a flat sits at the top, the way a table does.
    const a = (i / sides) * Math.PI * 2 - Math.PI / 2 + Math.PI / sides;
    return `${(50 + Math.cos(a) * 50).toFixed(2)},${(50 + Math.sin(a) * 50).toFixed(2)}`;
  }).join(' ');

  return (
    <div ref={ref} className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden="true">
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <svg
          viewBox="0 0 100 100"
          className="h-[140%] w-[140%] max-w-none"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <radialGradient id="facet-tunnel-core" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgb(var(--gold-200))" stopOpacity="0.5" />
              <stop offset="55%" stopColor="rgb(var(--gold-500))" stopOpacity="0.12" />
              <stop offset="100%" stopColor="rgb(var(--gold-700))" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* The light at the end of it. */}
          <circle cx="50" cy="50" r="46" fill="url(#facet-tunnel-core)" opacity={intensity} />

          {Array.from({ length: rings }, (_, i) => (
            <TunnelRing
              key={i}
              index={i}
              rings={rings}
              points={points}
              progress={scrollYProgress}
              intensity={intensity}
              twist={twist}
              reduced={!!reduced}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}

function TunnelRing({
  index,
  rings,
  points,
  progress,
  intensity,
  twist,
  reduced,
}: {
  index: number;
  rings: number;
  points: string;
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
  intensity: number;
  twist: number;
  reduced: boolean;
}) {
  // Each ring starts one slot further down the corridor than the last, and the
  // whole set advances by `rings` slots across the section — which is exactly
  // one full cycle per ring, so the recycling is seamless.
  const offset = index / rings;

  // Exponential scale: 0.06 at the far end out to ~3.2 past the viewer. The
  // fractional part of (progress + offset) is the ring's own depth, so it wraps
  // on its own without any index bookkeeping.
  const scale = useTransform(progress, (p) => {
    const depth = (p * rings + index) % rings / rings;
    return 0.06 * Math.pow(52, depth);
  });

  // Brightest in the middle distance. A ring at the far end is too small to
  // read and one past the viewer is a distraction, so both ends fade out.
  const opacity = useTransform(progress, (p) => {
    const depth = (p * rings + index) % rings / rings;
    const bell = Math.sin(depth * Math.PI) ** 1.4;
    return bell * intensity * 0.9;
  });

  const rotate = useTransform(progress, (p) => {
    const depth = (p * rings + index) % rings / rings;
    return depth * twist;
  });

  // Line weight has to be divided out of the scale, or the near rings render
  // as thick slabs while the far ones vanish entirely.
  const strokeWidth = useTransform(scale, (s) => 0.5 / Math.max(s, 0.02));

  if (reduced) {
    return (
      <polygon
        points={points}
        fill="none"
        stroke="rgb(var(--gold-400))"
        strokeWidth={0.4}
        opacity={intensity * 0.25 * (1 - offset)}
        transform={`translate(50 50) scale(${(0.2 + offset).toFixed(2)}) translate(-50 -50)`}
      />
    );
  }

  return (
    <motion.polygon
      points={points}
      fill="none"
      stroke="rgb(var(--gold-400))"
      strokeLinejoin="round"
      style={{
        scale,
        rotate,
        opacity,
        strokeWidth,
        transformOrigin: '50px 50px',
        transformBox: 'view-box',
      }}
    />
  );
}
