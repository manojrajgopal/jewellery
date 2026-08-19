'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface OdometerProps {
  value: number;
  /** Digits shown before the decimal; pads with leading zeros when set. */
  pad?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  /** Seconds for the roll. */
  duration?: number;
  /** Roll on first scroll into view rather than immediately. */
  onView?: boolean;
  /** Separate thousands with a thin space. */
  group?: boolean;
}

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

/**
 * A mechanical digit roll, like the counter on a fuel pump or a share ticker.
 *
 * Each column is a vertical strip of 0–9 translated to bring the target digit
 * into the window, so digits physically travel past each other rather than
 * cross-fading. Higher-order columns are given a longer settle, which is what
 * makes the whole readout land like a mechanism rather than all at once.
 *
 * Re-renders when `value` changes, so it doubles as a live readout for the gold
 * rate and the configurator's running total.
 */
export default function Odometer({
  value,
  pad = 0,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
  duration = 1.2,
  onView = true,
  group = false,
}: OdometerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15%' });
  const [armed, setArmed] = useState(!onView);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (inView) setArmed(true);
  }, [inView]);

  const text = Math.abs(value).toFixed(decimals).padStart(pad + (decimals ? decimals + 1 : 0), '0');

  // Group only the integer part, and only when asked.
  const chars = (() => {
    if (!group) return text.split('');
    const [int, frac] = text.split('.');
    const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return (frac ? `${grouped}.${frac}` : grouped).split('');
  })();

  // Count columns from the right so the delay grows toward the leading digit.
  const digitCount = chars.filter((c) => /\d/.test(c)).length;
  let seen = 0;

  return (
    <span ref={ref} className={`inline-flex items-baseline tabular-nums ${className}`}>
      {/* Every visible part below is aria-hidden — the digit columns each carry
          a full 0–9 strip, which assistive tech would otherwise read out in
          full. This is the only accessible copy of the number. */}
      <span className="sr-only">{`${value < 0 ? '-' : ''}${prefix}${text}${suffix}`}</span>

      {value < 0 && <span aria-hidden="true">-</span>}
      {prefix && <span aria-hidden="true">{prefix}</span>}

      {chars.map((c, i) => {
        if (!/\d/.test(c)) {
          return (
            <span key={`${i}-sep`} aria-hidden="true" className="px-[0.02em]">
              {c}
            </span>
          );
        }
        const index = digitCount - 1 - seen;
        seen += 1;
        return (
          <Column
            key={`${i}-digit`}
            digit={Number(c)}
            armed={armed}
            reduced={reduced}
            duration={duration}
            delay={index * 0.055}
          />
        );
      })}

      {suffix && <span aria-hidden="true">{suffix}</span>}
    </span>
  );
}

function Column({
  digit,
  armed,
  reduced,
  duration,
  delay,
}: {
  digit: number;
  armed: boolean;
  reduced: boolean;
  duration: number;
  delay: number;
}) {
  // The strip is ten glyphs tall; -10% per digit brings the right one up.
  const target = armed ? -digit * 10 : 0;

  return (
    <span
      aria-hidden="true"
      className="relative inline-block h-[1em] overflow-hidden align-baseline"
      style={{ width: '0.62em' }}
    >
      <motion.span
        className="absolute inset-x-0 top-0 flex flex-col items-center"
        animate={{ y: `${reduced ? -digit * 10 : target}%` }}
        transition={
          reduced
            ? { duration: 0 }
            : { duration, delay, ease: [0.22, 1, 0.36, 1] }
        }
      >
        {DIGITS.map((d) => (
          <span key={d} className="block h-[1em] leading-[1em]">
            {d}
          </span>
        ))}
      </motion.span>
    </span>
  );
}
