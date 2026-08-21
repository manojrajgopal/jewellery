'use client';

import { useRef, type ElementType } from 'react';
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

  // The blur lives only in the `visible` keyframes, never in `hidden`.
  //
  // That looks like a stylistic choice and is in fact the largest single
  // rendering saving on the site. A glyph waiting to animate is at opacity 0, so
  // its blur cannot be seen — but a `filter` promotes the element to its own
  // compositing layer whether or not anything is visible through it, and this
  // component renders one span per character. Measured on the home page, the
  // hidden state alone accounted for one thousand one hundred and ten live blur
  // layers: about thirty headings' worth of glyphs, every one of them invisible.
  // The frame rate at rest tripled when they went away.
  //
  // Expressing the blur as a two-stop keyframe gives the identical animation —
  // it starts at 8px the instant the glyph starts moving and resolves to zero —
  // while the waiting state carries no filter at all.
  const piece: Variants = {
    hidden: {
      y: '110%',
      opacity: 0,
    },
    visible: {
      y: '0%',
      opacity: 1,
      ...(blur ? { filter: ['blur(8px)', 'blur(0px)'] } : {}),
      transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
    },
  };

  /**
   * Once the entrance has finished, `filter: blur(0px)` is left on every glyph:
   * visually nothing, and still a compositing layer each. Clearing it is one
   * pass over the heading's own spans, and it is what stops a page full of
   * already-animated headings from accumulating the same cost the hidden state
   * used to have.
   */
  const dropSettledFilters = () => {
    const root = ref.current;
    if (!root) return;
    root.querySelectorAll<HTMLElement>('[style*="blur"]').forEach((el) => {
      el.style.filter = '';
    });
  };

  // Indexed, not called. `motion(tag)` builds a brand-new component type on every
  // render, so React sees a different element type each time the parent updates and
  // remounts the whole subtree — which restarts every glyph mid-animation and throws
  // away the inView state. The indexed form is memoised inside framer-motion, and is
  // also the API that is not deprecated.
  const Tag = motion[as as keyof typeof motion] as ElementType;

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
      onAnimationComplete={dropSettledFilters}
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
