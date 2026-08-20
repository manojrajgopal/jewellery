'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * Grown and mined, side by side, with the arguments neither side likes.
 *
 * This is the most loaded question on any jeweller's counter and almost every
 * answer given to it is a sales position. So the panel is built to be readable
 * as evidence rather than as advocacy: each row says what is true of a grown
 * stone, what is true of a mined one, and — the column that makes it worth
 * having — whether the difference is one a wearer will ever encounter.
 *
 * The facts that a shop selling mined stones would rather skip are here in
 * full. A grown diamond is a diamond: same carbon lattice, same 10 on Mohs,
 * same 2.42 refractive index, same fire. It is not a simulant and nothing about
 * "real" is a useful word in this conversation. A jeweller cannot tell one from
 * the other with a loupe, and neither can a very good jeweller with a very good
 * loupe.
 *
 * And the facts an enthusiastic lab-grown seller would rather skip are here
 * too. The price has fallen by roughly 80% in a decade and there is no floor in
 * sight, because supply is a factory and factories get better. A stone bought
 * this year will be worth a fraction of that in five, which is a fine outcome
 * for a piece of jewellery and a bad one for anything anybody calls an
 * investment. And "environmentally better" is a claim that depends entirely on
 * the grid the reactor runs on — a CVD press drawing coal-fired power for six
 * weeks is not obviously the greener choice, and very few sellers publish which
 * grid theirs is.
 *
 * Our own position is at the foot, stated once and marked as a position rather
 * than as a fact.
 */

interface Row {
  id: string;
  question: string;
  grown: string;
  mined: string;
  /** Whether the difference is one a wearer will ever meet. */
  matters: 'never' | 'sometimes' | 'always';
}

const ROWS: Row[] = [
  {
    id: 'material',
    question: 'What it is',
    grown: 'Carbon in a cubic lattice. 10 on Mohs, refractive index 2.42, dispersion 0.044.',
    mined: 'Carbon in a cubic lattice. 10 on Mohs, refractive index 2.42, dispersion 0.044.',
    matters: 'never',
  },
  {
    id: 'look',
    question: 'How it looks',
    grown: 'Identical. Same brilliance, same fire, same scintillation, graded on the same four Cs by the same laboratories.',
    mined: 'Identical. There is no visual test, at any magnification, that separates them.',
    matters: 'never',
  },
  {
    id: 'identify',
    question: 'How anyone tells',
    grown: 'Photoluminescence and short-wave UV in a laboratory. Growth striae under crossed polars for CVD; metallic flux inclusions for HPHT. None of it is bench work.',
    mined: 'By exclusion, and by the report. Every stone we sell over 0.30ct is laboratory-tested and the origin is on the certificate.',
    matters: 'sometimes',
  },
  {
    id: 'price',
    question: 'What it costs',
    grown: 'Roughly a fifth to a tenth of a mined equivalent, and falling. Down about 80% in ten years.',
    mined: 'Set by a supply nobody can increase quickly. It moves, and it has never moved like that.',
    matters: 'always',
  },
  {
    id: 'resale',
    question: 'What it is worth later',
    grown: 'Very little, and less every year, because next year’s reactor is cheaper than this year’s. Buy it for the wearing.',
    mined: 'A real secondary market, at a real discount to retail. Not an investment either, but it has a floor.',
    matters: 'always',
  },
  {
    id: 'ethics',
    question: 'The ethical claim',
    grown: 'No pit, no tailings, no artisanal mining. Also: six to twelve weeks of continuous high-temperature power, and the honest answer depends on whose grid it was.',
    mined: 'Traceable to a named operation in our case, and that traceability is the claim — not that mining is harmless.',
    matters: 'sometimes',
  },
  {
    id: 'service',
    question: 'Living with it',
    grown: 'Identical. Same setting, same resizing, same care, same repair. A bench cannot tell and does not need to.',
    mined: 'Identical.',
    matters: 'never',
  },
];

const MATTERS: Record<Row['matters'], { label: string; tone: string }> = {
  never: { label: 'No difference a wearer meets', tone: 'var(--series-1)' },
  sometimes: { label: 'Depends on the buyer', tone: 'var(--series-2)' },
  always: { label: 'A real difference', tone: 'var(--series-4)' },
};

export default function LabGrownLedger({ className = '' }: { className?: string }) {
  const [open, setOpen] = useState<string | null>('material');

  return (
    <div className={className}>
      {/* Legend, present because three states are encoded and colour is never
          the only carrier of any of them — each row prints its own label. */}
      <div className="mb-6 flex flex-wrap gap-x-6 gap-y-2 border-b border-line-subtle pb-4">
        {(Object.keys(MATTERS) as Row['matters'][]).map((key) => (
          <span
            key={key}
            className="flex items-center gap-2 font-accent text-[9px] uppercase tracking-luxe text-muted"
          >
            <span
              className="series-swatch"
              style={{ background: `rgb(${MATTERS[key].tone})` }}
              aria-hidden="true"
            />
            {MATTERS[key].label}
          </span>
        ))}
      </div>

      <div className="divide-y divide-line-subtle border-y border-line-subtle">
        {ROWS.map((row) => {
          const isOpen = open === row.id;
          const tone = MATTERS[row.matters];
          return (
            <div key={row.id}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : row.id)}
                aria-expanded={isOpen}
                className="group flex w-full items-center justify-between gap-4 py-4 text-left"
              >
                <span className="flex items-center gap-3">
                  <span
                    className="series-swatch"
                    style={{ background: `rgb(${tone.tone})` }}
                    aria-hidden="true"
                  />
                  <span className="font-display text-lg text-primary transition-colors group-hover:text-accent md:text-xl">
                    {row.question}
                  </span>
                </span>
                <span className="flex items-center gap-4">
                  <span className="hidden font-accent text-[9px] uppercase tracking-luxe text-faint sm:block">
                    {tone.label}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="font-accent text-lg leading-none text-accent"
                    aria-hidden="true"
                  >
                    +
                  </motion.span>
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="grid gap-6 pb-6 md:grid-cols-2">
                      <div className="spec-plate p-4">
                        <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
                          Laboratory grown
                        </p>
                        <p className="mt-2 font-sans text-sm font-light leading-relaxed text-muted">
                          {row.grown}
                        </p>
                      </div>
                      <div className="spec-plate p-4">
                        <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
                          Mined
                        </p>
                        <p className="mt-2 font-sans text-sm font-light leading-relaxed text-muted">
                          {row.mined}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Marked as a position rather than as a finding, which is the only
          honest way to end a panel like this. */}
      <div className="mt-8 rounded-2xl border border-accent/25 bg-accent/[0.04] p-6">
        <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
          Where this house stands — an opinion, not a fact
        </p>
        <p className="mt-3 max-w-3xl font-display text-xl italic leading-snug text-primary md:text-2xl">
          We sell both, we will set either, and we will never tell you one of
          them is not a real diamond.
        </p>
        <p className="mt-4 max-w-3xl font-sans text-sm font-light leading-relaxed text-muted">
          What we will say is this. If the piece is being bought to be worn and
          the budget is the constraint, a grown stone buys you a size and a
          clarity that a mined one at the same money does not, and you will
          never once be able to tell across a dinner table. If the piece is
          being bought to be handed on, buy mined — not because it is better,
          but because in forty years a grown stone will be worth roughly what a
          grown stone costs in forty years, and nobody sensible thinks that is
          much. Anyone who gives you a more confident answer than that is
          selling you the one they have in stock.
        </p>
      </div>
    </div>
  );
}
