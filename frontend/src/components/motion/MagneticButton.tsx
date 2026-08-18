'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  as?: React.ElementType;
  /** How far the element leans toward the pointer, 0–1. */
  pull?: number;
  /** Inner content counter-moves for a parallax layer effect. */
  parallaxLabel?: boolean;
}

/**
 * The element leans toward the pointer while it is nearby and springs back on
 * exit, with a sheen that sweeps across on hover.
 */
export default function MagneticButton({
  children,
  className = '',
  onClick,
  href,
  as = 'button',
  pull = 0.32,
  parallaxLabel = true,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => setIsClient(true), []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const spring = { stiffness: 240, damping: 18, mass: 0.35 };
  const springX = useSpring(x, spring);
  const springY = useSpring(y, spring);

  // The label trails the shell slightly, which reads as depth.
  const labelX = useTransform(springX, (v) => v * -0.28);
  const labelY = useTransform(springY, (v) => v * -0.28);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - (rect.left + rect.width / 2)) * pull);
    y.set((e.clientY - (rect.top + rect.height / 2)) * pull);
  };

  const handleMouseLeave = () => {
    setHovering(false);
    x.set(0);
    y.set(0);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Component = motion(as as any);

  if (!isClient) {
    const Fallback = as;
    return (
      <Fallback className={className} onClick={onClick} href={href}>
        {children}
      </Fallback>
    );
  }

  return (
    <Component
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      href={href}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.96 }}
      className={`relative overflow-hidden ${className}`}
    >
      <motion.span
        style={parallaxLabel ? { x: labelX, y: labelY } : undefined}
        className="relative z-10 flex h-full w-full items-center justify-center gap-2"
      >
        {children}
      </motion.span>

      <motion.span
        aria-hidden="true"
        initial={false}
        animate={hovering ? { x: ['-120%', '120%'] } : { x: '-120%' }}
        transition={
          hovering
            ? { duration: 1.1, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.6 }
            : { duration: 0.2 }
        }
        className="pointer-events-none absolute inset-0 z-0 skew-x-12 bg-gradient-to-r from-transparent via-gold-100/25 to-transparent"
      />
    </Component>
  );
}
