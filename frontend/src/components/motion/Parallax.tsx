'use client';

import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

interface ParallaxProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
  offset?: [number, number];
  /** Scroll on the horizontal axis instead. */
  axis?: 'y' | 'x';
  /** Scale up slightly across the scroll range. */
  scaleRange?: [number, number];
  /** Rotate across the scroll range, in degrees. */
  rotateRange?: [number, number];
  /** Fade in and back out at the edges of the viewport. */
  fade?: boolean;
}

/**
 * Scroll-linked depth. Spring-smoothed so the layer settles instead of
 * snapping to each scroll event.
 *
 * The positional drift (the `speed`/`offset` translation) is intentionally
 * disabled: it made the wrapped content travel faster or slower than the page,
 * which read as sections scrolling at different speeds. Everything now moves 1:1
 * with the scroll. The API is unchanged so no consumer breaks, and the in-place
 * effects that do not change scroll speed — an optional scale, rotate or edge
 * fade — still work; only the translate is pinned to zero.
 */
export default function Parallax({
  children,
  speed = 0.5,
  className = '',
  offset = [-100, 100],
  axis = 'y',
  scaleRange,
  rotateRange,
  fade = false,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const smooth = useSpring(scrollYProgress, { stiffness: 400, damping: 38, mass: 0.3 });

  // Translation pinned to zero — see the note above. `speed` and `offset` are
  // kept in the signature so existing call sites compile unchanged.
  void speed;
  void offset;
  const shift = useTransform(smooth, [0, 1], [0, 0]);
  const scale = useTransform(smooth, [0, 1], scaleRange ?? [1, 1]);
  const rotate = useTransform(smooth, [0, 1], rotateRange ?? [0, 0]);
  const opacity = useTransform(smooth, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <div ref={ref} className={`relative h-full w-full ${className}`}>
      <motion.div
        style={{
          [axis]: shift,
          ...(scaleRange ? { scale } : {}),
          ...(rotateRange ? { rotate } : {}),
          ...(fade ? { opacity } : {}),
        }}
        className="h-full w-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
