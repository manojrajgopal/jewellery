'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Info, Scale } from 'lucide-react';

import Odometer from '@/components/motion/Odometer';

/** Indicative opening rates, matching the strip above. Rupees per gram. */
const RATE_PER_G: Record<string, number> = {
  '24': 7428,
  '22': 6809,
  '18': 5571,
};

const PURITY = [
  { id: '24', label: '24K', note: '999 fine. Coins and bars, rarely jewellery.' },
  { id: '22', label: '22K', note: '916. The standard for Indian gold jewellery.' },
  { id: '18', label: '18K', note: '750. Harder, and what fine settings are made in.' },
];

const CONDITION = [
  { id: 'mint', label: 'As new', deduction: 0.02, note: 'Boxed, unworn, papers present.' },
  { id: 'good', label: 'Worn', deduction: 0.05, note: 'Everyday wear, nothing missing.' },
  { id: 'poor', label: 'Damaged', deduction: 0.12, note: 'Stones lost, shank thin, solder repairs.' },
  { id: 'scrap', label: 'For melt', deduction: 0.18, note: 'Broken, mismatched, or a bag of odds.' },
];

/**
 * Making charges are never returned on exchange — that is the single most
 * misunderstood thing about selling gold back, and the calculator exists mostly
 * to make it visible rather than to produce a number.
 */
const MAKING_LOSS = 0.09;

/**
 * Trade-in valuation.
 *
 * The output is deliberately shown as a deduction stack rather than one figure:
 * gross metal value, then what comes off for making, for condition, for assay.
 * A single number invites the customer to feel cheated when the counter offer
 * differs; the stack shows them exactly which line they are arguing about, which
 * is a far better conversation to have.
 *
 * The gauge is the emotional half and the stack is the honest half. Both are
 * needed — a page of subtraction with no visual anchor reads as bad news, and a
 * gauge with no arithmetic reads as a slot machine.
 */
export default function ValuationCalculator({ className = '' }: { className?: string }) {
  const [grams, setGrams] = useState(18);
  const [purity, setPurity] = useState('22');
  const [condition, setCondition] = useState('good');

  const cond = CONDITION.find((c) => c.id === condition) ?? CONDITION[1];

  const { gross, making, wear, assay, net, ratio } = useMemo(() => {
    const g = grams * (RATE_PER_G[purity] ?? RATE_PER_G['22']);
    const m = g * MAKING_LOSS;
    const w = g * cond.deduction;
    // Flat assay and refining fee, waived on anything substantial.
    const a = grams > 25 ? 0 : 850;
    const n = Math.max(0, Math.round(g - m - w - a));
    return { gross: Math.round(g), making: Math.round(m), wear: Math.round(w), assay: a, net: n, ratio: g ? n / g : 0 };
  }, [grams, purity, cond]);

  // Gauge sweeps 220° from the lower left, which reads better than a full
  // circle for a value that can never reach 100%.
  const sweep = 220;
  const angle = -110 + ratio * sweep;

  return (
    <div className={`plate-metal rounded-4xl p-7 sm:p-9 ${className}`}>
      <span className="mb-2 flex items-center gap-2 font-accent text-[10px] uppercase tracking-luxer text-accent">
        <Scale className="h-3.5 w-3.5" /> Exchange valuation
      </span>
      <h3 className="mb-7 font-display text-2xl text-primary md:text-3xl">
        What your gold is worth today
      </h3>

      <div className="grid gap-8 sm:grid-cols-[minmax(0,1fr)_11rem] sm:items-start">
        {/* ---------------- Inputs ---------------- */}
        <div className="space-y-6">
          {/* Weight */}
          <div>
            <div className="mb-2 flex items-baseline justify-between">
              <label htmlFor="grams" className="font-accent text-[10px] uppercase tracking-luxe text-muted">
                Gross weight
              </label>
              <span className="nums-tabular font-display text-lg text-accent">
                {grams} g
              </span>
            </div>
            <input
              id="grams"
              type="range"
              min={1}
              max={120}
              step={1}
              value={grams}
              onChange={(e) => setGrams(Number(e.target.value))}
              className="h-1 w-full cursor-pointer appearance-none rounded-full bg-line accent-[rgb(var(--accent))]"
            />
            <p className="mt-1.5 font-sans text-[10px] text-faint">
              Stones and findings are weighed out separately at the counter.
            </p>
          </div>

          {/* Purity */}
          <fieldset>
            <legend className="mb-2 font-accent text-[10px] uppercase tracking-luxe text-muted">
              Purity
            </legend>
            <div className="flex gap-2">
              {PURITY.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPurity(p.id)}
                  aria-pressed={purity === p.id}
                  className={`relative flex-1 rounded-xl border px-3 py-2.5 font-accent text-[11px] uppercase tracking-luxe transition-colors duration-300 ${
                    purity === p.id
                      ? 'border-accent/60 bg-accent/10 text-accent'
                      : 'border-line text-muted hover:border-accent/40'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <p className="mt-1.5 font-sans text-[10px] leading-relaxed text-faint">
              {PURITY.find((p) => p.id === purity)?.note}
            </p>
          </fieldset>

          {/* Condition */}
          <fieldset>
            <legend className="mb-2 font-accent text-[10px] uppercase tracking-luxe text-muted">
              Condition
            </legend>
            <div className="grid grid-cols-2 gap-2">
              {CONDITION.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCondition(c.id)}
                  aria-pressed={condition === c.id}
                  className={`rounded-xl border px-3 py-2.5 text-left transition-colors duration-300 ${
                    condition === c.id
                      ? 'border-accent/60 bg-accent/10'
                      : 'border-line hover:border-accent/40'
                  }`}
                >
                  <span
                    className={`block font-accent text-[11px] uppercase tracking-luxe ${
                      condition === c.id ? 'text-accent' : 'text-muted'
                    }`}
                  >
                    {c.label}
                  </span>
                  <span className="mt-0.5 block font-sans text-[10px] leading-snug text-faint">
                    {c.note}
                  </span>
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        {/* ---------------- Gauge ---------------- */}
        <div className="flex flex-col items-center">
          <svg viewBox="0 0 120 120" className="w-full max-w-[11rem]">
            <defs>
              <linearGradient id="val-arc" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor="rgb(var(--burgundy-500))" />
                <stop offset="45%" stopColor="rgb(var(--gold-600))" />
                <stop offset="100%" stopColor="rgb(var(--gold-300))" />
              </linearGradient>
            </defs>

            {/* Track */}
            <path
              d="M22 96 A48 48 0 1 1 98 96"
              fill="none"
              stroke="rgb(var(--border))"
              strokeWidth={6}
              strokeLinecap="round"
            />
            {/* Fill */}
            <motion.path
              d="M22 96 A48 48 0 1 1 98 96"
              fill="none"
              stroke="url(#val-arc)"
              strokeWidth={6}
              strokeLinecap="round"
              initial={false}
              animate={{ pathLength: ratio }}
              transition={{ type: 'spring', stiffness: 90, damping: 20 }}
            />

            {/* Needle */}
            <motion.g
              initial={false}
              animate={{ rotate: angle }}
              transition={{ type: 'spring', stiffness: 110, damping: 14 }}
              style={{ transformOrigin: '60px 76px' }}
            >
              <line x1={60} y1={76} x2={60} y2={34} stroke="rgb(var(--gold-200))" strokeWidth={2} strokeLinecap="round" />
              <circle cx={60} cy={76} r={4.5} fill="rgb(var(--gold-400))" />
            </motion.g>

            <text
              x={60}
              y={108}
              textAnchor="middle"
              className="font-accent"
              fontSize="9"
              letterSpacing="1.4"
              fill="rgb(var(--text-faint))"
            >
              {Math.round(ratio * 100)}% OF METAL
            </text>
          </svg>

          <div className="mt-3 text-center">
            <span className="mb-1 block font-accent text-[9px] uppercase tracking-luxer text-faint">
              Offer today
            </span>
            <span className="font-display text-2xl">
              <Odometer
                value={net}
                prefix="₹"
                group
                onView={false}
                duration={0.8}
                className="text-gradient-static"
              />
            </span>
          </div>
        </div>
      </div>

      {/* ---------------- The deduction stack ---------------- */}
      <ul className="mt-8 space-y-2 border-t border-hairline pt-6">
        {[
          ['Gross metal value', gross, false],
          ['Making charges, not recoverable', -making, true],
          [`Condition — ${cond.label.toLowerCase()}`, -wear, true],
          ...(assay ? [['Assay and refining', -assay, true] as const] : []),
        ].map(([label, value]) => (
          <li key={String(label)} className="flex items-baseline justify-between gap-4">
            <span className="font-sans text-[11px] text-muted">{label}</span>
            <span
              className={`nums-tabular font-sans text-[11px] ${
                Number(value) < 0 ? 'text-burgundy-300' : 'text-secondary'
              }`}
            >
              {Number(value) < 0 ? '−' : ''}₹{Math.abs(Number(value)).toLocaleString('en-IN')}
            </span>
          </li>
        ))}
        <li className="flex items-baseline justify-between gap-4 border-t border-hairline pt-3">
          <span className="font-accent text-[10px] uppercase tracking-luxe text-accent">
            Net offer
          </span>
          <span className="nums-tabular font-display text-lg text-accent">
            ₹{net.toLocaleString('en-IN')}
          </span>
        </li>
      </ul>

      <AnimatePresence mode="wait">
        <motion.p
          key={condition + purity}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mt-5 flex gap-2.5 font-sans text-[11px] leading-relaxed text-faint"
        >
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" strokeWidth={1.6} />
          Indicative only, and worked from illustrative rates. Making charges never
          come back on an exchange — that is the line most people are surprised by,
          so it is shown first. Exchange against a new commission and we return the
          making charge in full.
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
