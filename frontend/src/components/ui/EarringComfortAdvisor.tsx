'use client';

import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Info } from 'lucide-react';

import { easeCine } from '@/lib/motion';

/**
 * The fittings, with the load each one will genuinely carry all day.
 *
 * `carries` is grams per ear and it is the number this whole component exists to
 * publish, because it is the one figure a customer needs and no catalogue prints.
 * A butterfly back holds about two grams comfortably; the same earring on a
 * screw-back La Pousette will hold five. That is not a small difference — it is
 * the difference between an earring that is worn and one that is not.
 *
 * `support` is where the load is carried: `lobe` means the piercing takes all of
 * it, `spread` means the fitting distributes it across the back of the lobe, and
 * `frame` means the weight is partly carried by the ear's own structure.
 */
interface Back {
  id: string;
  name: string;
  alias?: string;
  /** Grams per ear this fitting carries comfortably all day. */
  carries: number;
  support: 'lobe' | 'spread' | 'frame';
  what: string;
  /** Honest downside. */
  cost: string;
  /** Whether it will hold a valuable stone if it comes loose. */
  loss: string;
}

const BACKS: Back[] = [
  {
    id: 'butterfly',
    name: 'Butterfly back',
    alias: 'push-on scroll',
    carries: 2,
    support: 'lobe',
    what: 'The default. A sprung wire scroll pushed onto a straight post, held by friction alone.',
    cost:
      'Loosens with wear and cannot be tightened once the spring has opened. Also the single most-lost component in jewellery.',
    loss: 'Poor. If the back goes, the earring goes with it, and it happens through a jumper.',
  },
  {
    id: 'screw',
    name: 'Screw back',
    carries: 4,
    support: 'lobe',
    what: 'A threaded post with a matching threaded back. Nothing sprung, so nothing to fatigue.',
    cost:
      'Slow to put on, and a fine gold thread will eventually wear. Not the choice for earrings taken off nightly.',
    loss: 'Good. It will not come off without being turned.',
  },
  {
    id: 'lapousette',
    name: 'La Pousette',
    alias: 'spring-lock back',
    carries: 5,
    support: 'spread',
    what: 'A back with two sprung tabs that lock into a notch on the post, released by squeezing. The trade’s answer for heavy studs.',
    cost: 'Costs several times a butterfly, and the mechanism is small enough that arthritic fingers struggle.',
    loss: 'Excellent. This is what is fitted to stones worth losing sleep over.',
  },
  {
    id: 'omega',
    name: 'Omega clip',
    carries: 12,
    support: 'frame',
    what: 'A post through the piercing plus a hinged clip behind the lobe, so the weight is shared between the piercing and the back of the ear.',
    cost: 'Visible from behind, and adds real bulk. Not discreet in a low chignon.',
    loss: 'Excellent, and it is the only fitting on this list that survives the piercing itself stretching.',
  },
  {
    id: 'shepherd',
    name: 'Shepherd hook',
    alias: 'fish hook',
    carries: 3,
    support: 'lobe',
    what: 'An open wire through the piercing, held by its own bend. What most drop earrings arrive on.',
    cost: 'Open by definition — it can lift out. Fine for an evening, poor for a day of moving about.',
    loss: 'Poor, and the reason drop earrings are lost more often than studs.',
  },
  {
    id: 'lever',
    name: 'Lever back',
    carries: 7,
    support: 'spread',
    what: 'A hinged wire that closes into a catch behind the lobe, forming a closed loop.',
    cost: 'The hinge is a wear point and will need re-tensioning after a decade of daily use.',
    loss: 'Very good. A closed loop cannot lift out, only unclip.',
  },
];

/** Pierce ages, because an older piercing carries more and stretches faster. */
const AGES = [
  { id: 'new', label: 'Under a year', factor: 0.6, note: 'A new piercing has not built any supporting tissue. Keep the load light for the first year whatever the fitting says.' },
  { id: 'settled', label: 'One to ten years', factor: 1, note: 'A settled piercing at its normal tolerance. Every figure on this page is calibrated to this.' },
  { id: 'old', label: 'Over ten years', factor: 1.15, note: 'More tolerant of weight and more prone to elongating under it. The risk shifts from discomfort to a stretched piercing you cannot undo.' },
  { id: 'stretched', label: 'Already elongated', factor: 0.5, note: 'A lobe that has already stretched will keep stretching. This is where an omega clip stops being about security and becomes the only sensible option.' },
] as const;

/**
 * How the day goes at a given load, as a fraction of the fitting's rated
 * capacity. The bands are the ones people actually report: unnoticed, noticed by
 * evening, uncomfortable by mid-afternoon, and taken off.
 */
function verdictFor(ratio: number) {
  if (ratio <= 0.6)
    return {
      kind: 'good' as const,
      headline: 'Unnoticed all day',
      body: 'Comfortably inside what this fitting carries. This is what "wearable" actually means — not that it can be got on, but that it can be forgotten about.',
    };
  if (ratio <= 1)
    return {
      kind: 'good' as const,
      headline: 'Noticed by the evening',
      body: 'At the top of what this fitting handles. Fine for a working day, and you will be aware of it by nine at night.',
    };
  if (ratio <= 1.5)
    return {
      kind: 'fair' as const,
      headline: 'Uncomfortable by mid-afternoon',
      body: 'Over the fitting’s capacity. It will sit forward, the post will angle in the piercing, and the lobe will ache. A better back solves this without touching the earring.',
    };
  return {
    kind: 'poor' as const,
    headline: 'This will not be worn',
    body: 'Well past what the fitting and the piercing can carry. Either the earring needs a different fitting, or the weight has to come out of the design — usually by hollowing the back of the setting, which costs nothing in appearance.',
  };
}

const TONE = {
  good: 'text-jade-300',
  fair: 'text-gold-300',
  poor: 'text-burgundy-300',
} as const;

/**
 * Whether an earring will actually be worn, which is a question of grams.
 *
 * This is the third of the three sizing tools on this page and the one that
 * surprises people. A ring that does not fit is obvious; an earring that is too
 * heavy is not, because it goes on perfectly well and then quietly stops being
 * chosen. Nobody returns them. They simply sit in the box, and the customer
 * concludes they do not suit heavy earrings — when what actually happened is
 * that a four-gram pair was sold on a two-gram fitting.
 *
 * The recommendation is deliberately never "buy a lighter earring". It is almost
 * always the back that is wrong, and changing a butterfly for a La Pousette is a
 * small bench charge that more than doubles what the same earring will carry.
 */
export default function EarringComfortAdvisor({ className = '' }: { className?: string }) {
  const reduced = useReducedMotion();
  const [grams, setGrams] = useState(3.5);
  const [backId, setBackId] = useState(BACKS[0].id);
  const [ageId, setAgeId] = useState<(typeof AGES)[number]['id']>('settled');

  const back = BACKS.find((b) => b.id === backId) ?? BACKS[0];
  const age = AGES.find((a) => a.id === ageId) ?? AGES[1];

  const capacity = back.carries * age.factor;
  const ratio = grams / capacity;
  const verdict = verdictFor(ratio);

  // The fitting that would carry this weight comfortably, if the current one
  // does not. Cheapest sufficient answer rather than the strongest available.
  const better = useMemo(() => {
    if (ratio <= 1) return null;
    return (
      [...BACKS]
        .sort((a, b) => a.carries - b.carries)
        .find((b) => b.carries * age.factor >= grams) ?? null
    );
  }, [ratio, grams, age.factor]);

  return (
    <div className={`space-y-8 ${className}`}>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]">
        <div className="space-y-7">
          {/* The weight. */}
          <div>
            <div className="flex items-baseline justify-between gap-4">
              <label htmlFor="earring-grams" className="font-accent text-[10px] uppercase tracking-luxe text-accent">
                Weight of one earring
              </label>
              <span className="nums-tabular font-display text-3xl text-accent">
                {grams.toFixed(1)}
                <span className="ml-1 font-accent text-xs uppercase tracking-luxe text-faint">g</span>
              </span>
            </div>
            <input
              id="earring-grams"
              type="range"
              min={0.5}
              max={18}
              step={0.5}
              value={grams}
              onChange={(e) => setGrams(Number(e.target.value))}
              className="range-overlay mt-3 w-full"
            />
            <p className="mt-1.5 font-sans text-[11px] font-light text-faint">
              A pair of small diamond studs is under a gram. A jhumka in 22K is commonly eight to
              fourteen. Every piece we sell has this figure on its tag.
            </p>
          </div>

          {/* The piercing. */}
          <fieldset>
            <legend className="font-accent text-[10px] uppercase tracking-luxe text-accent">
              The piercing itself
            </legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {AGES.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setAgeId(a.id)}
                  aria-pressed={a.id === ageId}
                  className={`rounded-full border px-4 py-1.5 font-accent text-[10px] uppercase tracking-luxe transition-colors duration-300 ${
                    a.id === ageId
                      ? 'border-accent/60 bg-accent/12 text-accent'
                      : 'border-hairline text-muted hover:border-accent/40 hover:text-accent'
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>
            <motion.p
              key={age.id}
              initial={reduced ? undefined : { opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 font-sans text-xs font-light leading-relaxed text-secondary"
            >
              {age.note}
            </motion.p>
          </fieldset>
        </div>

        {/* The verdict. */}
        <motion.div
          key={`${verdict.headline}-${back.id}`}
          initial={reduced ? undefined : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: easeCine.glass }}
          className="flex flex-col justify-center gap-4 rounded-2xl border border-hairline bg-surface-raised/45 p-6"
        >
          <span className={`font-accent text-[10px] uppercase tracking-luxe ${TONE[verdict.kind]}`}>
            {Math.round(ratio * 100)}% of what this fitting carries
          </span>

          {/* The load bar. Marked at 100% so being over it is visible rather than
              inferred from a number. */}
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-[rgb(var(--hairline)/0.14)]">
            <motion.span
              initial={false}
              animate={{ scaleX: Math.min(1.6, ratio) / 1.6 }}
              transition={{ duration: reduced ? 0 : 0.6, ease: easeCine.glass }}
              style={{ transformOrigin: '0% 50%' }}
              className={`block h-full w-full rounded-full ${
                verdict.kind === 'good'
                  ? 'bg-jade-300'
                  : verdict.kind === 'fair'
                    ? 'bg-gold-400'
                    : 'bg-burgundy-300'
              }`}
            />
            <span
              aria-hidden="true"
              className="absolute inset-y-0 w-px bg-[rgb(var(--hairline)/0.5)]"
              style={{ left: `${(1 / 1.6) * 100}%` }}
            />
          </div>

          <p className="font-display text-2xl leading-snug text-primary">{verdict.headline}</p>
          <p className="font-sans text-sm font-light leading-relaxed text-secondary">
            {verdict.body}
          </p>

          {better && (
            <p className="flex gap-2 border-t border-hairline pt-4 font-sans text-xs font-light leading-relaxed text-accent">
              <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
              <span>
                A <strong className="font-normal">{better.name}</strong> carries{' '}
                {(better.carries * age.factor).toFixed(1)}g on this piercing and would take the
                same earring comfortably. Changing the fitting is a bench job, not a redesign.
              </span>
            </p>
          )}
        </motion.div>
      </div>

      {/* The six fittings. */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {BACKS.map((b, i) => {
          const on = b.id === backId;
          const holds = b.carries * age.factor;
          return (
            <motion.button
              key={b.id}
              type="button"
              onClick={() => setBackId(b.id)}
              aria-pressed={on}
              initial={reduced ? undefined : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-6% 0px' }}
              transition={{ duration: 0.5, delay: reduced ? 0 : i * 0.04, ease: easeCine.glass }}
              className={`rounded-2xl border p-5 text-left transition-colors duration-500 ${
                on
                  ? 'border-accent/55 bg-surface-raised/75'
                  : 'border-hairline bg-surface-raised/25 hover:border-accent/35'
              } ${holds >= grams ? '' : 'opacity-70'}`}
            >
              <span className="flex items-baseline justify-between gap-3">
                <span className={`font-display text-lg leading-tight ${on ? 'text-accent' : 'text-primary'}`}>
                  {b.name}
                </span>
                <span className="nums-tabular font-accent text-[10px] uppercase tracking-luxe text-accent">
                  {holds.toFixed(1)}g
                </span>
              </span>

              {b.alias && (
                <span className="mt-0.5 block font-accent text-[9px] uppercase tracking-luxe text-faint">
                  also “{b.alias}” · load on the {b.support}
                </span>
              )}

              <span className="mt-2.5 block font-sans text-xs font-light leading-relaxed text-secondary">
                {b.what}
              </span>

              <span className="mt-3 block border-t border-hairline pt-3 font-sans text-[11px] font-light leading-relaxed text-faint">
                <strong className="font-normal text-burgundy-300">Costs you:</strong> {b.cost}
              </span>
              <span className="mt-1.5 block font-sans text-[11px] font-light leading-relaxed text-faint">
                <strong className="font-normal text-jade-300">If it fails:</strong> {b.loss}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
