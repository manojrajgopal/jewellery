'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';

interface GodRaysProps {
  /** Where the light enters the frame, as a percentage of the container. */
  originX?: number;
  originY?: number;
  /** Overall strength. 'soft' is safe over type; 'strong' wants an empty plate. */
  intensity?: 'soft' | 'medium' | 'strong';
  /** Rays rotate slightly as the section scrolls, as if the sun moved. */
  parallax?: boolean;
  className?: string;
}

const STRENGTH = {
  soft: { opacity: 0.28, blur: 22, spread: 46 },
  medium: { opacity: 0.45, blur: 16, spread: 38 },
  strong: { opacity: 0.62, blur: 12, spread: 32 },
} as const;

/**
 * Shafts of light falling through a window onto a vitrine. Built from skewed
 * gradient bars rather than a repeating-gradient background, so each shaft can
 * drift at its own rate — a single background can only translate as one piece,
 * which reads as a moving texture instead of moving light.
 *
 * Blend mode is `screen`: these are additive light, so on the cream theme they
 * correctly do almost nothing rather than laying grey bars over the page.
 */
export default function GodRays({
  originX = 22,
  originY = -12,
  intensity = 'medium',
  parallax = true,
  className = '',
}: GodRaysProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 400, damping: 38, mass: 0.3 });

  // The whole fan pivots a few degrees across the section — enough to feel like
  // the light source moved, not enough to notice the mechanism.
  const rotate = useTransform(smooth, [0, 1], parallax ? [-7, 7] : [0, 0]);
  const shift = useTransform(smooth, [0, 1], parallax ? ['-4%', '6%'] : ['0%', '0%']);

  const { opacity, blur, spread } = STRENGTH[intensity];

  // Irregular widths and offsets: evenly spaced shafts read as a pattern.
  const rays = [
    { left: 0, width: 4.5, alpha: 1.0, delay: 0 },
    { left: 7, width: 2.0, alpha: 0.55, delay: -3.2 },
    { left: 13, width: 7.0, alpha: 0.85, delay: -6.1 },
    { left: 24, width: 2.5, alpha: 0.45, delay: -1.7 },
    { left: 30, width: 5.5, alpha: 0.95, delay: -8.4 },
    { left: 40, width: 1.5, alpha: 0.4, delay: -4.9 },
    { left: 45, width: 6.0, alpha: 0.7, delay: -10.2 },
  ];

  if (reduced) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <motion.div
        style={{
          rotate,
          x: shift,
          transformOrigin: `${originX}% ${originY}%`,
          filter: `blur(${blur}px)`,
          opacity: `calc(${opacity} * var(--bloom))`,
        }}
        className="absolute -inset-[30%] mix-blend-screen"
      >
        {rays.map((ray) => (
          <motion.span
            key={ray.left}
            animate={{
              opacity: [ray.alpha * 0.4, ray.alpha, ray.alpha * 0.4],
              scaleY: [1, 1.06, 1],
            }}
            transition={{
              duration: 11 + ray.width,
              delay: ray.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              left: `${originX + ray.left}%`,
              width: `${ray.width}%`,
              transform: `skewX(-${spread / 3}deg)`,
              transformOrigin: 'top center',
              background:
                'linear-gradient(to bottom, rgb(var(--gold-100) / 0.55) 0%, rgb(var(--gold-200) / 0.28) 35%, transparent 82%)',
            }}
            className="absolute top-0 h-full"
          />
        ))}
      </motion.div>
    </div>
  );
}
