'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface RotatingWords3DProps {
  words: string[];
  className?: string;
  /** Milliseconds each word is held. */
  hold?: number;
  /** 'x' tumbles forward like a split-flap; 'y' turns like a carousel. */
  axis?: 'x' | 'y';
}

/**
 * Words that tumble on a real axis rather than cross-fading — the split-flap
 * board in a station hall, or the drum of a slot machine.
 *
 * Two panels only: the outgoing word rotating away and the incoming one
 * rotating in. Because both share a perspective container and the rotation
 * origin sits at the centre of the line, the pair reads as one solid object
 * turning, which a stack of absolutely positioned fades never does.
 */
export default function RotatingWords3D({
  words,
  className = '',
  hold = 2400,
  axis = 'x',
}: RotatingWords3DProps) {
  const [i, setI] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (words.length < 2) return;
    const id = window.setInterval(() => setI((v) => (v + 1) % words.length), hold);
    return () => window.clearInterval(id);
  }, [words.length, hold]);

  const word = words[i] ?? '';

  if (reduced) {
    return <span className={className}>{word}</span>;
  }

  const from = axis === 'x' ? { rotateX: -92, y: '55%' } : { rotateY: 88, x: '35%' };
  const to = axis === 'x' ? { rotateX: 92, y: '-55%' } : { rotateY: -88, x: '-35%' };

  return (
    <span
      className={`relative inline-grid overflow-hidden align-bottom ${className}`}
      style={{ perspective: '600px' }}
      aria-live="polite"
    >
      {/* A hidden copy of the longest word holds the box open, so the line
          around it does not reflow on every change. */}
      <span aria-hidden="true" className="invisible col-start-1 row-start-1 whitespace-nowrap">
        {words.reduce((a, b) => (b.length > a.length ? b : a), '')}
      </span>

      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={word}
          initial={{ opacity: 0, ...from }}
          animate={{ opacity: 1, rotateX: 0, rotateY: 0, x: 0, y: 0 }}
          exit={{ opacity: 0, ...to }}
          transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
          className="col-start-1 row-start-1 whitespace-nowrap"
          style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
        >
          {word}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
