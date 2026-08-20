'use client';

import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Gem, Gift, Sparkles } from 'lucide-react';

import { easeLens, springsHeavy } from '@/lib/motion';

/**
 * The anniversary table, as it is actually kept.
 *
 * Two traditions run in parallel and disagree, which is the interesting part.
 * The older European list is material — paper, cotton, leather — and runs out of
 * ideas by about year fifteen. The modern gemstone list was assembled by the
 * American National Retail Jeweler Association in 1937, and it exists because
 * the older list had almost no jewellery in it. Showing both, and saying which
 * is which, is more honest than presenting one as "the" tradition.
 *
 * `stone` follows the 1937 list. `classic` is the older material. `note` is why
 * that material was chosen, where a reason survives — those reasons are the best
 * thing about the whole tradition and they are almost never printed.
 */
interface Anniversary {
  year: number;
  classic: string;
  stone: string;
  /** Why that material, where the reasoning survives. */
  note: string;
}

const YEARS: Anniversary[] = [
  { year: 1, classic: 'Paper', stone: 'Gold jewellery', note: 'Blank, and easily torn. A first year is not yet proof of anything.' },
  { year: 2, classic: 'Cotton', stone: 'Garnet', note: 'Two threads twisted make a yarn stronger than either.' },
  { year: 3, classic: 'Leather', stone: 'Pearl', note: 'Hide becomes durable only after it has been worked on.' },
  { year: 4, classic: 'Linen / fruit', stone: 'Blue topaz', note: 'The first year with something to harvest.' },
  { year: 5, classic: 'Wood', stone: 'Sapphire', note: 'Roots deep enough that weather stops mattering.' },
  { year: 6, classic: 'Iron', stone: 'Amethyst', note: 'Strength that has to be maintained or it rusts.' },
  { year: 7, classic: 'Wool / copper', stone: 'Onyx', note: 'Warmth, and a metal that conducts.' },
  { year: 8, classic: 'Bronze', stone: 'Tourmaline', note: 'An alloy — two metals better together than apart.' },
  { year: 9, classic: 'Pottery', stone: 'Lapis lazuli', note: 'Earth made permanent by fire.' },
  { year: 10, classic: 'Tin / aluminium', stone: 'Diamond jewellery', note: 'Metals that bend without breaking.' },
  { year: 11, classic: 'Steel', stone: 'Turquoise', note: 'Iron with the weakness taken out of it.' },
  { year: 12, classic: 'Silk', stone: 'Jade', note: 'Fine, and stronger than it looks.' },
  { year: 13, classic: 'Lace', stone: 'Citrine', note: 'Made almost entirely of the spaces in it.' },
  { year: 14, classic: 'Ivory (now agate)', stone: 'Opal', note: 'The one entry the modern list corrected outright.' },
  { year: 15, classic: 'Crystal', stone: 'Ruby', note: 'Clear all the way through.' },
  { year: 20, classic: 'China', stone: 'Emerald', note: 'Delicate, expensive, and it has survived being used.' },
  { year: 25, classic: 'Silver', stone: 'Silver jubilee', note: 'The first anniversary with a metal of its own.' },
  { year: 30, classic: 'Pearl', stone: 'Pearl jubilee', note: 'Built up in layers over decades, from an irritation.' },
  { year: 35, classic: 'Coral / jade', stone: 'Emerald', note: 'Grown, not mined.' },
  { year: 40, classic: 'Ruby', stone: 'Ruby jubilee', note: 'The colour of the thing that has kept beating.' },
  { year: 45, classic: 'Sapphire', stone: 'Sapphire', note: 'Second only to diamond in hardness.' },
  { year: 50, classic: 'Gold', stone: 'Golden jubilee', note: 'Does not tarnish, does not corrode, does not diminish.' },
  { year: 55, classic: 'Emerald', stone: 'Alexandrite', note: 'A stone that changes colour depending on the light it is in.' },
  { year: 60, classic: 'Diamond', stone: 'Diamond jubilee', note: 'The hardest natural substance there is. Sixty years earns it.' },
];

interface AnniversaryDialProps {
  className?: string;
}

/**
 * A dial for the anniversary lists, rather than a table of them.
 *
 * The years are laid out around a circle because that is what an anniversary is
 * — the same point come round again — and because a 24-row table is a thing
 * nobody reads. Dragging or clicking the ring rotates the selected year to the
 * top, and the two competing traditions are shown side by side in the middle.
 *
 * The ring rotates rather than the labels moving independently, so the whole
 * dial reads as one object. Each label counter-rotates by exactly the ring's
 * angle, which keeps every year upright at every position — without that the
 * numbers on the far side are upside down and the thing is unreadable.
 *
 * There is also a date field. Given an anniversary date it works out which year
 * is next and preselects it, which is the actual question a visitor arrives with.
 */
export default function AnniversaryDial({ className = '' }: AnniversaryDialProps) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(9); // Year 10 — the one people look up most.
  const [since, setSince] = useState('');

  const current = YEARS[index];
  const step = 360 / YEARS.length;
  const ringAngle = -index * step;

  /** Which anniversary is next, given a wedding date. */
  const upcoming = useMemo(() => {
    if (!since) return null;
    const then = new Date(since);
    if (Number.isNaN(then.getTime())) return null;
    const now = new Date();
    let years = now.getFullYear() - then.getFullYear();
    // Has this year's anniversary already passed?
    const passed =
      now.getMonth() > then.getMonth() ||
      (now.getMonth() === then.getMonth() && now.getDate() >= then.getDate());
    if (!passed) years -= 1;
    const next = years + 1;
    // The list is sparse past 15, so land on the next entry that exists.
    const slot = YEARS.findIndex((y) => y.year >= next);
    return { next, slot: slot === -1 ? YEARS.length - 1 : slot, elapsed: Math.max(0, years) };
  }, [since]);

  return (
    <div className={`grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] ${className}`}>
      {/* ---- The dial ---- */}
      <div className="relative mx-auto aspect-square w-full max-w-xl">
        {/* Fixed marker at the top — the position that reads as "selected". */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1"
        >
          <div className="h-3 w-3 rotate-45 bg-accent shadow-[0_0_14px_3px_rgb(var(--gold-500)/0.55)]" />
        </div>

        <motion.div
          animate={{ rotate: ringAngle }}
          transition={reduced ? { duration: 0 } : springsHeavy.tray}
          className="absolute inset-0"
        >
          {YEARS.map((y, i) => {
            const angle = i * step;
            const selected = i === index;
            const nextUp = upcoming?.slot === i && !selected;

            return (
              <div
                key={y.year}
                className="absolute left-1/2 top-1/2 h-0 w-0"
                style={{ transform: `rotate(${angle}deg) translateY(-46%)` }}
              >
                <motion.button
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-pressed={selected}
                  aria-label={`Year ${y.year}: ${y.stone}`}
                  animate={{
                    // Counter-rotate by the ring's angle so every label stays
                    // upright wherever it sits on the circle.
                    rotate: -angle - ringAngle,
                    scale: selected ? 1.25 : nextUp ? 1.1 : 1,
                  }}
                  transition={reduced ? { duration: 0 } : springsHeavy.detent}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border font-accent text-[11px] tabular-nums transition-colors duration-500 ${
                    selected
                      ? 'border-accent bg-accent px-3 py-1.5 text-onaccent'
                      : nextUp
                        ? 'border-accent/60 bg-accent/10 px-2.5 py-1 text-accent'
                        : 'border-hairline bg-canvas-alt/70 px-2.5 py-1 text-muted hover:border-accent/50 hover:text-accent'
                  }`}
                >
                  {y.year}
                </motion.button>
              </div>
            );
          })}
        </motion.div>

        {/* Rings, drawn inside the dial rather than behind it, so they rotate
            with nothing and read as the fixed frame the years move against. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[12%] rounded-full border border-line-subtle"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[20%] rounded-full border border-dashed border-accent/15"
        />

        {/* ---- The centre: both traditions, side by side ---- */}
        <div className="absolute inset-[22%] flex flex-col items-center justify-center text-center">
          <motion.div
            key={current.year}
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easeLens.focusRing }}
          >
            <span className="font-display text-5xl leading-none text-accent nums-tabular md:text-6xl">
              {current.year}
            </span>
            <span className="mt-1 block font-accent text-[10px] uppercase tracking-luxer text-faint">
              {current.year === 1 ? 'year' : 'years'}
            </span>

            <div className="mt-5 space-y-3">
              <div>
                <span className="flex items-center justify-center gap-1.5 font-accent text-[9px] uppercase tracking-luxer text-faint">
                  <Gem className="h-3 w-3" aria-hidden="true" />
                  1937 gemstone list
                </span>
                <p className="mt-1 font-display text-lg leading-tight text-primary">
                  {current.stone}
                </p>
              </div>
              <div>
                <span className="flex items-center justify-center gap-1.5 font-accent text-[9px] uppercase tracking-luxer text-faint">
                  <Gift className="h-3 w-3" aria-hidden="true" />
                  Older tradition
                </span>
                <p className="mt-1 font-accent text-sm text-secondary">{current.classic}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ---- The reading ---- */}
      <div className="space-y-7">
        <div className="rounded-3xl border border-hairline bg-canvas-alt/60 p-6">
          <span className="font-accent text-[10px] uppercase tracking-luxer text-accent">
            Why that material
          </span>
          <motion.p
            key={current.year}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easeLens.focusRing }}
            className="mt-3 font-display text-xl leading-snug text-primary"
          >
            {current.note}
          </motion.p>
        </div>

        {/* ---- Work out which one is next ---- */}
        <div className="rounded-3xl border border-hairline bg-canvas-alt/60 p-6">
          <label
            htmlFor="anniversary-since"
            className="font-accent text-[10px] uppercase tracking-luxer text-accent"
          >
            The date itself
          </label>
          <input
            id="anniversary-since"
            type="date"
            value={since}
            onChange={(e) => {
              setSince(e.target.value);
            }}
            className="mt-3 w-full rounded-full border border-hairline bg-surface-sunken px-5 py-3 font-sans text-sm font-light text-primary outline-none transition-colors duration-300 focus:border-accent/60"
          />

          {upcoming && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={springsHeavy.leaf}
              className="mt-5"
            >
              <p className="font-sans text-sm font-light leading-relaxed text-secondary">
                {upcoming.elapsed} {upcoming.elapsed === 1 ? 'year' : 'years'} behind you. The next
                one is the{' '}
                <span className="font-accent text-accent nums-tabular">{upcoming.next}</span>
                {upcoming.next !== YEARS[upcoming.slot].year && (
                  <>
                    , and the tradition next marks{' '}
                    <span className="font-accent text-accent nums-tabular">
                      {YEARS[upcoming.slot].year}
                    </span>
                  </>
                )}
                .
              </p>
              <button
                type="button"
                onClick={() => setIndex(upcoming.slot)}
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-5 py-2.5 font-accent text-[10px] uppercase tracking-luxe text-accent transition-all duration-300 hover:bg-accent hover:text-onaccent"
              >
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                Turn the dial to it
              </button>
            </motion.div>
          )}
        </div>

        <p className="font-sans text-xs font-light leading-relaxed text-faint">
          The gemstone list was assembled by a retail jewellers&rsquo; association in 1937, largely
          because the older list of materials had almost no jewellery in it. We show both, and which
          is which, because one of them is a tradition and the other is a marketing document that
          became one.
        </p>
      </div>
    </div>
  );
}
