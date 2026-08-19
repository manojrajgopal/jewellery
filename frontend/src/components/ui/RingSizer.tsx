'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Info, Ruler } from 'lucide-react';

/**
 * Indian standard ring sizes against inner diameter in millimetres, with the
 * usual UK/US equivalents. Diameters are the published nominal values; the
 * circumference column is derived rather than tabulated so the two can never
 * disagree.
 */
const SIZES = [
  { indian: 6, mm: 14.0, uk: 'F', us: 3.0 },
  { indian: 8, mm: 14.8, uk: 'H', us: 4.0 },
  { indian: 10, mm: 15.6, uk: 'J', us: 5.0 },
  { indian: 12, mm: 16.5, uk: 'L', us: 6.0 },
  { indian: 13, mm: 17.0, uk: 'M', us: 6.5 },
  { indian: 14, mm: 17.3, uk: 'N', us: 7.0 },
  { indian: 16, mm: 18.2, uk: 'P', us: 8.0 },
  { indian: 18, mm: 19.0, uk: 'R', us: 9.0 },
  { indian: 20, mm: 19.8, uk: 'T', us: 10.0 },
  { indian: 22, mm: 20.6, uk: 'V', us: 11.0 },
  { indian: 24, mm: 21.4, uk: 'X', us: 12.0 },
  { indian: 26, mm: 22.2, uk: 'Z', us: 13.0 },
];

type Mode = 'diameter' | 'circumference';

/**
 * Ring sizer: a to-scale circle the visitor can match a ring against, plus the
 * conversion table for every standard they might already know their size in.
 *
 * The circle is drawn in real millimetres using CSS `mm` units. On a correctly
 * reporting display that is genuinely to scale, and the calibration note says
 * plainly that it may not be — an on-screen sizer that quietly assumes 96 DPI
 * is worse than no sizer, because the visitor trusts it.
 */
export default function RingSizer({ className = '' }: { className?: string }) {
  const [index, setIndex] = useState(5);
  const [mode, setMode] = useState<Mode>('diameter');

  const size = SIZES[index];
  const circumference = useMemo(() => size.mm * Math.PI, [size.mm]);

  return (
    <div className={`glass overflow-hidden ${className}`}>
      <div className="border-b border-hairline px-6 py-5">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold-500/30 text-accent">
            <Ruler size={16} strokeWidth={1.7} />
          </span>
          <div>
            <h3 className="font-accent text-sm uppercase tracking-luxe text-primary">
              Ring Sizer
            </h3>
            <p className="font-sans text-xs font-light text-muted">
              Match an existing ring against the circle
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 p-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:p-8">
        {/* ---- The to-scale circle ---- */}
        <div className="flex flex-col items-center justify-center gap-5">
          <div className="relative flex h-52 w-52 items-center justify-center">
            {/* Concentric guides at the neighbouring sizes, so the visitor can
                see whether they are between two. */}
            {[index - 1, index + 1]
              .filter((i) => i >= 0 && i < SIZES.length)
              .map((i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  className="absolute rounded-full border border-dashed border-line-strong/60"
                  style={{ width: `${SIZES[i].mm}mm`, height: `${SIZES[i].mm}mm` }}
                />
              ))}

            {/* The selected size. Animating width/height in mm is the whole
                point — a transform scale would no longer be to scale. */}
            <motion.span
              layout
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              className="relative rounded-full border-2 border-accent shadow-gold-bloom"
              style={{ width: `${size.mm}mm`, height: `${size.mm}mm` }}
            >
              <span className="animate-conic-spin-slow absolute -inset-1 rounded-full bg-conic-gold opacity-40 blur-[2px]" />
            </motion.span>

            {/* Diameter callout */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-1/2 flex items-center justify-center"
            >
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold-500/40" />
              <AnimatePresence mode="wait">
                <motion.span
                  key={size.mm}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25 }}
                  className="mx-2 font-sans text-[10px] tracking-luxe text-accent tabular-nums"
                >
                  {size.mm.toFixed(1)} mm
                </motion.span>
              </AnimatePresence>
              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold-500/40" />
            </span>
          </div>

          <p className="flex max-w-[16rem] items-start gap-2 text-center font-sans text-[10px] font-light leading-relaxed text-faint">
            <Info size={12} strokeWidth={1.8} className="mt-0.5 flex-shrink-0" />
            <span>
              Drawn in real millimetres, though screen scaling can affect this. Check against a
              ruler before relying on it.
            </span>
          </p>
        </div>

        {/* ---- Controls and readout ---- */}
        <div className="flex flex-col justify-center gap-6">
          {/* Big readout */}
          <div>
            <span className="font-accent text-[10px] uppercase tracking-luxer text-accent">
              Indian Size
            </span>
            {/* Relative: the outgoing number exits as position:absolute so the
                incoming one does not shove the millimetre label sideways. */}
            <div className="relative mt-1 flex items-baseline gap-3">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={size.indian}
                  initial={{ y: 16, opacity: 0, filter: 'blur(6px)' }}
                  animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                  exit={{ y: -16, opacity: 0, position: 'absolute' }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="font-display text-5xl font-light text-gradient-static tabular-nums"
                >
                  {size.indian}
                </motion.span>
              </AnimatePresence>
              <span className="font-sans text-sm font-light text-muted tabular-nums">
                {mode === 'diameter'
                  ? `${size.mm.toFixed(1)} mm across`
                  : `${circumference.toFixed(1)} mm around`}
              </span>
            </div>
          </div>

          {/* Slider */}
          <div>
            <label
              htmlFor="ring-size-slider"
              className="mb-3 block font-accent text-[10px] uppercase tracking-luxe text-muted"
            >
              Adjust
            </label>
            <input
              id="ring-size-slider"
              type="range"
              min={0}
              max={SIZES.length - 1}
              step={1}
              value={index}
              onChange={(e) => setIndex(Number(e.target.value))}
              aria-valuetext={`Indian size ${size.indian}, ${size.mm.toFixed(1)} millimetres`}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-line-strong accent-[rgb(var(--accent))]"
              style={{
                backgroundImage: `linear-gradient(to right, rgb(var(--gold-600)), rgb(var(--gold-300)) ${
                  (index / (SIZES.length - 1)) * 100
                }%, transparent ${(index / (SIZES.length - 1)) * 100}%)`,
              }}
            />
            <div className="mt-2 flex justify-between font-sans text-[10px] text-faint tabular-nums">
              <span>{SIZES[0].indian}</span>
              <span>{SIZES[SIZES.length - 1].indian}</span>
            </div>
          </div>

          {/* Mode toggle */}
          <div className="flex gap-2">
            {(['diameter', 'circumference'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                aria-pressed={mode === m}
                className={`relative flex-1 rounded-full border px-4 py-2 font-accent text-[10px] uppercase tracking-luxe transition-colors duration-300 ${
                  mode === m
                    ? 'border-gold-500/50 text-accent'
                    : 'border-hairline text-muted hover:text-primary'
                }`}
              >
                {mode === m && (
                  <motion.span
                    layoutId="ring-sizer-mode"
                    transition={{ type: 'spring', stiffness: 340, damping: 30 }}
                    className="absolute inset-0 -z-10 rounded-full bg-gold-500/10"
                  />
                )}
                {m === 'diameter' ? 'Diameter' : 'Circumference'}
              </button>
            ))}
          </div>

          {/* Conversions */}
          <dl className="grid grid-cols-3 gap-3 border-t border-hairline pt-5">
            {[
              { label: 'UK', value: size.uk },
              { label: 'US', value: size.us.toFixed(1) },
              {
                label: mode === 'diameter' ? 'Circum.' : 'Diameter',
                value:
                  mode === 'diameter'
                    ? `${circumference.toFixed(1)}mm`
                    : `${size.mm.toFixed(1)}mm`,
              },
            ].map((row) => (
              <div key={row.label}>
                <dt className="font-accent text-[9px] uppercase tracking-luxe text-faint">
                  {row.label}
                </dt>
                <dd className="mt-1 font-display text-lg text-primary tabular-nums">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
