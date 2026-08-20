'use client';

import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { easeCine, springsSilk } from '@/lib/motion';

/**
 * Whether the stone being asked for actually exists.
 *
 * The commission bench can already price a ring and take a brief. What neither
 * does is answer the question that decides whether a commission is possible at
 * all: is there a stone like that, findable, in this budget, in this timescale?
 *
 * Almost every dealer in the trade answers "yes, leave it with me" and then
 * spends six weeks negotiating the customer down. The arithmetic that makes that
 * unnecessary is not complicated, and it is deliberately never shown:
 *
 *  - Price per carat does not scale linearly with size. It steps, hard, at the
 *    weights the market trades in — a 1.00ct stone costs meaningfully more per
 *    carat than a 0.99ct one for no physical reason whatsoever. Four of these
 *    cliffs do most of the damage to a budget.
 *  - Every constraint added multiplies the search rather than adding to it.
 *    Origin, no-treatment, and a specific colour grade each cut the available
 *    parcel by a large factor, and three of them together can reduce a global
 *    market to a handful of stones a year.
 *  - Time is the substitutable resource. Almost any brief becomes possible if
 *    the customer will wait for the right parcel, and almost none of them are
 *    told that.
 *
 * So the output is three numbers — feasibility, expected weeks, and what the
 * budget actually buys — plus, crucially, the *one constraint to drop*. That last
 * one is the whole value: it turns an impossible brief into a possible one
 * without the customer having to guess which of their requirements was the
 * expensive one.
 */
const SPECIES = [
  { id: 'diamond', name: 'Diamond', base: 520000, scarcity: 1, note: 'The deepest market in the world. Almost anything is findable; the question is only price.' },
  { id: 'sapphire', name: 'Blue sapphire', base: 180000, scarcity: 1.4, note: 'Plentiful up to about three carats, then it thins fast. Kashmir is a separate market from everything else.' },
  { id: 'ruby', name: 'Ruby', base: 620000, scarcity: 2.6, note: 'The hardest of the big three. Untreated Burmese material over two carats is genuinely rare and priced as such.' },
  { id: 'emerald', name: 'Emerald', base: 320000, scarcity: 1.8, note: 'Findable, but clarity expectations have to be realistic — an emerald with no fissures does not exist at any size.' },
  { id: 'spinel', name: 'Spinel', base: 85000, scarcity: 1.5, note: 'The connoisseur’s answer. Untreated by default, historically confused with ruby, and a fraction of the price of one.' },
  { id: 'paraiba', name: 'Paraíba tourmaline', base: 900000, scarcity: 4.2, note: 'A market of a few dozen serious stones a year. Copper-bearing, and the colour cannot be imitated by anything else.' },
];

const ORIGINS = [
  { id: 'any', label: 'Any origin', factor: 1, weeks: 0 },
  { id: 'named', label: 'A named country', factor: 1.35, weeks: 3 },
  { id: 'classic', label: 'A classic source', factor: 2.4, weeks: 9 },
];

const TREATMENT = [
  { id: 'standard', label: 'Standard for the species', factor: 1, weeks: 0 },
  { id: 'none', label: 'No treatment at all', factor: 2.2, weeks: 7 },
];

/** The four weight cliffs, and what crossing each one costs per carat. */
const CLIFFS = [
  { at: 0.5, step: 1.18 },
  { at: 1, step: 1.42 },
  { at: 2, step: 1.55 },
  { at: 5, step: 1.9 },
];

export default function StoneSourcingBrief() {
  const [speciesId, setSpeciesId] = useState('sapphire');
  const [carats, setCarats] = useState(2.1);
  const [originId, setOriginId] = useState('classic');
  const [treatmentId, setTreatmentId] = useState('none');
  const [budget, setBudget] = useState(900000);
  const [weeks, setWeeks] = useState(10);
  const reduced = useReducedMotion();

  const species = SPECIES.find((s) => s.id === speciesId)!;
  const origin = ORIGINS.find((o) => o.id === originId)!;
  const treatment = TREATMENT.find((t) => t.id === treatmentId)!;

  /** Per-carat price with the cliffs applied cumulatively. */
  const perCarat = useMemo(() => {
    let p = species.base;
    CLIFFS.forEach((c) => {
      if (carats >= c.at) p *= c.step;
    });
    return p * origin.factor * treatment.factor;
  }, [species.base, carats, origin.factor, treatment.factor]);

  const estimate = perCarat * carats;

  /** How long the search realistically takes, before budget is considered. */
  const searchWeeks = useMemo(
    () => Math.round((2 + origin.weeks + treatment.weeks) * species.scarcity + Math.max(0, carats - 1) * 2),
    [origin.weeks, treatment.weeks, species.scarcity, carats]
  );

  const budgetRatio = budget / estimate;
  const timeOk = weeks >= searchWeeks;

  const verdict = useMemo(() => {
    if (budgetRatio >= 1 && timeOk)
      return {
        label: 'Findable',
        tone: 'jade' as const,
        line: 'This brief is buyable. We would expect to show you two or three candidates rather than one.',
      };
    if (budgetRatio >= 1)
      return {
        label: 'Findable, but not that fast',
        tone: 'gold' as const,
        line: `The budget works. ${searchWeeks} weeks is the honest search time — the right parcel has to come round, and it cannot be hurried by paying more.`,
      };
    if (budgetRatio >= 0.65)
      return {
        label: 'Close',
        tone: 'gold' as const,
        line: 'Within reach if one requirement moves. Dropping the right one is much cheaper than raising the budget.',
      };
    return {
      label: 'Not as specified',
      tone: 'burgundy' as const,
      line: 'The brief and the budget are describing different stones. Worth saying now rather than in six weeks.',
    };
  }, [budgetRatio, timeOk, searchWeeks]);

  /* Which single constraint to drop. Computed by testing each relaxation and
     taking the one with the largest effect — which is the part a customer cannot
     do in their head, because the factors multiply rather than add. */
  const suggestion = useMemo(() => {
    if (budgetRatio >= 1) return null;

    const options: { label: string; saved: number; how: string }[] = [];

    if (origin.factor > 1) {
      const relaxed = ORIGINS[originId === 'classic' ? 1 : 0];
      options.push({
        label: `Origin — ${relaxed.label.toLowerCase()}`,
        saved: estimate - estimate * (relaxed.factor / origin.factor),
        how: 'The single most expensive word in a stone brief is usually a place name. The same material from an unfashionable deposit is frequently indistinguishable in the piece.',
      });
    }

    if (treatment.factor > 1) {
      options.push({
        label: 'Accept the standard treatment',
        saved: estimate - estimate / treatment.factor,
        how: 'For sapphire and ruby the standard treatment is heat, which is permanent, two thousand years old and completely stable. Untreated is a collector’s premium rather than a quality difference.',
      });
    }

    // Drop below the nearest cliff. Frequently the largest single saving.
    const cliff = [...CLIFFS].reverse().find((c) => carats >= c.at && carats < c.at * 1.25);
    if (cliff) {
      const under = cliff.at - 0.01;
      const savedRatio = 1 / cliff.step;
      options.push({
        label: `Take ${under.toFixed(2)} ct instead of ${carats.toFixed(2)}`,
        saved: estimate - estimate * savedRatio * (under / carats),
        how: `The market steps at exactly ${cliff.at.toFixed(2)} carats for no physical reason at all. A hundredth of a carat under the line is invisible in the setting and materially cheaper.`,
      });
    }

    return options.sort((a, b) => b.saved - a.saved)[0] ?? null;
  }, [budgetRatio, origin, originId, treatment.factor, estimate, carats]);

  const fmt = (n: number) =>
    `₹${Math.round(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

  const tones = {
    jade: 'border-jade-500/40 text-jade-500',
    gold: 'border-accent/40 text-accent',
    burgundy: 'border-burgundy-500/40 text-burgundy-500',
  } as const;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] md:gap-16">
        {/* ---- The brief ---- */}
        <div className="space-y-8">
          <div>
            <p className="mb-3 font-accent text-[10px] uppercase tracking-luxe text-accent">
              Species
            </p>
            <div className="flex flex-wrap gap-2">
              {SPECIES.map((s) => {
                const on = s.id === speciesId;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSpeciesId(s.id)}
                    aria-pressed={on}
                    className={`rounded-full border px-4 py-1.5 font-accent text-[10px] uppercase tracking-luxe transition-colors duration-300 ${
                      on
                        ? 'border-accent bg-accent text-onaccent'
                        : 'border-hairline text-muted hover:border-accent/50 hover:text-accent'
                    }`}
                  >
                    {s.name}
                  </button>
                );
              })}
            </div>
            <p className="mt-3 font-sans text-sm font-light leading-relaxed text-muted">
              {species.note}
            </p>
          </div>

          <label className="block">
            <span className="flex items-baseline justify-between">
              <span className="font-accent text-[10px] uppercase tracking-luxe text-accent">
                Weight
              </span>
              <span className="nums-instrument font-display text-2xl text-primary">
                {carats.toFixed(2)} ct
              </span>
            </span>
            <input
              type="range"
              min={0.3}
              max={6}
              step={0.01}
              value={carats}
              onChange={(e) => setCarats(Number(e.target.value))}
              className="mt-3 w-full accent-[rgb(var(--accent))]"
            />
            {/* The cliffs, marked on the track. This is the fact the whole tool
                exists to show and it is invisible on any other slider. */}
            <span aria-hidden="true" className="relative mt-1 block h-3">
              {CLIFFS.map((c) => (
                <span
                  key={c.at}
                  className={`absolute top-0 -translate-x-1/2 font-accent text-[8px] uppercase tracking-luxe ${
                    carats >= c.at ? 'text-accent' : 'text-faint'
                  }`}
                  style={{ left: `${((c.at - 0.3) / 5.7) * 100}%` }}
                >
                  {c.at}
                </span>
              ))}
            </span>
            <span className="mt-2 block font-accent text-[9px] uppercase leading-relaxed tracking-luxe text-faint">
              Marks are the weights the market steps at — crossing one is a price rise with no
              physical cause.
            </span>
          </label>

          <div>
            <p className="mb-3 font-accent text-[10px] uppercase tracking-luxe text-accent">
              Origin
            </p>
            <div className="flex flex-wrap gap-2">
              {ORIGINS.map((o) => {
                const on = o.id === originId;
                return (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => setOriginId(o.id)}
                    aria-pressed={on}
                    className={`rounded-full border px-4 py-1.5 font-accent text-[10px] uppercase tracking-luxe transition-colors duration-300 ${
                      on ? 'border-accent text-accent' : 'border-hairline text-muted hover:border-accent/50'
                    }`}
                  >
                    {o.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="mb-3 font-accent text-[10px] uppercase tracking-luxe text-accent">
              Treatment
            </p>
            <div className="flex flex-wrap gap-2">
              {TREATMENT.map((t) => {
                const on = t.id === treatmentId;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTreatmentId(t.id)}
                    aria-pressed={on}
                    className={`rounded-full border px-4 py-1.5 font-accent text-[10px] uppercase tracking-luxe transition-colors duration-300 ${
                      on ? 'border-accent text-accent' : 'border-hairline text-muted hover:border-accent/50'
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="block">
            <span className="flex items-baseline justify-between">
              <span className="font-accent text-[10px] uppercase tracking-luxe text-accent">
                Budget for the stone
              </span>
              <span className="nums-instrument font-display text-2xl text-primary">
                {fmt(budget)}
              </span>
            </span>
            <input
              type="range"
              min={50000}
              max={12000000}
              step={50000}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="mt-3 w-full accent-[rgb(var(--accent))]"
            />
          </label>

          <label className="block">
            <span className="flex items-baseline justify-between">
              <span className="font-accent text-[10px] uppercase tracking-luxe text-accent">
                Weeks you can wait
              </span>
              <span className="nums-instrument font-display text-2xl text-primary">{weeks}</span>
            </span>
            <input
              type="range"
              min={1}
              max={52}
              step={1}
              value={weeks}
              onChange={(e) => setWeeks(Number(e.target.value))}
              className="mt-3 w-full accent-[rgb(var(--accent))]"
            />
          </label>
        </div>

        {/* ---- The answer ---- */}
        <div className="md:sticky md:top-28 md:self-start">
          <div className={`rounded-2xl border p-6 ${tones[verdict.tone]}`}>
            <p className="font-accent text-[10px] uppercase tracking-luxe">{verdict.label}</p>
            <p className="mt-2 font-display text-xl leading-snug text-primary">{verdict.line}</p>
          </div>

          <dl className="mt-6 space-y-5">
            <div>
              <dt className="font-accent text-[9px] uppercase tracking-luxe text-faint">
                What that stone costs
              </dt>
              <dd className="nums-instrument mt-1 font-display text-3xl text-primary">
                {fmt(estimate)}
              </dd>
              <dd className="nums-instrument mt-1 font-accent text-[9px] uppercase tracking-luxe text-faint">
                {fmt(perCarat)} per carat
              </dd>
            </div>

            {/* Budget against estimate. The bar crosses the mark or it does not,
                which is a faster read than two numbers side by side. */}
            <div>
              <dt className="font-accent text-[9px] uppercase tracking-luxe text-faint">
                Your budget against it
              </dt>
              <dd className="mt-2">
                <span className="relative block h-1.5 rounded-full bg-line/50">
                  <motion.span
                    className={`absolute inset-y-0 left-0 block rounded-full ${
                      budgetRatio >= 1 ? 'bg-jade-500' : 'bg-accent'
                    }`}
                    initial={false}
                    animate={{ width: `${Math.min(100, budgetRatio * 100)}%` }}
                    transition={reduced ? { duration: 0 } : springsSilk.readout}
                  />
                </span>
                <span className="nums-instrument mt-2 block font-accent text-[9px] uppercase tracking-luxe text-faint">
                  {(budgetRatio * 100).toFixed(0)}% of the estimate
                </span>
              </dd>
            </div>

            <div>
              <dt className="font-accent text-[9px] uppercase tracking-luxe text-faint">
                Honest search time
              </dt>
              <dd className="nums-instrument mt-1 font-display text-3xl text-primary">
                {searchWeeks} weeks
              </dd>
              <dd className={`mt-1 font-accent text-[9px] uppercase tracking-luxe ${timeOk ? 'text-jade-500' : 'text-accent'}`}>
                {timeOk ? 'inside your window' : `${searchWeeks - weeks} weeks longer than you said`}
              </dd>
            </div>
          </dl>

          {/* The single most useful output: which requirement to drop. */}
          {suggestion && (
            <motion.div
              key={suggestion.label}
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: easeCine.glass }}
              className="mt-8 rounded-2xl border border-accent/30 bg-accent/5 p-6"
            >
              <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
                Drop this one, not the budget
              </p>
              <p className="mt-2 font-display text-xl leading-snug text-primary">
                {suggestion.label}
              </p>
              <p className="nums-instrument mt-1 font-accent text-[10px] uppercase tracking-luxe text-jade-500">
                saves about {fmt(suggestion.saved)}
              </p>
              <p className="mt-3 font-sans text-sm font-light leading-relaxed text-muted">
                {suggestion.how}
              </p>
            </motion.div>
          )}

          <p className="mt-6 font-sans text-sm font-light leading-relaxed text-muted">
            These are our own buying figures rather than retail, and they move with the market —
            treat them as the right order of magnitude and the right *shape*, which is what you
            actually need before a conversation rather than after one.
          </p>
        </div>
      </div>
    </div>
  );
}
