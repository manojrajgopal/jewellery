'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Finding the second stone.
 *
 * Everything else on the commission page prices one stone in one ring. This is
 * the question that catches people out when they ask for earrings, or a
 * three-stone, or a pair of anything: a matched stone is not the same as a
 * stone with the same numbers on its report.
 *
 * Two figures on a certificate can be identical while the stones are visibly
 * different in the hand. Colour is graded in letter steps, and the step from H
 * to I is a real, visible difference that a pair will show instantly because
 * the two are three centimetres apart on a face. Fluorescence is not on most
 * people's radar at all and it is the commonest cause of a mismatched pair —
 * one stone strong blue and one inert look like different stones under any
 * daylight, and both reports say "H VS1".
 *
 * So the panel prices the *search* rather than the stone, and it says the
 * uncomfortable thing plainly: past a certain tightness the honest answer is
 * that we cannot promise a date. A dealer with the right second stone either
 * has it or does not, and telling somebody eight weeks when the truth is "when
 * one turns up" is how a wedding gets ruined.
 */

interface Criterion {
  id: string;
  label: string;
  /** How much this narrows the search, per step of tightness. */
  weight: number;
  steps: string[];
  note: string;
}

const CRITERIA: Criterion[] = [
  {
    id: 'colour',
    label: 'Colour',
    weight: 2.6,
    steps: ['Within two grades', 'Within one grade', 'Exact grade', 'Matched by eye at the bench'],
    note: 'A grade apart is invisible in one ring and obvious in a pair, because the two stones are being compared to each other rather than to a memory. "Matched by eye" means we lay candidates beside your stone under one lamp and reject on sight, which is stricter than any grade.',
  },
  {
    id: 'clarity',
    label: 'Clarity',
    weight: 1.4,
    steps: ['Within two grades', 'Within one grade', 'Exact grade', 'Same inclusion character'],
    note: 'The last step is the one nobody asks for and the one that matters for a pair: two VS1 stones can be a feather and a cloud, and in a three-stone setting where light passes between them, that reads.',
  },
  {
    id: 'fluor',
    label: 'Fluorescence',
    weight: 2.2,
    steps: ['Ignore it', 'Both faint or less', 'Both inert', 'Identical response'],
    note: 'The commonest cause of a badly matched pair and the one almost nobody checks. One strong-blue stone next to an inert one looks like a different stone in any daylight, and both certificates will read the same.',
  },
  {
    id: 'cut',
    label: 'Cut and outline',
    weight: 1.8,
    steps: ['Same shape', 'Same shape and ratio', 'Same cut grade', 'Same cutter, same period'],
    note: 'Two ovals at 1.35 and 1.48 length-to-width are visibly different animals face-up. For anything elongated this matters more than colour, and for a round it barely matters at all.',
  },
  {
    id: 'weight',
    label: 'Weight',
    weight: 1.2,
    steps: ['Within 10%', 'Within 5%', 'Within 2%', 'Within 1%'],
    note: 'Loosest of the five, deliberately. A pair matched to 2% is indistinguishable, and insisting on 1% roughly doubles the search for a difference nobody has ever noticed across a dinner table.',
  },
];

const SHAPES = [
  { id: 'round', label: 'Round', supply: 1 },
  { id: 'oval', label: 'Oval', supply: 0.62 },
  { id: 'emerald', label: 'Emerald', supply: 0.44 },
  { id: 'pear', label: 'Pear', supply: 0.38 },
  { id: 'cushion', label: 'Cushion', supply: 0.5 },
  { id: 'marquise', label: 'Marquise', supply: 0.22 },
];

export default function StoneMatchingBench({ className = '' }: { className?: string }) {
  const [tight, setTight] = useState<Record<string, number>>({
    colour: 1,
    clarity: 1,
    fluor: 1,
    cut: 1,
    weight: 0,
  });
  const [shape, setShape] = useState('round');
  const [carat, setCarat] = useState(1.2);
  const [needPair, setNeedPair] = useState(2);

  const supply = SHAPES.find((s) => s.id === shape)?.supply ?? 1;

  const result = useMemo(() => {
    // A difficulty score that compounds, because these constraints multiply
    // rather than add — each one filters the pool the previous one left.
    const tightness = CRITERIA.reduce(
      (acc, c) => acc * (1 + (tight[c.id] / 3) * c.weight),
      1
    );
    // Large stones are rarer, and the rarity climbs faster than the weight.
    const sizePenalty = Math.max(1, carat ** 1.7);
    // A third stone is much harder than a second, not fifty per cent harder.
    const setPenalty = needPair === 2 ? 1 : needPair === 3 ? 2.6 : 5.2;

    const difficulty = (tightness * sizePenalty * setPenalty) / supply;

    const weeks = Math.round(Math.min(60, 1.6 + difficulty * 0.55));
    const premium = Math.min(0.9, (difficulty - 1) * 0.035);

    let confidence: { label: string; tone: string; body: string };
    if (difficulty < 9) {
      confidence = {
        label: 'We will have it in the safe or within a week',
        tone: 'var(--series-1)',
        body: 'This is inside our own stock or one call away. Nothing here needs a search.',
      };
    } else if (difficulty < 26) {
      confidence = {
        label: 'A real search, with a date we will hold to',
        tone: 'var(--series-2)',
        body: 'Two or three dealers, a parcel to view, and a date we are willing to commit to in writing. This is the normal shape of a matched commission.',
      };
    } else if (difficulty < 70) {
      confidence = {
        label: 'A search with a date we can only estimate',
        tone: 'var(--series-3)',
        body: 'We will find it. We are not able to tell you which month, because it depends on what comes out of a cutting house rather than on how hard anybody looks. If there is a wedding date, tell us now and we will plan around a stone we already have.',
      };
    } else {
      confidence = {
        label: 'We cannot promise a date, and we will not pretend otherwise',
        tone: 'var(--series-4)',
        body: 'At this tightness the right stone exists somewhere and nobody can say when it will surface. We will take the brief, we will not take a deposit, and we will call you the day one appears. If you need certainty rather than the match, loosen one constraint — usually fluorescence or weight — and the whole thing becomes findable.',
      };
    }

    return { difficulty, weeks, premium, confidence };
  }, [tight, carat, needPair, supply]);

  return (
    <div className={className}>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
        {/* The brief. */}
        <div>
          <div className="flex flex-wrap gap-6">
            <div className="min-w-[10rem] flex-1">
              <p className="font-accent text-[10px] uppercase tracking-luxe text-muted">Shape</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {SHAPES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setShape(s.id)}
                    aria-pressed={shape === s.id}
                    className={`rounded-full border px-3 py-1.5 font-accent text-[10px] uppercase tracking-luxe transition-colors duration-300 ${
                      shape === s.id
                        ? 'border-accent bg-accent/10 text-accent'
                        : 'border-hairline text-muted hover:border-accent/50 hover:text-accent'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="min-w-[10rem] flex-1">
              <p className="font-accent text-[10px] uppercase tracking-luxe text-muted">
                How many, matched
              </p>
              <div className="mt-2 flex gap-2">
                {[2, 3, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setNeedPair(n)}
                    aria-pressed={needPair === n}
                    className={`h-9 w-9 rounded-full border font-accent text-xs transition-colors duration-300 ${
                      needPair === n
                        ? 'border-accent bg-accent/10 text-accent'
                        : 'border-hairline text-muted hover:border-accent/50 hover:text-accent'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <p className="mt-2 font-sans text-xs font-light text-faint">
                A third stone is not half again as hard as a second. It is
                roughly three times.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <label
              htmlFor="match-carat"
              className="font-accent text-[10px] uppercase tracking-luxe text-muted"
            >
              Each stone
            </label>
            <p className="nums-instrument mt-1 font-display text-3xl text-primary">
              {carat.toFixed(2)}
              <span className="ml-1 font-accent text-xs uppercase tracking-luxe text-muted">
                ct
              </span>
            </p>
            <input
              id="match-carat"
              type="range"
              min={0.2}
              max={4}
              step={0.05}
              value={carat}
              onChange={(e) => setCarat(Number(e.target.value))}
              className="range-overlay mt-2 w-full"
            />
          </div>

          <div className="mt-8 space-y-5 border-t border-line-subtle pt-6">
            <p className="font-accent text-[10px] uppercase tracking-luxe text-muted">
              How closely they must match
            </p>

            {CRITERIA.map((c) => (
              <div key={c.id}>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-accent text-[10px] uppercase tracking-luxe text-primary">
                    {c.label}
                  </span>
                  <span className="font-accent text-[10px] uppercase tracking-luxe text-accent">
                    {c.steps[tight[c.id]]}
                  </span>
                </div>
                <div className="mt-2 flex gap-1">
                  {c.steps.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setTight((t) => ({ ...t, [c.id]: i }))}
                      aria-label={`${c.label}: ${c.steps[i]}`}
                      aria-pressed={tight[c.id] === i}
                      className="h-2 flex-1 rounded-full transition-colors duration-300"
                      style={{
                        background:
                          i <= tight[c.id]
                            ? 'rgb(var(--series-2))'
                            : 'rgb(var(--surface-sunken))',
                      }}
                    />
                  ))}
                </div>
                <p className="mt-1.5 font-sans text-xs font-light leading-relaxed text-faint">
                  {c.note}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* What it means. */}
        <div>
          <div className="chart-surface rounded-2xl p-5">
            <p className="font-accent text-[10px] uppercase tracking-luxe text-muted">
              How hard this is
            </p>

            <div className="mt-4 flex items-end gap-4">
              <div>
                <p className="nums-instrument font-display text-4xl text-primary">
                  {result.weeks}
                </p>
                <p className="font-accent text-[9px] uppercase tracking-luxe text-faint">
                  weeks, typically
                </p>
              </div>
              <div className="ml-auto text-right">
                <p className="nums-instrument font-display text-4xl text-primary">
                  +{Math.round(result.premium * 100)}%
                </p>
                <p className="font-accent text-[9px] uppercase tracking-luxe text-faint">
                  matching premium
                </p>
              </div>
            </div>

            <div className="mt-5 border-t border-line-subtle pt-4">
              <div className="flex items-baseline justify-between">
                <span className="font-accent text-[9px] uppercase tracking-luxe text-faint">
                  Search difficulty
                </span>
                <span className="nums-instrument font-accent text-[9px] text-primary">
                  {Math.round(result.difficulty)}
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-sunken">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `rgb(${result.confidence.tone})` }}
                  animate={{ width: `${Math.min(100, (result.difficulty / 110) * 100)}%` }}
                  transition={{ type: 'spring', stiffness: 170, damping: 26 }}
                />
              </div>
            </div>
          </div>

          <motion.div
            key={result.confidence.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="spec-plate mt-5 p-4"
          >
            <p
              className="font-accent text-[10px] uppercase leading-relaxed tracking-luxe"
              style={{ color: `rgb(${result.confidence.tone})` }}
            >
              {result.confidence.label}
            </p>
            <p className="mt-2 font-sans text-sm font-light leading-relaxed text-muted">
              {result.confidence.body}
            </p>
          </motion.div>

          <p className="mt-5 font-sans text-xs font-light leading-relaxed text-faint">
            The premium is on the second and subsequent stones only, and it is
            the dealer’s, not ours — a matched parcel costs more than two loose
            stones because somebody had to hold inventory until the pair existed.
            We show it separately rather than folding it into the price.
          </p>
        </div>
      </div>
    </div>
  );
}
