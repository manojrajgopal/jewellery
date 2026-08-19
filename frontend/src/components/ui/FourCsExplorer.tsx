'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Info } from 'lucide-react';

import Odometer from '@/components/motion/Odometer';

/**
 * Grade scales, coarsest first. Index into these rather than storing the label,
 * so a slider can move along them and the multipliers stay adjacent to the
 * grades they belong to.
 */
const CUT = [
  { label: 'Fair', note: 'Light leaks out of the pavilion. The stone looks glassy.', mult: 0.72, brilliance: 0.22 },
  { label: 'Good', note: 'Returns light, but unevenly across the table.', mult: 0.86, brilliance: 0.45 },
  { label: 'Very Good', note: 'Even return. The value sweet spot for most buyers.', mult: 1, brilliance: 0.7 },
  { label: 'Excellent', note: 'Near-ideal proportions. Fire visible across a room.', mult: 1.18, brilliance: 0.88 },
  { label: 'Ideal / Hearts & Arrows', note: 'Optical symmetry. Under a scope you see eight arrows.', mult: 1.34, brilliance: 1 },
] as const;

const COLOUR = [
  { label: 'K', note: 'Warm. Beautiful in yellow gold, obvious in platinum.', mult: 0.6, tint: '#F5E6C0' },
  { label: 'J', note: 'Faint warmth face-up, invisible once set in gold.', mult: 0.72, tint: '#F8EDD4' },
  { label: 'H', note: 'Near-colourless. The value grade nobody regrets.', mult: 0.86, tint: '#FBF5E8' },
  { label: 'G', note: 'Colourless to the eye in any setting.', mult: 1, tint: '#FDFAF3' },
  { label: 'E', note: 'Colourless. A gemmologist needs a master set to grade it.', mult: 1.22, tint: '#FEFDFA' },
  { label: 'D', note: 'Absolutely colourless. Rarity you pay for and cannot see.', mult: 1.42, tint: '#FFFFFF' },
] as const;

const CLARITY = [
  { label: 'I1', note: 'Inclusions visible without magnification.', mult: 0.52, flaws: 7 },
  { label: 'SI2', note: 'Visible under a loupe, sometimes findable by eye.', mult: 0.68, flaws: 5 },
  { label: 'SI1', note: 'Loupe-visible, eye-clean. Where the sense lives.', mult: 0.82, flaws: 3 },
  { label: 'VS2', note: 'Minor inclusions, difficult to find at 10×.', mult: 1, flaws: 2 },
  { label: 'VS1', note: 'Very slightly included. Hard work at 10×.', mult: 1.14, flaws: 1 },
  { label: 'VVS1', note: 'Two graders may disagree on where the inclusion is.', mult: 1.36, flaws: 0 },
  { label: 'FL', note: 'Flawless. Under one stone in three thousand.', mult: 1.9, flaws: 0 },
] as const;

const CARAT = [0.3, 0.5, 0.7, 0.9, 1.0, 1.25, 1.5, 2.0, 3.0] as const;

/** Price per carat at the reference grade, in rupees. */
const BASE_PER_CARAT = 420_000;

const CS = [
  { key: 'cut', label: 'Cut', blurb: 'The only C a human decided. Everything else was set when the stone formed.' },
  { key: 'colour', label: 'Colour', blurb: 'Graded on absence. D is nothing; Z is unmistakably yellow.' },
  { key: 'clarity', label: 'Clarity', blurb: 'What is inside. Graded at ten times magnification, not by eye.' },
  { key: 'carat', label: 'Carat', blurb: 'Weight, not size. Price per carat rises with weight as well.' },
] as const;

type CKey = (typeof CS)[number]['key'];

/**
 * The 4Cs, made playable rather than explained.
 *
 * Move any of the four and three things respond at once: the drawn stone changes
 * (brilliance, body tint, inclusions, size), the price recalculates, and the
 * verdict line reads the *combination* rather than each grade separately.
 *
 * That last part is the whole argument of the piece. Grading tables teach people
 * to maximise every C independently, which is how they end up paying a 90%
 * premium for flawless clarity they will never see. Showing the price move
 * against a live drawing lets someone discover the trade-off themselves — and
 * the trade-off is the actual expertise a jeweller has to offer.
 */
export default function FourCsExplorer({ className = '' }: { className?: string }) {
  const [cut, setCut] = useState(3);
  const [colour, setColour] = useState(3);
  const [clarity, setClarity] = useState(3);
  const [carat, setCarat] = useState(4);
  const [focus, setFocus] = useState<CKey>('cut');

  const c = CUT[cut];
  const col = COLOUR[colour];
  const cl = CLARITY[clarity];
  const ct = CARAT[carat];

  // Price per carat itself climbs with weight — the well-known step-ups at the
  // half and whole carat marks — so weight enters the sum twice.
  const weightPremium = 1 + Math.max(0, ct - 0.5) * 0.42;
  const price = Math.round(
    BASE_PER_CARAT * ct * weightPremium * c.mult * col.mult * cl.mult
  );

  const verdict = useMemo(() => {
    // Read the shape of the choice, not the grades in isolation.
    if (cl.mult > 1.3 && cut <= 2) {
      return 'You are paying for clarity nobody can see, in a cut that will not show it. Move the money into the cut.';
    }
    if (col.mult > 1.2 && cut <= 2) {
      return 'A colourless stone in a fair cut looks grey, not icy. The cut has to come first.';
    }
    if (cut >= 3 && clarity <= 2 && colour <= 2) {
      return 'This is how the trade actually buys: spend on the cut, take the eye-clean stone, let the setting carry the rest.';
    }
    if (ct >= 2 && cut <= 2) {
      return 'A large stone in a modest cut announces its size and nothing else. Consider dropping weight to lift the cut.';
    }
    if (c.mult >= 1.18 && cl.mult >= 1 && col.mult >= 1) {
      return 'A genuinely fine stone. Everything here you will be able to see.';
    }
    return 'A sound, honest combination — nothing wasted and nothing obviously missing.';
  }, [c.mult, cl.mult, col.mult, cut, clarity, colour, ct]);

  return (
    <div className={`grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-12 ${className}`}>
      {/* ---------------- The drawn stone ---------------- */}
      <div className="plate-metal relative flex flex-col overflow-hidden rounded-4xl p-6 sm:p-8">
        <span className="mb-4 font-accent text-[10px] uppercase tracking-luxer text-accent">
          {ct.toFixed(2)} ct · {c.label} · {col.label} · {cl.label}
        </span>

        <div className="relative mx-auto aspect-square w-full max-w-[320px]">
          <DiamondGraphic
            brilliance={c.brilliance}
            tint={col.tint}
            flaws={cl.flaws}
            carat={ct}
          />
        </div>

        {/* Price */}
        <div className="mt-6 border-t border-hairline pt-5">
          <span className="mb-1 block font-accent text-[10px] uppercase tracking-luxer text-faint">
            Loose stone, indicative
          </span>
          <span className="font-display text-3xl sm:text-4xl">
            <Odometer
              value={price}
              prefix="₹"
              group
              onView={false}
              duration={0.85}
              className="text-gradient-static"
            />
          </span>

          <AnimatePresence mode="wait">
            <motion.p
              key={verdict}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className="mt-4 flex gap-2.5 font-sans text-xs leading-relaxed text-muted"
            >
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" strokeWidth={1.6} />
              {verdict}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* ---------------- The four dials ---------------- */}
      <div className="space-y-5">
        {CS.map((meta) => {
          const active = focus === meta.key;
          return (
            <motion.div
              key={meta.key}
              onPointerEnter={() => setFocus(meta.key)}
              animate={{
                borderColor: active
                  ? 'rgb(var(--gold-500) / 0.45)'
                  : 'rgb(var(--border) / 1)',
              }}
              className="rounded-3xl border bg-surface/40 p-6"
            >
              <div className="mb-4 flex items-baseline justify-between gap-4">
                <h3 className="font-display text-2xl text-primary">{meta.label}</h3>
                <span className="font-accent text-xs uppercase tracking-luxe text-accent">
                  {meta.key === 'cut' && c.label}
                  {meta.key === 'colour' && col.label}
                  {meta.key === 'clarity' && cl.label}
                  {meta.key === 'carat' && `${ct.toFixed(2)} ct`}
                </span>
              </div>

              <p className="mb-5 font-sans text-[11px] leading-relaxed text-faint">
                {meta.blurb}
              </p>

              {meta.key === 'cut' && (
                <GradeSlider
                  labels={CUT.map((g) => g.label)}
                  value={cut}
                  onChange={setCut}
                  name="Cut grade"
                />
              )}
              {meta.key === 'colour' && (
                <GradeSlider
                  labels={COLOUR.map((g) => g.label)}
                  value={colour}
                  onChange={setColour}
                  name="Colour grade"
                />
              )}
              {meta.key === 'clarity' && (
                <GradeSlider
                  labels={CLARITY.map((g) => g.label)}
                  value={clarity}
                  onChange={setClarity}
                  name="Clarity grade"
                />
              )}
              {meta.key === 'carat' && (
                <GradeSlider
                  labels={CARAT.map((v) => v.toFixed(2))}
                  value={carat}
                  onChange={setCarat}
                  name="Carat weight"
                />
              )}

              <AnimatePresence mode="wait">
                <motion.p
                  key={`${meta.key}-${cut}-${colour}-${clarity}-${carat}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 font-sans text-xs leading-relaxed text-secondary"
                >
                  {meta.key === 'cut' && c.note}
                  {meta.key === 'colour' && col.note}
                  {meta.key === 'clarity' && cl.note}
                  {meta.key === 'carat' &&
                    `Multiplies through everything else. At ${ct.toFixed(2)} ct the per-carat rate itself is ${Math.round((weightPremium - 1) * 100)}% above the half-carat reference.`}
                </motion.p>
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * Discrete slider over named grades. A native range input keeps keyboard and
 * screen-reader behaviour for free; the visible track and ticks are drawn over
 * it, and the thumb is styled through the pseudo-elements in globals.css.
 */
function GradeSlider({
  labels,
  value,
  onChange,
  name,
}: {
  labels: readonly string[];
  value: number;
  onChange: (v: number) => void;
  name: string;
}) {
  const max = labels.length - 1;
  const pct = (value / max) * 100;

  return (
    <div>
      <div className="relative h-8">
        {/* Track */}
        <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-line" />
        <motion.span
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          className="absolute left-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-gold-700 to-gold-300"
        />

        {/* Ticks */}
        {labels.map((l, i) => (
          <span
            key={l}
            style={{ left: `${(i / max) * 100}%` }}
            className={`absolute top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rotate-45 transition-colors duration-300 ${
              i <= value ? 'bg-accent' : 'bg-line-strong'
            }`}
          />
        ))}

        {/* Thumb */}
        <motion.span
          animate={{ left: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-gold-200/60 bg-gradient-to-br from-gold-200 to-gold-600 shadow-[0_0_16px_3px_rgb(var(--gold-400)/0.45)]"
        />

        <input
          type="range"
          min={0}
          max={max}
          step={1}
          value={value}
          aria-label={name}
          aria-valuetext={labels[value]}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent opacity-0"
        />
      </div>

      <div className="mt-1 flex justify-between">
        {labels.map((l, i) => (
          <button
            key={l}
            onClick={() => onChange(i)}
            className={`nums-tabular font-accent text-[9px] tracking-luxe transition-colors ${
              i === value ? 'text-accent' : 'text-faint hover:text-muted'
            }`}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * The stone itself. Brilliance drives how many facet flashes are lit and how
 * strong the prismatic wash is; tint colours the body; flaws are placed
 * deterministically inside the table so they do not jump between renders.
 */
function DiamondGraphic({
  brilliance,
  tint,
  flaws,
  carat,
}: {
  brilliance: number;
  tint: string;
  flaws: number;
  carat: number;
}) {
  const scale = 0.62 + Math.cbrt(carat) * 0.26;

  return (
    <motion.svg
      viewBox="0 0 200 200"
      className="h-full w-full overflow-visible"
      animate={{ scale }}
      transition={{ type: 'spring', stiffness: 140, damping: 20 }}
    >
      <defs>
        <radialGradient id="fc-body" cx="40%" cy="30%" r="76%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="46%" stopColor={tint} stopOpacity="0.82" />
          <stop offset="100%" stopColor={tint} stopOpacity="0.5" />
        </radialGradient>
        <linearGradient id="fc-fire" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8A5CC7" />
          <stop offset="34%" stopColor="#1A8A6F" />
          <stop offset="62%" stopColor="#EFCE78" />
          <stop offset="100%" stopColor="#DB9A82" />
        </linearGradient>
        <filter id="fc-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Bloom under the stone, scaled by how much light it actually returns */}
      <motion.circle
        cx={100}
        cy={100}
        r={78}
        fill="rgb(var(--gold-300) / 0.16)"
        animate={{ opacity: 0.25 + brilliance * 0.6, scale: [1, 1.05, 1] }}
        transition={{
          opacity: { duration: 0.6 },
          scale: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
        }}
        style={{ transformOrigin: '100px 100px' }}
        filter="url(#fc-glow)"
      />

      {/* Crown outline — round brilliant, seen table-up */}
      <circle cx={100} cy={100} r={62} fill="url(#fc-body)" stroke="#FFFFFF" strokeOpacity={0.6} strokeWidth={1.6} />

      {/* Prismatic fire */}
      <motion.circle
        cx={100}
        cy={100}
        r={62}
        fill="url(#fc-fire)"
        style={{ mixBlendMode: 'screen' }}
        animate={{ opacity: [brilliance * 0.12, brilliance * 0.4, brilliance * 0.12] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Star and bezel facets */}
      <g stroke="#FFFFFF" strokeOpacity={0.42} strokeWidth={0.9} fill="none">
        <circle cx={100} cy={100} r={34} />
        {Array.from({ length: 16 }).map((_, i) => {
          const a = (i / 16) * Math.PI * 2;
          return (
            <line
              key={i}
              x1={100 + Math.cos(a) * 34}
              y1={100 + Math.sin(a) * 34}
              x2={100 + Math.cos(a) * 62}
              y2={100 + Math.sin(a) * 62}
            />
          );
        })}
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
          return (
            <line
              key={`s${i}`}
              x1={100 + Math.cos(a) * 12}
              y1={100 + Math.sin(a) * 12}
              x2={100 + Math.cos(a) * 34}
              y2={100 + Math.sin(a) * 34}
            />
          );
        })}
      </g>

      {/* Lit facet flashes — count and brightness follow the cut grade */}
      {Array.from({ length: 8 }).map((_, i) => {
        const lit = i < Math.round(brilliance * 8);
        const a = (i / 8) * Math.PI * 2 + 0.4;
        return (
          <motion.path
            key={`f${i}`}
            d={`M${100 + Math.cos(a) * 34} ${100 + Math.sin(a) * 34} L${100 + Math.cos(a + 0.38) * 62} ${100 + Math.sin(a + 0.38) * 62} L${100 + Math.cos(a - 0.38) * 62} ${100 + Math.sin(a - 0.38) * 62} Z`}
            fill="#FFFFFF"
            animate={{ opacity: lit ? [0.06, 0.5, 0.06] : 0.03 }}
            transition={{
              duration: 2.6 + i * 0.27,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.18,
            }}
          />
        );
      })}

      {/* Inclusions. Positions are derived from the index so the same clarity
          grade always draws the same stone. */}
      <AnimatePresence>
        {Array.from({ length: flaws }).map((_, i) => {
          const a = (i * 2.399) % (Math.PI * 2);
          const r = 14 + ((i * 13) % 40);
          return (
            <motion.g
              key={`inc-${i}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
            >
              <path
                d={`M${100 + Math.cos(a) * r} ${100 + Math.sin(a) * r} l${2 + (i % 3)} ${1 + (i % 2)} l-1 ${2 + (i % 2)}`}
                stroke="rgb(var(--ink-700))"
                strokeWidth={1.3}
                strokeOpacity={0.6}
                fill="none"
                strokeLinecap="round"
              />
            </motion.g>
          );
        })}
      </AnimatePresence>

      {/* Central star, the brightest single return */}
      <motion.path
        d="M100 68 L104 96 L132 100 L104 104 L100 132 L96 104 L68 100 L96 96 Z"
        fill="#FFFFFF"
        filter="url(#fc-glow)"
        animate={{ opacity: 0.2 + brilliance * 0.75, rotate: [0, 45] }}
        transition={{
          opacity: { duration: 0.6 },
          rotate: { duration: 30, repeat: Infinity, ease: 'linear' },
        }}
        style={{ transformOrigin: '100px 100px' }}
      />
    </motion.svg>
  );
}
