'use client';

import React, { ElementType } from 'react';
import { motion } from 'framer-motion';

type Variant = 'default' | 'strong' | 'soft';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
  as?: ElementType;
  /** Lift and warm the rim on hover. */
  interactive?: boolean;
  /** Slow gold hairline sweeping the top edge. */
  sheen?: boolean;
}

const VARIANTS: Record<Variant, string> = {
  default: 'glass',
  strong: 'glass-strong',
  soft: 'glass-soft',
};

/**
 * Frosted surface built on the theme's glass tokens, so it inverts correctly
 * in light mode instead of staying a fixed dark tint.
 */
export default function GlassPanel({
  children,
  className = '',
  variant = 'default',
  as: Component = 'div',
  interactive = false,
  sheen = true,
}: GlassPanelProps) {
  const MotionComponent = motion(Component as ElementType);

  return (
    <MotionComponent
      whileHover={
        interactive
          ? { y: -6, transition: { type: 'spring', stiffness: 260, damping: 22 } }
          : undefined
      }
      className={`relative overflow-hidden ${VARIANTS[variant]} ${
        interactive ? 'transition-colors duration-500 hover:border-gold-500/30' : ''
      } ${className}`}
    >
      {sheen && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/50 to-transparent"
        />
      )}
      {children}
    </MotionComponent>
  );
}
