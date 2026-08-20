'use client';

import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CircleSlash, Leaf, Recycle, ShieldQuestion } from 'lucide-react';

import { easeCine } from '@/lib/motion';

/**
 * What this house measures, what it estimates, and what it does not know.
 *
 * `basis` is the important field. It says how the figure was arrived at, and the
 * three values are not interchangeable: `measured` means somebody weighed it,
 * `estimated` means it was derived from a published factor, and `unknown` means
 * the honest answer is that nobody in this supply chain can currently say. A
 * ledger that presents all three in the same typeface is a ledger designed to be
 * misread.
 */
type Basis = 'measured' | 'estimated' | 'unknown';

interface Line {
  id: string;
  label: string;
  /** The figure itself, already formatted — units differ per line. */
  value: string;
  basis: Basis;
  /** How the number was arrived at, in one sentence. */
  method: string;
  /** What the figure does *not* cover. Every line has one. */
  caveat: string;
}

const LINES: Line[] = [
  {
    id: 'recycled-gold',
    label: 'Gold from recycled stock',
    value: '78%',
    basis: 'measured',
    method:
      'Refinery invoices, weighed. Every gram entering the bench is either refined customer metal, refined scrap from our own bench, or newly mined — and the three are booked separately.',
    caveat:
      'Recycled gold is not carbon-free gold. It is mining that has already happened. The honest claim is that we did not cause more of it, not that this metal came from nowhere.',
  },
  {
    id: 'bench-scrap',
    label: 'Bench scrap recovered',
    value: '99.2%',
    basis: 'measured',
    method:
      'Filings, polishing sweeps and floor lemel are collected daily and refined quarterly. The 0.8% is what leaves the building in the extraction filters and on people’s hands.',
    caveat:
      'This is the easiest number on the list to make look good, because gold is valuable enough that every workshop already does it. It is table stakes, not an achievement.',
  },
  {
    id: 'lab-share',
    label: 'Diamonds grown rather than mined',
    value: '31%',
    basis: 'measured',
    method:
      'Counted by stone, not by carat weight, and offered on every commission at the customer’s choice rather than substituted.',
    caveat:
      'Grown stones are not automatically the lower-impact choice. A CVD reactor runs for weeks on grid electricity, and the grid it runs on decides the answer. We will tell you which reactor and which country if you ask.',
  },
  {
    id: 'energy',
    label: 'Workshop electricity from renewables',
    value: '62%',
    basis: 'estimated',
    method:
      'Our own rooftop generation, metered, plus the published renewable share of the state grid we draw the balance from.',
    caveat:
      'The grid half of this figure is an average published annually, not our own consumption profile. Our casting runs at night, when that share is lower.',
  },
  {
    id: 'water',
    label: 'Water per commission',
    value: '≈ 41 litres',
    basis: 'estimated',
    method:
      'Total metered workshop draw divided by pieces completed. Most of it is ultrasonic cleaning and polishing swarf capture.',
    caveat:
      'It excludes everything upstream of our door — refining, and mining. Those are the overwhelming majority of the real figure and we cannot measure them.',
  },
  {
    id: 'freight',
    label: 'Carbon in shipping, per piece',
    value: '≈ 2.4 kg CO₂e',
    basis: 'estimated',
    method:
      'Courier-published emissions factors against our actual consignment records, insured air freight included.',
    caveat:
      'Insured air freight is the single largest thing on this page we could reduce and have not, because sea freight for a ₹4 lakh ring is not insurable at a sane rate.',
  },
  {
    id: 'mine-origin',
    label: 'Newly-mined gold traced to a named mine',
    value: 'Not known',
    basis: 'unknown',
    method:
      'Our refiner certifies conflict-free and LBMA chain-of-custody. It does not, and cannot currently, name the pit.',
    caveat:
      'Anybody in this trade claiming mine-level traceability on ordinary bullion gold is describing a system that does not yet exist at this scale. We would rather say so than imply otherwise.',
  },
  {
    id: 'coloured-origin',
    label: 'Coloured stones traced to a named mine',
    value: 'Partially',
    basis: 'unknown',
    method:
      'Emeralds and rubies above 2ct arrive with origin reports. Everything smaller comes through a Jaipur cutting house that buys mixed parcels.',
    caveat:
      'For small coloured stones the parcel is the unit of trade, and a parcel has no single origin. This is a real limitation of the market, not a gap in our paperwork.',
  },
];

const BASIS_META: Record<Basis, { label: string; icon: typeof Leaf; tone: string; rank: number }> = {
  measured: { label: 'Measured', icon: Recycle, tone: 'text-jade-300', rank: 0 },
  estimated: { label: 'Estimated', icon: Leaf, tone: 'text-gold-300', rank: 1 },
  unknown: { label: 'Not known', icon: ShieldQuestion, tone: 'text-burgundy-300', rank: 2 },
};

/**
 * The environmental ledger, kept the way a ledger is kept.
 *
 * Sustainability sections on jewellery sites are almost always a list of the
 * four best numbers a house has, in a green typeface, with no indication of how
 * any of them were arrived at. That is not a disclosure, it is a selection.
 *
 * This is built round the opposite instinct: sorted by *confidence* rather than
 * by flattery, so the two lines the house cannot answer sit at the bottom in the
 * same typeface as everything else and are impossible to miss. Every line
 * carries a caveat, including the ones that look good — the recovered-scrap
 * figure is excellent and it is also table stakes, and saying so is the whole
 * difference between a ledger and a brochure.
 *
 * The filter is there because the interesting reading is "show me only what you
 * actually measured", and a page that makes that reading hard to get to is
 * hiding something in the aggregate.
 */
export default function SustainabilityLedger({ className = '' }: { className?: string }) {
  const reduced = useReducedMotion();
  const [filter, setFilter] = useState<Basis | 'all'>('all');
  const [openId, setOpenId] = useState<string | null>(null);

  const rows = useMemo(() => {
    const list = filter === 'all' ? LINES : LINES.filter((l) => l.basis === filter);
    // Confidence order, then original order within a band.
    return [...list].sort((a, b) => BASIS_META[a.basis].rank - BASIS_META[b.basis].rank);
  }, [filter]);

  const counts = useMemo(
    () =>
      LINES.reduce(
        (acc, l) => ({ ...acc, [l.basis]: (acc[l.basis] ?? 0) + 1 }),
        {} as Record<Basis, number>
      ),
    []
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* The filter, stated as counts so the shape of the ledger is visible
          before anything is filtered. */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setFilter('all')}
          aria-pressed={filter === 'all'}
          className={`rounded-full border px-4 py-1.5 font-accent text-[10px] uppercase tracking-luxe transition-colors duration-300 ${
            filter === 'all'
              ? 'border-accent/60 bg-accent/12 text-accent'
              : 'border-hairline text-muted hover:border-accent/40 hover:text-accent'
          }`}
        >
          All {LINES.length} lines
        </button>

        {(Object.keys(BASIS_META) as Basis[]).map((basis) => {
          const meta = BASIS_META[basis];
          const Icon = meta.icon;
          return (
            <button
              key={basis}
              type="button"
              onClick={() => setFilter(basis)}
              aria-pressed={filter === basis}
              className={`flex items-center gap-2 rounded-full border px-4 py-1.5 font-accent text-[10px] uppercase tracking-luxe transition-colors duration-300 ${
                filter === basis
                  ? 'border-accent/60 bg-accent/12 text-accent'
                  : 'border-hairline text-muted hover:border-accent/40 hover:text-accent'
              }`}
            >
              <Icon className={`h-3 w-3 ${meta.tone}`} aria-hidden="true" />
              {meta.label}
              <span className="nums-tabular text-faint">{counts[basis] ?? 0}</span>
            </button>
          );
        })}
      </div>

      {/* The ledger itself. Ruled stock, because that is what it is. */}
      <div className="stock-ruled overflow-hidden rounded-2xl border border-hairline bg-surface-raised/30">
        {rows.map((line, i) => {
          const meta = BASIS_META[line.basis];
          const Icon = meta.icon;
          const open = openId === line.id;

          return (
            <motion.div
              key={line.id}
              initial={reduced ? undefined : { opacity: 0, x: -14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-6% 0px' }}
              transition={{ duration: 0.5, delay: reduced ? 0 : i * 0.05, ease: easeCine.glass }}
              className={`border-b border-hairline last:border-b-0 ${
                open ? 'bg-surface-raised/60' : ''
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenId(open ? null : line.id)}
                aria-expanded={open}
                className="flex w-full flex-wrap items-baseline justify-between gap-x-6 gap-y-2 px-5 py-4 text-left md:px-7 md:py-5"
              >
                <span className="flex min-w-0 items-baseline gap-3">
                  <Icon className={`mt-1 h-3.5 w-3.5 flex-shrink-0 ${meta.tone}`} aria-hidden="true" />
                  <span className="font-sans text-sm font-light text-secondary">{line.label}</span>
                </span>

                <span className="flex items-baseline gap-4">
                  <span
                    className={`nums-tabular font-display text-xl ${
                      line.basis === 'unknown' ? 'text-muted' : 'text-accent'
                    }`}
                  >
                    {line.value}
                  </span>
                  <span className={`font-accent text-[9px] uppercase tracking-luxe ${meta.tone}`}>
                    {meta.label}
                  </span>
                </span>
              </button>

              <motion.div
                initial={false}
                animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
                transition={{ duration: reduced ? 0 : 0.5, ease: easeCine.curtain }}
                className="overflow-hidden"
              >
                <div className="grid gap-5 px-5 pb-6 md:grid-cols-2 md:px-7">
                  <div>
                    <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
                      How we know
                    </p>
                    <p className="mt-2 font-sans text-xs font-light leading-relaxed text-secondary">
                      {line.method}
                    </p>
                  </div>
                  <div>
                    <p className="flex items-center gap-2 font-accent text-[10px] uppercase tracking-luxe text-burgundy-300">
                      <CircleSlash className="h-3 w-3" aria-hidden="true" />
                      What it does not cover
                    </p>
                    <p className="mt-2 font-sans text-xs font-light leading-relaxed text-secondary">
                      {line.caveat}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      <p className="font-sans text-xs font-light leading-relaxed text-faint">
        Two of these eight lines are answers we do not have, and they are the two that would
        matter most. They are on the page for exactly that reason: a ledger that only contains the
        entries a house is pleased with is an advertisement wearing a ledger’s clothes.
      </p>
    </div>
  );
}
