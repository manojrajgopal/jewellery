'use client';

import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { easeCine, needleSwing } from '@/lib/motion';

/**
 * Whether the chain can carry the pendant.
 *
 * This is the single most common avoidable loss in the trade and it is almost
 * always the shop's fault. A customer buys a pendant and a chain separately,
 * nobody checks that the chain is rated for the weight, and eight months later
 * the chain parts — usually at the jump ring, usually while being pulled over
 * clothing, and usually the pendant is never found.
 *
 * The arithmetic is not difficult and nobody does it out loud. A chain's working
 * limit is governed by its *weakest link*, which for almost every commercial
 * chain is the solder on the jump ring and not the chain body. Doubling the wire
 * gauge quadruples the strength, which is why a half-millimetre difference in
 * gauge — invisible across a counter — changes what a chain can carry by a
 * factor of four.
 *
 * `limit` below is a working load in grams, not a breaking load: a quarter of
 * the measured breaking point, which is the safety factor a rigger would use and
 * the trade generally does not. `snag` is the more important number and the one
 * nobody quotes at all — the shock load a chain sees when it catches on a coat
 * zip is several times the static weight of the pendant, and that is the event
 * that actually breaks chains.
 */
interface Chain {
  id: string;
  name: string;
  /** Wire gauge in mm. */
  gauge: number;
  /** Working load in grams, at a 4:1 safety factor. */
  limit: number;
  /** How badly it fails when snagged: 1 is graceful, 3 is catastrophic. */
  snag: 1 | 2 | 3;
  note: string;
  /** Whether a broken one can be repaired invisibly. */
  repair: 'invisible' | 'visible' | 'replace';
}

const CHAINS: Chain[] = [
  {
    id: 'cable-fine',
    name: 'Fine cable',
    gauge: 0.8,
    limit: 3.5,
    snag: 3,
    note: 'The chain most pendants are sold on and the one most of them are too heavy for. Beautiful, and appropriate for a bezel-set stone under three grams and almost nothing else.',
    repair: 'invisible',
  },
  {
    id: 'cable-standard',
    name: 'Cable, standard',
    gauge: 1.3,
    limit: 12,
    snag: 2,
    note: 'The sensible default. Carries almost any single-stone pendant, takes a solder repair without showing it, and looks like a chain rather than like a fixing.',
    repair: 'invisible',
  },
  {
    id: 'rope',
    name: 'Rope',
    gauge: 1.5,
    limit: 22,
    snag: 1,
    note: 'The strongest thing per gram in the case, because the load is shared across several links at once instead of taken by one. It also kinks permanently if it is stored knotted, which is the only real complaint against it.',
    repair: 'visible',
  },
  {
    id: 'box',
    name: 'Box',
    gauge: 1.4,
    limit: 18,
    snag: 2,
    note: 'Square section, so it sits flat and does not roll the pendant face-down — which is the failing of every round chain and the reason a heavy pendant on a cable chain always ends up backwards.',
    repair: 'invisible',
  },
  {
    id: 'snake',
    name: 'Snake',
    gauge: 1.6,
    limit: 9,
    snag: 3,
    note: 'The one to be honest about. It is stiff, it looks substantial, and it is far weaker than it appears because the plates are pressed rather than soldered. Once it kinks it is finished — there is no repair, only a replacement.',
    repair: 'replace',
  },
  {
    id: 'curb',
    name: 'Curb, flattened',
    gauge: 2.1,
    limit: 40,
    snag: 1,
    note: 'What a genuinely heavy pendant needs. Each link is twisted and flattened so it lies in one plane, and it will carry considerably more than the clasp on it will.',
    repair: 'invisible',
  },
  {
    id: 'wheat',
    name: 'Wheat',
    gauge: 1.8,
    limit: 30,
    snag: 1,
    note: 'Four strands plaited, which means a single failed link does not open the chain — the other three hold it while you notice. The only chain here with genuine redundancy in it.',
    repair: 'visible',
  },
  {
    id: 'trace-belcher',
    name: 'Belcher',
    gauge: 2.4,
    limit: 55,
    snag: 1,
    note: 'Round wire, wide links, and effectively unbreakable at this gauge. Traditionally the chain a locket goes on, for exactly that reason.',
    repair: 'invisible',
  },
];

/** Pendant weights people actually turn up with, as reference points. */
const PRESETS = [
  { label: 'Bezel solitaire', grams: 2.5 },
  { label: 'Small locket', grams: 8 },
  { label: 'Kundan drop', grams: 16 },
  { label: 'Temple pendant', grams: 34 },
  { label: 'Heirloom medallion', grams: 62 },
];

/** Shock multiplier when a chain catches. Conservative; riggers use more. */
const SHOCK = 3.2;

export default function ChainStrengthGauge() {
  const [grams, setGrams] = useState(16);
  const [chainId, setChainId] = useState('cable-standard');
  const reduced = useReducedMotion();

  const chain = CHAINS.find((c) => c.id === chainId)!;

  /* Two verdicts, because a chain can pass the static test and fail the one that
     matters. Reporting only the first is how the trade sells fine cable for
     heavy pendants in good conscience. */
  const staticRatio = grams / chain.limit;
  const shockRatio = (grams * SHOCK) / chain.limit;

  const verdict =
    shockRatio <= 1
      ? { label: 'Rated', tone: 'jade' as const, note: 'Carries this pendant, and survives a snag.' }
      : staticRatio <= 1
        ? {
            label: 'Marginal',
            tone: 'gold' as const,
            note: 'Holds the weight standing still. Will not survive being caught on a zip.',
          }
        : {
            label: 'Overloaded',
            tone: 'burgundy' as const,
            note: 'Beyond its working load before anything happens to it. This is a chain that breaks.',
          };

  /* The needle's angle: -46° at nothing, +46° at twice the working load. */
  const needle = Math.min(46, -46 + Math.min(2, shockRatio) * 46);

  const safest = useMemo(
    () =>
      [...CHAINS]
        .filter((c) => (grams * SHOCK) / c.limit <= 1)
        .sort((a, b) => a.gauge - b.gauge)[0],
    [grams]
  );

  const tones = {
    jade: 'text-jade-500 border-jade-500/40',
    gold: 'text-accent border-accent/40',
    burgundy: 'text-burgundy-500 border-burgundy-500/40',
  } as const;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:gap-14">
        {/* ---- The instrument ---- */}
        <div>
          <div className="relative aspect-[4/3] rounded-2xl border border-hairline bg-surface-sunken/60 p-6">
            {/* The dial face. Divisions crowd at the top of the range, which is
                what a real load gauge does and what makes the safe end legible. */}
            <svg viewBox="0 0 200 140" className="h-full w-full" role="img" aria-label={`Load gauge reading ${verdict.label}`}>
              {/* Arc */}
              <path
                d="M 28 118 A 74 74 0 0 1 172 118"
                fill="none"
                stroke="rgb(var(--hairline))"
                strokeOpacity={0.25}
                strokeWidth={1}
              />
              {/* Safe / marginal / overloaded bands. Drawn as arcs rather than
                  as a coloured background, so the boundaries are readable. */}
              <path
                d="M 28 118 A 74 74 0 0 1 100 44"
                fill="none"
                stroke="rgb(var(--jade-500))"
                strokeOpacity={0.5}
                strokeWidth={3}
              />
              <path
                d="M 100 44 A 74 74 0 0 1 141 57"
                fill="none"
                stroke="rgb(var(--gold-500))"
                strokeOpacity={0.6}
                strokeWidth={3}
              />
              <path
                d="M 141 57 A 74 74 0 0 1 172 118"
                fill="none"
                stroke="rgb(var(--burgundy-500))"
                strokeOpacity={0.55}
                strokeWidth={3}
              />

              {/* Divisions */}
              {Array.from({ length: 11 }, (_, i) => {
                const a = Math.PI - (i / 10) * Math.PI;
                const inner = 62;
                const outer = i % 5 === 0 ? 74 : 69;
                return (
                  <line
                    key={i}
                    x1={100 + Math.cos(a) * inner}
                    y1={118 - Math.sin(a) * inner}
                    x2={100 + Math.cos(a) * outer}
                    y2={118 - Math.sin(a) * outer}
                    stroke="rgb(var(--hairline))"
                    strokeOpacity={0.35}
                    strokeWidth={1}
                  />
                );
              })}

              {/* The needle. Pivoted at the bottom centre, sprung, and it
                  overshoots — which is the only thing that makes a dial read as
                  an instrument rather than as a progress bar bent into an arc. */}
              <motion.g
                variants={needleSwing(needle)}
                initial="hidden"
                animate="visible"
                key={`${chainId}-${grams}`}
                style={{ transformOrigin: '100px 118px' }}
                className="assay-needle"
              >
                <line
                  x1={100}
                  y1={118}
                  x2={100}
                  y2={50}
                  stroke="rgb(var(--text-primary))"
                  strokeWidth={2}
                  strokeLinecap="round"
                />
                <circle cx={100} cy={118} r={5} fill="rgb(var(--accent))" />
              </motion.g>
            </svg>

            {/* The instrument's own division strip, under the needle's pivot.
                Divisions crowd towards the ends the way a real load gauge's do —
                an evenly ruled scale is the tell that a dial is a drawing. */}
            <span
              aria-hidden="true"
              className="assay-scale pointer-events-none absolute inset-x-8 bottom-[4.5rem] h-2 opacity-70"
            />

            <div className="pointer-events-none absolute inset-x-0 bottom-6 text-center">
              <p
                className={`font-accent text-[10px] uppercase tracking-luxe ${
                  tones[verdict.tone].split(' ')[0]
                }`}
              >
                {verdict.label}
              </p>
              <p className="nums-instrument mt-1 font-display text-3xl text-primary">
                {(shockRatio * 100).toFixed(0)}%
              </p>
              <p className="font-accent text-[9px] uppercase tracking-luxe text-faint">
                of working load, snagged
              </p>
            </div>
          </div>

          <p className={`mt-4 rounded-xl border px-5 py-4 font-sans text-sm font-light leading-relaxed text-muted ${tones[verdict.tone]}`}>
            {verdict.note}
          </p>
        </div>

        {/* ---- The two inputs ---- */}
        <div>
          <label className="block">
            <span className="flex items-baseline justify-between">
              <span className="font-accent text-[10px] uppercase tracking-luxe text-accent">
                Pendant weight
              </span>
              <span className="nums-instrument font-display text-2xl text-primary">
                {grams} g
              </span>
            </span>
            <input
              type="range"
              min={1}
              max={80}
              step={1}
              value={grams}
              onChange={(e) => setGrams(Number(e.target.value))}
              className="mt-3 w-full accent-[rgb(var(--accent))]"
            />
          </label>

          <div className="mt-4 flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => setGrams(p.grams)}
                className={`rounded-full border px-4 py-1.5 font-accent text-[10px] uppercase tracking-luxe transition-colors duration-300 ${
                  grams === p.grams
                    ? 'border-accent text-accent'
                    : 'border-hairline text-faint hover:border-accent/50 hover:text-accent'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="mt-8">
            <p className="mb-3 font-accent text-[10px] uppercase tracking-luxe text-accent">
              Chain
            </p>
            <ul className="space-y-2">
              {CHAINS.map((c) => {
                const on = c.id === chainId;
                const ok = (grams * SHOCK) / c.limit <= 1;
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => setChainId(c.id)}
                      aria-pressed={on}
                      className={`flex w-full items-center gap-4 rounded-lg border px-4 py-3 text-left transition-colors duration-300 ${
                        on
                          ? 'border-accent/60 bg-accent/5'
                          : 'border-hairline hover:border-accent/40'
                      }`}
                    >
                      {/* Gauge, drawn to scale. The whole surprise of this tool is
                          how small the difference looks and how large it is. */}
                      <span
                        aria-hidden="true"
                        className="shrink-0 rounded-full bg-accent/70"
                        style={{ width: `${c.gauge * 4}px`, height: `${c.gauge * 4}px` }}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block font-display text-base text-primary">{c.name}</span>
                        <span className="nums-instrument mt-0.5 block font-accent text-[9px] uppercase tracking-luxe text-faint">
                          {c.gauge.toFixed(1)} mm · holds {c.limit} g
                        </span>
                      </span>
                      <span
                        aria-hidden="true"
                        className={`h-2 w-2 shrink-0 rounded-full ${
                          ok ? 'bg-jade-500' : 'bg-burgundy-500/70'
                        }`}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* The recommendation. Lightest chain that passes, not the strongest —
              a customer sent away with a Belcher chain for a two-gram pendant has
              been sold the wrong thing just as surely. */}
          <motion.div
            key={safest?.id ?? 'none'}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easeCine.glass }}
            className="mt-6 rounded-xl border border-hairline bg-surface-raised/40 p-5"
          >
            {safest ? (
              <>
                <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
                  Lightest chain that carries it
                </p>
                <p className="mt-2 font-display text-xl text-primary">{safest.name}</p>
                <p className="mt-2 font-sans text-sm font-light leading-relaxed text-muted">
                  {safest.note}
                </p>
                <p className="mt-3 font-accent text-[10px] uppercase tracking-luxe text-faint">
                  If it breaks:{' '}
                  <span className="text-primary">
                    {safest.repair === 'invisible'
                      ? 'repairable without a trace'
                      : safest.repair === 'visible'
                        ? 'repairable, and the join will show'
                        : 'not repairable — replaced'}
                  </span>
                </p>
              </>
            ) : (
              <>
                <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
                  Nothing in the case
                </p>
                <p className="mt-2 font-sans text-sm font-light leading-relaxed text-muted">
                  A pendant this heavy wants a chain made for it, which we do — usually a hollow
                  curb, so the neck carries a fraction of the weight the pendant implies. It is a
                  bench job rather than a stock item.
                </p>
              </>
            )}
          </motion.div>
        </div>
      </div>

      <p className="mt-10 border-t border-hairline pt-6 font-sans text-sm font-light leading-relaxed text-muted">
        The figures are working loads at a four-to-one safety factor, and the snag multiplier is
        3.2&times; — the shock a chain sees when it catches on clothing, measured on our own bench
        rather than taken from a supplier&rsquo;s sheet. Every chain here will hold considerably more
        than these numbers for a while. The numbers are what it will hold{' '}
        <em className="not-italic text-primary">for twenty years</em>, which is the only figure worth
        quoting on something you intend to leave to somebody.
      </p>
    </div>
  );
}
