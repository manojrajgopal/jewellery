'use client';

import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Check, ChevronRight, Crown } from 'lucide-react';

import { easeLens, springsHeavy } from '@/lib/motion';

/**
 * The four standings, and what each actually entitles the holder to.
 *
 * Every benefit listed here is a *service*, not a discount. That is deliberate
 * and it is the honest structure for a house that sells things which appreciate:
 * a loyalty scheme built on percentage-off trains a customer to wait for the
 * next tier, and it devalues the last thing they bought. Bench time, storage,
 * first refusal and valuation do none of that.
 *
 * `threshold` is cumulative lifetime spend in rupees, and `years` is the
 * alternative route — because someone who bought one significant piece thirty
 * years ago is a patron of this house in a way that a recent large spend is not.
 * Either qualifies. Publishing both is the point.
 */
interface Tier {
  id: string;
  name: string;
  /** Cumulative spend that qualifies, in rupees. */
  threshold: number;
  /** Years since first purchase that qualifies instead. */
  years: number;
  /** Benefits, in the order they matter. */
  benefits: string[];
  /** The one thing this tier gets that the tier below does not. */
  distinction: string;
}

const TIERS: Tier[] = [
  {
    id: 'named',
    name: 'Named',
    threshold: 0,
    years: 0,
    benefits: [
      'Your sizes, allergies and preferences kept on file',
      'Annual clean and prong check, no charge, no appointment',
      'Written valuation on request for insurance',
    ],
    distinction: 'Everyone who has ever bought from us. There is no minimum.',
  },
  {
    id: 'kept',
    name: 'Kept',
    threshold: 250000,
    years: 5,
    benefits: [
      'Everything above',
      'Two hours of bench time a year — resizing, restringing, re-tipping',
      'Pieces held in the house vault between wearings, insured',
      'A note before a collection goes to the floor',
    ],
    distinction: 'The vault. Your pieces live here rather than in a drawer at home.',
  },
  {
    id: 'counselled',
    name: 'Counselled',
    threshold: 1200000,
    years: 12,
    benefits: [
      'Everything above',
      'First refusal on any single stone above two carats we acquire',
      'A named artisan, the same one, for every commission',
      'Private viewing outside hours, with the floor closed',
      'Bench time uncapped',
    ],
    distinction: 'First refusal. You see the stone before it is offered to anyone.',
  },
  {
    id: 'entrusted',
    name: 'Entrusted',
    threshold: 5000000,
    years: 25,
    benefits: [
      'Everything above',
      'A commission slot held permanently, used whenever you choose',
      'The house will travel to you for fittings and deliveries',
      'Succession recorded — the file passes to whoever inherits the pieces',
      'A voice on what the house acquires',
    ],
    distinction:
      'Succession. The relationship outlives you, which is the only benefit here that actually matters.',
  },
];

const inr = (n: number) =>
  n >= 10000000
    ? `₹${(n / 10000000).toFixed(n % 10000000 === 0 ? 0 : 1)} Cr`
    : n >= 100000
      ? `₹${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)} L`
      : `₹${n.toLocaleString('en-IN')}`;

interface HouseCircleProps {
  className?: string;
}

/**
 * The house's standings, published with their thresholds.
 *
 * A tiered relationship is normal in this trade and it is normally secret — the
 * customer is moved between tiers without being told the tiers exist, which is
 * how a house avoids ever having to honour the top one. So this publishes the
 * numbers, and it publishes the second route to every tier: years since first
 * purchase, as an alternative to cumulative spend. Someone who bought one ring
 * in 1998 and nothing since is a patron of this house, and a scheme that only
 * counts money says otherwise.
 *
 * The slider is the whole interaction. Moving it moves a real marker along a real
 * scale and the tier boundaries are drawn at their actual positions, so the
 * distances between them are honest — the gap from Kept to Counselled is nearly
 * five times the gap from Named to Kept, and that is visible rather than
 * flattened into four equal cards.
 *
 * Every benefit is a service and none is a discount. A loyalty scheme built on
 * percentage-off teaches a customer to wait, and it retroactively devalues the
 * last thing they bought.
 */
export default function HouseCircle({ className = '' }: HouseCircleProps) {
  const reduced = useReducedMotion();
  /** Position along the scale, 0–1, mapped exponentially onto rupees. */
  const [pos, setPos] = useState(0.42);
  const [years, setYears] = useState(6);
  const [openId, setOpenId] = useState<string | null>('kept');

  const max = TIERS[TIERS.length - 1].threshold * 1.4;

  /** Exponential, because the thresholds are — a linear slider spends 90% of its travel below the first tier. */
  const spend = useMemo(() => Math.round(Math.pow(pos, 2.2) * max), [pos, max]);

  /** Whichever route gets the holder further is the one that counts. */
  const bySpend = useMemo(
    () => TIERS.reduce((best, t) => (spend >= t.threshold ? t : best), TIERS[0]),
    [spend],
  );
  const byYears = useMemo(
    () => TIERS.reduce((best, t) => (years >= t.years ? t : best), TIERS[0]),
    [years],
  );
  const standing = TIERS.indexOf(bySpend) >= TIERS.indexOf(byYears) ? bySpend : byYears;
  const viaYears = standing.id === byYears.id && TIERS.indexOf(byYears) > TIERS.indexOf(bySpend);

  const next = TIERS[TIERS.indexOf(standing) + 1] ?? null;

  return (
    <div className={className}>
      {/* ================= The scale ================= */}
      <div className="rounded-3xl border border-hairline bg-canvas-alt/60 p-6 md:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="font-accent text-[10px] uppercase tracking-luxer text-accent">
              Your standing
            </span>
            <motion.p
              key={standing.id}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: easeLens.focusRing }}
              className="mt-1 font-display text-4xl text-primary md:text-5xl"
            >
              {standing.name}
            </motion.p>
            {viaYears && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-1 font-accent text-[10px] uppercase tracking-luxe text-accent"
              >
                by years, not by spend
              </motion.p>
            )}
          </div>

          <div className="text-right">
            <span className="font-accent text-[10px] uppercase tracking-luxer text-faint">
              Cumulative
            </span>
            <p className="font-display text-2xl text-accent nums-tabular">{inr(spend)}</p>
          </div>
        </div>

        {/* ---- The rail, with the boundaries at their true positions ---- */}
        <div className="relative mt-9">
          <div className="relative h-2 rounded-full bg-surface-sunken">
            <motion.div
              initial={false}
              animate={{ scaleX: pos }}
              transition={reduced ? { duration: 0 } : springsHeavy.tray}
              className="absolute inset-0 origin-left rounded-full bg-gradient-to-r from-accent/40 via-accent to-accent"
            />

            {/* Tier boundaries. Positioned by the inverse of the slider's own
                curve, so a marker sits exactly where that spend falls. */}
            {TIERS.slice(1).map((t) => {
              const at = Math.pow(t.threshold / max, 1 / 2.2);
              const reached = spend >= t.threshold;
              return (
                <div
                  key={t.id}
                  className="absolute top-1/2 -translate-y-1/2"
                  style={{ left: `${at * 100}%` }}
                >
                  <motion.span
                    initial={false}
                    animate={{ scale: reached ? 1.1 : 1, opacity: reached ? 1 : 0.5 }}
                    transition={reduced ? { duration: 0 } : springsHeavy.detent}
                    className={`block h-3.5 w-3.5 -translate-x-1/2 rotate-45 border ${
                      reached
                        ? 'border-accent bg-accent shadow-[0_0_12px_2px_rgb(var(--gold-500)/0.5)]'
                        : 'border-line-strong bg-surface'
                    }`}
                  />
                  <span
                    className={`absolute left-0 top-6 -translate-x-1/2 whitespace-nowrap font-accent text-[9px] uppercase tracking-luxe transition-colors duration-500 ${
                      reached ? 'text-accent' : 'text-faint'
                    }`}
                  >
                    {t.name}
                  </span>
                </div>
              );
            })}
          </div>

          <input
            type="range"
            min={0}
            max={1}
            step={0.005}
            value={pos}
            onChange={(e) => setPos(Number(e.target.value))}
            aria-label="Cumulative spend with the house"
            // range-overlay strips the native track so the drawn rail and its
            // tier markers show through, and redeclares the thumb — which
            // appearance:none would otherwise remove entirely.
            className="range-overlay absolute inset-x-0 -top-3 h-8 w-full"
          />
        </div>

        {/* ---- The second route ---- */}
        <div className="mt-14 border-t border-line-subtle pt-6">
          <div className="flex items-baseline justify-between">
            <label
              htmlFor="circle-years"
              className="font-accent text-[10px] uppercase tracking-luxer text-accent"
            >
              Or: years since your first piece
            </label>
            <span className="font-display text-xl text-primary nums-tabular">
              {years} {years === 1 ? 'year' : 'years'}
            </span>
          </div>
          <input
            id="circle-years"
            type="range"
            min={0}
            max={40}
            step={1}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="mt-3 w-full accent-[rgb(var(--accent))]"
          />
          <p className="mt-3 font-sans text-xs font-light leading-relaxed text-muted">
            Either route qualifies, and the better of the two applies. Someone who bought one ring in
            1998 and nothing since is a patron of this house; a scheme that only counts money says
            otherwise.
          </p>
        </div>

        {next && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springsHeavy.leaf}
            className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-2xl border border-accent/25 bg-accent/[0.06] px-5 py-4"
          >
            <ChevronRight aria-hidden="true" className="h-4 w-4 shrink-0 text-accent" />
            <span className="font-sans text-sm font-light text-secondary">
              {inr(Math.max(0, next.threshold - spend))} further, or{' '}
              {Math.max(0, next.years - years)} more years, reaches
            </span>
            <span className="font-accent text-xs uppercase tracking-luxe text-accent">
              {next.name}
            </span>
          </motion.div>
        )}
      </div>

      {/* ================= The tiers ================= */}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {TIERS.map((tier, i) => {
          const held = TIERS.indexOf(standing) >= i;
          const open = openId === tier.id;
          const current = standing.id === tier.id;

          return (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.07, ease: easeLens.focusRing }}
              className={`overflow-hidden rounded-3xl border transition-colors duration-500 ${
                current
                  ? 'border-accent bg-accent/[0.07]'
                  : held
                    ? 'border-accent/30 bg-canvas-alt/60'
                    : 'border-hairline bg-canvas-alt/30'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenId(open ? null : tier.id)}
                aria-expanded={open}
                className="w-full p-6 text-left"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="flex items-center gap-2">
                      {current && <Crown aria-hidden="true" className="h-4 w-4 text-accent" />}
                      <span
                        className={`font-display text-2xl ${
                          held ? 'text-primary' : 'text-faint'
                        }`}
                      >
                        {tier.name}
                      </span>
                    </span>
                    <span className="mt-1 block font-accent text-[10px] uppercase tracking-luxe text-faint nums-tabular">
                      {tier.threshold === 0
                        ? 'no minimum'
                        : `${inr(tier.threshold)} · or ${tier.years} years`}
                    </span>
                  </div>

                  <span
                    className={`mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full border ${
                      held ? 'border-accent bg-accent text-onaccent' : 'border-line text-faint'
                    }`}
                  >
                    {held ? <Check aria-hidden="true" className="h-3 w-3" /> : null}
                  </span>
                </div>

                <p className="mt-4 font-sans text-sm font-light leading-relaxed text-secondary">
                  {tier.distinction}
                </p>
              </button>

              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  transition={{ duration: 0.45, ease: easeLens.focusRing }}
                  className="overflow-hidden"
                >
                  <ul className="space-y-2.5 border-t border-line-subtle px-6 py-5">
                    {tier.benefits.map((b) => (
                      <li key={b} className="flex gap-3">
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1 w-1 shrink-0 rotate-45 bg-accent"
                        />
                        <span className="font-sans text-sm font-light leading-relaxed text-secondary">
                          {b}
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      <p className="mt-6 font-sans text-xs font-light leading-relaxed text-faint">
        Not one of these benefits is a discount. A scheme built on percentage-off teaches a customer
        to wait for the next tier, and it retroactively devalues the last thing they bought. Bench
        time, storage, first refusal and succession do neither.
      </p>
    </div>
  );
}
