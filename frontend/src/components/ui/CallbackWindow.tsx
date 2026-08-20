'use client';

import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Phone, Video } from 'lucide-react';

import { easeCine } from '@/lib/motion';
import { useToast } from '@/components/providers/ToastProvider';

/**
 * Choosing a half hour when both ends are awake.
 *
 * The site can already book an appointment in the room and report whether the
 * bench is currently working. Neither solves the actual problem for a customer
 * in another country, which is that our hours mean nothing to them and their
 * hours mean nothing to us — and every "preferred time" field on every contact
 * form on the internet quietly assumes one of the two.
 *
 * So the grid is drawn in *both* clocks at once. That is the whole design. A
 * dual-clock grid takes no more space than a single one and removes the
 * arithmetic entirely, and the arithmetic is where these arrangements go wrong —
 * somebody mentally converts a time zone the wrong way about once in every four
 * or five attempts, and it is always the customer who then waits by a phone.
 *
 * Three states per slot rather than two, because "the bench is open but the
 * person who can answer your question is not here" is a real and common
 * situation, and offering it as available produces a call that has to happen
 * twice. The unavailable slots stay visible and greyed rather than being removed:
 * an empty grid teaches nothing, and seeing *why* a slot is out is what lets
 * somebody pick the next best one themselves.
 */
const HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];

/** Named offsets rather than a full tz database — six cities cover almost every
    enquiry we get, and a picker with four hundred entries in it is a worse
    experience than a list of six with an "elsewhere" note underneath. */
const ZONES = [
  { id: 'ist', label: 'India', city: 'Mumbai · Hyderabad', offset: 0 },
  { id: 'gst', label: 'Gulf', city: 'Dubai · Doha', offset: -1.5 },
  { id: 'bst', label: 'United Kingdom', city: 'London', offset: -4.5 },
  { id: 'edt', label: 'US East', city: 'New York · Toronto', offset: -9.5 },
  { id: 'pdt', label: 'US West', city: 'San Francisco', offset: -12.5 },
  { id: 'aest', label: 'Australia', city: 'Sydney · Melbourne', offset: 4.5 },
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

type Slot = 'open' | 'bench-only' | 'closed';

/**
 * Our own availability, by day and hour, in house time. Hand-authored rather
 * than generated: the two long gaps are real — Wednesday afternoons are the
 * setting bench's uninterrupted block, and nobody senior is on the shop floor
 * before ten on a Saturday.
 */
function houseAvailability(dayIndex: number, hour: number): Slot {
  if (hour < 10 || hour >= 19) return 'closed';
  if (dayIndex === 5) {
    // Saturday: open later, and the senior bench is not in at all.
    if (hour < 11) return 'closed';
    if (hour >= 17) return 'closed';
    return 'bench-only';
  }
  if (dayIndex === 2 && hour >= 14 && hour < 17) return 'bench-only';
  if (hour === 13) return 'bench-only';
  return 'open';
}

const SLOT_META: Record<Slot, { label: string; className: string }> = {
  open: {
    label: 'Anyone available',
    className: 'bg-accent/15 border-accent/40 text-primary hover:bg-accent/25',
  },
  'bench-only': {
    label: 'Bench only — no senior advice',
    className: 'bg-surface-raised/40 border-hairline text-muted hover:border-accent/30',
  },
  closed: {
    label: 'Closed',
    className: 'bg-transparent border-hairline/40 text-faint cursor-not-allowed opacity-40',
  },
};

export default function CallbackWindow() {
  const [zoneId, setZoneId] = useState('bst');
  const [mode, setMode] = useState<'call' | 'video'>('call');
  const [picked, setPicked] = useState<{ day: number; hour: number } | null>(null);
  const reduced = useReducedMotion();
  const { toast } = useToast();

  const zone = ZONES.find((z) => z.id === zoneId)!;

  /** Their clock for a given hour of ours, wrapped into a 24-hour day. */
  const theirs = (hour: number) => {
    const raw = hour + zone.offset;
    const wrapped = ((raw % 24) + 24) % 24;
    const h = Math.floor(wrapped);
    const m = Math.round((wrapped - h) * 60);
    return { h, m, day: raw < 0 ? -1 : raw >= 24 ? 1 : 0 };
  };

  const fmt = (h: number, m: number) => `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

  /* A slot is only genuinely offerable if it is also a civil hour at their end.
     Our being open at two in the morning their time is not availability. */
  const civil = (hour: number) => {
    const t = theirs(hour);
    return t.h >= 7 && t.h < 22;
  };

  const bestCount = useMemo(() => {
    let n = 0;
    DAYS.forEach((_, d) =>
      HOURS.forEach((h) => {
        if (houseAvailability(d, h) === 'open' && civil(h)) n += 1;
      })
    );
    return n;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoneId]);

  const confirm = () => {
    if (!picked) return;
    const t = theirs(picked.hour);
    // Both clocks in the confirmation, deliberately. A confirmation naming one
    // time zone is how these arrangements get missed in the first place.
    toast({
      title: 'Window requested',
      message: `${DAYS[picked.day]} ${fmt(t.h, t.m)} your time — ${fmt(picked.hour, 0)} ours. We will confirm by email before we call.`,
      kind: 'success',
    });
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="mb-3 font-accent text-[10px] uppercase tracking-luxe text-accent">
            Where you are
          </p>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Your time zone">
            {ZONES.map((z) => {
              const on = z.id === zoneId;
              return (
                <button
                  key={z.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => {
                    setZoneId(z.id);
                    setPicked(null);
                  }}
                  className={`rounded-full border px-4 py-1.5 text-left font-accent text-[10px] uppercase tracking-luxe transition-colors duration-300 ${
                    on
                      ? 'border-accent bg-accent text-onaccent'
                      : 'border-hairline text-muted hover:border-accent/50 hover:text-accent'
                  }`}
                >
                  {z.label}
                </button>
              );
            })}
          </div>
          <p className="mt-2 font-accent text-[9px] uppercase tracking-luxe text-faint">
            {zone.city} · {zone.offset === 0 ? 'same as us' : `${zone.offset > 0 ? '+' : ''}${zone.offset}h from us`}
          </p>
        </div>

        <div>
          <p className="mb-3 font-accent text-[10px] uppercase tracking-luxe text-accent">How</p>
          <div className="flex gap-2">
            {(
              [
                { id: 'call' as const, label: 'Telephone', Icon: Phone },
                { id: 'video' as const, label: 'Video, with the piece', Icon: Video },
              ]
            ).map((m) => {
              const on = mode === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMode(m.id)}
                  aria-pressed={on}
                  className={`flex items-center gap-2 rounded-full border px-4 py-1.5 font-accent text-[10px] uppercase tracking-luxe transition-colors duration-300 ${
                    on
                      ? 'border-accent text-accent'
                      : 'border-hairline text-muted hover:border-accent/50'
                  }`}
                >
                  <m.Icon className="h-3 w-3" aria-hidden="true" />
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <p className="mt-6 font-sans text-sm font-light leading-relaxed text-muted">
        <span className="nums-instrument text-primary">{bestCount}</span> slots this week where
        somebody who can answer a real question is here and it is still a civil hour where you are.
        Both clocks are shown in every cell, so there is no conversion to get wrong.
      </p>

      {/* The grid. Rows are our hours; each cell prints their time above ours. */}
      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[640px] border-separate border-spacing-1">
          <thead>
            <tr>
              <th className="w-24 text-left font-accent text-[9px] uppercase tracking-luxe text-faint">
                Your time / ours
              </th>
              {DAYS.map((d) => (
                <th
                  key={d}
                  className="pb-2 font-accent text-[9px] uppercase tracking-luxe text-faint"
                >
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HOURS.map((hour) => {
              const t = theirs(hour);
              const ok = civil(hour);
              return (
                <tr key={hour}>
                  <th scope="row" className="pr-3 text-left align-middle">
                    <span
                      className={`nums-instrument block font-accent text-[11px] tracking-wide ${
                        ok ? 'text-primary' : 'text-faint'
                      }`}
                    >
                      {fmt(t.h, t.m)}
                      {t.day === -1 && <sup className="ml-0.5 text-[8px]">prev</sup>}
                      {t.day === 1 && <sup className="ml-0.5 text-[8px]">next</sup>}
                    </span>
                    <span className="nums-instrument block font-accent text-[9px] uppercase tracking-luxe text-faint">
                      {fmt(hour, 0)} ist
                    </span>
                  </th>

                  {DAYS.map((d, di) => {
                    const slot = houseAvailability(di, hour);
                    const selectable = slot !== 'closed' && ok;
                    const on = picked?.day === di && picked?.hour === hour;
                    const meta = SLOT_META[slot];

                    return (
                      <td key={d} className="align-middle">
                        <button
                          type="button"
                          disabled={!selectable}
                          onClick={() => setPicked({ day: di, hour })}
                          aria-label={`${d} ${fmt(t.h, t.m)} your time, ${fmt(hour, 0)} ours — ${
                            !ok ? 'outside civil hours where you are' : meta.label
                          }`}
                          aria-pressed={on}
                          className={`h-9 w-full rounded border transition-colors duration-300 ${
                            on
                              ? 'border-accent bg-accent'
                              : !ok
                                ? 'cursor-not-allowed border-hairline/40 bg-transparent opacity-25'
                                : meta.className
                          }`}
                        >
                          {on && (
                            <span className="font-accent text-[9px] uppercase tracking-luxe text-onaccent">
                              Picked
                            </span>
                          )}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend. Three states, so it needs one. */}
      <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
        {(['open', 'bench-only', 'closed'] as Slot[]).map((s) => (
          <li key={s} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className={`h-3 w-6 rounded border ${SLOT_META[s].className.split(' ').slice(0, 2).join(' ')}`}
            />
            <span className="font-accent text-[9px] uppercase tracking-luxe text-faint">
              {SLOT_META[s].label}
            </span>
          </li>
        ))}
        <li className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="h-3 w-6 rounded border border-hairline/40 opacity-25"
          />
          <span className="font-accent text-[9px] uppercase tracking-luxe text-faint">
            Middle of your night
          </span>
        </li>
      </ul>

      {/* The confirmation, restating both clocks — the single most common failure
          in arranging these is a confirmation that only names one of them. */}
      <motion.div
        initial={false}
        animate={{ opacity: picked ? 1 : 0.45 }}
        transition={reduced ? { duration: 0 } : { duration: 0.4, ease: easeCine.glass }}
        className="mt-8 flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-hairline bg-surface-raised/40 p-6"
      >
        <div>
          <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
            {picked ? 'Your window' : 'Pick a window'}
          </p>
          {picked ? (
            <p className="mt-2 font-display text-xl text-primary">
              {DAYS[picked.day]}{' '}
              <span className="nums-instrument">
                {(() => {
                  const t = theirs(picked.hour);
                  return fmt(t.h, t.m);
                })()}
              </span>{' '}
              where you are
              <span className="block font-sans text-sm font-light text-muted">
                {fmt(picked.hour, 0)} here · {mode === 'video' ? 'video, with the piece on the bench camera' : 'telephone'} · thirty minutes
              </span>
            </p>
          ) : (
            <p className="mt-2 font-sans text-sm font-light leading-relaxed text-muted">
              Any gold cell. We hold the window for you rather than calling &ldquo;sometime that
              morning&rdquo;.
            </p>
          )}
        </div>

        <button
          type="button"
          disabled={!picked}
          onClick={confirm}
          className="rounded-full bg-accent px-7 py-3 font-accent text-[10px] uppercase tracking-luxe text-onaccent transition-opacity duration-300 hover:opacity-90 disabled:opacity-30"
        >
          Request this window
        </button>
      </motion.div>

      <p className="mt-6 font-sans text-sm font-light leading-relaxed text-muted">
        Not in one of those six places? Say the city in the message and we will work it out at our
        end — which is the correct way round, and the reason this grid has six entries rather than
        four hundred.
      </p>
    </div>
  );
}
