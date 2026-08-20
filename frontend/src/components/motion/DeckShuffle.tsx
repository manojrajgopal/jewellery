'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Shuffle } from 'lucide-react';

import { springsHeavy } from '@/lib/motion';

export interface DeckCard {
  id: string;
  title: string;
  meta: string;
  image: string;
  /** One line the card is worth reading for. */
  note: string;
}

interface DeckShuffleProps {
  cards: DeckCard[];
  className?: string;
}

/**
 * A hand of cards, dealt and cut.
 *
 * The deck reads as a physical object because of three rules that a stack of
 * absolutely-positioned divs does not get for free. Cards behind the front one
 * are offset on an *arc* rather than a straight line, so the stack fans like
 * paper held in a hand. Each card is rotated by a small amount that is stable
 * per card rather than random per render, so the deck does not visibly reshuffle
 * on every state change. And the card leaving the front is thrown sideways and
 * down, because a card taken off a deck goes somewhere — fading it out is what
 * makes a carousel look like software.
 *
 * Drag to cut the deck: a throw past a third of the card's width commits, and
 * anything less springs back. The threshold is on distance rather than velocity
 * because a slow deliberate cut is the gesture people actually make on a trackpad.
 *
 * Keyboard: the buttons are real buttons, and the live region announces the card
 * at the front so the deck is usable without seeing it.
 */
export default function DeckShuffle({ cards, className = '' }: DeckShuffleProps) {
  const reduced = useReducedMotion();
  const [top, setTop] = useState(0);
  /** +1 dealt forward, -1 cut backward. Drives which way a card is thrown. */
  const [dir, setDir] = useState(1);

  const total = cards.length;

  const advance = useCallback(
    (by: number) => {
      setDir(by > 0 ? 1 : -1);
      setTop((t) => (t + by + total) % total);
    },
    [total],
  );

  /** Stable per-card jitter — a hash, not Math.random, so it never re-rolls. */
  const jitter = (i: number) => (((i * 2654435761) % 1000) / 1000 - 0.5) * 2;

  return (
    <div className={className}>
      <div
        className="relative mx-auto aspect-[3/4] w-full max-w-sm select-none"
        style={{ perspective: 1400 }}
      >
        <AnimatePresence initial={false} mode="popLayout">
          {cards.map((card, i) => {
            // Position in the fan: 0 is the front, higher is further back. The
            // modulo keeps the fan continuous as the deck cycles.
            const slot = (i - top + total) % total;
            // Only four are worth drawing; the rest are behind them.
            if (slot > 3) return null;

            const behind = slot > 0;
            const j = jitter(i);

            return (
              <motion.div
                key={card.id}
                initial={
                  reduced
                    ? { opacity: 0 }
                    : {
                        // A card arriving at the back of the fan comes from
                        // further back, not from the side.
                        opacity: 0,
                        y: 40,
                        scale: 0.88,
                        rotate: j * 6,
                      }
                }
                animate={
                  reduced
                    ? { opacity: behind ? 0 : 1, zIndex: 10 - slot }
                    : {
                        // The arc: x grows faster than linearly with depth while
                        // y grows more slowly, which is what fans paper.
                        x: slot * slot * 7 + slot * 6,
                        y: slot * 13,
                        scale: 1 - slot * 0.055,
                        rotate: slot * 3.4 + j * 1.8,
                        opacity: 1 - slot * 0.16,
                        zIndex: 10 - slot,
                        filter: `blur(${slot * 0.9}px) brightness(${1 - slot * 0.08})`,
                      }
                }
                exit={
                  reduced
                    ? { opacity: 0 }
                    : {
                        // Thrown off the table in the direction of travel.
                        x: dir * 320,
                        y: 90,
                        rotate: dir * 26,
                        opacity: 0,
                        transition: { duration: 0.42, ease: [0.4, 0, 0.7, 0.4] },
                      }
                }
                transition={springsHeavy.tray}
                drag={!behind && !reduced ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.16}
                onDragEnd={(_, info) => {
                  if (Math.abs(info.offset.x) > 90) advance(info.offset.x < 0 ? 1 : -1);
                }}
                className={`absolute inset-0 overflow-hidden rounded-3xl border border-hairline bg-surface-raised shadow-lift ${
                  behind ? 'pointer-events-none' : 'cursor-grab active:cursor-grabbing'
                }`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes="(min-width: 640px) 24rem, 90vw"
                  className="object-cover"
                  priority={slot === 0}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[rgb(var(--media-veil))]/95 via-[rgb(var(--media-veil))]/25 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-6">
                  <span className="font-accent text-[10px] uppercase tracking-luxer text-accent">
                    {card.meta}
                  </span>
                  <h3 className="mt-2 font-display text-2xl leading-tight text-on-media">
                    {card.title}
                  </h3>
                  <p className="mt-2 font-sans text-sm font-light leading-relaxed text-on-media-soft">
                    {card.note}
                  </p>
                </div>

                {/* Edge highlight — the lit rim of a card lifted off a stack. */}
                <div className="pointer-events-none absolute inset-0 rounded-3xl shadow-[inset_0_1px_0_0_rgb(var(--hairline)/0.22)]" />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* ---- Controls ---- */}
      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => advance(-1)}
          aria-label="Previous card"
          className="grid h-11 w-11 place-items-center rounded-full border border-hairline text-muted transition-all duration-300 hover:border-accent/60 hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <button
          type="button"
          // A cut of a third of the deck, rather than one card — the point of a
          // shuffle button is that where it lands is not predictable.
          onClick={() => advance(Math.max(2, Math.floor(total / 3)))}
          className="flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-5 py-2.5 font-accent text-[10px] uppercase tracking-luxe text-accent transition-all duration-300 hover:bg-accent hover:text-onaccent"
        >
          <Shuffle className="h-3.5 w-3.5" />
          Cut the deck
        </button>

        <button
          type="button"
          onClick={() => advance(1)}
          aria-label="Next card"
          className="grid h-11 w-11 place-items-center rounded-full border border-hairline text-muted transition-all duration-300 hover:border-accent/60 hover:text-accent"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <p className="mt-4 text-center font-accent text-[10px] uppercase tracking-luxer text-faint nums-tabular">
        {top + 1} / {total}
      </p>

      {/* Announced rather than drawn, so the deck is followable by screen reader. */}
      <p aria-live="polite" className="sr-only">
        {cards[top]?.title}. {cards[top]?.note}
      </p>
    </div>
  );
}
