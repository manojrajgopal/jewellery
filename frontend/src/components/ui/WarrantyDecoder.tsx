'use client';

import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Check, Minus, X } from 'lucide-react';

import { easeCine } from '@/lib/motion';

/**
 * What the guarantee covers, laid out against what actually goes wrong.
 *
 * Every jewellers' guarantee is written as a list of what is covered, and every
 * one of them is therefore useless — because a customer with a problem does not
 * know which category their problem is in. "Manufacturing defects" covers a
 * prong that lifted and does not cover the identical-looking prong that lifted
 * because the ring was caught on a car door, and nobody can tell which theirs is
 * from reading the clause.
 *
 * So this is inverted: the rows are the *events*, in the order they actually
 * happen to people, and the columns are who pays. The three-state answer matters
 * — covered, shared, or yours — because a binary yes/no forces every ambiguous
 * case into "not covered", which is exactly how guarantees get their reputation.
 *
 * `frequency` is the honest ordering: how often we see each event per hundred
 * pieces over ten years, from our own bench records. It puts the boring items at
 * the top, which is where they belong. The dramatic ones people worry about —
 * a stone falling out, a chain snapping — are near the bottom, and the thing that
 * will actually happen to your ring is that the rhodium wears off.
 */
type Cover = 'covered' | 'shared' | 'yours';

interface Event {
  id: string;
  what: string;
  /** Per hundred pieces over ten years, from bench records. */
  frequency: number;
  cover: Cover;
  /** When it happens, and why. */
  when: string;
  /** What we do about it, in plain terms including the cost when there is one. */
  answer: string;
  /** Which of the three products it applies to. */
  scope: ('made' | 'sold' | 'other')[];
}

const EVENTS: Event[] = [
  {
    id: 'rhodium',
    what: 'Rhodium plating wears through on a white gold ring',
    frequency: 71,
    cover: 'shared',
    when: 'Three to five years on a ring worn daily, sooner on the underside of the shank. It is wear, not a fault, and it is the single most common thing we see.',
    answer:
      'Free for the first two re-plates on anything we made. After that it is a modest bench charge, about the price of a good dinner, and it takes two days.',
    scope: ['made', 'sold', 'other'],
  },
  {
    id: 'polish',
    what: 'General scratching and loss of polish',
    frequency: 64,
    cover: 'covered',
    when: 'Continuously, from the day it is worn. Platinum shows it worst and hides it best, which is the paradox of the metal.',
    answer:
      'Free, for life, on anything we made or sold — and free once a year on anything at all, whoever made it. Bring it in. We would rather see it than not.',
    scope: ['made', 'sold', 'other'],
  },
  {
    id: 'restring',
    what: 'A pearl or bead strand needs restringing',
    frequency: 48,
    cover: 'yours',
    when: 'Every eighteen months to three years on a strand worn weekly. Silk stretches and absorbs skin oils, which is what silk is for.',
    answer:
      'A bench charge, and never covered by anyone’s guarantee — it is scheduled maintenance, like a service on a car. We will tell you when it is due at any inspection.',
    scope: ['made', 'sold', 'other'],
  },
  {
    id: 'prong-wear',
    what: 'A claw wears thin',
    frequency: 34,
    cover: 'covered',
    when: 'Eight to fifteen years on a daily-worn ring, and much sooner on a piece worn while working with the hands.',
    answer:
      'Re-tipped free on anything we made, for as long as the piece exists. This is the one we most want you to bring in early — a thin claw is a small job and a lost stone is not.',
    scope: ['made'],
  },
  {
    id: 'resize',
    what: 'The ring no longer fits',
    frequency: 29,
    cover: 'shared',
    when: 'Usually within the first two years, and then again after any significant change in weight or in the weather — fingers are between a half and a full size larger in summer.',
    answer:
      'First resize free within a year on anything we made. After that, a bench charge. We will also tell you honestly when a resize is a bad idea for the construction, which is a conversation we have several times a month.',
    scope: ['made'],
  },
  {
    id: 'clasp',
    what: 'A clasp becomes hard to work, or fails',
    frequency: 22,
    cover: 'covered',
    when: 'Five to ten years on a spring ring, longer on a box clasp with a safety. Spring rings fail closed far more often than open, which is why people think they are fine.',
    answer:
      'Replaced free on anything we made, and we will fit a different type at no extra charge if the original is one you have struggled with. Changing a clasp for an easier one is not an admission of anything.',
    scope: ['made'],
  },
  {
    id: 'stone-loss-defect',
    what: 'A stone falls out and the setting was at fault',
    frequency: 6,
    cover: 'covered',
    when: 'If it is going to happen from a setting fault it happens in the first two years. After that, a lost stone is almost always impact or wear.',
    answer:
      'Stone replaced and reset, free, whenever it happens — there is no time limit on our own bench error. We say which it was after looking at it under the scope, and we have told customers it was our fault more often than they expected.',
    scope: ['made'],
  },
  {
    id: 'stone-loss-impact',
    what: 'A stone falls out after a knock',
    frequency: 11,
    cover: 'shared',
    when: 'Any time. A single hard impact on a claw setting can do it on day one or in year thirty.',
    answer:
      'We reset free and you replace the stone, or claim it — this is precisely what an all-risks policy is for. If the stone is one we supplied we will match it from the same parcel where we still have it, which is worth more than the discount.',
    scope: ['made', 'sold'],
  },
  {
    id: 'chain-break',
    what: 'A chain parts',
    frequency: 9,
    cover: 'shared',
    when: 'Almost always at the jump ring, almost always while being pulled over clothing, and almost always because the pendant was heavier than the chain was rated for.',
    answer:
      'Repaired free if we supplied the chain and the pendant together. If they came from different places we repair at cost and then have the conversation about gauge that should have happened first.',
    scope: ['made', 'sold', 'other'],
  },
  {
    id: 'enamel',
    what: 'Enamel crazes or chips',
    frequency: 4,
    cover: 'yours',
    when: 'From a single sharp impact, or from thermal shock — hot water straight onto a cold piece will do it.',
    answer:
      'Not covered by anybody, and we will say so up front before you commission anything enamelled. It is repairable in some techniques and not in others, and the piece is re-fired at your cost with a real chance of losing it.',
    scope: ['made'],
  },
  {
    id: 'loss',
    what: 'The piece is lost or stolen',
    frequency: 3,
    cover: 'yours',
    when: 'Overwhelmingly at home, and overwhelmingly a ring taken off to wash something.',
    answer:
      'Nothing we can do, and no jeweller’s guarantee anywhere covers it. What we can do is hold the drawing, the stone details and the measurements so an insurer has something to work from and a remake is a remake rather than a guess. That record is free and permanent.',
    scope: ['made', 'sold', 'other'],
  },
];

const SCOPES = [
  { id: 'made' as const, label: 'We made it' },
  { id: 'sold' as const, label: 'We sold it' },
  { id: 'other' as const, label: 'Somebody else made it' },
];

const COVER_META = {
  covered: { label: 'We cover it', Icon: Check, tone: 'text-jade-500', border: 'border-jade-500/30' },
  shared: { label: 'Shared', Icon: Minus, tone: 'text-accent', border: 'border-accent/30' },
  yours: { label: 'Yours', Icon: X, tone: 'text-burgundy-500', border: 'border-burgundy-500/30' },
} as const;

export default function WarrantyDecoder() {
  const [scope, setScope] = useState<'made' | 'sold' | 'other'>('made');
  const [open, setOpen] = useState('rhodium');
  const reduced = useReducedMotion();

  const shown = useMemo(
    () => EVENTS.filter((e) => e.scope.includes(scope)).sort((a, b) => b.frequency - a.frequency),
    [scope]
  );

  const counts = useMemo(() => {
    const c = { covered: 0, shared: 0, yours: 0 };
    shown.forEach((e) => (c[e.cover] += 1));
    return c;
  }, [shown]);

  return (
    <div className="mx-auto max-w-5xl">
      <div role="radiogroup" aria-label="Where the piece came from" className="flex flex-wrap gap-2">
        {SCOPES.map((s) => {
          const on = s.id === scope;
          return (
            <button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => setScope(s.id)}
              className={`rounded-full border px-5 py-2 font-accent text-[10px] uppercase tracking-luxe transition-colors duration-300 ${
                on
                  ? 'border-accent bg-accent text-onaccent'
                  : 'border-hairline text-muted hover:border-accent/50 hover:text-accent'
              }`}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      {/* The summary, which is the answer most people came for. */}
      <dl className="mt-8 grid grid-cols-3 gap-4">
        {(['covered', 'shared', 'yours'] as const).map((k) => {
          const meta = COVER_META[k];
          return (
            <div key={k} className={`rounded-xl border px-4 py-4 ${meta.border}`}>
              <dt className="font-accent text-[9px] uppercase tracking-luxe text-faint">
                {meta.label}
              </dt>
              <dd className={`nums-instrument mt-1 font-display text-3xl ${meta.tone}`}>
                {counts[k]}
              </dd>
            </div>
          );
        })}
      </dl>

      {/* The events, most frequent first. This ordering is the argument: the
          things people worry about are at the bottom and the thing that will
          happen to them is at the top. */}
      <ul className="mt-10 space-y-3">
        {shown.map((e) => {
          const isOpen = open === e.id;
          const meta = COVER_META[e.cover];
          return (
            <li key={e.id} className={`rounded-xl border bg-surface-raised/40 ${meta.border}`}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? '' : e.id)}
                aria-expanded={isOpen}
                className="flex w-full items-start gap-4 p-5 text-left"
              >
                <meta.Icon className={`mt-1 h-4 w-4 shrink-0 ${meta.tone}`} aria-hidden="true" />

                <span className="min-w-0 flex-1">
                  <span className="block font-display text-lg leading-snug text-primary">
                    {e.what}
                  </span>
                  <span className={`mt-1 block font-accent text-[10px] uppercase tracking-luxe ${meta.tone}`}>
                    {meta.label}
                  </span>
                </span>

                {/* Frequency, as a bar. The row order already says it, and the
                    bar says *how much* — 71 against 3 is the whole point. */}
                <span className="hidden w-28 shrink-0 pt-1 sm:block">
                  <span className="block h-1 rounded-full bg-line/50">
                    <motion.span
                      className="block h-full rounded-full bg-accent/70"
                      initial={false}
                      animate={{ width: `${e.frequency}%` }}
                      transition={reduced ? { duration: 0 } : { duration: 0.6, ease: easeCine.glass }}
                    />
                  </span>
                  <span className="nums-instrument mt-2 block font-accent text-[9px] uppercase tracking-luxe text-faint">
                    {e.frequency} in 100
                  </span>
                </span>
              </button>

              <motion.div
                initial={false}
                animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                transition={reduced ? { duration: 0 } : { duration: 0.45, ease: easeCine.glass }}
                className="overflow-hidden"
              >
                <div className="border-t border-hairline px-5 pb-5 pt-4">
                  <p className="font-sans text-sm font-light leading-relaxed text-muted">
                    <span className="text-primary">When. </span>
                    {e.when}
                  </p>
                  <p className="mt-3 font-sans text-sm font-light leading-relaxed text-muted">
                    <span className="text-primary">What we do. </span>
                    {e.answer}
                  </p>
                </div>
              </motion.div>
            </li>
          );
        })}
      </ul>

      <p className="mt-10 border-t border-hairline pt-6 font-sans text-sm font-light leading-relaxed text-muted">
        Frequencies are from our own bench book over ten years and about eleven hundred pieces, which
        is a small enough sample that the numbers at the bottom of the list should be read as
        &ldquo;rare&rdquo; rather than as exact. Nothing on this page has a time limit on it except
        where one is stated, and nothing on it requires a receipt — a commission number, or the piece
        itself, is enough.
      </p>
    </div>
  );
}
