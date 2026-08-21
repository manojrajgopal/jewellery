'use client';

import { useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';

interface ScrollTextMaskProps {
  text: string;
  as?: 'p' | 'h2' | 'h3' | 'blockquote';
  className?: string;
  /** Words rendered in the gold accent once they light up. */
  highlightWords?: string[];
  /** How much of the scroll range the reveal occupies. Lower finishes sooner. */
  span?: number;
}

/**
 * Word-by-word illumination driven by scroll position rather than by a timer.
 * Each word sits at a dim baseline and brightens as the passage crosses the
 * viewport, so the reader's eye and the reveal move together — scroll back and
 * the words dim again.
 *
 * This is the one reveal on the site that is deliberately reversible. A
 * one-shot entrance is right for a heading you arrive at; a long passage the
 * reader may scroll through twice should not be frozen after the first pass.
 */
export default function ScrollTextMask({
  text,
  as = 'p',
  className = '',
  highlightWords = [],
  span = 0.72,
}: ScrollTextMaskProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    // Starts once the block is a third of the way up the viewport and completes
    // before it leaves, so the last word lights while the text is still read.
    offset: ['start 0.82', 'end 0.42'],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 400, damping: 38, mass: 0.3 });

  const words = text.split(' ');
  const Tag = as;

  const isHighlighted = (word: string) => {
    const clean = word.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    return highlightWords.some((h) => h.toLowerCase() === clean);
  };

  return (
    <div ref={ref}>
      <Tag className={className}>
        {words.map((word, i) => {
          // Each word owns a slice of the range, and the slices overlap so the
          // brightening travels as a wave rather than as a row of switches.
          const start = (i / words.length) * span;
          const end = start + (1 / words.length) * span * 2.4;

          return (
            <Word
              key={`${word}-${i}`}
              word={word}
              progress={progress}
              start={start}
              end={end}
              highlight={isHighlighted(word)}
              reduced={!!reduced}
            />
          );
        })}
      </Tag>
    </div>
  );
}

function Word({
  word,
  progress,
  start,
  end,
  highlight,
  reduced,
}: {
  word: string;
  progress: MotionValue<number>;
  start: number;
  end: number;
  highlight: boolean;
  reduced: boolean;
}) {
  const opacity = useTransform(progress, [start, end], [0.18, 1]);
  const y = useTransform(progress, [start, end], [8, 0]);
  const blur = useTransform(progress, [start, end], [4, 0]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);

  if (reduced) {
    return (
      <span className={highlight ? 'italic text-accent' : ''}>
        {word}
        {' '}
      </span>
    );
  }

  return (
    <motion.span
      style={{ opacity, y, filter }}
      className={`inline-block ${highlight ? 'italic text-accent' : ''}`}
    >
      {word}
      <span>&nbsp;</span>
    </motion.span>
  );
}
