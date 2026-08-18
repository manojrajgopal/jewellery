'use client';

import React from 'react';
import { motion } from 'framer-motion';

const sizeMap: Record<string, number> = {
  sm: 200,
  md: 400,
  lg: 600,
  xl: 800,
};

const positionMap: Record<string, React.CSSProperties> = {
  'top-left': { top: '-10%', left: '-10%' },
  'top-right': { top: '-10%', right: '-10%' },
  'bottom-left': { bottom: '-10%', left: '-10%' },
  'bottom-right': { bottom: '-10%', right: '-10%' },
  center: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
  left: { top: '30%', left: '-10%' },
  right: { top: '30%', right: '-10%' },
};

const blurMap: Record<string, string> = {
  sm: 'blur-[60px]',
  md: 'blur-[100px]',
  lg: 'blur-[120px]',
  xl: 'blur-[160px]',
  '2xl': 'blur-[200px]',
  '3xl': 'blur-[240px]',
};

interface GradientOrbProps {
  color?: string;
  size?: number | string;
  position?: string | { top?: string; left?: string; right?: string; bottom?: string };
  blur?: string;
  className?: string;
}

export default function GradientOrb({
  color = '#d4a843',
  size = 400,
  position = 'top-left',
  blur = 'lg',
  className = '',
}: GradientOrbProps) {
  const resolvedSize = typeof size === 'string' ? (sizeMap[size] || 400) : size;
  const resolvedPosition = typeof position === 'string' ? (positionMap[position] || positionMap['top-left']) : position;
  const resolvedBlur = blurMap[blur] || (blur.startsWith('blur') ? blur : `blur-[${blur}]`);

  // Resolve color — support tailwind-like names or raw hex
  const resolvedColor = color.startsWith('#') ? color : 
    color === 'gold' ? '#d4a843' :
    color === 'gold-500' ? '#d4a843' :
    color === 'gold-700' ? '#a37c2c' :
    color === 'gold-300' ? '#f0d48a' :
    color === 'rosegold' ? '#e8b4a2' :
    color === 'platinum' ? '#c0c0c8' :
    '#d4a843';

  return (
    <motion.div
      animate={{
        y: [0, -20, 0],
        x: [0, 10, 0],
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{
        ...resolvedPosition,
        width: resolvedSize,
        height: resolvedSize,
        background: `radial-gradient(circle, ${resolvedColor}40 0%, transparent 70%)`,
      }}
      className={`absolute pointer-events-none rounded-full ${resolvedBlur} ${className}`}
    />
  );
}
