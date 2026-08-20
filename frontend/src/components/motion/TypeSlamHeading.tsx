'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

import { easeLens } from '@/lib/motion';

interface TypeSlamHeadingProps {
  /** Lines are slammed one after another, not word by word. */
  lines: string[];
  /** Words rendered in gold italic. Matched case-insensitively, punctuation ignored. */
  highlightWords?: string[];
  as?: 'h1' | 'h2' | 'h3' | 'p';
  className?: string;
  /** Seconds between one line landing and the next starting. */
  gap?: number;
  /** Draw the displaced-air ring behind each landing. */
  shockwave?: boolean;
}

/**
 * Strip punctuation so 'light.' still matches a highlight of 'light'.
 *
 * Written as an explicit character class rather than with \p{L}: unicode
 * property escapes need an ES2018 target and this project compiles lower, so
 * the /u form is a build error rather than a preference.
 */
const bare = (w: string) => w.replace(/[^A-Za-z0-9À-ɏ]/g, '').toLowerCase();

/**
 * A title that lands rather than arrives.
 *
 * Every character-stagger heading on the site fades type in gently, which is
 * right for editorial and wrong for a title card. This is the opposite gesture:
 * each line comes in oversized and out of focus, collapses to its final size in
 * under half a second on a shutter curve, and throws a ring of displaced air as
 * it hits.
 *
 * Three details do the work. The letter-spacing collapses along with the scale,
 * so the line appears to *compress* rather than merely shrink. The blur is tied
 * to the same curve, so the moment of impact is the moment it becomes readable.
 * And the shockwave is a separate element on a slower easeOut, so it outlives
 * the impact by about 400ms — matching them makes the whole thing read as one
 * scale animation instead of as a cause and an effect.
 *
 * Lines are `<span>`s inside a single heading element and the text is present in
 * the DOM as ordinary text, so the semantic heading and its content survive with
 * animation disabled. Under a reduced-motion preference the lines simply appear.
 */
export default function TypeSlamHeading({
  lines,
  highlightWords = [],
  as: Tag = 'h2',
  className = '',
  gap = 0.16,
  shockwave = true,
}: TypeSlamHeadingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  // Once, and late: a title card that replays on every pass loses its impact.
  const inView = useInView(ref, { once: true, margin: '-12% 0px -18% 0px' });

  const highlights = new Set(highlightWords.map(bare));

  return (
    <div ref={ref} className={`relative ${className}`}>
      <Tag className="relative m-0">
        {lines.map((line, li) => {
          const delay = li * (0.42 + gap);

          return (
            <span key={line} className="relative block overflow-visible">
              {shockwave && !reduced && (
                <motion.span
                  aria-hidden="true"
                  initial={{ scale: 0.35, opacity: 0 }}
                  animate={inView ? { scale: 2.4, opacity: [0, 0.42, 0] } : undefined}
                  transition={{
                    duration: 0.95,
                    // Fired a hair before the line lands, so the ring is already
                    // expanding at the moment of impact.
                    delay: delay + 0.3,
                    times: [0, 0.2, 1],
                    ease: 'easeOut',
                  }}
                  className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-full w-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(var(--gold-400)/0.4),transparent)] blur-xl"
                />
              )}

              <motion.span
                initial={
                  reduced
                    ? { opacity: 0 }
                    : { scale: 1.75, opacity: 0, filter: 'blur(15px)', letterSpacing: '0.26em' }
                }
                animate={
                  inView
                    ? reduced
                      ? { opacity: 1 }
                      : { scale: 1, opacity: 1, filter: 'blur(0px)', letterSpacing: '0em' }
                    : undefined
                }
                transition={
                  reduced
                    ? { duration: 0.3, delay: li * 0.06 }
                    : { duration: 0.52, delay, ease: easeLens.shutter }
                }
                // Origin at the left edge keeps a left-aligned heading from
                // sliding sideways as it compresses.
                className="block origin-left will-change-transform"
              >
                {line.split(' ').map((word, wi) => {
                  const hot = highlights.has(bare(word));
                  return (
                    <span key={`${word}-${wi}`}>
                      {wi > 0 && ' '}
                      <span className={hot ? 'italic text-accent' : undefined}>{word}</span>
                    </span>
                  );
                })}
              </motion.span>
            </span>
          );
        })}
      </Tag>
    </div>
  );
}
