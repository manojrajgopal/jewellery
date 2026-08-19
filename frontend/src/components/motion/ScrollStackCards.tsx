'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

export interface StackCard {
  id: string;
  kicker?: string;
  title: string;
  body?: string;
  image?: string;
  meta?: string[];
  accent?: 'gold' | 'jade' | 'amethyst' | 'burgundy' | 'rose';
}

interface ScrollStackCardsProps {
  cards: StackCard[];
  className?: string;
  /** Vertical offset each settled card keeps, so the stack stays readable. */
  offset?: number;
  /** How much a card shrinks once it has been covered. */
  shrink?: number;
}

const ACCENT_RING: Record<NonNullable<StackCard['accent']>, string> = {
  gold: 'ring-gold-500/25',
  jade: 'ring-jade-500/25',
  amethyst: 'ring-amethyst-500/25',
  burgundy: 'ring-burgundy-500/25',
  rose: 'ring-rose-500/25',
};

const ACCENT_TEXT: Record<NonNullable<StackCard['accent']>, string> = {
  gold: 'text-accent',
  jade: 'text-jade-300',
  amethyst: 'text-amethyst-300',
  burgundy: 'text-burgundy-300',
  rose: 'text-rose-300',
};

/**
 * Cards that pile up as the page scrolls: each one sticks at the top of the
 * viewport while the next slides over it, and the covered cards shrink and dim
 * back into the stack.
 *
 * The mechanism is CSS `position: sticky` per card, not a pinned scene. That
 * matters: a pinned container has to hold the scroll and translate its children,
 * which means it fights the page's smooth scroller and breaks anchor links
 * through it. Sticky children scroll natively — the page never stops moving, and
 * the effect costs one transform per card.
 *
 * Each card's own scroll range is measured against the *stack*, not the viewport,
 * so the shrink is keyed to how many cards have landed on top of it rather than
 * to where it happens to be on screen. That is what keeps the depth consistent
 * whether the visitor scrolls slowly or flicks through.
 */
export default function ScrollStackCards({
  cards,
  className = '',
  offset = 26,
  shrink = 0.06,
}: ScrollStackCardsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  return (
    <div ref={ref} className={`relative ${className}`}>
      {cards.map((card, i) => (
        <Card
          key={card.id}
          card={card}
          index={i}
          total={cards.length}
          progress={scrollYProgress}
          offset={offset}
          shrink={shrink}
          reduced={Boolean(reduced)}
        />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function Card({
  card,
  index,
  total,
  progress,
  offset,
  shrink,
  reduced,
}: {
  card: StackCard;
  index: number;
  total: number;
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
  offset: number;
  shrink: number;
  reduced: boolean;
}) {
  // The slice of the stack's scroll during which this card is being covered.
  // Card i starts being covered when card i+1 begins its approach.
  const span = 1 / total;
  const from = index * span;
  const to = Math.min((index + 1) * span, 1);

  // The last card is never covered, so it holds full size and opacity.
  const isLast = index === total - 1;

  const scale = useTransform(progress, [from, to], [1, isLast ? 1 : 1 - shrink]);
  const opacity = useTransform(progress, [from, to], [1, isLast ? 1 : 0.42]);
  const blur = useTransform(progress, [from, to], [0, isLast ? 0 : 4]);
  const filter = useTransform(blur, (b) => `blur(${b.toFixed(2)}px)`);
  // A slight rotation as it settles, so the pile reads as physical rather than
  // as a set of concentric rectangles.
  const rotate = useTransform(
    progress,
    [from, to],
    [0, isLast ? 0 : index % 2 === 0 ? -0.8 : 0.8]
  );

  const accent = card.accent ?? 'gold';

  return (
    <div
      className="sticky mb-6 last:mb-0"
      style={{
        // Each card parks a little lower than the one before, which is what keeps
        // the edges of the buried cards visible.
        top: `calc(6rem + ${index * offset}px)`,
        zIndex: index + 1,
      }}
    >
      <motion.article
        style={reduced ? undefined : { scale, opacity, filter, rotate }}
        className={`relative overflow-hidden rounded-3xl border border-hairline bg-surface-raised shadow-cinema ring-1 ring-inset ${ACCENT_RING[accent]}`}
      >
        <div className="grid gap-0 md:grid-cols-5">
          {card.image && (
            <div className="relative aspect-[4/3] md:col-span-2 md:aspect-auto">
              <Image
                src={card.image}
                alt={card.title}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent to-surface-raised/70 md:to-surface-raised"
              />
            </div>
          )}

          <div
            className={`relative flex flex-col justify-center gap-4 p-8 md:p-12 ${
              card.image ? 'md:col-span-3' : 'md:col-span-5'
            }`}
          >
            {/* Index, printed large and faint, so a buried card is still
                identifiable by its number alone. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-6 top-4 font-display text-6xl leading-none text-accent/[0.07] md:text-8xl"
            >
              {String(index + 1).padStart(2, '0')}
            </span>

            {card.kicker && (
              <span
                className={`font-accent text-[10px] uppercase tracking-luxest ${ACCENT_TEXT[accent]}`}
              >
                {card.kicker}
              </span>
            )}

            <h3 className="font-display text-2xl font-light leading-tight text-primary md:text-4xl">
              {card.title}
            </h3>

            {card.body && (
              <p className="max-w-prose font-sans text-sm font-light leading-relaxed text-muted md:text-base">
                {card.body}
              </p>
            )}

            {card.meta && card.meta.length > 0 && (
              <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-2 border-t border-hairline pt-4">
                {card.meta.map((m) => (
                  <li
                    key={m}
                    className="font-accent text-[9px] uppercase tracking-luxe text-faint"
                  >
                    {m}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Hairline travelling the top edge, so the live card is obvious */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"
        />
      </motion.article>
    </div>
  );
}
