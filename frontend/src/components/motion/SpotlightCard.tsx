'use client';

import { useRef, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  /** Radius of the light pool in px. */
  radius?: number;
  /** Show a gold border segment that follows the pointer. */
  borderGlow?: boolean;
}

/**
 * A card lit by a pointer-following pool of warm light, with an optional
 * gold rim that brightens on the same axis — the way a display case reads
 * under a moving spotlight.
 */
export default function SpotlightCard({
  children,
  className = '',
  radius = 340,
  borderGlow = true,
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 260, damping: 30, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 260, damping: 30, mass: 0.4 });

  const glow = useMotionTemplate`radial-gradient(${radius}px circle at ${sx}px ${sy}px, rgb(var(--gold-400) / 0.16), transparent 72%)`;
  const rim = useMotionTemplate`radial-gradient(${radius * 0.8}px circle at ${sx}px ${sy}px, rgb(var(--gold-400) / 0.65), transparent 70%)`;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(e.clientX - rect.left);
    my.set(e.clientY - rect.top);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      className={`group relative overflow-hidden rounded-2xl ${className}`}
    >
      {borderGlow && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] p-px"
          style={{ background: rim, opacity: active ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="h-full w-full rounded-[inherit] bg-surface-raised" />
        </motion.div>
      )}

      <div className="relative z-10 h-full">{children}</div>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] transition-opacity duration-300"
        style={{ background: glow, opacity: active ? 1 : 0 }}
      />
    </div>
  );
}
