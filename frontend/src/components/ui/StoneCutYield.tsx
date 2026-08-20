'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * The rough, and what is left of it.
 *
 * This is the number the trade is quietest about, and it is not a scandal — it
 * is simply arithmetic that nobody outside the business ever sees. A polished
 * diamond is the survivor of a much larger stone. Somewhere between a third and
 * two thirds of what came out of the ground is sawn off, ground away and
 * collected as dust, and that loss is in the price of what is left.
 *
 * Every yield figure below is the trade's own working range. A round brilliant
 * is the most wasteful cut in common use — around 40% retained is normal, and
 * an excellent-cut round from awkward rough can drop under a third. An emerald
 * cut keeps around 60% because its outline follows the shape most rough
 * actually arrives in. That single fact is why an emerald cut of the same
 * weight and colour costs meaningfully less than a round, and it is almost
 * always explained to customers as a matter of fashion instead.
 *
 * The second half of the panel is the part that changes a decision. Prices step
 * at the half and whole carat, and they step hard — a 1.00ct stone is worth
 * about a fifth more per carat than a 0.99ct stone that no human being can tell
 * apart from it. So a cutter looking at rough that will finish at 0.97 has a
 * powerful reason to leave the pavilion a degree too deep and land on 1.00
 * instead. That is where badly cut stones come from. Not carelessness — a
 * pricing cliff.
 */

interface Cut {
  id: string;
  name: string;
  /** Typical retained weight from well-suited rough, as a fraction. */
  yield: number;
  /** Retained weight when the rough shape fights the cut. */
  worst: number;
  clip: string;
  note: string;
}

const CUTS: Cut[] = [
  {
    id: 'round',
    name: 'Round brilliant',
    yield: 0.42,
    worst: 0.31,
    clip: 'clip-oval',
    note: 'The most wasteful cut in common use, and the brightest. A round has to be cut out of the middle of whatever shape the rough happens to be, so more than half of it is normally sawn away. Everything you are paying extra for is the part that no longer exists.',
  },
  {
    id: 'oval',
    name: 'Oval',
    yield: 0.55,
    worst: 0.42,
    clip: 'clip-oval',
    note: 'Follows elongated rough, so it keeps a third more than a round from the same stone. It also looks larger face-up at the same weight, which means an oval is bigger, cheaper and made of less waste — and it is still the second choice, for reasons that are purely about what an engagement ring is supposed to look like.',
  },
  {
    id: 'emerald',
    name: 'Emerald',
    yield: 0.62,
    worst: 0.5,
    clip: 'clip-emerald',
    note: 'The step cut that made its name from the shape rough actually arrives in. It keeps the most of any cut here and hides the least — with only a few large facets there is nowhere for an inclusion to disappear, so an emerald cut has to be a cleaner stone to begin with.',
  },
  {
    id: 'cushion',
    name: 'Cushion',
    yield: 0.5,
    worst: 0.38,
    clip: 'clip-cushion',
    note: 'A compromise, and an old one — this is what a round brilliant looked like before power-driven saws made true circles economic. It keeps more than a round and gives back a softer, larger flash rather than the small hard sparkle of a modern round.',
  },
  {
    id: 'pear',
    name: 'Pear',
    yield: 0.53,
    worst: 0.36,
    clip: 'clip-pear',
    note: 'Excellent yield from a naturally tapered crystal and merciless about symmetry. A pear that is a degree out of true is visibly out of true, and unlike a round there is no facet pattern to hide it behind.',
  },
  {
    id: 'princess',
    name: 'Princess',
    yield: 0.6,
    worst: 0.48,
    clip: 'clip-baguette',
    note: 'Designed specifically to be cut from the pyramidal halves left when an octahedron is sawn — which is to say, it exists because of yield rather than because of light. Two princesses come out of the rough that would have made one round.',
  },
];

/** The steps a price list actually has. Nothing in between them matters. */
const CLIFFS = [0.3, 0.5, 0.7, 0.9, 1.0, 1.5, 2.0, 3.0];

const fmt = (n: number) => n.toFixed(2);

export default function StoneCutYield({ className = '' }: { className?: string }) {
  const [rough, setRough] = useState(2.4);
  const [cutId, setCutId] = useState('round');
  const [awkward, setAwkward] = useState(false);

  const cut = CUTS.find((c) => c.id === cutId) ?? CUTS[0];
  const rate = awkward ? cut.worst : cut.yield;
  const finished = rough * rate;

  // The nearest step above, and how much extra rough it would take to reach it.
  const cliff = useMemo(() => {
    const next = CLIFFS.find((c) => c > finished);
    if (!next) return null;
    const gap = next - finished;
    // Under about 4% short is where the temptation lives: it can be reached by
    // leaving the stone a shade deep rather than by finding better rough.
    return { next, gap, tempting: gap / next < 0.045 };
  }, [finished]);

  return (
    <div className={className}>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
        {/* The controls. */}
        <div>
          <label
            htmlFor="yield-rough"
            className="font-accent text-[10px] uppercase tracking-luxe text-muted"
          >
            Rough on the bench
          </label>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="nums-instrument font-display text-4xl text-primary">
              {fmt(rough)}
            </span>
            <span className="font-accent text-xs uppercase tracking-luxe text-muted">
              carats
            </span>
          </div>
          <input
            id="yield-rough"
            type="range"
            min={0.5}
            max={8}
            step={0.05}
            value={rough}
            onChange={(e) => setRough(Number(e.target.value))}
            className="range-overlay mt-3 w-full"
          />

          <p className="mt-6 font-accent text-[10px] uppercase tracking-luxe text-muted">
            Cut it as
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {CUTS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCutId(c.id)}
                aria-pressed={cutId === c.id}
                className={`rounded-full border px-3.5 py-1.5 font-accent text-[10px] uppercase tracking-luxe transition-colors duration-300 ${
                  cutId === c.id
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-hairline text-muted hover:border-accent/50 hover:text-accent'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          <label className="mt-6 flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={awkward}
              onChange={(e) => setAwkward(e.target.checked)}
              className="mt-0.5 h-4 w-4 flex-none accent-[rgb(var(--accent))]"
            />
            <span>
              <span className="font-accent text-[10px] uppercase tracking-luxe text-primary">
                The rough fights the cut
              </span>
              <span className="mt-1 block font-sans text-xs font-light leading-relaxed text-faint">
                A flat, included or badly shaped crystal. Most rough is not the
                shape somebody wants, and this is the difference that makes.
              </span>
            </span>
          </label>
        </div>

        {/* What survives. */}
        <div>
          <div className="chart-surface rounded-2xl p-5">
            {/* One bar, split. Kept as a single bar rather than two, because the
                whole point is that these are parts of one stone. */}
            <div className="flex items-baseline justify-between">
              <span className="font-accent text-[10px] uppercase tracking-luxe text-muted">
                One stone
              </span>
              <span className="nums-instrument font-accent text-[10px] uppercase tracking-luxe text-accent">
                {Math.round(rate * 100)}% retained
              </span>
            </div>

            <div className="mt-3 flex h-10 gap-[2px] overflow-hidden rounded-sm">
              <motion.div
                className="relative flex items-center justify-center bg-[rgb(var(--series-1))]"
                animate={{ width: `${rate * 100}%` }}
                transition={{ type: 'spring', stiffness: 180, damping: 26 }}
              >
                <span className="nums-instrument px-2 font-accent text-[10px] uppercase tracking-luxe text-cream-50">
                  {fmt(finished)}ct
                </span>
              </motion.div>
              <motion.div
                className="yield-bar relative flex items-center justify-center bg-surface-sunken"
                animate={{ width: `${(1 - rate) * 100}%` }}
                transition={{ type: 'spring', stiffness: 180, damping: 26 }}
              >
                <span className="nums-instrument px-2 font-accent text-[10px] uppercase tracking-luxe text-faint">
                  {fmt(rough - finished)}ct gone
                </span>
              </motion.div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1">
              <span className="flex items-center gap-2 font-accent text-[9px] uppercase tracking-luxe text-muted">
                <span
                  className="series-swatch"
                  style={{ background: 'rgb(var(--series-1))' }}
                  aria-hidden="true"
                />
                Polished
              </span>
              <span className="flex items-center gap-2 font-accent text-[9px] uppercase tracking-luxe text-muted">
                <span className="series-swatch yield-bar bg-surface-sunken" aria-hidden="true" />
                Sawn, ground and swept up
              </span>
            </div>
          </div>

          {/* The pricing cliff, which is where the badly cut stones come from. */}
          <div className="mt-6 spec-plate p-4">
            <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
              The step above
            </p>
            {cliff ? (
              <>
                <div className="mt-3 flex items-end gap-3">
                  {CLIFFS.filter((c) => c <= 3).map((c) => {
                    const reached = finished >= c;
                    const isNext = c === cliff.next;
                    return (
                      <div key={c} className="flex flex-1 flex-col items-center gap-1.5">
                        <motion.div
                          className="w-full origin-bottom rounded-sm"
                          style={{
                            background: reached
                              ? 'rgb(var(--series-1))'
                              : isNext
                                ? 'rgb(var(--series-2))'
                                : 'rgb(var(--surface-sunken))',
                            height: 12 + c * 14,
                          }}
                          animate={{ opacity: reached || isNext ? 1 : 0.4 }}
                        />
                        <span className="nums-instrument font-accent text-[8px] text-faint">
                          {c.toFixed(c < 1 ? 2 : 1)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <p className="mt-4 font-sans text-sm font-light leading-relaxed text-muted">
                  This stone finishes at{' '}
                  <span className="nums-instrument text-primary">{fmt(finished)}ct</span>,{' '}
                  <span className="nums-instrument text-primary">{fmt(cliff.gap)}ct</span>{' '}
                  short of {fmt(cliff.next)} — where the price per carat steps up
                  by roughly a fifth for a difference nobody can see.
                  {cliff.tempting && (
                    <>
                      {' '}
                      <span className="text-accent">
                        That is close enough to reach by leaving the pavilion a
                        degree too deep, and that is exactly how most poorly cut
                        stones come to exist.
                      </span>
                    </>
                  )}
                </p>
              </>
            ) : (
              <p className="mt-3 font-sans text-sm font-light leading-relaxed text-muted">
                Past every step on the common price list. Above three carats the
                pricing stops stepping and starts being negotiated, which is a
                different trade entirely.
              </p>
            )}
          </div>

          <motion.p
            key={cut.id + String(awkward)}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mt-6 border-t border-line-subtle pt-5 font-sans text-sm font-light leading-relaxed text-muted"
          >
            {cut.note}
          </motion.p>
        </div>
      </div>
    </div>
  );
}
