'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { easeCine } from '@/lib/motion';

/**
 * The season's colours, named and sourced.
 *
 * Every lookbook has a palette and almost none of them say where it came from,
 * which turns the most concrete decision in the whole season into decoration. A
 * palette is not a mood — it is a set of instructions to a bench about which
 * metals go next to which stones, and it is arrived at by looking at specific
 * physical things.
 *
 * So each entry here carries three pieces of information a swatch normally does
 * not: what the colour actually *is* as a material, what it was taken from, and
 * which metal it fails against. The last one is the useful one. A palette that
 * only says what works is useless at the counter, because the question a
 * customer asks is always about the piece they already own.
 *
 * The interaction is a hover-to-mix rather than a click-to-expand: two swatches
 * held together show whether the pair works, which is the only way anybody has
 * ever chosen a colour combination. The mixing strip is the component's whole
 * reason to exist and it is why this is not a list.
 */
interface Swatch {
  id: string;
  name: string;
  /** The material, not the hex. */
  material: string;
  /** Where it was taken from. */
  source: string;
  /** Metals it sits well against. */
  with: string[];
  /** The metal it fights, and why. */
  against: string;
  css: string;
  /** Whether it is a stone, a metal or a finish — they behave differently. */
  kind: 'stone' | 'metal' | 'finish';
}

const PALETTE: Swatch[] = [
  {
    id: 'monsoon',
    name: 'Monsoon',
    material: 'Grey-green tourmaline, lightly included',
    source: 'The colour of the Deccan sky forty minutes before the first rain — recorded on the roof of the Hyderabad workshop in June.',
    with: ['Platinum', 'White gold', 'Oxidised silver'],
    against:
      'Rose gold. The copper pulls the green towards brown and the stone reads as dirty rather than as smoky.',
    css: 'linear-gradient(150deg, rgb(120 132 118), rgb(84 96 92))',
    kind: 'stone',
  },
  {
    id: 'ghee',
    name: 'Ghee',
    material: '22K gold, matte-finished with a sand blast',
    source: 'Clarified butter in a brass vessel. The specific quality is that it is warm without being bright — the finish does the work, not the alloy.',
    with: ['Emerald', 'Rubellite', 'Uncut diamond'],
    against:
      'Polished 22K. Two golds of the same karat and different finishes next to each other look like one of them is a mistake.',
    css: 'linear-gradient(150deg, rgb(214 176 106), rgb(178 140 74))',
    kind: 'finish',
  },
  {
    id: 'ink',
    name: 'Ink',
    material: 'Blue sapphire, Ceylon, unheated',
    source: 'Iron-gall ink on the ledger page of 1892 — the first entry in the house book, which has gone slightly green with age and is a better blue for it.',
    with: ['22K yellow gold', 'Pearl', 'Platinum'],
    against:
      'Rhodium-plated white gold. Both are cold, so the stone loses its depth and the setting looks like a bezel around a hole.',
    css: 'linear-gradient(150deg, rgb(38 58 96), rgb(22 36 66))',
    kind: 'stone',
  },
  {
    id: 'unripe',
    name: 'Unripe',
    material: 'Peridot, Pakistani, over three carats',
    source: 'A mango a fortnight early, cut open on the bench. The yellow underneath the green is the part that matters and the part most peridot lacks.',
    with: ['Rose gold', '22K yellow gold'],
    against:
      'Platinum. A cool white metal makes peridot look like glass, which is unfortunate given how often it is set that way.',
    css: 'linear-gradient(150deg, rgb(164 186 92), rgb(122 148 62))',
    kind: 'stone',
  },
  {
    id: 'ash',
    name: 'Ash',
    material: 'Oxidised silver, sealed',
    source: 'Cold charcoal from the annealing hearth. Deliberately not black — the grey has a blue in it that comes from the sealing wax.',
    with: ['Diamond', 'Moonstone', 'White gold'],
    against:
      '22K gold. High-karat gold beside a deliberate oxidation looks like tarnish nobody has got round to cleaning.',
    css: 'linear-gradient(150deg, rgb(92 94 100), rgb(58 60 66))',
    kind: 'metal',
  },
  {
    id: 'kumkum',
    name: 'Kumkum',
    material: 'Burmese ruby, or spinel at a fifth of the price',
    source: 'Vermilion powder in the shallow brass dish by the door. It is a red with no blue in it at all, which is rarer in a stone than it sounds.',
    with: ['22K yellow gold', 'Uncut diamond', 'Pearl'],
    against:
      'Rose gold. Two warm reds compete and neither wins; the stone stops reading as a stone and becomes part of the metal.',
    css: 'linear-gradient(150deg, rgb(178 44 42), rgb(132 26 30))',
    kind: 'stone',
  },
];

const KIND_LABEL = { stone: 'Stone', metal: 'Metal', finish: 'Finish' } as const;

export default function SeasonPalette() {
  const [primary, setPrimary] = useState('ink');
  const [secondary, setSecondary] = useState<string | null>('ghee');
  const reduced = useReducedMotion();

  const a = PALETTE.find((s) => s.id === primary)!;
  const b = secondary ? PALETTE.find((s) => s.id === secondary) : null;

  /* Whether the pair works, decided from the authored data rather than from a
     colour-distance calculation. A hue-wheel rule would say Ink and Kumkum are a
     fine complementary pair, and on a piece of jewellery they are a disaster —
     the judgement here is metallurgical and cultural, not chromatic. */
  const pairing =
    !b || b.id === a.id
      ? null
      : a.against.toLowerCase().includes(b.name.toLowerCase()) ||
          b.against.toLowerCase().includes(a.name.toLowerCase())
        ? 'fights'
        : a.with.some((w) => b.with.includes(w))
          ? 'shares'
          : 'neutral';

  return (
    <div className="mx-auto max-w-6xl">
      {/* The swatches. Large, because a colour decision made from a 20px chip is
          not a colour decision. */}
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {PALETTE.map((s) => {
          const isA = s.id === primary;
          const isB = s.id === secondary;
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => setPrimary(s.id)}
                onDoubleClick={() => setSecondary(s.id)}
                onMouseEnter={() => setSecondary(s.id)}
                aria-pressed={isA}
                aria-label={`${s.name} — ${s.material}`}
                className={`group relative block w-full overflow-hidden rounded-xl border transition-all duration-400 ${
                  isA
                    ? 'border-accent ring-1 ring-accent/40'
                    : isB
                      ? 'border-accent/50'
                      : 'border-hairline hover:border-accent/40'
                }`}
              >
                <span
                  aria-hidden="true"
                  className="block aspect-[4/5] w-full transition-transform duration-600 group-hover:scale-105"
                  style={{ background: s.css }}
                />
                {/* Kind, printed on the swatch. A stone, a metal and a finish are
                    three different kinds of instruction and mixing them in one
                    palette without saying which is which is how a lookbook ends
                    up unbuildable. */}
                <span className="absolute left-3 top-3 font-accent text-[8px] uppercase tracking-luxe text-white/70">
                  {KIND_LABEL[s.kind]}
                </span>
                <span className="block border-t border-hairline bg-surface-raised/80 px-3 py-2.5 text-left font-accent text-[10px] uppercase tracking-luxe text-primary backdrop-blur-sm">
                  {s.name}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
        {/* ---- The pair, held together ---- */}
        <div>
          <p className="mb-3 font-accent text-[10px] uppercase tracking-luxe text-accent">
            Held together
          </p>

          {/* The mixing strip. A hard join rather than a gradient, because the
              question is whether the two colours can sit *adjacent* on a piece —
              which is exactly the question a gradient blurs away. */}
          <div className="relative flex h-48 overflow-hidden rounded-2xl border border-hairline">
            <motion.span
              className="block h-full"
              animate={{ width: b && b.id !== a.id ? '50%' : '100%' }}
              transition={reduced ? { duration: 0 } : { duration: 0.5, ease: easeCine.glass }}
              style={{ background: a.css }}
            />
            {b && b.id !== a.id && (
              <motion.span
                className="block h-full flex-1"
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                style={{ background: b.css }}
              />
            )}

            {/* The seam, lit — which is what a real join between a stone and a
                metal looks like and the thing that decides whether it works. */}
            {b && b.id !== a.id && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[linear-gradient(180deg,transparent,rgb(var(--gold-100)/0.6),transparent)]"
              />
            )}
          </div>

          {pairing && (
            <motion.p
              key={pairing + a.id + (b?.id ?? '')}
              initial={reduced ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={`mt-4 rounded-xl border px-5 py-4 font-sans text-sm font-light leading-relaxed ${
                pairing === 'fights'
                  ? 'border-burgundy-500/40 text-muted'
                  : pairing === 'shares'
                    ? 'border-jade-500/40 text-muted'
                    : 'border-hairline text-muted'
              }`}
            >
              {pairing === 'fights' && (
                <>
                  <span className="text-primary">These two fight. </span>
                  {a.against.toLowerCase().includes((b?.name ?? '').toLowerCase())
                    ? a.against
                    : b?.against}
                </>
              )}
              {pairing === 'shares' && (
                <>
                  <span className="text-primary">These two work. </span>
                  Both sit well against{' '}
                  {a.with.filter((w) => b?.with.includes(w)).join(' and ').toLowerCase()}, which is
                  what makes them combinable on one piece rather than merely adjacent in a book.
                </>
              )}
              {pairing === 'neutral' && (
                <>
                  <span className="text-primary">Neither helped nor harmed. </span>
                  They share no metal, so a piece using both needs a third element — usually the
                  setting — to hold them together. Possible, and a longer conversation.
                </>
              )}
            </motion.p>
          )}

          <p className="mt-4 font-accent text-[10px] uppercase leading-relaxed tracking-luxe text-faint">
            Click to set the left colour. Hover or double-click for the right.
          </p>
        </div>

        {/* ---- Where it came from ---- */}
        <motion.div
          key={a.id}
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeCine.glass }}
        >
          <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
            {KIND_LABEL[a.kind]}
          </p>
          <h3 className="mt-2 font-display text-3xl text-primary">{a.name}</h3>
          <p className="mt-1 font-display text-lg italic text-accent">{a.material}</p>

          <p className="mt-5 font-sans text-base font-light leading-relaxed text-muted">
            {a.source}
          </p>

          <dl className="mt-8 space-y-5 border-t border-hairline pt-6">
            <div>
              <dt className="font-accent text-[10px] uppercase tracking-luxe text-faint">
                Sits well against
              </dt>
              <dd className="mt-2 flex flex-wrap gap-2">
                {a.with.map((w) => (
                  <span
                    key={w}
                    className="rounded-full border border-jade-500/30 px-3 py-1 font-accent text-[10px] uppercase tracking-luxe text-muted"
                  >
                    {w}
                  </span>
                ))}
              </dd>
            </div>
            <div>
              <dt className="font-accent text-[10px] uppercase tracking-luxe text-faint">
                Fights
              </dt>
              <dd className="mt-2 font-sans text-sm font-light leading-relaxed text-muted">
                {a.against}
              </dd>
            </div>
          </dl>
        </motion.div>
      </div>
    </div>
  );
}
