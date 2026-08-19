'use client';

import { useId } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface CircularTextProps {
  text: string;
  size?: number;
  /** Seconds for one full revolution. Negative reverses. */
  duration?: number;
  className?: string;
  /** Repeats the text around the ring; 2 fills a circle for short phrases. */
  repeat?: number;
  children?: React.ReactNode;
}

/**
 * Type set around a circle — the maker's seal on a certificate. Uses an SVG
 * textPath rather than per-character rotation, so the letterforms stay on their
 * true baseline instead of each glyph being individually skewed.
 *
 * The ring rotates; anything passed as children sits still at the centre.
 */
export default function CircularText({
  text,
  size = 200,
  duration = 26,
  className = '',
  repeat = 1,
  children,
}: CircularTextProps) {
  const reduced = useReducedMotion();
  // Separator so the repeats do not run into each other.
  const phrase = Array.from({ length: repeat }, () => text).join('  •  ') + '  •  ';
  // Per-instance id. Two seals on one page sharing a hard-coded id would leave
  // the second textPath resolving against the first one's <defs>.
  const pathId = `aurum-ring-${useId().replace(/:/g, '')}`;
  const r = 42;

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <motion.svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
        animate={reduced ? {} : { rotate: duration < 0 ? -360 : 360 }}
        transition={{ duration: Math.abs(duration), repeat: Infinity, ease: 'linear' }}
      >
        <defs>
          <path id={pathId} d={`M 50,50 m -${r},0 a ${r},${r} 0 1,1 ${r * 2},0 a ${r},${r} 0 1,1 -${r * 2},0`} />
        </defs>
        <text
          className="fill-accent font-accent uppercase"
          style={{ fontSize: 7, letterSpacing: '0.34em' }}
        >
          <textPath href={`#${pathId}`} startOffset="0%">
            {phrase}
          </textPath>
        </text>
      </motion.svg>

      {/* Hairline rings, counter-rotating so the seal has depth */}
      <motion.span
        aria-hidden="true"
        animate={reduced ? {} : { rotate: -360 }}
        transition={{ duration: Math.abs(duration) * 1.6, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-[14%] rounded-full border border-dashed border-gold-500/25"
      />
      <span
        aria-hidden="true"
        className="absolute inset-[6%] rounded-full border border-gold-500/15"
      />

      {children && <div className="relative z-10">{children}</div>}

      {/* The text is decorative in the ring, so it is announced once here. */}
      <span className="sr-only">{text}</span>
    </div>
  );
}
