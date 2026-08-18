'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

type Direction = 'left' | 'right' | 'up' | 'down';

interface CurtainRevealProps {
  children: React.ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  className?: string;
  /** Colour of the sliding panel. */
  panelClassName?: string;
  once?: boolean;
}

const EXIT: Record<Direction, { x?: string; y?: string }> = {
  left: { x: '-101%' },
  right: { x: '101%' },
  up: { y: '-101%' },
  down: { y: '101%' },
};

/**
 * A gold panel wipes away to expose the content beneath, the way a cloth is
 * lifted off a display piece. The content itself scales down from a slight
 * overshoot so the reveal has weight.
 */
export default function CurtainReveal({
  children,
  direction = 'left',
  delay = 0,
  duration = 1,
  className = '',
  panelClassName = 'bg-gradient-to-br from-gold-400 via-gold-500 to-gold-700',
  once = true,
}: CurtainRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: '-12% 0px' });

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        initial={{ scale: 1.14, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: duration * 1.25, delay: delay + 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="h-full w-full"
      >
        {children}
      </motion.div>

      <motion.div
        aria-hidden="true"
        initial={{ x: '0%', y: '0%' }}
        animate={inView ? EXIT[direction] : { x: '0%', y: '0%' }}
        transition={{ duration, delay, ease: [0.76, 0, 0.24, 1] }}
        className={`absolute inset-0 z-20 ${panelClassName}`}
      />
    </div>
  );
}
