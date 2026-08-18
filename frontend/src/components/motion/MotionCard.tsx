'use client';

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';

interface MotionCardProps {
  children: React.ReactNode;
  className?: string;
  glareOpacity?: number;
  tiltAmount?: number;
  /** Lift toward the viewer on hover. */
  lift?: number;
  /** Adds a gold rim that tracks the light source. */
  rim?: boolean;
}

/**
 * Pointer-tracked 3D tilt with a moving specular glare and a light-tracking
 * rim. On touch devices it renders as a plain static card — the tilt is
 * skipped, never the content.
 */
export default function MotionCard({
  children,
  className = '',
  glareOpacity = 0.16,
  tiltAmount = 9,
  lift = 14,
  rim = true,
}: MotionCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [canTilt, setCanTilt] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setCanTilt(fine && !reduced);
  }, []);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const spring = { damping: 22, stiffness: 210, mass: 0.5 };
  const sx = useSpring(mouseX, spring);
  const sy = useSpring(mouseY, spring);

  const rotateX = useTransform(sy, [0, 1], [tiltAmount, -tiltAmount]);
  const rotateY = useTransform(sx, [0, 1], [-tiltAmount, tiltAmount]);

  const glareX = useTransform(sx, [0, 1], ['-20%', '120%']);
  const glareY = useTransform(sy, [0, 1], ['-20%', '120%']);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,${glareOpacity}), transparent 45%)`;
  const rimLight = useMotionTemplate`radial-gradient(220px circle at ${glareX} ${glareY}, rgb(var(--gold-300) / 0.55), transparent 70%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const reset = () => {
    setHovering(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  // Touch / reduced motion: same markup, no transforms.
  if (!canTilt) {
    return <div className={`relative w-full ${className}`}>{children}</div>;
  }

  return (
    <div className="perspective-1000 h-full w-full">
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={reset}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        animate={{ z: hovering ? lift : 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 24 }}
        className={`relative w-full ${className}`}
      >
        {rim && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-px z-0 rounded-[inherit] transition-opacity duration-300"
            style={{ background: rimLight, opacity: hovering ? 0.85 : 0 }}
          />
        )}

        <div className="relative z-10 h-full rounded-[inherit]" style={{ transform: 'translateZ(28px)' }}>
          {children}
        </div>

        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] mix-blend-soft-light transition-opacity duration-300"
          style={{ background: glare, opacity: hovering ? 1 : 0 }}
        />
      </motion.div>
    </div>
  );
}
