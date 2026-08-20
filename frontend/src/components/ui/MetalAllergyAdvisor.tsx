'use client';

import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { AlertTriangle, Check, ShieldCheck } from 'lucide-react';

import { easeCine } from '@/lib/motion';

/**
 * What is actually in an alloy, and which of it a skin reacts to.
 *
 * Almost nobody reacts to gold, platinum or silver. What people react to is the
 * *other* metals in the alloy — overwhelmingly nickel, occasionally cobalt or
 * chromium, and in a small number of cases copper. Since a karat number tells
 * you only how much gold is present and says nothing at all about what makes up
 * the remainder, a customer with a nickel allergy cannot tell from any figure a
 * jeweller prints whether a piece is safe for them.
 *
 * So this is the disclosure, per alloy, with the number that matters: nickel
 * release measured against the EU limit of 0.5 micrograms per square centimetre
 * per week, which is the only threshold with a legal definition behind it.
 *
 * `risk` is deliberately not a marketing grade. It is the proportion of
 * nickel-sensitised people who react to prolonged contact with that alloy,
 * rounded to the nearest five percent from the dermatological literature — which
 * is why 'white gold, nickel-hardened' is a genuinely bad idea for a sensitised
 * customer and why 22K is fine for essentially everyone.
 */
interface Alloy {
  id: string;
  name: string;
  /** Everything in it, by mass, gold first. */
  makeup: { metal: string; percent: number; culprit?: boolean }[];
  /** Micrograms of nickel per square cm per week. 0 where there is none. */
  release: number;
  /** Percentage of nickel-sensitised wearers who react on prolonged contact. */
  risk: number;
  /** What to do instead, or what to ask for. */
  advice: string;
  swatch: string;
}

const ALLOYS: Alloy[] = [
  {
    id: 'gold-22',
    name: '22K yellow gold',
    makeup: [
      { metal: 'Gold', percent: 91.6 },
      { metal: 'Silver', percent: 5 },
      { metal: 'Copper', percent: 3.4, culprit: true },
    ],
    release: 0,
    risk: 2,
    advice:
      'Safe for effectively everyone, including sensitised skin. The 3% copper is the only reactive component and copper sensitivity is rare — it shows as a green mark on the skin far more often than as a rash, and the mark is cosmetic.',
    swatch: 'rgb(var(--gold-400))',
  },
  {
    id: 'gold-18-yellow',
    name: '18K yellow gold',
    makeup: [
      { metal: 'Gold', percent: 75 },
      { metal: 'Silver', percent: 12.5 },
      { metal: 'Copper', percent: 12.5, culprit: true },
    ],
    release: 0,
    risk: 4,
    advice:
      'No nickel by our specification, and we will put that in writing on the invoice. This is the default we recommend for anyone who has reacted to jewellery before and does not know why.',
    swatch: 'rgb(var(--gold-500))',
  },
  {
    id: 'gold-18-white-pd',
    name: '18K white gold, palladium',
    makeup: [
      { metal: 'Gold', percent: 75 },
      { metal: 'Palladium', percent: 17 },
      { metal: 'Silver', percent: 8 },
    ],
    release: 0,
    risk: 3,
    advice:
      'The white gold to ask for. Slightly warmer in tone than the nickel version and about fifteen percent more expensive, which is the entire reason the trade defaults to the other one.',
    swatch: 'rgb(var(--diamond))',
  },
  {
    id: 'gold-18-white-ni',
    name: '18K white gold, nickel',
    makeup: [
      { metal: 'Gold', percent: 75 },
      { metal: 'Nickel', percent: 13, culprit: true },
      { metal: 'Copper', percent: 8, culprit: true },
      { metal: 'Zinc', percent: 4 },
    ],
    release: 0.9,
    risk: 65,
    advice:
      'Above the EU release limit once the rhodium plating wears through, which takes three to five years on a ring. We do not make this alloy. If a piece you already own is doing this, a re-plate stops it for another few years and a re-shank fixes it permanently.',
    swatch: 'rgb(var(--ink-300))',
  },
  {
    id: 'platinum',
    name: 'Platinum 950',
    makeup: [
      { metal: 'Platinum', percent: 95 },
      { metal: 'Ruthenium', percent: 5 },
    ],
    release: 0,
    risk: 1,
    advice:
      'The genuinely hypoallergenic answer, and the reason it is standard for surgical implants. Nothing in it is a recognised contact allergen. Heavier and dearer, and that is the whole trade-off.',
    swatch: 'rgb(var(--platinum))',
  },
  {
    id: 'silver-925',
    name: 'Sterling silver 925',
    makeup: [
      { metal: 'Silver', percent: 92.5 },
      { metal: 'Copper', percent: 7.5, culprit: true },
    ],
    release: 0,
    risk: 6,
    advice:
      'No nickel in the standard alloy — but plenty of imported silver findings and clasps are nickel-plated base metal, and the clasp is the part that sits against the neck all day. Ask about the findings, not the body.',
    swatch: 'rgb(var(--ink-200))',
  },
  {
    id: 'steel-316l',
    name: 'Surgical steel 316L',
    makeup: [
      { metal: 'Iron', percent: 68 },
      { metal: 'Chromium', percent: 17, culprit: true },
      { metal: 'Nickel', percent: 12, culprit: true },
      { metal: 'Molybdenum', percent: 3 },
    ],
    release: 0.3,
    risk: 22,
    advice:
      'The name is misleading and it is worth being blunt about: 316L contains twelve percent nickel. It is bound tightly enough to stay under the EU limit, which is why it is legal for piercings, but a strongly sensitised wearer will still react to it.',
    swatch: 'rgb(var(--ink-400))',
  },
  {
    id: 'titanium',
    name: 'Titanium, grade 5',
    makeup: [
      { metal: 'Titanium', percent: 90 },
      { metal: 'Aluminium', percent: 6 },
      { metal: 'Vanadium', percent: 4 },
    ],
    release: 0,
    risk: 1,
    advice:
      'Inert, very light, and it cannot be sized or soldered — which for a ring is a serious limitation nobody mentions at the point of sale. We will make one, and we will tell you it is a ring you cannot alter.',
    swatch: 'rgb(var(--ink-300))',
  },
];

const LIMIT = 0.5;

type Sensitivity = 'unknown' | 'nickel' | 'severe';

const BANDS: Record<Sensitivity, { label: string; note: string; ceiling: number }> = {
  unknown: {
    label: 'Never reacted',
    note: 'Everything below is available to you. The column that still matters is the nickel release, because a sensitivity can develop at any age from prolonged exposure — most people who have one acquired it rather than being born with it.',
    ceiling: 70,
  },
  nickel: {
    label: 'Reacted before',
    note: 'Anything marked above the line will eventually cause a problem. Roughly one adult in seven is nickel-sensitised, so this is the common case rather than the unusual one, and it is the case the trade is worst at handling.',
    ceiling: 20,
  },
  severe: {
    label: 'Diagnosed sensitivity',
    note: 'Only the alloys with a measured release of zero are appropriate, and the findings matter as much as the body of the piece — a nickel-plated clasp on a platinum chain is a platinum chain that will still give you a rash.',
    ceiling: 5,
  },
};

export default function MetalAllergyAdvisor() {
  const [sensitivity, setSensitivity] = useState<Sensitivity>('nickel');
  const [open, setOpen] = useState<string>('gold-18-white-ni');
  const reduced = useReducedMotion();

  const band = BANDS[sensitivity];

  const sorted = useMemo(
    () => [...ALLOYS].sort((a, b) => a.risk - b.risk),
    []
  );

  const cleared = sorted.filter((a) => a.risk <= band.ceiling).length;

  return (
    <div className="mx-auto max-w-5xl">
      {/* Which case the visitor is in. Three, because the honest answer differs
          for each and a single list would have to be written for the worst. */}
      <div
        role="radiogroup"
        aria-label="Have you reacted to jewellery before?"
        className="flex flex-wrap gap-2"
      >
        {(Object.keys(BANDS) as Sensitivity[]).map((key) => {
          const on = sensitivity === key;
          return (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => setSensitivity(key)}
              className={`rounded-full border px-5 py-2 font-accent text-[10px] uppercase tracking-luxe transition-colors duration-300 ${
                on
                  ? 'border-accent bg-accent text-onaccent'
                  : 'border-hairline text-muted hover:border-accent/50 hover:text-accent'
              }`}
            >
              {BANDS[key].label}
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-2">
        <p className="nums-instrument font-display text-2xl text-accent">
          {cleared} of {ALLOYS.length}
        </p>
        <p className="font-accent text-[10px] uppercase tracking-luxe text-faint">
          alloys appropriate for you
        </p>
      </div>

      <p className="mt-3 max-w-2xl font-sans text-sm font-light leading-relaxed text-muted">
        {band.note}
      </p>

      {/* The alloys, ordered by risk rather than by price or prestige. The line
          across the list is the visitor's own threshold, drawn where it falls. */}
      <ul className="mt-10 space-y-3">
        {sorted.map((alloy, i) => {
          const clear = alloy.risk <= band.ceiling;
          const isOpen = open === alloy.id;
          const overLimit = alloy.release > LIMIT;

          return (
            <li key={alloy.id}>
              {/* The threshold, drawn between the last cleared alloy and the
                  first excluded one — a legend beside the list would make the
                  reader do the comparison themselves. */}
              {i === cleared && cleared > 0 && cleared < sorted.length && (
                <div className="mb-3 mt-6 flex items-center gap-4">
                  <span aria-hidden="true" className="h-px flex-1 bg-accent/40" />
                  <span className="font-accent text-[10px] uppercase tracking-luxe text-accent">
                    Below here, not for you
                  </span>
                  <span aria-hidden="true" className="h-px flex-1 bg-accent/40" />
                </div>
              )}

              <div
                className={`rounded-xl border transition-colors duration-400 ${
                  clear
                    ? 'border-hairline bg-surface-raised/40'
                    : 'border-burgundy-500/30 bg-burgundy-900/5'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? '' : alloy.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-4 p-5 text-left"
                >
                  <span
                    aria-hidden="true"
                    className="h-7 w-7 shrink-0 rounded-full border border-hairline"
                    style={{ background: alloy.swatch }}
                  />

                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-lg text-primary">{alloy.name}</span>
                    <span className="mt-1 block font-accent text-[10px] uppercase tracking-luxe text-faint">
                      {alloy.makeup.map((m) => m.metal).join(' · ')}
                    </span>
                  </span>

                  {/* The release figure, against the legal limit. The bar is the
                      point: a number alone does not say whether 0.3 is a lot. */}
                  <span className="hidden w-36 shrink-0 sm:block">
                    <span className="relative block h-1 rounded-full bg-line/50">
                      <motion.span
                        className={`absolute inset-y-0 left-0 block rounded-full ${
                          overLimit ? 'bg-burgundy-500' : 'bg-accent'
                        }`}
                        initial={false}
                        animate={{
                          width: `${Math.min(100, (alloy.release / (LIMIT * 2)) * 100)}%`,
                        }}
                        transition={reduced ? { duration: 0 } : { duration: 0.7, ease: easeCine.glass }}
                      />
                      {/* The limit itself, at the halfway mark by construction. */}
                      <span
                        aria-hidden="true"
                        className="absolute -top-1 left-1/2 h-3 w-px bg-primary/40"
                      />
                    </span>
                    <span className="nums-instrument mt-2 block font-accent text-[9px] uppercase tracking-luxe text-faint">
                      {alloy.release === 0 ? 'no nickel' : `${alloy.release} µg/cm²/wk`}
                    </span>
                  </span>

                  <span
                    className={`shrink-0 ${clear ? 'text-jade-500' : 'text-burgundy-500'}`}
                    aria-hidden="true"
                  >
                    {clear ? (
                      <ShieldCheck className="h-5 w-5" />
                    ) : (
                      <AlertTriangle className="h-5 w-5" />
                    )}
                  </span>
                </button>

                <motion.div
                  initial={false}
                  animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                  transition={reduced ? { duration: 0 } : { duration: 0.45, ease: easeCine.glass }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-hairline px-5 pb-5 pt-4">
                    {/* The composition, as a real bar. A pie chart of an alloy
                        hides the fact that the reactive component is usually a
                        very thin sliver — which is exactly the surprising part. */}
                    <div className="flex h-2 overflow-hidden rounded-full">
                      {alloy.makeup.map((m) => (
                        <span
                          key={m.metal}
                          title={`${m.metal} ${m.percent}%`}
                          style={{ width: `${m.percent}%` }}
                          className={
                            m.culprit
                              ? 'bg-burgundy-500/70'
                              : 'bg-accent/45'
                          }
                        />
                      ))}
                    </div>

                    <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                      {alloy.makeup.map((m) => (
                        <div key={m.metal} className="flex items-baseline gap-2">
                          <dt className="font-accent text-[10px] uppercase tracking-luxe text-faint">
                            {m.metal}
                          </dt>
                          <dd
                            className={`nums-instrument font-sans text-sm ${
                              m.culprit ? 'text-burgundy-500' : 'text-primary'
                            }`}
                          >
                            {m.percent}%
                          </dd>
                        </div>
                      ))}
                    </dl>

                    <p className="mt-4 font-sans text-sm font-light leading-relaxed text-muted">
                      {alloy.advice}
                    </p>

                    <p className="mt-4 flex items-baseline gap-2 font-accent text-[10px] uppercase tracking-luxe text-faint">
                      <span className="nums-instrument text-accent">{alloy.risk}%</span>
                      of nickel-sensitised wearers react to prolonged contact
                    </p>
                  </div>
                </motion.div>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-8 flex items-start gap-3 rounded-xl border border-hairline bg-surface-raised/30 p-5 font-sans text-sm font-light leading-relaxed text-muted">
        <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
        <span>
          We will state the full alloy composition on the invoice for any piece we make, including
          the findings and the solder — the solder is the part that catches people out, because a
          nickel-bearing solder on a nickel-free band still sits against the skin. Ask for it; it
          costs us nothing and it is the document a dermatologist actually wants to see.
        </span>
      </p>
    </div>
  );
}
