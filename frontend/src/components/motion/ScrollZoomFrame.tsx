'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

interface ScrollZoomFrameProps {
  children: React.ReactNode;
  className?: string;
  /** Starting inset of the aperture, in percent. 0 disables the wipe. */
  inset?: number;
  /** Scale the content starts at, before the frame opens. */
  from?: number;
  /** Corner radius at the closed state, in pixels. */
  radius?: number;
  /** Rotate very slightly as it opens. */
  twist?: number;
}

/**
 * Content held inside an aperture that opens as the section scrolls in — the
 * shot widening from a letterboxed window to the full frame.
 *
 * Two things move together: the clip inset shrinks and the content scales down
 * from oversized to true size. Doing only the first reads as a curtain; doing
 * only the second reads as a zoom. Doing both is what makes it read as a camera
 * pulling back to reveal.
 */
export default function ScrollZoomFrame({
  children,
  className = '',
  inset = 12,
  from = 1.18,
  radius = 40,
  twist = 0,
}: ScrollZoomFrameProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center'],
  });
  const p = useSpring(scrollYProgress, { stiffness: 400, damping: 38, mass: 0.3 });

  const clip = useTransform(p, (v) => {
    const i = inset * (1 - v);
    return `inset(${i}% ${i}% ${i}% ${i}% round ${radius * (1 - v)}px)`;
  });
  const scale = useTransform(p, [0, 1], [from, 1]);
  const rotate = useTransform(p, [0, 1], [twist, 0]);

  return (
    <div ref={ref} className={className}>
      <motion.div
        style={{ clipPath: clip, willChange: 'clip-path' }}
        className="h-full w-full"
      >
        <motion.div style={{ scale, rotate }} className="h-full w-full">
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}
