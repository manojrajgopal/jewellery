'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

import { collections } from '@/data/collections';
import { easeCine, springsSilk } from '@/lib/motion';

/**
 * The collections plotted against each other rather than listed.
 *
 * A list of collections asks a visitor to hold six descriptions in their head
 * and compare them. Nobody does this. What they actually want to know is which
 * one is *theirs*, and that is a question about two things and not six: how loud
 * they want to be, and when they intend to wear it.
 *
 * So both axes are real decisions rather than categories:
 *
 *  - **Quiet ↔ Declarative.** Not price. A plain platinum band and a cocktail
 *    ring can cost the same and could not be further apart on this axis, and
 *    conflating the two is why price filters are so bad at this job.
 *  - **Daily ↔ Occasion.** Also not price, and largely a question of whether the
 *    piece survives a keyboard, a handbag and a coat sleeve.
 *
 * The interaction is a draggable reticle rather than a pair of sliders. Two
 * sliders describe a point too, but they make the visitor build the point in
 * their head from two numbers; a reticle lets them *aim*, and the nearest
 * collection updates as they do. The distance readout stays visible because the
 * honest answer is sometimes "nothing here is close to what you want", and a
 * ranked list can never say that.
 *
 * Positions are authored per collection below rather than derived from the
 * catalogue. They are editorial judgements about what a collection is *for*, and
 * no amount of averaging over metal types and price points would recover them.
 */
interface Placed {
  id: string;
  /** 0 quiet → 1 declarative. */
  voice: number;
  /** 0 daily → 1 occasion. */
  occasion: number;
  /** The one-line reason it sits there. */
  why: string;
}

const PLACED: Placed[] = [
  {
    id: 'everyday-luxe',
    voice: 0.14,
    occasion: 0.1,
    why: 'Designed to be forgotten about by ten in the morning, which is the hardest brief in the house.',
  },
  {
    id: 'bridal-elegance',
    voice: 0.42,
    occasion: 0.34,
    why: 'Worn on one enormous day and then every ordinary day afterwards — the only collection that has to work at both ends of this chart.',
  },
  {
    id: 'heritage',
    voice: 0.68,
    occasion: 0.72,
    why: 'Antique weight and antique scale. Reads as inherited rather than as bought, which is exactly the intention.',
  },
  {
    id: 'statement',
    voice: 0.94,
    occasion: 0.9,
    why: 'The only collection here that is meant to be the first thing anybody says to you.',
  },
  {
    id: 'gemstone',
    voice: 0.72,
    occasion: 0.5,
    why: 'Colour does the declaring, so the settings can stay quiet and the piece still carries a room.',
  },
  {
    id: 'mens',
    voice: 0.36,
    occasion: 0.24,
    why: 'Weight without ornament. Signet, band, cufflink — pieces judged on their edges rather than their surface.',
  },
];

const START = { voice: 0.4, occasion: 0.35 };

export default function CollectionCompass() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [aim, setAim] = useState(START);
  const [dragging, setDragging] = useState(false);

  const points = useMemo(
    () =>
      PLACED.map((p) => {
        const c = collections.find((x) => x.id === p.id);
        return { ...p, name: c?.name ?? p.id, slug: c?.slug ?? p.id, image: c?.image };
      }),
    []
  );

  /* Ranked by plain Euclidean distance. The axes are both 0–1 and both are real
     decisions, so neither needs weighting — and weighting one would be a claim
     about which question matters more that we are in no position to make. */
  const ranked = useMemo(
    () =>
      points
        .map((p) => ({
          ...p,
          distance: Math.hypot(p.voice - aim.voice, p.occasion - aim.occasion),
        }))
        .sort((a, b) => a.distance - b.distance),
    [points, aim]
  );

  const nearest = ranked[0];

  const setFromPointer = (clientX: number, clientY: number) => {
    const box = ref.current?.getBoundingClientRect();
    if (!box) return;
    setAim({
      voice: Math.min(1, Math.max(0, (clientX - box.left) / box.width)),
      occasion: Math.min(1, Math.max(0, (clientY - box.top) / box.height)),
    });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = 0.06;
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    const move = moves[e.key];
    if (!move) return;
    e.preventDefault();
    setAim((p) => ({
      voice: Math.min(1, Math.max(0, p.voice + move[0])),
      occasion: Math.min(1, Math.max(0, p.occasion + move[1])),
    }));
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
        {/* ---- The chart ---- */}
        <div>
          <div
            ref={ref}
            onPointerDown={(e) => {
              setDragging(true);
              (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
              setFromPointer(e.clientX, e.clientY);
            }}
            onPointerMove={(e) => dragging && setFromPointer(e.clientX, e.clientY)}
            onPointerUp={() => setDragging(false)}
            onPointerCancel={() => setDragging(false)}
            className={`relative aspect-square w-full select-none rounded-2xl border border-hairline bg-surface-sunken/50 ${
              dragging ? 'cursor-grabbing-any' : 'cursor-aim'
            }`}
          >
            {/* Grid. Deliberately faint: it is a reference, not the subject. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-2xl bg-grid-hairline bg-grid opacity-60"
            />
            {/* Axes through the middle, so the four quadrants read as quadrants. */}
            <span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 h-full w-px bg-line/40" />
            <span aria-hidden="true" className="pointer-events-none absolute left-0 top-1/2 h-px w-full bg-line/40" />

            {/* Axis labels, at the ends they describe. */}
            <span className="pointer-events-none absolute bottom-3 left-4 font-accent text-[9px] uppercase tracking-luxe text-faint">
              Quiet
            </span>
            <span className="pointer-events-none absolute bottom-3 right-4 font-accent text-[9px] uppercase tracking-luxe text-faint">
              Declarative
            </span>
            <span className="pointer-events-none absolute left-4 top-3 font-accent text-[9px] uppercase tracking-luxe text-faint">
              Every day
            </span>
            <span className="pointer-events-none absolute bottom-10 left-4 font-accent text-[9px] uppercase tracking-luxe text-faint">
              Occasion
            </span>

            {/* The collections. Size carries nothing — every one of these is a
                real option, and scaling by popularity would be an argument
                dressed as a chart. */}
            {ranked.map((p, i) => {
              const near = i === 0;
              return (
                <motion.div
                  key={p.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${p.voice * 100}%`, top: `${p.occasion * 100}%` }}
                  animate={{ scale: near ? 1 : 0.9, opacity: near ? 1 : 0.62 }}
                  transition={reduced ? { duration: 0 } : springsSilk.readout}
                >
                  <Link
                    href={`/collections/${p.slug}`}
                    className="group flex flex-col items-center gap-2"
                  >
                    <span
                      className={`block h-3 w-3 rotate-45 transition-colors duration-400 ${
                        near ? 'bg-accent shadow-gold' : 'bg-primary/40 group-hover:bg-accent'
                      }`}
                    />
                    <span
                      className={`whitespace-nowrap font-accent text-[9px] uppercase tracking-luxe transition-colors duration-400 ${
                        near ? 'text-accent' : 'text-faint group-hover:text-accent'
                      }`}
                    >
                      {p.name}
                    </span>
                  </Link>
                </motion.div>
              );
            })}

            {/* The line from the aim to the nearest collection. This is the whole
                readout: it says both *which* and *how far*, and a ranked list
                cannot say the second thing at all. */}
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <motion.line
                x1={aim.voice * 100}
                y1={aim.occasion * 100}
                x2={nearest.voice * 100}
                y2={nearest.occasion * 100}
                stroke="rgb(var(--accent))"
                strokeOpacity={0.5}
                strokeWidth={0.4}
                strokeDasharray="1.5 1.5"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            {/* The reticle. */}
            <button
              type="button"
              onKeyDown={onKeyDown}
              aria-label={`Your position — nearest collection is ${nearest.name}. Move with the arrow keys.`}
              className="absolute z-10 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              style={{ left: `${aim.voice * 100}%`, top: `${aim.occasion * 100}%` }}
            >
              <span className="absolute inset-0 rounded-full border border-accent/60" />
              <span className="absolute inset-[35%] rounded-full bg-accent" />
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-accent/40"
              />
              <span
                aria-hidden="true"
                className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-accent/40"
              />
            </button>
          </div>

          <p className="mt-4 font-sans text-sm font-light leading-relaxed text-muted">
            Drag the reticle, or use the arrow keys. Neither axis is price — a plain platinum band
            and a cocktail ring can cost the same and sit at opposite corners of this chart, which is
            precisely why a price filter is so bad at answering this question.
          </p>
        </div>

        {/* ---- What you aimed at ---- */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <motion.div
            key={nearest.id}
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easeCine.glass }}
          >
            <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
              Closest to where you aimed
            </p>
            <h3 className="mt-2 font-display text-3xl text-primary">{nearest.name}</h3>
            <p className="mt-4 font-display text-lg italic leading-snug text-primary">
              {nearest.why}
            </p>

            {/* The distance, in words. Under 0.15 is a genuine match; past 0.4
                the honest answer is that the visitor wants something we would
                have to make. */}
            <p className="mt-5 font-sans text-sm font-light leading-relaxed text-muted">
              {nearest.distance < 0.15
                ? 'This is a close match — near enough that the collection was very likely designed for the person you have just described.'
                : nearest.distance < 0.32
                  ? 'A reasonable match. Expect to find two or three pieces in it rather than a whole collection that fits.'
                  : 'Nothing here is genuinely close to that corner of the chart. That is worth knowing rather than working around: it is a commission, and it is the conversation the bespoke bench exists for.'}
            </p>

            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href={`/collections/${nearest.slug}`}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 font-accent text-[10px] uppercase tracking-luxe text-onaccent transition-opacity duration-300 hover:opacity-90"
              >
                See {nearest.name}
              </Link>
              {nearest.distance >= 0.32 && (
                <Link
                  href="/bespoke"
                  className="inline-flex items-center gap-2 rounded-full border border-hairline px-6 py-2.5 font-accent text-[10px] uppercase tracking-luxe text-muted transition-colors duration-300 hover:border-accent/50 hover:text-accent"
                >
                  Commission instead
                </Link>
              )}
            </div>
          </motion.div>

          {/* The full ranking, so the chart is not the only way to read this. */}
          <ol className="mt-10 space-y-2 border-t border-hairline pt-6">
            {ranked.map((p, i) => (
              <li key={p.id} className="flex items-baseline gap-4">
                <span className="nums-instrument w-6 shrink-0 font-accent text-[10px] uppercase tracking-luxe text-faint">
                  {i + 1}
                </span>
                <Link
                  href={`/collections/${p.slug}`}
                  className="flex-1 font-display text-base text-primary transition-colors duration-300 hover:text-accent"
                >
                  {p.name}
                </Link>
                {/* Distance as a bar rather than a number — the gaps between
                    ranks are the information, not the values. */}
                <span aria-hidden="true" className="hidden w-24 shrink-0 sm:block">
                  <span className="block h-px bg-line/50">
                    <motion.span
                      className="block h-px bg-accent"
                      initial={false}
                      animate={{ width: `${Math.max(4, (1 - p.distance) * 100)}%` }}
                      transition={reduced ? { duration: 0 } : { duration: 0.4 }}
                    />
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
