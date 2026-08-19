'use client';

import { motion } from 'framer-motion';

interface RarityMeterProps {
  /** How scarce, 1–5. */
  value: number;
  label?: string;
  className?: string;
  /** Segments, if a scale other than five is wanted. */
  of?: number;
}

const WORDS = ['Common', 'Available', 'Scarce', 'Rare', 'Exceptional'];

/**
 * A segmented scarcity gauge.
 *
 * Segments rather than a continuous bar, deliberately. Scarcity here is an
 * editorial judgement on a five-point scale, not a measurement — and a smooth bar
 * filled to 73% implies a precision that a five-point judgement does not have.
 * Discrete segments say "four out of five" and nothing more.
 */
export default function RarityMeter({
  value,
  label = 'Scarcity',
  className = '',
  of = 5,
}: RarityMeterProps) {
  const clamped = Math.max(0, Math.min(of, Math.round(value)));
  const word = WORDS[Math.min(clamped, WORDS.length) - 1] ?? '—';

  return (
    <div className={className}>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span className="font-accent text-[9px] uppercase tracking-luxe text-faint">
          {label}
        </span>
        <span className="font-accent text-[9px] uppercase tracking-luxe text-accent">
          {word}
        </span>
      </div>

      <div
        className="flex gap-1"
        role="meter"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={of}
        aria-label={`${label}: ${word}`}
      >
        {Array.from({ length: of }).map((_, i) => (
          <motion.span
            key={i}
            className="rarity-seg"
            data-on={i < clamped}
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              // Filled segments arrive in order, so the meter reads as filling
              // rather than as appearing.
              delay: i * 0.07,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ originX: 0 }}
          />
        ))}
      </div>
    </div>
  );
}
