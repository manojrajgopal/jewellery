'use client';

import React from 'react';
import { motion } from 'framer-motion';

const SIZE_MAP: Record<string, number> = { sm: 220, md: 420, lg: 640, xl: 860, '2xl': 1100 };

const POSITION_MAP: Record<string, React.CSSProperties> = {
  'top-left': { top: '-12%', left: '-12%' },
  'top-right': { top: '-12%', right: '-12%' },
  'bottom-left': { bottom: '-12%', left: '-12%' },
  'bottom-right': { bottom: '-12%', right: '-12%' },
  center: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
  left: { top: '28%', left: '-14%' },
  right: { top: '28%', right: '-14%' },
  top: { top: '-18%', left: '50%', transform: 'translateX(-50%)' },
  bottom: { bottom: '-18%', left: '50%', transform: 'translateX(-50%)' },
};

const BLUR_MAP: Record<string, string> = {
  sm: 'blur-[60px]',
  md: 'blur-[100px]',
  lg: 'blur-[130px]',
  xl: 'blur-[170px]',
  '2xl': 'blur-[210px]',
  '3xl': 'blur-[250px]',
};

/** Named colours resolve through CSS variables so orbs follow the theme. */
const COLOR_MAP: Record<string, string> = {
  gold: 'var(--gold-500)',
  'gold-300': 'var(--gold-300)',
  'gold-500': 'var(--gold-500)',
  'gold-700': 'var(--gold-700)',
  champagne: 'var(--champagne-500)',
  rosegold: 'var(--rose-500)',
  rose: 'var(--rose-500)',
  jade: 'var(--jade-500)',
  amethyst: 'var(--amethyst-500)',
  burgundy: 'var(--burgundy-500)',
  platinum: 'var(--platinum)',
  diamond: 'var(--diamond)',
};

interface GradientOrbProps {
  color?: string;
  size?: number | string;
  position?: string | { top?: string; left?: string; right?: string; bottom?: string };
  blur?: string;
  className?: string;
  /** Opacity at the orb's core, 0–1. */
  intensity?: number;
}

/**
 * A soft bloom of coloured light. Drifts and breathes on a long loop so
 * backgrounds are never completely still.
 */
export default function GradientOrb({
  color = 'gold',
  size = 420,
  position = 'top-left',
  blur = 'lg',
  className = '',
  intensity = 0.28,
}: GradientOrbProps) {
  const resolvedSize = typeof size === 'string' ? SIZE_MAP[size] ?? 420 : size;
  const resolvedPosition =
    typeof position === 'string' ? POSITION_MAP[position] ?? POSITION_MAP['top-left'] : position;
  const resolvedBlur = BLUR_MAP[blur] ?? (blur.startsWith('blur') ? blur : BLUR_MAP.lg);

  const rgb = color.startsWith('#')
    ? null
    : COLOR_MAP[color] ?? COLOR_MAP.gold;

  // --bloom scales every additive glow down in the light theme, where the same
  // alpha that reads as light on obsidian reads as grubby haze on cream.
  const core = rgb
    ? `rgb(${rgb} / calc(${intensity} * var(--bloom, 1)))`
    : `${color}${Math.round(intensity * 255).toString(16).padStart(2, '0')}`;

  return (
    <motion.div
      aria-hidden="true"
      animate={{
        y: [0, -26, 8, 0],
        x: [0, 14, -10, 0],
        scale: [1, 1.08, 0.96, 1],
      }}
      transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        ...resolvedPosition,
        width: resolvedSize,
        height: resolvedSize,
        background: `radial-gradient(circle, ${core} 0%, transparent 68%)`,
      }}
      className={`pointer-events-none absolute rounded-full ${resolvedBlur} ${className}`}
    />
  );
}
