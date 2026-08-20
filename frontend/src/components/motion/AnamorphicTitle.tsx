'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

import { desqueeze, streakFlare } from '@/lib/motion';

interface AnamorphicTitleProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p';
  /** Words to set in gold italic, matched case-insensitively without punctuation. */
  highlight?: string[];
  /** Streak colour. Anamorphic flares are blue because the coating is blue. */
  streak?: string;
  /** Second, dimmer streak lower down — a two-element flare. */
  double?: boolean;
  /** Replay every time the title is passed rather than once. */
  replay?: boolean;
}

/**
 * A title arriving through anamorphic glass.
 *
 * Anamorphic lenses compress the image horizontally by about half and the
 * projector stretches it back out. Two artefacts come from that and they are the
 * two the site has never had: the *desqueeze*, where a frame is briefly too
 * narrow before it widens to the right proportions, and the horizontal *streak
 * flare*, which is a highlight smeared sideways — sideways specifically, because
 * the cylindrical element only has power in one axis.
 *
 * This matters against the headings the site already has. `TypeSlamHeading`
 * arrives with force, `SplitText` arrives per character, `MetalText` is a
 * surface, `EchoTrailText` is a repetition. None of them changes the *geometry*
 * of the type, and a horizontal-only squeeze is unmistakably a lens rather than
 * a transition — which makes it the right opener for anything the site is
 * presenting as photographed or projected rather than written.
 *
 * The streak is deliberately not centred on the text. A flare originates at a
 * light source, and a source dead centre behind a headline reads as a glow; put
 * it a third of the way in and the same element reads as a lamp just out of
 * frame. The double option adds the second, dimmer element that real anamorphic
 * glass produces from its rear group — always lower, always shorter.
 *
 * Reduced motion keeps the type at its correct proportions from the first frame
 * and drops both streaks, because a flare with no travel is just a bar.
 */
export default function AnamorphicTitle({
  text,
  className = '',
  as = 'h2',
  highlight = [],
  streak = 'rgb(var(--jade-300))',
  double = false,
  replay = false,
}: AnamorphicTitleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: !replay, margin: '-14% 0px -14% 0px' });
  const reduced = useReducedMotion();

  const Tag = motion[as];
  const run = inView || reduced;

  const marks = highlight.map((w) => w.toLowerCase().replace(/[^a-z0-9]/g, ''));
  const words = text.split(' ');

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* The flare sits behind the type. In front, it would wash the letterforms
          out at exactly the moment they are being read for the first time. */}
      {!reduced && (
        <>
          <motion.span
            aria-hidden="true"
            variants={streakFlare(2.6)}
            initial="hidden"
            animate={run ? 'visible' : 'hidden'}
            style={{
              background: `linear-gradient(90deg, transparent, ${streak} 34%, rgb(var(--gold-100)) 50%, ${streak} 66%, transparent)`,
              transformOrigin: '34% 50%',
            }}
            className="pointer-events-none absolute left-0 top-[38%] h-px w-full blur-[1.5px] blend-screen"
          />
          {double && (
            <motion.span
              aria-hidden="true"
              variants={streakFlare(3.1)}
              initial="hidden"
              animate={run ? 'visible' : 'hidden'}
              style={{
                background: `linear-gradient(90deg, transparent 18%, ${streak} 46%, transparent 74%)`,
                transformOrigin: '52% 50%',
              }}
              className="pointer-events-none absolute left-0 top-[68%] h-px w-2/3 opacity-60 blur-[2px] blend-screen"
            />
          )}
        </>
      )}

      <Tag
        variants={reduced ? undefined : desqueeze}
        initial={reduced ? undefined : 'hidden'}
        animate={run ? 'visible' : 'hidden'}
        style={{ transformOrigin: '50% 50%' }}
        className="relative font-display leading-[0.95] tracking-slab text-primary"
      >
        {words.map((word, i) => {
          const bare = word.toLowerCase().replace(/[^a-z0-9]/g, '');
          const lit = marks.includes(bare);
          return (
            <span key={`${word}-${i}`} className={lit ? 'italic text-accent' : undefined}>
              {word}
              {i < words.length - 1 ? ' ' : ''}
            </span>
          );
        })}
      </Tag>
    </div>
  );
}
