'use client';

import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

import { heatRise } from '@/lib/motion';

interface HeatShimmerProps {
  children: React.ReactNode;
  className?: string;
  /** How hard the air moves. 1 is a soldering flame; 2 is a casting furnace. */
  strength?: number;
  /** Coals along the bottom edge. */
  embers?: boolean;
  /** The quench: one ring, on a loop, for the moment a piece hits water. */
  quench?: boolean;
  /** Temperature printed on the frame, in the bench's own units. */
  reading?: string;
}

/**
 * Air moving over something hot.
 *
 * This is the only treatment on the site that distorts what is *behind* it. Every
 * other overlay adds light, grain, colour or texture on top of the picture; heat
 * haze bends the picture itself, and that difference is the whole reason a forge
 * looks like a forge on film.
 *
 * The physics worth respecting: a heat column is not a uniform shimmer. Hot air
 * rises, so the distortion is strongest just above the source, weakens with
 * height, and *travels upward* while it does it. A shimmer applied evenly across
 * a frame reads as a bad video codec. The mask here therefore fades at both
 * ends, and the drift is vertical.
 *
 * The implementation is deliberately not an SVG turbulence filter. `feTurbulence`
 * with an animated `baseFrequency` is the textbook way to do this and it repaints
 * the whole filtered subtree on the main thread every frame — which is
 * unaffordable over content that is already animating, and this sits over the
 * atelier photography and the bench readouts. A `backdrop-filter` blur combined
 * with a compositor-only skew and scale gets most of the way there for
 * essentially nothing, and the part it loses — the fine ripple — is invisible
 * above about 400px of column height anyway.
 *
 * Reduced motion keeps the embers and the temperature and stops the air. A forge
 * that is lit but still is a forge between passes, which is a real thing rather
 * than a degraded effect.
 */
export default function HeatShimmer({
  children,
  className = '',
  strength = 1,
  embers = true,
  quench = false,
  reading,
}: HeatShimmerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: '-10% 0px -10% 0px' });
  const reduced = useReducedMotion();

  const running = inView && !reduced;

  return (
    <div ref={ref} className={`heat-column relative ${className}`}>
      {children}

      {/* The moving air. Skew and scale only, both compositor properties, over
          a backdrop blur that is doing the actual bending. */}
      {running && (
        <motion.span
          aria-hidden="true"
          variants={heatRise(strength)}
          initial="hidden"
          animate="visible"
          className="pointer-events-none absolute inset-0 z-[2] mask-column-fade"
          style={{ backdropFilter: 'blur(0.7px) saturate(1.06)' }}
        />
      )}

      {/* The warm cast a mass of hot metal throws onto everything near it. Stays
          under reduced motion: it is colour, not movement. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-1/2 bg-[linear-gradient(0deg,rgb(var(--gold-500)/0.16),transparent)] blend-screen"
      />

      {embers && (
        <span
          aria-hidden="true"
          className="ember-bed pointer-events-none absolute inset-x-0 bottom-0 z-[4] h-24 blend-screen"
        />
      )}

      {quench && (
        <span
          aria-hidden="true"
          className="quench-ripple pointer-events-none absolute left-1/2 top-1/2 z-[5] h-40 w-40 -translate-x-1/2 -translate-y-1/2"
        />
      )}

      {reading && (
        <span className="nums-instrument absolute right-4 top-4 z-[6] rounded-full border border-accent/25 bg-surface-raised/60 px-3 py-1 font-accent text-[10px] uppercase tracking-luxe text-accent backdrop-blur-sm">
          {reading}
        </span>
      )}
    </div>
  );
}
