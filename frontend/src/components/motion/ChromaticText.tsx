'use client';

import React, { ElementType, useState } from 'react';
import { motion } from 'framer-motion';

interface ChromaticTextProps {
  text: string;
  as?: ElementType;
  className?: string;
  /** Pixels of channel separation at full strength. */
  spread?: number;
  /** Split constantly instead of only on hover. */
  always?: boolean;
}

/**
 * Chromatic aberration on type: the red and cyan channels pull apart under the
 * pointer and snap back together when it leaves.
 *
 * Three stacked copies rather than a filter, because `feOffset` on live text
 * blocks selection and copies badly. The middle copy stays selectable; the two
 * ghosts are aria-hidden and blend-screen so they only tint what is behind them.
 */
export default function ChromaticText({
  text,
  as: Component = 'span',
  className = '',
  spread = 3,
  always = false,
}: ChromaticTextProps) {
  const [on, setOn] = useState(false);
  const active = always || on;
  const El = Component as ElementType;

  return (
    <El
      onPointerEnter={() => setOn(true)}
      onPointerLeave={() => setOn(false)}
      className={`relative inline-block ${className}`}
    >
      <motion.span
        aria-hidden="true"
        animate={{ x: active ? -spread : 0, opacity: active ? 0.75 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="pointer-events-none absolute inset-0 select-none text-[#ff2d55] mix-blend-screen"
      >
        {text}
      </motion.span>

      <motion.span
        aria-hidden="true"
        animate={{ x: active ? spread : 0, opacity: active ? 0.75 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="pointer-events-none absolute inset-0 select-none text-[#00e5ff] mix-blend-screen"
      >
        {text}
      </motion.span>

      <span className="relative">{text}</span>
    </El>
  );
}
