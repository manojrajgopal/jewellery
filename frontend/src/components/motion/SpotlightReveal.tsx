'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';

interface SpotlightRevealProps {
  /** The layer that is always visible — usually the dark, unlit state. */
  base: React.ReactNode;
  /** The layer revealed only inside the torch beam. */
  lit: React.ReactNode;
  className?: string;
  /** Beam radius in pixels. */
  radius?: number;
  /** Soft edge width as a fraction of the radius. */
  falloff?: number;
  /** Leave a faint glow at rest so the effect is discoverable without hover. */
  restingHint?: boolean;
}

/**
 * Two stacked layers where the upper one is only visible inside a circle that
 * follows the pointer — a torch swept across a dark vitrine.
 *
 * `mask-image` with a radial gradient is the whole mechanism; the interesting
 * part is the resting state. Without a hint, an unhovered visitor sees only the
 * dark layer and never learns there is anything to find, so at rest the beam
 * parks at the centre of the plate and breathes. On touch, where there is no
 * pointer to follow, the beam simply stays open wide.
 */
export default function SpotlightReveal({
  base,
  lit,
  className = '',
  radius = 190,
  falloff = 0.55,
  restingHint = true,
}: SpotlightRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const sx = useSpring(mx, { stiffness: 300, damping: 30, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 300, damping: 30, mass: 0.4 });

  const mask = useMotionTemplate`radial-gradient(${radius}px ${radius}px at ${sx}% ${sy}%, #000 0%, #000 ${
    (1 - falloff) * 100
  }%, transparent 100%)`;

  const beamX = useMotionTemplate`${sx}%`;
  const beamY = useMotionTemplate`${sy}%`;

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 100);
    my.set(((e.clientY - r.top) / r.height) * 100);
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => {
        setHovered(false);
        mx.set(50);
        my.set(50);
      }}
      className={`relative overflow-hidden ${className}`}
    >
      {base}

      <motion.div
        aria-hidden="true"
        style={{
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
        animate={{ opacity: hovered ? 1 : restingHint ? 0.55 : 0 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 motion-reduce:!opacity-100 motion-reduce:![mask-image:none]"
      >
        {lit}
      </motion.div>

      {/* The beam's own bloom, so the light has a source rather than just
          revealing what is under it. */}
      <motion.span
        aria-hidden="true"
        style={{
          left: beamX,
          top: beamY,
          // Sized in px so the bloom stays circular whatever the plate's
          // aspect ratio happens to be.
          width: radius * 1.5,
          height: radius * 1.5,
        }}
        animate={{
          opacity: hovered ? 0.5 : restingHint ? 0.2 : 0,
          scale: hovered ? 1 : [1, 1.09, 1],
        }}
        transition={{
          opacity: { duration: 0.4 },
          scale: hovered
            ? { duration: 0.4 }
            : { duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(var(--gold-100)/0.4),transparent_70%)] blur-2xl"
      />
    </div>
  );
}
