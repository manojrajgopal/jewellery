'use client';

import { useId, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Coins, Info, TrendingUp } from 'lucide-react';
import CountUp from '@/components/motion/CountUp';

interface SavingsPlannerProps {
  className?: string;
}

/** Plan terms the house actually offers, with the bonus each carries. */
const TERMS = [
  { months: 11, bonusMonths: 1, label: '11 + 1', note: 'The classic scheme — one month on us' },
  { months: 18, bonusMonths: 2, label: '18 + 2', note: 'Two months added at maturity' },
  { months: 24, bonusMonths: 3, label: '24 + 3', note: 'Best for a bridal commission' },
];

const fmt = (n: number) =>
  `₹${Math.round(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

/**
 * A savings-plan projection: pay monthly, and the house adds instalments at
 * maturity.
 *
 * The chart plots two series against each other — what the visitor has paid in,
 * and what it is worth to spend — because the gap between them is the entire
 * proposition and a single line hides it. The bonus is shown as the shaded area
 * between the two, which is the honest way to draw it: it is not growth, and
 * drawing it as one rising line would imply an investment return we are not
 * offering and cannot promise.
 *
 * The disclosure under the chart is deliberate and load-bearing. This is a
 * deposit scheme, not an instrument with a yield, and a projection chart that does
 * not say so is misleading regardless of how the numbers are computed.
 */
export default function SavingsPlanner({ className = '' }: SavingsPlannerProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');

  const [monthly, setMonthly] = useState(15000);
  const [termIndex, setTermIndex] = useState(0);

  const term = TERMS[termIndex];

  const series = useMemo(() => {
    const points: { month: number; paid: number; value: number }[] = [];
    for (let m = 0; m <= term.months; m++) {
      const paid = monthly * m;
      // The bonus lands at maturity, not pro rata — so the value line tracks the
      // paid line exactly until the final month, then steps. Drawing it as a
      // gradual accrual would misrepresent when the money is actually available.
      const value = m === term.months ? paid + monthly * term.bonusMonths : paid;
      points.push({ month: m, paid, value });
    }
    return points;
  }, [monthly, term]);

  const totalPaid = monthly * term.months;
  const bonus = monthly * term.bonusMonths;
  const maturity = totalPaid + bonus;

  /* ---- Chart geometry ---- */
  const W = 560;
  const H = 220;
  const PAD = { l: 8, r: 8, t: 14, b: 26 };
  const maxY = maturity || 1;

  const px = (m: number) =>
    PAD.l + (m / term.months) * (W - PAD.l - PAD.r);
  const py = (v: number) => H - PAD.b - (v / maxY) * (H - PAD.t - PAD.b);

  const paidLine = series.map((p) => `${px(p.month).toFixed(1)},${py(p.paid).toFixed(1)}`);
  const valueLine = series.map((p) => `${px(p.month).toFixed(1)},${py(p.value).toFixed(1)}`);

  // The shaded band is the value line out and the paid line back — one closed
  // path, so the fill is unambiguous even where the two lines coincide.
  const bandPath = `M ${valueLine.join(' L ')} L ${[...paidLine].reverse().join(' L ')} Z`;
  const areaPath = `M ${px(0)},${py(0)} L ${paidLine.join(' L ')} L ${px(term.months)},${py(0)} Z`;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-hairline bg-surface-raised/60 p-6 backdrop-blur-xl md:p-8 ${className}`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-spotlight-soft opacity-[var(--bloom)]"
      />

      <header className="relative mb-7 flex items-start gap-3">
        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-gold-500/30 text-accent">
          <Coins size={16} strokeWidth={1.7} />
        </span>
        <div>
          <h3 className="font-display text-xl font-light text-primary md:text-2xl">
            The Savings Plan
          </h3>
          <p className="mt-0.5 font-sans text-[11px] font-light text-muted">
            Set aside monthly. We add instalments at maturity.
          </p>
        </div>
      </header>

      <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-10">
        {/* ---- Chart ---- */}
        <div>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full overflow-visible"
            role="img"
            aria-label={`Over ${term.months} months at ${fmt(monthly)} a month, ${fmt(totalPaid)} paid in and ${fmt(maturity)} available at maturity.`}
          >
            <defs>
              <linearGradient id={`paid-${uid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgb(var(--gold-400))" stopOpacity="0.28" />
                <stop offset="100%" stopColor="rgb(var(--gold-400))" stopOpacity="0" />
              </linearGradient>
              <linearGradient id={`band-${uid}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgb(var(--jade-500))" stopOpacity="0.1" />
                <stop offset="100%" stopColor="rgb(var(--jade-300))" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            {/* Baseline and gridlines */}
            {[0.25, 0.5, 0.75, 1].map((f) => (
              <line
                key={f}
                x1={PAD.l}
                x2={W - PAD.r}
                y1={py(maxY * f)}
                y2={py(maxY * f)}
                stroke="rgb(var(--hairline) / 0.09)"
                strokeWidth="1"
              />
            ))}
            <line
              x1={PAD.l}
              x2={W - PAD.r}
              y1={py(0)}
              y2={py(0)}
              stroke="rgb(var(--hairline) / 0.2)"
              strokeWidth="1"
            />

            {/* Paid-in area */}
            <motion.path
              d={areaPath}
              fill={`url(#paid-${uid})`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7 }}
            />

            {/* The bonus band — the gap between paid and available */}
            <motion.path
              key={`${term.months}-${monthly}`}
              d={bandPath}
              fill={`url(#band-${uid})`}
              stroke="rgb(var(--jade-300))"
              strokeOpacity="0.4"
              strokeWidth="1"
              initial={{ opacity: 0, scaleY: 0.6 }}
              animate={{ opacity: 1, scaleY: 1 }}
              style={{ originY: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />

            {/* Paid-in line */}
            <motion.polyline
              points={paidLine.join(' ')}
              fill="none"
              stroke="rgb(var(--accent))"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
            />

            {/* Instalment marks */}
            {series.map((p) =>
              p.month === 0 ? null : (
                <motion.circle
                  key={p.month}
                  cx={px(p.month)}
                  cy={py(p.paid)}
                  r="2.4"
                  fill="rgb(var(--accent))"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.2 + (p.month / term.months) * 0.9,
                    type: 'spring',
                    stiffness: 400,
                    damping: 18,
                  }}
                />
              )
            )}

            {/* Maturity marker */}
            <motion.g
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.15, duration: 0.5 }}
            >
              <line
                x1={px(term.months)}
                x2={px(term.months)}
                y1={py(maturity)}
                y2={py(0)}
                stroke="rgb(var(--jade-300))"
                strokeOpacity="0.4"
                strokeDasharray="3 4"
              />
              <circle
                cx={px(term.months)}
                cy={py(maturity)}
                r="4"
                fill="rgb(var(--jade-300))"
                className="animate-pulse-dot"
              />
            </motion.g>

            {/* Month axis */}
            {[0, Math.floor(term.months / 2), term.months].map((m) => (
              <text
                key={m}
                x={px(m)}
                y={H - 8}
                textAnchor={m === 0 ? 'start' : m === term.months ? 'end' : 'middle'}
                fill="rgb(var(--text-faint))"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '9px',
                  letterSpacing: '0.1em',
                }}
              >
                {m === 0 ? 'Start' : m === term.months ? 'Maturity' : `Month ${m}`}
              </text>
            ))}
          </svg>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            <span className="flex items-center gap-2 font-accent text-[9px] uppercase tracking-luxe text-muted">
              <span className="block h-px w-6 bg-accent" />
              Paid in
            </span>
            <span className="flex items-center gap-2 font-accent text-[9px] uppercase tracking-luxe text-muted">
              <span className="block h-2.5 w-6 rounded-sm bg-jade-300/35 ring-1 ring-jade-300/40" />
              Added by the house
            </span>
          </div>
        </div>

        {/* ---- Controls and readout ---- */}
        <div className="flex flex-col gap-6">
          {/* Monthly */}
          <div>
            <label
              htmlFor={`monthly-${uid}`}
              className="mb-2 flex items-baseline justify-between font-accent text-[10px] uppercase tracking-luxe text-muted"
            >
              <span>Monthly</span>
              <span className="nums-tabular text-accent">{fmt(monthly)}</span>
            </label>
            <input
              id={`monthly-${uid}`}
              type="range"
              min={2500}
              max={100000}
              step={2500}
              value={monthly}
              onChange={(e) => setMonthly(Number(e.target.value))}
              className="h-1 w-full cursor-pointer appearance-none rounded-full bg-line accent-[rgb(var(--accent))]"
            />
            <div className="mt-1.5 flex justify-between font-sans text-[9px] font-light text-faint">
              <span>₹2,500</span>
              <span>₹1,00,000</span>
            </div>
          </div>

          {/* Term */}
          <div>
            <p className="mb-2 font-accent text-[10px] uppercase tracking-luxe text-muted">
              Term
            </p>
            <div className="flex flex-wrap gap-2">
              {TERMS.map((t, i) => (
                <button
                  key={t.label}
                  onClick={() => setTermIndex(i)}
                  aria-pressed={i === termIndex}
                  className={`nums-tabular rounded-full border px-4 py-2 font-accent text-[10px] uppercase tracking-luxe transition-all duration-300 ${
                    i === termIndex
                      ? 'border-gold-500/60 bg-gold-500/12 text-accent'
                      : 'border-hairline text-muted hover:border-gold-500/40 hover:text-accent'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <p className="mt-2 font-sans text-[11px] font-light text-faint">{term.note}</p>
          </div>

          {/* Readout */}
          <dl className="flex flex-col gap-3 rounded-xl border border-hairline bg-canvas/40 p-5">
            <Row label="You pay in" value={totalPaid} />
            <Row label="We add" value={bonus} tone="jade" />
            <div className="mt-1 border-t border-hairline pt-3">
              <dt className="font-accent text-[9px] uppercase tracking-luxe text-faint">
                To spend at maturity
              </dt>
              <dd className="nums-tabular mt-1 font-display text-3xl text-accent">
                ₹
                <CountUp end={maturity} duration={1.1} separator />
              </dd>
            </div>
            <p className="mt-1 flex items-center gap-1.5 font-accent text-[9px] uppercase tracking-luxe text-jade-300">
              <TrendingUp size={11} strokeWidth={2} />
              {((bonus / totalPaid) * 100).toFixed(1)}% added
            </p>
          </dl>

          <p className="flex items-start gap-2 font-sans text-[10px] font-light italic leading-relaxed text-faint">
            <Info size={11} strokeWidth={1.8} className="mt-0.5 flex-shrink-0" />
            A deposit scheme, not an investment. The added instalments are a purchase
            credit redeemable against a piece, they carry no interest, and the metal rate
            on the day of purchase applies. Full terms at the boutique.
          </p>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  tone = 'gold',
}: {
  label: string;
  value: number;
  tone?: 'gold' | 'jade';
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="font-accent text-[9px] uppercase tracking-luxe text-faint">{label}</dt>
      <dd
        className={`nums-tabular font-display text-lg ${
          tone === 'jade' ? 'text-jade-300' : 'text-primary'
        }`}
      >
        {fmt(value)}
      </dd>
    </div>
  );
}
