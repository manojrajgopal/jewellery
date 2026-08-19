'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  /** Maximum rotation in degrees at the edges of the plate. */
  strength?: number;
  /** Specular highlight that tracks the pointer across the surface. */
  glare?: boolean;
  /** Warm rim light on the edge the pointer is nearest. */
  rimLight?: boolean;
  /** Lift toward the viewer while hovered. */
  lift?: number;
  /** Perspective depth — smaller is more extreme. */
  depth?: number;
}

/**
 * A plate that tilts under the pointer as though it were a physical object on a
 * velvet tray.
 *
 * Two things separate this from the usual CSS-variable tilt: the rotation runs
 * through springs, so releasing the pointer lets the card settle rather than
 * snapping flat, and the specular glare is a separate layer whose position is
 * derived from the same motion values — which is what makes the light read as
 * reflecting off a surface instead of sliding across a picture of one.
 *
 * Children can opt into parallax by carrying `data-tilt-depth="1"` … `"3"`; the
 * CSS below translates them on Z so the card gains real interior depth.
 */
export default function TiltCard({
  children,
  className = '',
  strength = 12,
  glare = true,
  rimLight = true,
  lift = 10,
  depth = 1100,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  // Normalised pointer position, -0.5 … 0.5 from the centre of the plate.
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  const spring = { stiffness: 220, damping: 26, mass: 0.6 };
  const sx = useSpring(px, spring);
  const sy = useSpring(py, spring);

  const rotateY = useTransform(sx, [-0.5, 0.5], [-strength, strength]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [strength, -strength]);

  // The highlight travels further than the pointer, the way a reflection does.
  const glareX = useTransform(sx, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(sy, [-0.5, 0.5], ['0%', '100%']);
  const glareBg = useTransform(
    [glareX, glareY] as const,
    ([x, y]: string[]) =>
      `radial-gradient(38% 44% at ${x} ${y}, rgb(var(--gold-100) / 0.42), transparent 68%)`
  );

  // Rim light picks the side the pointer sits on.
  const rimBg = useTransform(
    [sx, sy] as const,
    ([x, y]: number[]) =>
      `linear-gradient(${Math.atan2(y, x) * (180 / Math.PI) + 90}deg, rgb(var(--gold-400) / 0.55), transparent 42%)`
  );

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };

  const reset = () => {
    setHovered(false);
    px.set(0);
    py.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={reset}
      style={{
        perspective: depth,
        transformStyle: 'preserve-3d',
      }}
      className={`relative motion-reduce:transform-none ${className}`}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        animate={{ z: hovered ? lift : 0 }}
        transition={{ type: 'spring', stiffness: 240, damping: 24 }}
        className="relative h-full w-full [&_[data-tilt-depth='1']]:translate-z-4 [&_[data-tilt-depth='2']]:translate-z-8 [&_[data-tilt-depth='3']]:translate-z-14"
      >
        {children}

        {rimLight && (
          <motion.span
            aria-hidden="true"
            style={{ background: rimBg }}
            animate={{ opacity: hovered ? 0.5 : 0 }}
            transition={{ duration: 0.35 }}
            className="pointer-events-none absolute inset-0 mix-blend-overlay"
          />
        )}

        {glare && (
          <motion.span
            aria-hidden="true"
            style={{ background: glareBg }}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            className="pointer-events-none absolute inset-0 mix-blend-soft-light"
          />
        )}
      </motion.div>
    </motion.div>
  );
}
