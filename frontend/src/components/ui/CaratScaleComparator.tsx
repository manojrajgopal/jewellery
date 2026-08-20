'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Hand, Ruler } from 'lucide-react';

import { ease, springs } from '@/lib/motion';

/**
 * Face-up diameter in millimetres at 1.00ct for each cut, and the length-to-width
 * ratio that gives the cut its outline. Both are the trade's own round numbers —
 * a marquise at 1ct is 10 × 5mm, and every jeweller quotes it that way.
 *
 * `spread` is the honest part of this table: two stones of the same weight can
 * differ by 15% in the size they *look*, because weight hides in the pavilion
 * where nobody sees it. That is the single most useful fact in choosing a stone
 * and it is almost never shown.
 */
const CUTS = [
  { id: 'round', label: 'Round brilliant', mmAt1ct: 6.5, ratio: 1, clip: 'rounded-full', spread: 1 },
  { id: 'oval', label: 'Oval', mmAt1ct: 7.7, ratio: 1.45, clip: 'clip-oval', spread: 1.1 },
  { id: 'cushion', label: 'Cushion', mmAt1ct: 6.0, ratio: 1.05, clip: 'clip-cushion', spread: 0.94 },
  { id: 'emerald', label: 'Emerald', mmAt1ct: 6.9, ratio: 1.4, clip: 'clip-emerald', spread: 1.06 },
  { id: 'pear', label: 'Pear', mmAt1ct: 8.6, ratio: 1.55, clip: 'clip-pear', spread: 1.12 },
  { id: 'marquise', label: 'Marquise', mmAt1ct: 10, ratio: 2, clip: 'clip-marquise', spread: 1.2 },
  { id: 'princess', label: 'Princess', mmAt1ct: 5.5, ratio: 1, clip: 'clip-baguette', spread: 0.9 },
  { id: 'asscher', label: 'Asscher', mmAt1ct: 5.6, ratio: 1, clip: 'clip-asscher', spread: 0.91 },
] as const;

const WEIGHTS = [0.3, 0.5, 0.7, 0.9, 1, 1.25, 1.5, 2, 2.5, 3, 4, 5] as const;

/** Reference objects, so the millimetres mean something without a ruler to hand. */
const REFERENCES = [
  { id: 'none', label: 'Nothing', mm: 0 },
  { id: 'pencil', label: 'Pencil lead', mm: 0.7 },
  { id: 'rice', label: 'Grain of rice', mm: 6 },
  { id: 'pea', label: 'Garden pea', mm: 8 },
  { id: 'coin', label: '₹1 coin', mm: 21.9 },
] as const;

/**
 * Carat weight, drawn at true size.
 *
 * Weight is the number on the certificate and size is the thing on the hand, and
 * they are not the same question. This draws the answer instead of tabulating it:
 * pick a cut and a weight and the stone on screen is the size it will actually
 * be — scaled through a physical-pixel calibration the visitor can correct by
 * matching a real coin against the ruler.
 *
 * That calibration matters more than it sounds. Browser CSS pixels are only
 * loosely tied to physical length, and a stone drawn "to scale" without it is off
 * by up to a third on a phone. So the ruler is on the page, the slider adjusts it,
 * and the number it produces is applied to everything else — which makes this the
 * only place on the site where a visitor can trust a size on screen.
 */
export default function CaratScaleComparator({ className = '' }: { className?: string }) {
  const [cutId, setCutId] = useState<(typeof CUTS)[number]['id']>('round');
  const [weightIndex, setWeightIndex] = useState(4);
  const [refId, setRefId] = useState<(typeof REFERENCES)[number]['id']>('rice');
  const [compareId, setCompareId] = useState<(typeof CUTS)[number]['id']>('marquise');
  /** CSS pixels per millimetre. 3.78 is the nominal 96dpi figure. */
  const [pxPerMm, setPxPerMm] = useState(3.78);

  const cut = CUTS.find((c) => c.id === cutId) ?? CUTS[0];
  const other = CUTS.find((c) => c.id === compareId) ?? CUTS[5];
  const ct = WEIGHTS[weightIndex];
  const reference = REFERENCES.find((r) => r.id === refId) ?? REFERENCES[0];

  /**
   * Diameter scales with the cube root of weight, because weight is a volume and
   * the stone keeps its proportions. Using a linear scale here — which plenty of
   * size charts do — makes a 2ct look twice as wide as a 1ct, and it is about 26%
   * wider.
   */
  const dims = useMemo(() => {
    const size = (c: (typeof CUTS)[number]) => {
      const w = c.mmAt1ct * Math.cbrt(ct);
      return { w, h: w / c.ratio };
    };
    return { main: size(cut), other: size(other) };
  }, [cut, other, ct]);

  return (
    <div className={`grid gap-8 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] ${className}`}>
      {/* ---- Controls ---- */}
      <div className="space-y-7 rounded-3xl border border-hairline bg-canvas-alt/60 p-6 md:p-7">
        <div>
          <span className="font-accent text-[10px] uppercase tracking-luxer text-accent">Cut</span>
          <div className="mt-3 flex flex-wrap gap-2">
            {CUTS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCutId(c.id)}
                aria-pressed={c.id === cutId}
                className={`rounded-full border px-3 py-1.5 font-accent text-[10px] uppercase tracking-luxe transition-all duration-300 ${
                  c.id === cutId
                    ? 'border-accent bg-accent text-onaccent'
                    : 'border-hairline text-muted hover:border-accent/50 hover:text-accent'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-baseline justify-between">
            <span className="font-accent text-[10px] uppercase tracking-luxer text-accent">
              Weight
            </span>
            <span className="font-display text-2xl text-primary nums-tabular">
              {ct.toFixed(2)} ct
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={WEIGHTS.length - 1}
            step={1}
            value={weightIndex}
            onChange={(e) => setWeightIndex(Number(e.target.value))}
            aria-label="Carat weight"
            className="mt-3 w-full accent-[rgb(var(--accent))]"
          />
          <div className="mt-1 flex justify-between font-sans text-[10px] text-faint nums-tabular">
            <span>0.30</span>
            <span>5.00</span>
          </div>
        </div>

        <div>
          <span className="font-accent text-[10px] uppercase tracking-luxer text-accent">
            Against
          </span>
          <div className="mt-3 flex flex-wrap gap-2">
            {REFERENCES.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRefId(r.id)}
                aria-pressed={r.id === refId}
                className={`rounded-full border px-3 py-1.5 font-accent text-[10px] uppercase tracking-luxe transition-all duration-300 ${
                  r.id === refId
                    ? 'border-accent bg-accent/12 text-accent'
                    : 'border-hairline text-muted hover:text-accent'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="font-accent text-[10px] uppercase tracking-luxer text-accent">
            Second cut, same weight
          </span>
          <select
            value={compareId}
            onChange={(e) => setCompareId(e.target.value as typeof compareId)}
            aria-label="Cut to compare against"
            className="input-gold mt-3 font-sans text-sm"
          >
            {CUTS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* ---- Calibration ---- */}
        <div className="rounded-2xl border border-hairline bg-surface-raised/50 p-4">
          <span className="flex items-center gap-2 font-accent text-[10px] uppercase tracking-luxe text-muted">
            <Ruler className="h-3.5 w-3.5" aria-hidden="true" />
            Calibrate
          </span>
          <p className="mt-2 font-sans text-[11px] font-light leading-relaxed text-faint">
            Hold a ₹1 coin against the bar below and drag until they match. Everything on the
            right is then drawn at true size on your screen.
          </p>
          <div className="mt-3 flex items-center gap-3">
            <span
              aria-hidden="true"
              className="block h-3 rounded-full bg-gradient-to-r from-gold-700 via-gold-300 to-gold-700"
              style={{ width: `${21.9 * pxPerMm}px` }}
            />
            <span className="font-sans text-[10px] text-faint nums-tabular">21.9 mm</span>
          </div>
          <input
            type="range"
            min={2.4}
            max={7}
            step={0.02}
            value={pxPerMm}
            onChange={(e) => setPxPerMm(Number(e.target.value))}
            aria-label="Screen calibration, pixels per millimetre"
            className="mt-2 w-full accent-[rgb(var(--accent))]"
          />
        </div>
      </div>

      {/* ---- The drawing ---- */}
      <div className="relative overflow-hidden rounded-3xl border border-hairline bg-surface-sunken/40 p-6 md:p-10">
        {/* Millimetre rule along the top, so the scale is provable rather than
            claimed. Ticks are generated from the calibration, not hard-coded. */}
        <div className="relative mb-8 h-8 border-b border-hairline">
          {Array.from({ length: 41 }).map((_, i) => (
            <span
              key={i}
              aria-hidden="true"
              className={`absolute bottom-0 w-px ${
                i % 10 === 0 ? 'h-5 bg-accent/70' : i % 5 === 0 ? 'h-3.5 bg-line-strong' : 'h-2 bg-line'
              }`}
              style={{ left: `${i * pxPerMm}px` }}
            />
          ))}
          {[0, 10, 20, 30, 40].map((mm) => (
            <span
              key={mm}
              aria-hidden="true"
              className="absolute top-0 -translate-x-1/2 font-sans text-[9px] text-faint nums-tabular"
              style={{ left: `${mm * pxPerMm}px` }}
            >
              {mm}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-end gap-10">
          {/* The chosen stone */}
          <figure className="flex flex-col items-center">
            <motion.div
              layout
              animate={{
                width: dims.main.w * pxPerMm,
                height: dims.main.h * pxPerMm,
              }}
              transition={springs.plate}
              className={`pave-field relative border border-gold-300/40 bg-gradient-to-br from-white/85 via-champagne-100/70 to-gold-200/60 shadow-[0_18px_40px_-22px_rgb(var(--gold-500)/0.8)] ${cut.clip}`}
            >
              {/* Table facet, so the shape reads as a cut stone rather than a
                  coloured blob at any size. */}
              <span
                aria-hidden="true"
                className="absolute inset-[22%] border border-white/70 bg-white/35"
                style={{ clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)' }}
              />
            </motion.div>
            <figcaption className="mt-3 text-center">
              <span className="block font-accent text-[10px] uppercase tracking-luxe text-accent">
                {cut.label}
              </span>
              <span className="mt-1 block font-sans text-xs text-muted nums-tabular">
                {dims.main.w.toFixed(1)} × {dims.main.h.toFixed(1)} mm
              </span>
            </figcaption>
          </figure>

          {/* The comparison stone, same weight */}
          <figure className="flex flex-col items-center opacity-90">
            <motion.div
              layout
              animate={{
                width: dims.other.w * pxPerMm,
                height: dims.other.h * pxPerMm,
              }}
              transition={springs.plate}
              className={`relative border border-line-strong bg-gradient-to-br from-surface-raised to-surface-sunken ${other.clip}`}
            />
            <figcaption className="mt-3 text-center">
              <span className="block font-accent text-[10px] uppercase tracking-luxe text-muted">
                {other.label}
              </span>
              <span className="mt-1 block font-sans text-xs text-faint nums-tabular">
                {dims.other.w.toFixed(1)} × {dims.other.h.toFixed(1)} mm
              </span>
            </figcaption>
          </figure>

          {/* The everyday reference */}
          {reference.mm > 0 && (
            <figure className="flex flex-col items-center">
              <motion.span
                aria-hidden="true"
                animate={{ width: reference.mm * pxPerMm, height: reference.mm * pxPerMm }}
                transition={springs.plate}
                className="rounded-full border border-dashed border-line-strong bg-canvas/40"
              />
              <figcaption className="mt-3 font-accent text-[10px] uppercase tracking-luxe text-faint">
                {reference.label}
              </figcaption>
            </figure>
          )}
        </div>

        {/* The spread verdict — the reason the tool exists. */}
        <motion.div
          key={`${cut.id}-${other.id}-${ct}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: ease.luxury }}
          className="mt-10 flex items-start gap-3 rounded-2xl border border-hairline bg-canvas/60 p-4"
        >
          <Hand className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" aria-hidden="true" />
          <p className="font-sans text-sm font-light leading-relaxed text-secondary">
            At the same {ct.toFixed(2)} ct, the {other.label.toLowerCase()} covers{' '}
            <span className="text-accent nums-tabular">
              {Math.abs(Math.round((other.spread / cut.spread - 1) * 100))}%
            </span>{' '}
            {other.spread >= cut.spread ? 'more' : 'less'} of the finger than the{' '}
            {cut.label.toLowerCase()}. You pay for the weight either way — the difference is
            how much of it you can see.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
