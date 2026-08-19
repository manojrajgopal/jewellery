'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';

interface Rate {
  id: string;
  label: string;
  unit: string;
  /** Opening price for the session, in rupees. */
  base: number;
  /** How much this metal typically moves in a session, as a fraction. */
  volatility: number;
}

const METALS: Rate[] = [
  { id: 'gold-24', label: '24K Gold', unit: '/ 10g', base: 74280, volatility: 0.004 },
  { id: 'gold-22', label: '22K Gold', unit: '/ 10g', base: 68090, volatility: 0.004 },
  { id: 'gold-18', label: '18K Gold', unit: '/ 10g', base: 55710, volatility: 0.0038 },
  { id: 'silver', label: 'Silver', unit: '/ kg', base: 92450, volatility: 0.009 },
  { id: 'platinum', label: 'Platinum', unit: '/ 10g', base: 31640, volatility: 0.006 },
];

interface Tick {
  price: number;
  /** Change against the session open, in rupees. */
  delta: number;
}

/**
 * Indicative metal rates, ticking live.
 *
 * These are illustrative figures generated in the browser, not a market feed —
 * a real one needs a server route and a licensed provider. That is stated in
 * the strip itself rather than left implied, because a number that looks like a
 * quote and is not one is the kind of thing a customer makes a decision on.
 *
 * The walk is seeded from the session open and bounded, so the price wanders
 * plausibly instead of drifting off or jittering symmetrically around a line.
 */
export default function LiveGoldRate({ className = '' }: { className?: string }) {
  const [ticks, setTicks] = useState<Record<string, Tick>>(() =>
    Object.fromEntries(METALS.map((m) => [m.id, { price: m.base, delta: 0 }]))
  );
  const [stamp, setStamp] = useState<string>('');

  useEffect(() => {
    // Rendering a timestamp on the server and again on the client is a
    // guaranteed hydration mismatch, so the first one is written after mount.
    const format = () =>
      new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
    setStamp(format());

    const interval = window.setInterval(() => {
      setTicks((prev) => {
        const next: Record<string, Tick> = {};
        for (const metal of METALS) {
          const current = prev[metal.id]?.price ?? metal.base;
          // Random walk with a pull back toward the open, so a long session
          // does not wander somewhere absurd.
          const drift = (metal.base - current) * 0.06;
          const noise = (Math.random() - 0.5) * metal.base * metal.volatility;
          const price = Math.round(current + drift + noise);
          next[metal.id] = { price, delta: price - metal.base };
        }
        return next;
      });
      setStamp(format());
    }, 3600);

    return () => window.clearInterval(interval);
  }, []);

  const inr = useMemo(
    () =>
      new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }),
    []
  );

  return (
    <div
      className={`hud relative overflow-hidden rounded-2xl ${className}`}
      // Rates update on their own, so assistive tech is told about the region
      // but not interrupted every 3.6 seconds.
      aria-live="off"
    >
      {/* Travelling hairline, so the strip reads as live */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px overflow-hidden"
      >
        <motion.span
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-gold-300 to-transparent"
        />
      </span>

      <div className="flex flex-col gap-4 p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {/* Pulse dot */}
            <span className="relative flex h-2 w-2">
              <span className="animate-pulse-ring absolute inset-0 rounded-full bg-jade-500" />
              <span className="relative h-2 w-2 rounded-full bg-jade-500" />
            </span>
            <span className="font-accent text-[10px] uppercase tracking-luxer text-accent">
              Indicative Rates
            </span>
          </div>

          <span className="font-sans text-[10px] tracking-luxe text-faint tabular-nums">
            {stamp ? `Updated ${stamp} IST` : 'Connecting…'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-5">
          {METALS.map((metal) => {
            const tick = ticks[metal.id] ?? { price: metal.base, delta: 0 };
            const direction = tick.delta === 0 ? 'flat' : tick.delta > 0 ? 'up' : 'down';
            const Icon =
              direction === 'up' ? ArrowUpRight : direction === 'down' ? ArrowDownRight : Minus;
            const tint =
              direction === 'up'
                ? 'text-jade-300'
                : direction === 'down'
                  ? 'text-burgundy-300'
                  : 'text-faint';

            return (
              <div key={metal.id} className="min-w-0">
                <p className="mb-1 truncate font-accent text-[10px] uppercase tracking-luxe text-muted">
                  {metal.label}
                  <span className="ml-1 text-faint">{metal.unit}</span>
                </p>

                {/* Relative, because the outgoing price is taken out of flow
                    with position:absolute so the incoming one does not shift
                    the row — it needs this box as its containing block. */}
                <div className="relative flex items-baseline gap-1.5">
                  {/* The price is keyed on its own value, so each change gets
                      its own enter/exit rather than mutating in place. */}
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={tick.price}
                      initial={{ y: direction === 'down' ? -12 : 12, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: direction === 'down' ? 12 : -12, opacity: 0, position: 'absolute' }}
                      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                      className="font-display text-lg text-primary tabular-nums md:text-xl"
                    >
                      {inr.format(tick.price)}
                    </motion.span>
                  </AnimatePresence>
                </div>

                <p className={`mt-0.5 flex items-center gap-0.5 font-sans text-[10px] tabular-nums ${tint}`}>
                  <Icon size={11} strokeWidth={2} />
                  {tick.delta === 0
                    ? '—'
                    : `${tick.delta > 0 ? '+' : '−'}${inr.format(Math.abs(tick.delta))}`}
                </p>
              </div>
            );
          })}
        </div>

        <p className="font-sans text-[10px] font-light leading-relaxed text-faint">
          Illustrative figures for display only, generated in your browser — not a live market
          feed. Ask our concierge for a firm quotation before purchase.
        </p>
      </div>
    </div>
  );
}
