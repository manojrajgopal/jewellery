'use client';

import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Flame, Hammer, Scale } from 'lucide-react';

import { easeCine } from '@/lib/motion';

/**
 * The metals, with the four physical constants that decide what it costs to make
 * something out of them.
 *
 * `density` is g/cm³ and it is the number that surprises people: the identical
 * ring in platinum weighs 60% more than in 18K gold, before any labour, because
 * platinum is simply heavier per unit volume. Half of the price difference
 * between two visually identical rings is this one figure.
 *
 * `melt` is in °C and `benchFactor` is the multiple of bench hours the same
 * design takes in this metal. They are related: a higher melting point means a
 * hotter torch, a different solder, a slower file and — in platinum's case — a
 * dedicated set of tools that cannot be shared with gold, because a trace of
 * gold contaminates a platinum join permanently.
 */
interface Metal {
  id: string;
  name: string;
  /** g/cm³ */
  density: number;
  /** °C */
  melt: number;
  /** Multiple of the bench hours the same design takes in 18K yellow. */
  benchFactor: number;
  /** Indicative rupees per gram, metal only. */
  perGram: number;
  swatch: string;
  /** Why the bench factor is what it is. */
  bench: string;
}

const METALS: Metal[] = [
  {
    id: 'gold-22',
    name: '22K yellow gold',
    density: 17.7,
    melt: 940,
    benchFactor: 1.25,
    perGram: 7150,
    swatch: 'rgb(var(--gold-400))',
    bench:
      'Soft enough to move under a graver beautifully and soft enough to bruise if you look at it wrong. The extra hours are all in handling, not in working.',
  },
  {
    id: 'gold-18',
    name: '18K yellow gold',
    density: 15.6,
    melt: 900,
    benchFactor: 1,
    perGram: 5980,
    swatch: 'rgb(var(--gold-500))',
    bench:
      'The reference. Everything a bench does is timed against 18K yellow, because it is the alloy that behaves best across every operation.',
  },
  {
    id: 'gold-18-white',
    name: '18K white gold',
    density: 15.8,
    melt: 940,
    benchFactor: 1.2,
    perGram: 6240,
    swatch: 'rgb(var(--diamond))',
    bench:
      'Harder than yellow, so filing and setting both take longer, and it needs rhodium plating at the end — an extra process with its own drying time.',
  },
  {
    id: 'gold-18-rose',
    name: '18K rose gold',
    density: 15.2,
    melt: 900,
    benchFactor: 1.15,
    perGram: 6010,
    swatch: 'rgb(var(--rose-300))',
    bench:
      'The copper makes it prone to cracking if it is worked cold for too long, so it needs annealing more often. Each anneal is a stop.',
  },
  {
    id: 'platinum',
    name: 'Platinum 950',
    density: 21.4,
    melt: 1768,
    benchFactor: 2.9,
    perGram: 3450,
    swatch: 'rgb(var(--platinum))',
    bench:
      'A different trade, effectively. Its own torch, its own solders, its own files, its own polishing wheels — and none of them may ever have touched gold. Add a third again for the fact that platinum galls, so every file stroke has to be deliberate.',
  },
  {
    id: 'silver',
    name: 'Sterling silver',
    density: 10.4,
    melt: 893,
    benchFactor: 0.85,
    perGram: 95,
    swatch: 'rgb(var(--ink-200))',
    bench:
      'Quick to work and unforgiving of heat — it will slump before it flows if the torch lingers. Cheap in metal and not cheap in scrap, because a ruined silver casting is still an hour gone.',
  },
];

/**
 * Designs, as volumes in cm³. These are real figures off finished pieces: a
 * plain 2mm court band in a size 12 displaces about 0.21cm³, which is why it
 * weighs 3.3g in 18K and 4.5g in platinum.
 */
const DESIGNS = [
  { id: 'band-fine', name: 'Fine band, 2mm court', volume: 0.21, hours: 3.5 },
  { id: 'band-heavy', name: 'Heavy band, 5mm court', volume: 0.62, hours: 4.5 },
  { id: 'solitaire', name: 'Solitaire, four-claw head', volume: 0.34, hours: 11 },
  { id: 'signet', name: 'Signet, engraved', volume: 1.15, hours: 16 },
  { id: 'bangle', name: 'Hollow bangle, 6mm', volume: 1.8, hours: 22 },
] as const;

/** Bench rate, in rupees per hour. Published because it is the honest half. */
const BENCH_RATE = 1450;

const RUPEES = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;

/**
 * Why the same ring costs three different amounts.
 *
 * This is the question a customer asks at the counter in exactly these words —
 * "but it's the same ring" — and the answer has two halves that nobody separates
 * for them. The first is density: platinum is 21.4 g/cm³ against 18K gold's
 * 15.6, so an identical ring is 37% heavier before anything else happens, and
 * you buy metal by the gram. The second is that platinum takes nearly three times
 * the bench hours, for reasons that are entirely practical and have nothing to do
 * with prestige.
 *
 * Splitting the estimate into metal and labour is the point of the whole panel.
 * It shows the thing the trade almost never shows: platinum's *metal* is
 * cheaper per gram than gold's, and it is still the most expensive ring on the
 * list. That single inversion explains more about jewellery pricing than any
 * amount of copy about heritage.
 *
 * The bar chart is drawn by volume rather than by weight, so every design is
 * literally the same object in six metals, and the weights underneath are what
 * that object comes to. Nothing here is a price list — it is the arithmetic
 * behind one.
 */
export default function DensityBench({ className = '' }: { className?: string }) {
  const reduced = useReducedMotion();
  const [designId, setDesignId] = useState<(typeof DESIGNS)[number]['id']>('solitaire');

  const design = DESIGNS.find((d) => d.id === designId) ?? DESIGNS[2];

  const rows = useMemo(() => {
    const computed = METALS.map((metal) => {
      const grams = design.volume * metal.density;
      const metalCost = grams * metal.perGram;
      const hours = design.hours * metal.benchFactor;
      const labour = hours * BENCH_RATE;
      return { metal, grams, metalCost, hours, labour, total: metalCost + labour };
    });
    const max = Math.max(...computed.map((r) => r.total));
    return computed.map((r) => ({ ...r, share: r.total / max }));
  }, [design]);

  const reference = rows.find((r) => r.metal.id === 'gold-18');
  // One shared denominator for every bar on the chart, so the widths are
  // comparable across rows rather than each row filling itself.
  const dearest = Math.max(...rows.map((r) => r.total));

  return (
    <div className={`space-y-8 ${className}`}>
      {/* The design. Same object throughout. */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-2 font-accent text-[10px] uppercase tracking-luxe text-faint">
          The same design
        </span>
        {DESIGNS.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => setDesignId(d.id)}
            aria-pressed={d.id === designId}
            className={`rounded-full border px-4 py-1.5 font-accent text-[10px] uppercase tracking-luxe transition-colors duration-300 ${
              d.id === designId
                ? 'border-accent/60 bg-accent/12 text-accent'
                : 'border-hairline text-muted hover:border-accent/40 hover:text-accent'
            }`}
          >
            {d.name}
          </button>
        ))}
      </div>

      <p className="nums-tabular font-sans text-xs font-light leading-relaxed text-faint">
        {design.volume.toFixed(2)}cm³ of metal · {design.hours} bench hours in 18K yellow · bench
        charged at {RUPEES(BENCH_RATE)} an hour, which is our real rate and is on every quotation
        we issue.
      </p>

      {/* The six metals, as stacked bars. Metal and labour separated, because
          the separation is the whole argument. */}
      <div className="space-y-3">
        {rows.map((row, i) => (
          <motion.div
            key={row.metal.id}
            initial={reduced ? undefined : { opacity: 0, x: -18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-6% 0px' }}
            transition={{ duration: 0.55, delay: reduced ? 0 : i * 0.06, ease: easeCine.glass }}
            className="rounded-2xl border border-hairline bg-surface-raised/30 p-5"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
              <span className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="block h-3 w-3 rounded-full"
                  style={{ backgroundColor: row.metal.swatch }}
                />
                <span className="font-display text-lg leading-tight text-primary">
                  {row.metal.name}
                </span>
              </span>

              <span className="flex flex-wrap items-baseline gap-x-5 gap-y-1 font-accent text-[10px] uppercase tracking-luxe text-faint">
                <span className="flex items-center gap-1.5">
                  <Scale className="h-3 w-3" aria-hidden="true" />
                  <span className="nums-tabular">{row.grams.toFixed(1)}g</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Flame className="h-3 w-3" aria-hidden="true" />
                  <span className="nums-tabular">{row.metal.melt}°C</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Hammer className="h-3 w-3" aria-hidden="true" />
                  <span className="nums-tabular">{row.hours.toFixed(1)}h</span>
                </span>
                <span className="nums-tabular font-display text-lg normal-case tracking-normal text-accent">
                  {RUPEES(row.total)}
                </span>
              </span>
            </div>

            {/* Metal against labour, to one shared scale. */}
            <div className="mt-3.5 flex h-2.5 w-full overflow-hidden rounded-full bg-[rgb(var(--hairline)/0.12)]">
              <motion.span
                initial={reduced ? false : { scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: easeCine.glass, delay: reduced ? 0 : 0.15 }}
                style={{
                  transformOrigin: '0% 50%',
                  width: `${(row.metalCost / dearest) * 100}%`,
                  backgroundColor: row.metal.swatch,
                }}
                className="block h-full"
              />
              <motion.span
                initial={reduced ? false : { scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: easeCine.glass, delay: reduced ? 0 : 0.3 }}
                style={{
                  transformOrigin: '0% 50%',
                  width: `${(row.labour / dearest) * 100}%`,
                }}
                className="block h-full bg-[rgb(var(--hairline)/0.3)]"
              />
            </div>

            <div className="mt-2 flex flex-wrap items-baseline gap-x-6 gap-y-1">
              <span className="nums-tabular font-accent text-[9px] uppercase tracking-luxe text-accent">
                Metal {RUPEES(row.metalCost)} · {Math.round((row.metalCost / row.total) * 100)}%
              </span>
              <span className="nums-tabular font-accent text-[9px] uppercase tracking-luxe text-faint">
                Bench {RUPEES(row.labour)} · {Math.round((row.labour / row.total) * 100)}%
              </span>
              {reference && row.metal.id !== 'gold-18' && (
                <span className="nums-tabular font-accent text-[9px] uppercase tracking-luxe text-faint">
                  {row.total > reference.total ? '+' : ''}
                  {Math.round(((row.total - reference.total) / reference.total) * 100)}% against 18K
                  yellow
                </span>
              )}
            </div>

            <p className="mt-3 border-t border-hairline pt-3 font-sans text-xs font-light leading-relaxed text-secondary">
              {row.metal.bench}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="rounded-2xl border border-hairline bg-surface-raised/40 p-6 md:p-8">
        <p className="font-display text-xl italic leading-snug text-primary md:text-2xl">
          Platinum is cheaper per gram than gold and makes the most expensive ring on this list.
        </p>
        <p className="mt-3 font-sans text-sm font-light leading-relaxed text-secondary">
          It is a third heavier for the same shape, and it takes nearly three times the bench
          hours — its own torch, its own solders, its own files, none of which may ever have
          touched gold, because a trace of gold in a platinum join stays there for ever. That is
          the whole of it. Nothing in the price is about prestige, and any jeweller who explains
          it that way is choosing not to explain it.
        </p>
      </div>
    </div>
  );
}
