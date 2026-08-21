'use client';

import { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';

import { useVisibleInterval } from '@/hooks/useVisibleInterval';

export interface CoverflowItem {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  href?: string;
  meta?: string;
}

interface Coverflow3DProps {
  items: CoverflowItem[];
  className?: string;
  /** Cards visible either side of the centre one. */
  depth?: number;
  /** Advance on its own until the visitor interacts. */
  autoplay?: boolean;
  autoplayMs?: number;
}

/**
 * A coverflow rail: the centred card faces the viewer, its neighbours turn away
 * into depth. Keyboard, drag and wheel all move it.
 *
 * Cards are positioned by their offset from the active index rather than by
 * layout, so the stack is always symmetrical and the z-order is explicit —
 * relying on document order for a 3D stack is what makes cards clip through
 * each other at the turn.
 */
export default function Coverflow3D({
  items,
  className = '',
  depth = 2,
  autoplay = true,
  autoplayMs = 4200,
}: Coverflow3DProps) {
  const [active, setActive] = useState(0);
  const [engaged, setEngaged] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const go = useCallback(
    (dir: number) => {
      setActive((i) => (i + dir + items.length) % items.length);
    },
    [items.length]
  );

  // Autoplay stops for good on the first interaction. Pausing and resuming
  // fights a visitor who is trying to look at one specific piece.
  //
  // It also only advances while the rail is on screen. An unseen carousel that
  // keeps dealing cards is not autoplay, it is a shuffle — a visitor who scrolls
  // to it arrives at whichever piece the clock happened to land on rather than
  // at the first.
  useVisibleInterval(
    rootRef,
    () => go(1),
    !autoplay || engaged || reduced ? null : autoplayMs
  );

  const engage = useCallback(() => setEngaged(true), []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      engage();
      go(-1);
    }
    if (e.key === 'ArrowRight') {
      engage();
      go(1);
    }
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <div
        className="perspective-1500 relative h-[26rem] w-full sm:h-[30rem] lg:h-[34rem]"
        role="group"
        aria-roledescription="carousel"
        aria-label="Featured collections"
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        {items.map((item, i) => {
          // Signed shortest distance around the ring, so the card that leaves
          // one edge re-enters from the other rather than flying across.
          let offset = i - active;
          const half = items.length / 2;
          if (offset > half) offset -= items.length;
          if (offset < -half) offset += items.length;

          const distance = Math.abs(offset);
          const visible = distance <= depth;

          return (
            <motion.div
              key={item.id}
              aria-hidden={offset !== 0}
              animate={{
                x: `${offset * 46}%`,
                z: -distance * 220,
                rotateY: offset * -34,
                scale: 1 - distance * 0.1,
                opacity: visible ? 1 - distance * 0.28 : 0,
                filter: `blur(${distance * 1.6}px)`,
              }}
              transition={
                reduced
                  ? { duration: 0 }
                  : { type: 'spring', stiffness: 130, damping: 22, mass: 0.7 }
              }
              style={{
                // Explicit stacking: the centre card must always win.
                zIndex: items.length - distance,
                transformStyle: 'preserve-3d',
                pointerEvents: offset === 0 ? 'auto' : visible ? 'auto' : 'none',
              }}
              className="absolute left-1/2 top-1/2 h-full w-[74%] -translate-x-1/2 -translate-y-1/2 sm:w-[58%] lg:w-[46%]"
              onClick={() => {
                if (offset !== 0) {
                  engage();
                  go(offset > 0 ? 1 : -1);
                }
              }}
            >
              <Card item={item} active={offset === 0} />
            </motion.div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="mt-8 flex items-center justify-center gap-5">
        <button
          onClick={() => {
            engage();
            go(-1);
          }}
          aria-label="Previous collection"
          className="group flex h-11 w-11 items-center justify-center rounded-full border border-hairline text-muted transition-all duration-300 hover:border-gold-500/50 hover:text-accent"
        >
          <ChevronLeft size={18} strokeWidth={1.6} className="transition-transform group-hover:-translate-x-0.5" />
        </button>

        {/* Dots double as the position readout */}
        <div className="flex items-center gap-2.5">
          {items.map((item, i) => (
            <button
              key={item.id}
              onClick={() => {
                engage();
                setActive(i);
              }}
              aria-label={`Show ${item.title}`}
              aria-current={i === active}
              className="group relative h-2.5 w-2.5"
            >
              <span
                className={`absolute inset-0 rotate-45 border transition-all duration-500 ${
                  i === active
                    ? 'border-accent bg-accent'
                    : 'border-line-strong bg-transparent group-hover:border-gold-500/60'
                }`}
              />
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            engage();
            go(1);
          }}
          aria-label="Next collection"
          className="group flex h-11 w-11 items-center justify-center rounded-full border border-hairline text-muted transition-all duration-300 hover:border-gold-500/50 hover:text-accent"
        >
          <ChevronRight size={18} strokeWidth={1.6} className="transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Live caption for the centred card */}
      <div className="mt-6 min-h-[4.5rem] text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={items[active]?.id}
            initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <h3 className="font-display text-2xl font-light text-primary md:text-3xl">
              {items[active]?.title}
            </h3>
            {items[active]?.subtitle && (
              <p className="mt-1.5 font-sans text-sm font-light text-muted">
                {items[active].subtitle}
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Card({ item, active }: { item: CoverflowItem; active: boolean }) {
  const inner = (
    <div className="group relative h-full w-full overflow-hidden rounded-2xl border border-hairline bg-surface-raised shadow-cinema">
      <Image
        src={item.image}
        alt={item.title}
        fill
        sizes="(max-width: 640px) 74vw, (max-width: 1024px) 58vw, 46vw"
        className="object-cover transition-transform duration-[1200ms] ease-luxury group-hover:scale-[1.06]"
      />

      {/* Legibility veil for the caption sitting on the photograph */}
      <div className="media-veil-soft absolute inset-0" />

      {/* Specular edge that only the centred card carries */}
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-gold-400/30"
        />
      )}

      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
        {item.meta && (
          <span className="mb-3 inline-block font-accent text-[10px] uppercase tracking-luxer text-accent">
            {item.meta}
          </span>
        )}
        <h4 className="font-display text-2xl font-light text-on-media md:text-3xl">
          {item.title}
        </h4>
        {item.href && active && (
          <motion.span
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="mt-4 inline-flex items-center gap-2 font-accent text-[11px] uppercase tracking-luxe text-on-media-soft"
          >
            Explore
            <ArrowUpRight size={14} strokeWidth={1.7} className="text-accent" />
          </motion.span>
        )}
      </div>
    </div>
  );

  // Only the centred card is a link. A turned-away card that navigates is a
  // trap: the visitor is aiming to bring it forward, not to leave the page.
  if (item.href && active) {
    return (
      <Link href={item.href} className="block h-full w-full" data-cursor="View">
        {inner}
      </Link>
    );
  }
  return inner;
}
