'use client';

import { useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';

type Mode = 'chars' | 'words' | 'lines';

interface SplitTextProps {
  text: string;
  as?: keyof JSX.IntrinsicElements;
  mode?: Mode;
  className?: string;
  /** Words rendered in the gold italic accent style. */
  highlightWords?: string[];
  delay?: number;
  stagger?: number;
  /** Blur-in adds depth; turn off for very long passages. */
  blur?: boolean;
  once?: boolean;
}

/**
 * Masked per-character (or per-word) entrance. Each glyph rises out of an
 * overflow-hidden box with an optional blur, so headings assemble themselves.
 */
export default function SplitText({
  text,
  as = 'p',
  mode = 'chars',
  className = '',
  highlightWords = [],
  delay = 0,
  stagger,
  blur = true,
  once = true,
}: SplitTextProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once, margin: '-12% 0px' });

  const words = text.split(' ');
  const step = stagger ?? (mode === 'chars' ? 0.028 : 0.07);

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: step, delayChildren: delay } },
  };

  const piece: Variants = {
    hidden: {
      y: '110%',
      opacity: 0,
      ...(blur ? { filter: 'blur(8px)' } : {}),
    },
    visible: {
      y: '0%',
      opacity: 1,
      ...(blur ? { filter: 'blur(0px)' } : {}),
      transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Tag = motion(as as any);

  const isHighlighted = (word: string) => {
    // Strip punctuation so 'Gold,' still matches the highlight 'Gold'.
    const clean = word.replace(/[^a-zA-Z0-9]/g, '');
    return highlightWords.some(
      (h) => h.toLowerCase() === clean.toLowerCase() || h.toLowerCase() === word.toLowerCase()
    );
  };

  return (
    <Tag
      ref={ref}
      variants={container}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
      aria-label={text}
    >
      {words.map((word, wi) => {
        const highlight = isHighlighted(word);
        const accent = highlight ? 'text-accent italic font-light' : '';

        if (mode === 'words') {
          return (
            <span key={wi} className="inline-block overflow-hidden align-bottom" aria-hidden="true">
              <motion.span variants={piece} className={`inline-block ${accent}`}>
                {word}
              </motion.span>
              <span className="inline-block">&nbsp;</span>
            </span>
          );
        }

        return (
          <span key={wi} className="inline-block whitespace-nowrap" aria-hidden="true">
            {Array.from(word).map((char, ci) => (
              <span key={ci} className="inline-block overflow-hidden align-bottom leading-[1.15]">
                <motion.span variants={piece} className={`inline-block ${accent}`}>
                  {char}
                </motion.span>
              </span>
            ))}
            <span className="inline-block">&nbsp;</span>
          </span>
        );
      })}
    </Tag>
  );
}
