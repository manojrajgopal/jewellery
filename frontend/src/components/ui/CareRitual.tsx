'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Ban, Check, Pause, Play, RotateCcw, ShieldAlert } from 'lucide-react';
import { careSteps } from '@/data/atelier';
import { gems } from '@/data/gems';

interface CareRitualProps {
  className?: string;
  /** Pre-select a stone, e.g. from a product page. */
  stoneId?: string;
}

/**
 * The care ritual, run as a timed sequence with the unsafe steps struck out for
 * whichever stone the visitor owns.
 *
 * The stone selector is the point of the whole component. A generic care guide
 * tells everyone to soak their jewellery in warm water, and for an emerald, an
 * opal, a pearl or a tanzanite that advice is actively damaging. Here, choosing a
 * stone marks the steps that stone cannot take, refuses to run them, and says
 * why — which is the difference between a care guide and a liability.
 *
 * The timer counts real seconds so it can actually be followed at a sink, and it
 * skips a blocked step rather than pausing on one. It ticks on an interval rather
 * than a rAF loop: nothing here changes faster than once a second, and a 60Hz loop
 * to move a countdown by one is fifty-nine wasted frames.
 */
export default function CareRitual({ className = '', stoneId }: CareRitualProps) {
  const [stone, setStone] = useState<string>(stoneId ?? 'diamond');
  const [active, setActive] = useState(0);
  const [running, setRunning] = useState(false);
  const [remaining, setRemaining] = useState(careSteps[0].minutes * 60);
  const [done, setDone] = useState<string[]>([]);

  const blocked = useMemo(
    () => new Set(careSteps.filter((s) => s.unsafeFor?.includes(stone)).map((s) => s.id)),
    [stone]
  );

  const selectedGem = gems.find((g) => g.id === stone);
  const step = careSteps[active];
  const isBlocked = blocked.has(step.id);

  /** The next step this stone is actually allowed to take. */
  const nextAllowed = useCallback(
    (from: number) => {
      for (let i = from; i < careSteps.length; i++) {
        if (!blocked.has(careSteps[i].id)) return i;
      }
      return -1;
    },
    [blocked]
  );

  // Changing stone can strand the ritual on a step that is now unsafe, so the
  // position is moved forward rather than left sitting on a struck-out step.
  useEffect(() => {
    if (!blocked.has(careSteps[active].id)) return;
    const next = nextAllowed(active + 1);
    setRunning(false);
    if (next >= 0) {
      setActive(next);
      setRemaining(careSteps[next].minutes * 60);
    }
    // `active` is read but deliberately not depended on: this should fire when the
    // stone changes, not every time the visitor steps forward.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocked, nextAllowed]);

  const advance = useCallback(() => {
    setDone((d) => (d.includes(careSteps[active].id) ? d : [...d, careSteps[active].id]));
    const next = nextAllowed(active + 1);
    if (next < 0) {
      setRunning(false);
      return;
    }
    setActive(next);
    setRemaining(careSteps[next].minutes * 60);
  }, [active, nextAllowed]);

  useEffect(() => {
    if (!running) return;
    const t = window.setInterval(() => {
      setRemaining((r) => {
        if (r > 1) return r - 1;
        // Landing on zero completes the step and rolls on, so a visitor who set
        // it going at the sink never has to come back and press anything.
        advance();
        return 0;
      });
    }, 1000);
    return () => window.clearInterval(t);
  }, [running, advance]);

  const goTo = (i: number) => {
    if (blocked.has(careSteps[i].id)) return;
    setActive(i);
    setRemaining(careSteps[i].minutes * 60);
    setRunning(false);
  };

  const reset = () => {
    const first = nextAllowed(0);
    setActive(first < 0 ? 0 : first);
    setRemaining(careSteps[first < 0 ? 0 : first].minutes * 60);
    setRunning(false);
    setDone([]);
  };

  const total = step.minutes * 60;
  const progress = total === 0 ? 0 : 1 - remaining / total;
  const allowedCount = careSteps.length - blocked.size;
  const mm = Math.floor(remaining / 60);
  const ss = remaining % 60;

  // Ring geometry. r=52 in a 120 box leaves room for the 6px stroke.
  const R = 52;
  const CIRC = 2 * Math.PI * R;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-hairline bg-surface-raised/60 p-6 backdrop-blur-xl md:p-8 ${className}`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-spotlight-soft opacity-[var(--bloom)]"
      />

      <header className="relative mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-xl font-light text-primary md:text-2xl">
            The Care Ritual
          </h3>
          <p className="mt-1 font-sans text-[11px] font-light text-muted">
            Twenty-four minutes, once a season. Tell us the stone and we will strike out
            what it cannot take.
          </p>
        </div>
        <button
          onClick={reset}
          aria-label="Start the ritual again"
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-hairline text-faint transition-colors hover:border-gold-500/40 hover:text-accent"
        >
          <RotateCcw size={14} strokeWidth={1.7} />
        </button>
      </header>

      {/* Stone selector */}
      <div className="relative mb-7">
        <label
          htmlFor="care-stone"
          className="mb-2 block font-accent text-[10px] uppercase tracking-luxe text-muted"
        >
          Your stone
        </label>
        <div className="flex flex-wrap gap-2">
          {gems.map((g) => (
            <button
              key={g.id}
              onClick={() => setStone(g.id)}
              aria-pressed={stone === g.id}
              className={`group flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3.5 transition-all duration-300 ${
                stone === g.id
                  ? 'border-gold-500/55 bg-gold-500/10'
                  : 'border-hairline hover:border-gold-500/35'
              }`}
            >
              <span
                aria-hidden="true"
                className={`block h-5 w-5 flex-shrink-0 bg-gradient-to-br ${g.swatch} ${g.cut}`}
              />
              <span
                className={`font-accent text-[9px] uppercase tracking-luxe ${
                  stone === g.id ? 'text-accent' : 'text-muted group-hover:text-accent'
                }`}
              >
                {g.name.split(' ').slice(-1)[0]}
              </span>
            </button>
          ))}
        </div>

        {blocked.size > 0 && selectedGem && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 flex items-start gap-2 rounded-lg border border-burgundy-500/25 bg-burgundy-900/10 p-3 font-sans text-[11px] font-light leading-relaxed text-secondary"
          >
            <ShieldAlert
              size={13}
              strokeWidth={1.8}
              className="mt-0.5 flex-shrink-0 text-burgundy-300"
            />
            <span>
              <strong className="font-normal text-primary">{selectedGem.name}:</strong>{' '}
              {selectedGem.care} {blocked.size} of {careSteps.length} steps are struck out
              below.
            </span>
          </motion.p>
        )}
      </div>

      <div className="relative grid gap-8 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-10">
        {/* ---- Timer ---- */}
        <div className="flex flex-col items-center">
          <div className="relative h-[7.5rem] w-[7.5rem]">
            <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
              <circle
                cx="60"
                cy="60"
                r={R}
                fill="none"
                stroke="rgb(var(--border))"
                strokeWidth="5"
              />
              <motion.circle
                cx="60"
                cy="60"
                r={R}
                fill="none"
                stroke="rgb(var(--accent))"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={CIRC}
                // Drawn from the dash offset rather than by rotating a wedge, so
                // the cap stays round at both ends of the arc.
                animate={{ strokeDashoffset: CIRC * (1 - progress) }}
                transition={{ duration: 0.9, ease: 'linear' }}
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="nums-tabular font-display text-2xl text-primary">
                {mm}:{String(ss).padStart(2, '0')}
              </span>
              <span className="font-accent text-[8px] uppercase tracking-luxe text-faint">
                Step {careSteps.indexOf(step) + 1}
              </span>
            </div>

            {running && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 animate-pulse-ring rounded-full border border-accent/30"
              />
            )}
          </div>

          <button
            onClick={() => setRunning((v) => !v)}
            disabled={isBlocked}
            className="group mt-5 inline-flex items-center gap-2.5 rounded-full bg-accent px-6 py-3 font-accent text-[10px] uppercase tracking-luxe text-onaccent shadow-gold transition-shadow hover:shadow-gold-lg disabled:opacity-40 disabled:shadow-none"
          >
            {running ? (
              <Pause size={13} strokeWidth={2} />
            ) : (
              <Play size={13} strokeWidth={2} />
            )}
            {running ? 'Pause' : remaining === total ? 'Begin' : 'Resume'}
          </button>

          <button
            onClick={advance}
            className="mt-3 font-sans text-[11px] font-light text-faint underline decoration-dotted underline-offset-4 transition-colors hover:text-accent"
          >
            Skip this step
          </button>

          <p className="mt-5 text-center font-accent text-[9px] uppercase tracking-luxe text-faint">
            {done.length} of {allowedCount} done
          </p>
        </div>

        {/* ---- Steps ---- */}
        <ol className="flex flex-col gap-2">
          {careSteps.map((s, i) => {
            const off = blocked.has(s.id);
            const isActive = i === active;
            const complete = done.includes(s.id);

            return (
              <li key={s.id}>
                <button
                  onClick={() => goTo(i)}
                  disabled={off}
                  aria-current={isActive}
                  className={`w-full rounded-xl border p-4 text-left transition-all duration-400 ${
                    off
                      ? 'cursor-not-allowed border-burgundy-500/20 bg-burgundy-900/[0.06] opacity-60'
                      : isActive
                        ? 'border-gold-500/50 bg-gold-500/[0.07]'
                        : 'border-hairline hover:border-gold-500/35'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Marker */}
                    <span
                      aria-hidden="true"
                      className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border text-[9px] ${
                        off
                          ? 'border-burgundy-500/40 text-burgundy-300'
                          : complete
                            ? 'border-jade-500/50 bg-jade-900/25 text-jade-300'
                            : isActive
                              ? 'border-gold-500/60 bg-gold-500/15 text-accent'
                              : 'border-hairline text-faint'
                      }`}
                    >
                      {off ? (
                        <Ban size={11} strokeWidth={2} />
                      ) : complete ? (
                        <Check size={11} strokeWidth={2.4} />
                      ) : (
                        i + 1
                      )}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                        <span
                          className={`font-accent text-[11px] uppercase tracking-luxe ${
                            off
                              ? 'text-burgundy-300 line-through decoration-burgundy-500/50'
                              : isActive
                                ? 'text-accent'
                                : 'text-secondary'
                          }`}
                        >
                          {s.title}
                        </span>
                        <span className="nums-tabular font-sans text-[10px] font-light text-faint">
                          {s.minutes} min
                        </span>
                      </div>

                      <AnimatePresence initial={false}>
                        {(isActive || off) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                          >
                            {off ? (
                              <p className="pt-2 font-sans text-[11px] font-light leading-relaxed text-burgundy-300">
                                Not for {selectedGem?.name.toLowerCase()}. Skip it — the
                                brush and the blot are enough.
                              </p>
                            ) : (
                              <>
                                <p className="pt-2 font-sans text-xs font-light leading-relaxed text-muted">
                                  {s.instruction}
                                </p>
                                <p className="mt-2 flex items-start gap-1.5 font-sans text-[11px] font-light leading-relaxed text-burgundy-300">
                                  <Ban
                                    size={11}
                                    strokeWidth={2}
                                    className="mt-0.5 flex-shrink-0"
                                  />
                                  {s.avoid}
                                </p>
                              </>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
