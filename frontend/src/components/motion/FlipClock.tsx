'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

import { useVisibleInterval } from '@/hooks/useVisibleInterval';

interface FlipClockProps {
  /** ISO date string the clock counts down to. */
  to: string;
  className?: string;
  /** Copy shown once the target has passed. */
  expiredLabel?: string;
  /** Drop the days column for anything under a day away. */
  compact?: boolean;
}

interface Unit {
  key: string;
  label: string;
  value: number;
  /** Digits to pad to, which fixes the column width. */
  pad: number;
}

const remainingFrom = (target: number) => {
  const ms = Math.max(target - Date.now(), 0);
  const total = Math.floor(ms / 1000);
  return {
    expired: ms === 0,
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
};

/**
 * A split-flap countdown, for a launch, a private view, or the close of a
 * commission window.
 *
 * The mechanism is the reason this is not just a number that changes. A real
 * split-flap has four surfaces in play at once: the new digit's top half already
 * standing, the old digit's bottom half still standing, a leaf falling that
 * carries the *old* top, and a leaf rising that carries the *new* bottom. Getting
 * that pairing the wrong way round is what makes most CSS flip clocks look like
 * a card folding rather than a flap dropping.
 *
 * Renders nothing time-dependent until after mount. This project builds as a
 * static export, so a server-rendered countdown would be baked into the HTML at
 * build time and every visitor would see the same stale figure hydrate away.
 */
export default function FlipClock({
  to,
  className = '',
  expiredLabel = 'The doors are open',
  compact = false,
}: FlipClockProps) {
  const target = useMemo(() => new Date(to).getTime(), [to]);
  const [state, setState] = useState<ReturnType<typeof remainingFrom> | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (Number.isNaN(target)) return;
    setState(remainingFrom(target));
  }, [target]);

  // A one-second interval, not a rAF loop: nothing here changes faster than a
  // second, and a 60Hz loop to move a digit once a second is 59 wasted frames.
  // Gated on visibility as well — a countdown is re-read from the clock when it
  // comes back, so nothing drifts by having stopped.
  useVisibleInterval(
    rootRef,
    () => setState(remainingFrom(target)),
    Number.isNaN(target) ? null : 1000
  );

  if (Number.isNaN(target)) return null;

  const units: Unit[] = state
    ? [
        ...(compact && state.days === 0
          ? []
          : [{ key: 'd', label: 'Days', value: state.days, pad: 2 }]),
        { key: 'h', label: 'Hours', value: state.hours, pad: 2 },
        { key: 'm', label: 'Minutes', value: state.minutes, pad: 2 },
        { key: 's', label: 'Seconds', value: state.seconds, pad: 2 },
      ]
    : [
        { key: 'd', label: 'Days', value: 0, pad: 2 },
        { key: 'h', label: 'Hours', value: 0, pad: 2 },
        { key: 'm', label: 'Minutes', value: 0, pad: 2 },
        { key: 's', label: 'Seconds', value: 0, pad: 2 },
      ];

  if (state?.expired) {
    return (
      <div ref={rootRef} className={`flex items-center gap-3 ${className}`}>
        <span
          aria-hidden="true"
          className="block h-2 w-2 animate-pulse-dot rotate-45 bg-accent shadow-[0_0_12px_2px_rgb(var(--gold-500)/0.6)]"
        />
        <span className="font-accent text-[11px] uppercase tracking-luxest text-accent">
          {expiredLabel}
        </span>
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className={`flex items-start gap-2.5 sm:gap-4 ${className}`}
      role="timer"
      aria-live="off"
      aria-label={
        state
          ? `${state.days} days, ${state.hours} hours, ${state.minutes} minutes remaining`
          : 'Counting down'
      }
    >
      {units.map((unit, i) => (
        <div key={unit.key} className="flex items-start gap-2.5 sm:gap-4">
          <div className="flex flex-col items-center gap-2.5">
            <div className="flex gap-1 sm:gap-1.5">
              {String(unit.value)
                .padStart(unit.pad, '0')
                .split('')
                .map((digit, di) => (
                  <Flap key={`${unit.key}-${di}`} digit={digit} idle={!state} />
                ))}
            </div>
            <span className="font-accent text-[8px] uppercase tracking-luxest text-faint sm:text-[9px]">
              {unit.label}
            </span>
          </div>

          {/* Colon between columns, pulsing on the seconds side only */}
          {i < units.length - 1 && (
            <span
              aria-hidden="true"
              className="flex h-[3.25rem] flex-col justify-center gap-2 sm:h-[4.25rem]"
            >
              <span className="block h-1 w-1 rounded-full bg-accent/45" />
              <span className="block h-1 w-1 animate-pulse-dot rounded-full bg-accent/45" />
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */

/** One flap. Owns the outgoing digit so the leaves have something to carry. */
function Flap({ digit, idle }: { digit: string; idle: boolean }) {
  const reduced = useReducedMotion();
  const [prev, setPrev] = useState(digit);
  // A counter rather than the digit itself, so 3 → 3 → 3 (which happens when a
  // slower column is unchanged) does not retrigger, but 9 → 0 → 9 does.
  const [turn, setTurn] = useState(0);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      setPrev(digit);
      return;
    }
    if (digit === prev) return;
    setTurn((n) => n + 1);
    // The leaf animations run 320ms; the resting halves swap once they land, so
    // the flap never shows the new digit before the flap has actually fallen.
    const t = window.setTimeout(() => setPrev(digit), 320);
    return () => window.clearTimeout(t);
  }, [digit, prev]);

  const animate = !reduced && !idle && turn > 0 && digit !== prev;

  return (
    <span className="relative block h-[3.25rem] w-[2.25rem] select-none sm:h-[4.25rem] sm:w-[3rem]">
      {/* Resting top: already shows the incoming digit, waiting to be uncovered */}
      <Half digit={digit} half="top" />
      {/* Resting bottom: still shows the outgoing digit until the leaf lands */}
      <Half digit={prev} half="bottom" />

      {animate && (
        <>
          {/* Falling leaf carries the OLD top */}
          <span
            key={`down-${turn}`}
            className="animate-leaf-flip-down absolute inset-0 origin-bottom"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <Half digit={prev} half="top" leaf />
          </span>

          {/* Rising leaf carries the NEW bottom, and starts as the other lands */}
          <span
            key={`up-${turn}`}
            className="animate-leaf-flip-up absolute inset-0 origin-top"
            style={{ transformStyle: 'preserve-3d', animationDelay: '300ms' }}
          >
            <Half digit={digit} half="bottom" leaf />
          </span>
        </>
      )}

      {/* Hinge line */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 z-20 h-px -translate-y-1/2 bg-canvas/80"
      />
      {/* Rim */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-md ring-1 ring-inset ring-gold-500/20"
      />
    </span>
  );
}

/**
 * Half a digit. The glyph is rendered at full size and the container clips it,
 * which is the only way to keep both halves on the same baseline — rendering a
 * clipped copy at half height distorts the face.
 */
function Half({
  digit,
  half,
  leaf = false,
}: {
  digit: string;
  half: 'top' | 'bottom';
  leaf?: boolean;
}) {
  const isTop = half === 'top';
  return (
    <span
      aria-hidden="true"
      className={`absolute inset-x-0 overflow-hidden ${
        isTop ? 'top-0 rounded-t-md' : 'bottom-0 rounded-b-md'
      } h-1/2 ${leaf ? 'z-10' : ''}`}
      style={{
        backfaceVisibility: 'hidden',
        // The two halves are lit differently: the upper leaf catches light, the
        // lower one sits in its own shadow. A flat plate reads as printed paper.
        background: isTop
          ? 'linear-gradient(180deg, rgb(var(--surface-raised)), rgb(var(--surface)))'
          : 'linear-gradient(180deg, rgb(var(--surface-sunken)), rgb(var(--surface)))',
        boxShadow: isTop
          ? 'inset 0 1px 0 rgb(var(--gold-200) / 0.16)'
          : 'inset 0 -1px 0 rgb(var(--shadow-color) / 0.4)',
      }}
    >
      <span
        className="absolute inset-x-0 flex h-[6.5rem] items-center justify-center font-display text-[2.6rem] leading-none text-primary nums-tabular sm:h-[8.5rem] sm:text-[3.4rem]"
        style={{ top: isTop ? 0 : '-100%' }}
      >
        {digit}
      </span>
    </span>
  );
}
