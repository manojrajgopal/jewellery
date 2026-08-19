'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface FlipCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
  /** 'hover' turns on pointer-over; 'click' needs a deliberate press. */
  trigger?: 'hover' | 'click';
  /** Turn on the horizontal axis instead of the vertical one. */
  axis?: 'y' | 'x';
  /** Accessible name for the flip control when triggered by click. */
  label?: string;
}

/**
 * A card that turns over to reveal its reverse — a certificate, a spec, a price.
 *
 * Both faces are always in the DOM and hidden by backface-visibility rather
 * than by conditional rendering. Swapping the children on flip loses focus and
 * restarts any animation on the incoming face halfway through the turn.
 *
 * Click is the default on touch (there is no hover to speak of) and hover is
 * upgraded to click for keyboard users, who get a real button either way.
 */
export default function FlipCard({
  front,
  back,
  className = '',
  trigger = 'hover',
  axis = 'y',
  label = 'Turn card over',
}: FlipCardProps) {
  const [flipped, setFlipped] = useState(false);
  const reduced = useReducedMotion();

  const rotation = flipped ? 180 : 0;
  const transform = axis === 'y' ? { rotateY: rotation } : { rotateX: rotation };
  const faceBack = axis === 'y' ? 'rotateY(180deg)' : 'rotateX(180deg)';

  const interaction =
    trigger === 'hover'
      ? {
          onPointerEnter: (e: React.PointerEvent) => {
            // Only a real hover flips; a touch "hover" would flip then
            // immediately fire the click and flip back.
            if (e.pointerType === 'mouse') setFlipped(true);
          },
          onPointerLeave: (e: React.PointerEvent) => {
            if (e.pointerType === 'mouse') setFlipped(false);
          },
        }
      : {};

  return (
    <div className={`perspective-1500 ${className}`}>
      <button
        type="button"
        aria-label={label}
        aria-pressed={flipped}
        onClick={() => setFlipped((f) => !f)}
        onFocus={() => trigger === 'hover' && setFlipped(true)}
        onBlur={() => trigger === 'hover' && setFlipped(false)}
        {...interaction}
        className="relative block h-full w-full text-left"
        data-cursor="Flip"
      >
        <motion.div
          animate={transform}
          transition={
            reduced
              ? { duration: 0 }
              : { type: 'spring', stiffness: 120, damping: 18, mass: 0.9 }
          }
          style={{ transformStyle: 'preserve-3d' }}
          className="relative h-full w-full"
        >
          <div className="backface-hidden absolute inset-0 h-full w-full">{front}</div>
          <div
            className="backface-hidden absolute inset-0 h-full w-full"
            style={{ transform: faceBack }}
          >
            {back}
          </div>
        </motion.div>
      </button>
    </div>
  );
}
