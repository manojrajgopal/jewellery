'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface CountUpProps {
  end: number;
  /** Seconds when < 100, otherwise milliseconds — both call sites exist. */
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  decimals?: number;
  /** Insert locale thousands separators. */
  separator?: boolean;
}

/**
 * Eases a number up to its target the first time it scrolls into view.
 * Digits are tabular so the element never jitters as values change width.
 */
export default function CountUp({
  end,
  duration = 2,
  suffix = '',
  prefix = '',
  className = '',
  decimals = 0,
  separator = true,
}: CountUpProps) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  useEffect(() => {
    if (!inView) return;

    // Accept both 2 (seconds) and 2000 (ms).
    const ms = duration < 100 ? duration * 1000 : duration;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(end);
      return;
    }

    let start: number | null = null;
    let raf = 0;
    const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    const step = (ts: number) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / ms, 1);
      setValue(easeOutExpo(progress) * end);
      if (progress < 1) raf = requestAnimationFrame(step);
      else setValue(end);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, end, duration]);

  const formatted = separator
    ? value.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
    : value.toFixed(decimals);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
