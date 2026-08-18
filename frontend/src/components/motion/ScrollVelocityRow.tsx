'use client';

import { useRef } from 'react';
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from 'framer-motion';

interface ScrollVelocityRowProps {
  children: React.ReactNode;
  /** Base drift speed in % of a copy per second. */
  baseVelocity?: number;
  className?: string;
  /** Skew the row in proportion to scroll speed. */
  skew?: boolean;
}

/**
 * A marquee whose speed and direction respond to scroll velocity: scroll down
 * and the row accelerates, scroll up and it reverses. Four copies keep the
 * strip seamless at any speed.
 */
export default function ScrollVelocityRow({
  children,
  baseVelocity = 3,
  className = '',
  skew = true,
}: ScrollVelocityRowProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);

  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });
  const skewValue = useTransform(smoothVelocity, [-2000, 2000], [4, -4], {
    clamp: true,
  });

  const x = useTransform(baseX, (v) => `${wrap(-25, -50, v)}%`);
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    let moveBy = direction.current * baseVelocity * (delta / 1000);

    const factor = velocityFactor.get();
    if (factor < 0) direction.current = -1;
    else if (factor > 0) direction.current = 1;

    moveBy += direction.current * moveBy * factor;
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className={`relative w-full overflow-hidden mask-fade-x ${className}`}>
      <motion.div
        className="flex w-max flex-nowrap"
        style={{ x, skewX: skew ? skewValue : 0 }}
      >
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex flex-nowrap items-center" aria-hidden={i > 0}>
            {children}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
