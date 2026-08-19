'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Check, Info, Plus, X } from 'lucide-react';
import { metals, type MetalSpec } from '@/data/gems';

interface MetalComparatorProps {
  className?: string;
  /** Ids selected on first paint. */
  initial?: string[];
}

/** Two is the useful comparison; three is the most a phone can hold legibly. */
const LIMIT = 3;

/**
 * The metals bench, side by side.
 *
 * Three of the four axes are measured — fineness in parts per thousand, Vickers
 * hardness, and a price index — and the fourth, warmth of colour, is an editorial
 * judgement. It is charted with a visibly different bar and labelled as a
 * judgement, because putting an opinion on the same axis as a measurement without
 * saying so implies a precision it does not have, and a customer holding a
 * hallmark certificate will notice.
 *
 * Bars run against fixed maxima rather than against the selected set, for the same
 * reason as in the stone library: a bar has to mean the same thing whichever two
 * metals happen to be on screen. Comparing 24K against 22K should not make 22K
 * look hard — it is still soft, and the chart has to say so.
 */
export default function MetalComparator({
  className = '',
  initial = ['18k', 'platinum'],
}: MetalComparatorProps) {
  const [selected, setSelected] = useState<string[]>(
    initial.filter((id) => metals.some((m) => m.id === id)).slice(0, LIMIT)
  );

  const chosen = useMemo(
    () =>
      selected
        .map((id) => metals.find((m) => m.id === id))
        .filter((m): m is MetalSpec => Boolean(m)),
    [selected]
  );

  const toggle = (id: string) => {
    setSelected((cur) => {
      if (cur.includes(id)) {
        // Never empty: an empty comparator is a blank panel with no way back in.
        return cur.length === 1 ? cur : cur.filter((v) => v !== id);
      }
      // Oldest out when full, so a fourth tap still does something visible.
      return cur.length >= LIMIT ? [...cur.slice(1), id] : [...cur, id];
    });
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-hairline bg-surface-raised/60 p-6 backdrop-blur-xl md:p-8 ${className}`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-spotlight-soft opacity-[var(--bloom)]"
      />

      <header className="relative mb-7">
        <h3 className="font-display text-xl font-light text-primary md:text-2xl">
          The Metals Bench
        </h3>
        <p className="mt-1 font-sans text-[11px] font-light text-muted">
          Pick up to {LIMIT}. Bars are on a fixed scale, so they mean the same thing in
          every comparison.
        </p>
      </header>

      {/* Swatch rail */}
      <div className="relative mb-8 flex flex-wrap gap-2.5">
        {metals.map((metal) => {
          const on = selected.includes(metal.id);
          return (
            <button
              key={metal.id}
              onClick={() => toggle(metal.id)}
              aria-pressed={on}
              className={`group flex items-center gap-2.5 rounded-full border py-2 pl-2 pr-4 transition-all duration-300 ${
                on
                  ? 'border-gold-500/55 bg-gold-500/10'
                  : 'border-hairline hover:border-gold-500/35'
              }`}
            >
              <span
                aria-hidden="true"
                className={`block h-6 w-6 flex-shrink-0 rounded-full bg-gradient-to-br ${metal.swatch} ring-1 ring-inset ring-white/20 transition-transform duration-500 group-hover:scale-110`}
              />
              <span
                className={`font-accent text-[10px] uppercase tracking-luxe transition-colors ${
                  on ? 'text-accent' : 'text-muted group-hover:text-accent'
                }`}
              >
                {metal.name.replace(' Gold', '').replace('Platinum ', 'Pt ')}
              </span>
              <span aria-hidden="true" className="text-faint">
                {on ? <X size={11} strokeWidth={2} /> : <Plus size={11} strokeWidth={2} />}
              </span>
            </button>
          );
        })}
      </div>

      {/* Columns */}
      <motion.div
        layout
        className={`relative grid gap-5 ${
          chosen.length === 1
            ? 'grid-cols-1'
            : chosen.length === 2
              ? 'grid-cols-1 sm:grid-cols-2'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        }`}
      >
        <AnimatePresence mode="popLayout">
          {chosen.map((metal, i) => (
            <motion.article
              key={metal.id}
              layout
              initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
              transition={{ duration: 0.45, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex flex-col overflow-hidden rounded-xl border border-hairline bg-canvas/40 p-5"
            >
              {/* The metal itself, as a poured bar */}
              <span
                aria-hidden="true"
                className={`mb-4 block h-10 w-full animate-molten-flow rounded-md bg-gradient-to-r ${metal.swatch} bg-size-300 ring-1 ring-inset ring-white/15`}
              />

              <h4 className="font-display text-lg font-light leading-tight text-primary">
                {metal.name}
              </h4>
              <p className="nums-tabular mt-1 font-accent text-[9px] uppercase tracking-luxe text-accent">
                {metal.fineness}‰ fine
              </p>

              <div className="mt-5 flex flex-col gap-3.5">
                <Axis
                  label="Purity"
                  value={metal.fineness}
                  max={1000}
                  display={`${metal.fineness}‰`}
                />
                <Axis
                  label="Hardness"
                  value={metal.hardness}
                  max={160}
                  display={`${metal.hardness} HV`}
                />
                <Axis
                  label="Price"
                  value={metal.priceIndex}
                  max={145}
                  display={`${metal.priceIndex} idx`}
                />
                <Axis
                  label="Warmth"
                  value={metal.warmth}
                  max={100}
                  display={metal.warmth > 60 ? 'Warm' : metal.warmth > 30 ? 'Neutral' : 'Cool'}
                  editorial
                />
              </div>

              <p className="mt-5 border-t border-hairline pt-4 font-sans text-xs font-light leading-relaxed text-muted">
                {metal.note}
              </p>

              <div className="mt-4 flex flex-col gap-2.5">
                <p className="flex items-start gap-2 font-sans text-[11px] font-light leading-relaxed text-secondary">
                  <Check
                    size={12}
                    strokeWidth={2}
                    className="mt-0.5 flex-shrink-0 text-jade-300"
                  />
                  {metal.best}
                </p>
                <p className="flex items-start gap-2 font-sans text-[11px] font-light leading-relaxed text-secondary">
                  <AlertTriangle
                    size={12}
                    strokeWidth={1.9}
                    className="mt-0.5 flex-shrink-0 text-burgundy-300"
                  />
                  {metal.caution}
                </p>
              </div>

              {/* Remove */}
              {chosen.length > 1 && (
                <button
                  onClick={() => toggle(metal.id)}
                  aria-label={`Remove ${metal.name} from the comparison`}
                  className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full border border-hairline bg-canvas/70 text-faint backdrop-blur transition-colors hover:border-gold-500/40 hover:text-accent"
                >
                  <X size={12} strokeWidth={2} />
                </button>
              )}
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>

      <p className="relative mt-7 flex items-start gap-2 font-sans text-[10px] font-light italic leading-relaxed text-faint">
        <Info size={11} strokeWidth={1.8} className="mt-0.5 flex-shrink-0" />
        Purity, hardness and price are measured — hardness on the Vickers scale, price
        indexed against 18K yellow at 100. Warmth is our own judgement of the colour and
        is drawn as a hollow bar to keep the two apart.
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function Axis({
  label,
  value,
  max,
  display,
  editorial = false,
}: {
  label: string;
  value: number;
  max: number;
  display: string;
  /** Drawn hollow, marking it as a judgement rather than a measurement. */
  editorial?: boolean;
}) {
  const pct = Math.max(0, Math.min(1, value / max));

  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <span className="font-accent text-[9px] uppercase tracking-luxe text-faint">
          {label}
          {editorial && <span className="ml-1 normal-case tracking-normal">(ours)</span>}
        </span>
        <span className="nums-tabular font-sans text-[10px] font-light text-muted">
          {display}
        </span>
      </div>
      <div
        className={`h-1.5 w-full overflow-hidden rounded-full ${
          editorial ? 'border border-dashed border-line-strong bg-transparent' : 'bg-line'
        }`}
      >
        <motion.span
          className={`block h-full rounded-full ${
            editorial
              ? 'bg-gradient-to-r from-transparent via-gold-500/40 to-gold-400/60'
              : 'bg-gradient-to-r from-gold-700 via-gold-400 to-gold-200'
          }`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: pct }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ originX: 0, width: '100%' }}
        />
      </div>
    </div>
  );
}
