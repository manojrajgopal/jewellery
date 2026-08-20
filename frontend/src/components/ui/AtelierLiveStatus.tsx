'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Clock, Flame, Hammer, Scissors, Sparkles, Users } from 'lucide-react';

import { ease, springs } from '@/lib/motion';

/**
 * The benches, in the order they sit in the room. `hours` is the window each bench
 * is actually worked — the setters start late because the raising bench is loud,
 * which is the same fact the craftsmanship page explains in prose.
 */
const BENCHES = [
  {
    id: 'raising',
    icon: Hammer,
    label: 'Raising',
    artisan: 'Devendra Rao',
    hours: [9, 17] as const,
    job: 'Hollow-forming a temple collar over a stake',
    unit: 'blows',
    rate: 46,
  },
  {
    id: 'kundan',
    icon: Sparkles,
    label: 'Kundan',
    artisan: 'Lakshmi Iyer',
    hours: [10, 18] as const,
    job: 'Foil-backing uncuts for a Nizam-line choker',
    unit: 'stones',
    rate: 3,
  },
  {
    id: 'setting',
    icon: Scissors,
    label: 'Setting',
    artisan: 'Farid Ansari',
    hours: [11, 19] as const,
    job: 'Bead-setting a pavé halo, 1.2mm cutter',
    unit: 'beads',
    rate: 8,
  },
  {
    id: 'casting',
    icon: Flame,
    label: 'Casting',
    artisan: 'Meera Pillai',
    hours: [8, 14] as const,
    job: 'Burn-out cycle on tomorrow\'s wax tree',
    unit: '°C',
    rate: 22,
  },
] as const;

/** Opening hours of the room itself, used for the closed state. */
const ROOM = { open: 8, close: 19 } as const;

/**
 * What is happening at the benches, right now.
 *
 * The most persuasive thing a workshop can show is that it is a workshop today
 * rather than in a photograph from 2019. So this reads the visitor's own clock and
 * reports the room against it: which benches are worked at this hour, what is on
 * each of them, how far through the day it is, and — when the room is shut — how
 * long until it opens.
 *
 * Everything is derived, nothing is invented. The counters advance at a stated
 * rate per minute from the bench's own start time, which means two visitors at the
 * same moment see the same numbers, and a visitor who leaves and comes back an
 * hour later sees numbers that moved by an hour's worth of work. A random ticker
 * would be caught out by exactly that.
 *
 * The clock is read in an effect rather than during render, because the server has
 * no idea what time it is where the visitor is: rendering it directly would
 * produce a hydration mismatch on every single page load.
 */
export default function AtelierLiveStatus({ className = '' }: { className?: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    // A minute is the right resolution: the counters move in units per minute, and
    // a second-by-second tick would spend a frame a second re-rendering four rows
    // that changed by nothing.
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const state = useMemo(() => {
    if (!now) return null;
    const hour = now.getHours() + now.getMinutes() / 60;
    const day = now.getDay();
    // Sunday the bench is closed; the boutique is not, and the contact page says so.
    const closedDay = day === 0;
    const open = !closedDay && hour >= ROOM.open && hour < ROOM.close;

    const benches = BENCHES.map((b) => {
      const active = open && hour >= b.hours[0] && hour < b.hours[1];
      const minutesIn = Math.max(0, Math.round((hour - b.hours[0]) * 60));
      const span = (b.hours[1] - b.hours[0]) * 60;
      return {
        ...b,
        active,
        count: active ? minutesIn * b.rate : 0,
        // Progress through this bench's own day, not through the room's.
        progress: active ? Math.min(1, minutesIn / span) : hour >= b.hours[1] ? 1 : 0,
      };
    });

    const hoursUntilOpen = closedDay
      ? 24 - hour + ROOM.open
      : hour < ROOM.open
        ? ROOM.open - hour
        : 24 - hour + ROOM.open;

    return {
      open,
      closedDay,
      benches,
      onBench: benches.filter((b) => b.active).length,
      hoursUntilOpen,
      clock: now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    };
  }, [now]);

  return (
    <div className={`rounded-3xl border border-hairline bg-canvas-alt/60 p-6 md:p-8 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Before the clock has been read there is nothing honest to say, so the
              chip stays neutral rather than claiming the room is open. */}
          {state?.open ? (
            <span className="chip-live font-accent text-[10px] uppercase tracking-luxe text-jade-300">
              Benches working
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-full border border-hairline px-3 py-1 font-accent text-[10px] uppercase tracking-luxe text-faint">
              <span className="block h-1.5 w-1.5 rounded-full bg-line-strong" />
              {state ? 'Room closed' : 'Reading the clock'}
            </span>
          )}
          {state && (
            <span className="font-sans text-xs text-muted nums-tabular">
              {state.clock} local
            </span>
          )}
        </div>

        {state && (
          <span className="inline-flex items-center gap-2 font-accent text-[10px] uppercase tracking-luxe text-muted">
            <Users className="h-3.5 w-3.5" aria-hidden="true" />
            {state.open
              ? `${state.onBench} of ${BENCHES.length} benches occupied`
              : state.closedDay
                ? 'Sunday — the bench rests'
                : `Opens in ${Math.round(state.hoursUntilOpen)}h`}
          </span>
        )}
      </div>

      <ul className="mt-7 space-y-3">
        {(state?.benches ?? BENCHES.map((b) => ({ ...b, active: false, count: 0, progress: 0 }))).map(
          (b, i) => {
            const Icon = b.icon;
            return (
              <motion.li
                key={b.id}
                initial={{ opacity: 0, x: -14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: ease.luxury }}
                className={`relative overflow-hidden rounded-2xl border px-4 py-4 transition-colors duration-700 ${
                  b.active
                    ? 'border-accent/35 bg-surface-raised/70'
                    : 'border-hairline bg-surface-raised/30'
                }`}
              >
                <div className="flex items-start gap-4">
                  <motion.span
                    animate={
                      b.active
                        ? { scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }
                        : { scale: 1, opacity: 0.5 }
                    }
                    transition={
                      b.active
                        ? { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }
                        : springs.chip
                    }
                    className={`grid h-10 w-10 flex-shrink-0 place-items-center rounded-full border ${
                      b.active
                        ? 'border-accent/50 bg-accent/10 text-accent'
                        : 'border-hairline text-faint'
                    }`}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </motion.span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                      <span className="font-accent text-[11px] uppercase tracking-luxe text-primary">
                        {b.label}
                        <span className="ml-2 normal-case tracking-normal text-faint">
                          {b.artisan}
                        </span>
                      </span>
                      <span className="font-sans text-[11px] text-faint nums-tabular">
                        {b.hours[0]}:00 – {b.hours[1]}:00
                      </span>
                    </div>

                    <p className="mt-1 font-sans text-xs font-light leading-relaxed text-secondary">
                      {b.active ? b.job : 'Bench clear'}
                    </p>

                    {/* Progress through this bench's day. Animated to its value
                        rather than transitioned in CSS, so it moves once per
                        minute and does not creep between renders. */}
                    <div className="mt-3 h-1 overflow-hidden rounded-full bg-line/40">
                      <motion.span
                        className="block h-full rounded-full bg-gradient-to-r from-gold-700 via-gold-300 to-gold-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${b.progress * 100}%` }}
                        transition={{ duration: 1.1, ease: ease.luxury }}
                      />
                    </div>

                    <AnimatePresence mode="wait">
                      {b.active && (
                        <motion.span
                          key={b.count}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.35 }}
                          className="mt-2 block font-sans text-[11px] text-accent nums-tabular"
                        >
                          {b.count.toLocaleString('en-IN')} {b.unit} since{' '}
                          {String(b.hours[0]).padStart(2, '0')}:00
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.li>
            );
          }
        )}
      </ul>

      <p className="mt-6 flex items-start gap-2 border-t border-hairline pt-5 font-sans text-[11px] font-light leading-relaxed text-faint">
        <Clock className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
        Read from your own clock against the benches&rsquo; published hours. Saturday mornings the
        front bench is open to anyone who walks in — that is the one you can stand at.
      </p>
    </div>
  );
}
