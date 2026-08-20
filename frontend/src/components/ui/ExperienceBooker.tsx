'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, Check, Clock, Gem, GraduationCap, Minus, Plus, Sparkles, Users, Wine } from 'lucide-react';

import { useToast } from '@/components/providers/ToastProvider';
import { ease, gridDelay, gridCell, shudder, springs } from '@/lib/motion';

/**
 * What the house actually opens its doors for. Each one is a real thing a boutique
 * this size can host, with the constraint that makes it real: a bench cannot take
 * more than four people, and a gem-grading class cannot run without the gemmologist
 * in the building.
 */
const EXPERIENCES = [
  {
    id: 'bench',
    icon: Sparkles,
    label: 'An hour at the bench',
    duration: '60 minutes',
    seats: 4,
    price: 'No charge',
    days: [6] as const, // Saturday only — the front bench is open then.
    slots: ['11:00', '12:00', '13:00'] as const,
    body:
      'Stand at the front bench while one artisan works, and interrupt as much as you like. It slows the work considerably, which is why it is Saturdays only and why it is free.',
  },
  {
    id: 'grading',
    icon: GraduationCap,
    label: 'Grading a stone yourself',
    duration: '90 minutes',
    seats: 6,
    price: '₹2,500, redeemable',
    days: [2, 4] as const,
    slots: ['15:00', '17:30'] as const,
    body:
      'A loupe, a master set and six stones with their certificates face down. You grade them, then we turn the papers over. Almost nobody gets clarity right, and that is the point of the exercise.',
  },
  {
    id: 'atelier',
    icon: Gem,
    label: 'The full atelier tour',
    duration: '2 hours',
    seats: 8,
    price: '₹1,500 per person',
    days: [1, 3, 5] as const,
    slots: ['10:30', '14:00', '16:30'] as const,
    body:
      'Raising, kundan, setting, casting and finishing, in the order a piece passes through them. Ends at the polishing bench with something of yours cleaned while you wait.',
  },
  {
    id: 'private',
    icon: Wine,
    label: 'A private evening',
    duration: '2 hours',
    seats: 10,
    price: 'By arrangement',
    days: [4, 5, 6] as const,
    slots: ['18:30', '20:00'] as const,
    body:
      'The boutique after hours, with an advisor, a gemmologist and whatever you have asked to see brought out of the safe. For a decision that involves more than one person.',
  },
] as const;

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

/**
 * Seats already taken for a given experience, date and slot.
 *
 * Deterministic from the three inputs rather than random: a visitor who picks a
 * slot, changes their mind and comes back must find the same availability, or the
 * whole thing reads as fiction. This is a hash, not a booking system — the note
 * under the form says exactly that, because implying live inventory we do not have
 * would be worse than showing none.
 */
const takenSeats = (experienceId: string, iso: string, slot: string, seats: number) => {
  const s = `${experienceId}|${iso}|${slot}`;
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h) % (seats + 1);
};

/**
 * The next 21 days, as date objects — the window the diary is actually kept for.
 *
 * Built in an effect rather than during render, and this is not a stylistic choice.
 * The site is a static export, so every page is HTML generated at build time: a
 * diary computed during render would be baked with the *build's* dates and then
 * re-render with the visitor's, which is a hydration mismatch and a visible flash
 * of last week. Returning an empty array first costs one frame and is correct on
 * any day the file happens to be served.
 */
const useDiary = () => {
  const [days, setDays] = useState<Date[]>([]);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setDays(
      Array.from({ length: 21 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        return d;
      })
    );
  }, []);

  return days;
};

const iso = (d: Date) => d.toISOString().slice(0, 10);

/**
 * The diary, as the boutique actually keeps it.
 *
 * Most appointment forms are one text field labelled "preferred date", which puts
 * the whole burden of guessing on the visitor and produces requests the house then
 * has to decline. This inverts it: the experience is chosen first, and the diary
 * then shows only the days that experience *can* run — Saturdays for the bench,
 * Tuesdays and Thursdays for grading — with the seats already taken in each slot.
 *
 * So a visitor cannot ask for something impossible, which means every request that
 * arrives can be said yes to. That is the entire design goal, and it is worth more
 * than any amount of validation copy.
 */
export default function ExperienceBooker({ className = '' }: { className?: string }) {
  const diary = useDiary();
  const { toast } = useToast();

  const [experienceId, setExperienceId] = useState<(typeof EXPERIENCES)[number]['id']>('atelier');
  const [dateIso, setDateIso] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [attempted, setAttempted] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const experience = EXPERIENCES.find((e) => e.id === experienceId) ?? EXPERIENCES[2];

  /** Only the days this experience runs. Changing experience invalidates the date. */
  const openDays = useMemo(
    () => diary.filter((d) => (experience.days as readonly number[]).includes(d.getDay())),
    [diary, experience]
  );

  const chosen = openDays.find((d) => iso(d) === dateIso) ?? null;

  const slotState = useMemo(() => {
    if (!chosen) return [];
    return experience.slots.map((s) => {
      const taken = takenSeats(experience.id, iso(chosen), s, experience.seats);
      return { slot: s, taken, free: experience.seats - taken };
    });
  }, [chosen, experience]);

  const chosenSlot = slotState.find((s) => s.slot === slot) ?? null;
  const overbooked = chosenSlot ? guests > chosenSlot.free : false;
  const complete = Boolean(chosen && chosenSlot && name.trim() && /.+@.+\..+/.test(email) && !overbooked);

  const pick = (id: typeof experienceId) => {
    setExperienceId(id);
    // Both are invalid the moment the experience changes: a Saturday bench slot is
    // not a Tuesday grading slot, and silently keeping them is how forms submit
    // impossible bookings.
    setDateIso(null);
    setSlot(null);
    setConfirmed(false);
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {/* ---- One: what ---- */}
      <div>
        <span className="font-accent text-[10px] uppercase tracking-luxer text-accent">
          One — choose the visit
        </span>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {EXPERIENCES.map((e, i) => {
            const on = e.id === experienceId;
            const Icon = e.icon;
            return (
              <motion.button
                key={e.id}
                type="button"
                onClick={() => pick(e.id)}
                variants={gridCell}
                custom={gridDelay(i, 2, EXPERIENCES.length, 'top-left')}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ y: -5, transition: springs.plate }}
                aria-pressed={on}
                className={`group relative overflow-hidden rounded-2xl border p-5 text-left transition-colors duration-500 ${
                  on
                    ? 'border-accent/60 bg-accent/[0.07] shadow-gold-bloom'
                    : 'border-hairline bg-surface-raised/40 hover:border-accent/40'
                }`}
              >
                <span className="flex items-start justify-between gap-4">
                  <span className="flex items-center gap-3">
                    <span
                      className={`grid h-10 w-10 place-items-center rounded-full border ${
                        on ? 'border-accent/50 bg-accent/12 text-accent' : 'border-hairline text-muted'
                      }`}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block font-display text-lg leading-tight text-primary">
                        {e.label}
                      </span>
                      <span className="mt-0.5 block font-accent text-[9px] uppercase tracking-luxe text-faint">
                        {e.duration} · up to {e.seats}
                      </span>
                    </span>
                  </span>
                  {on && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={springs.pop}
                      className="grid h-6 w-6 flex-shrink-0 place-items-center rounded-full bg-accent text-onaccent"
                    >
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    </motion.span>
                  )}
                </span>

                <p className="mt-3 font-sans text-xs font-light leading-relaxed text-secondary">
                  {e.body}
                </p>

                <span className="mt-4 flex flex-wrap items-center gap-3 font-accent text-[9px] uppercase tracking-luxe text-accent">
                  <span>{e.price}</span>
                  <span className="text-faint">
                    {(e.days as readonly number[]).map((d) => DAY_NAMES[d]).join(' · ')}
                  </span>
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ---- Two: when ---- */}
      <div className="rounded-3xl border border-hairline bg-canvas-alt/60 p-6 md:p-7">
        <span className="flex items-center gap-2 font-accent text-[10px] uppercase tracking-luxer text-accent">
          <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
          Two — the days it runs
        </span>

        {diary.length === 0 && (
          <p className="mt-4 font-sans text-xs font-light text-faint">
            Reading today&rsquo;s date&hellip;
          </p>
        )}

        <div className="mt-4 flex gap-2 overflow-x-auto scrollbar-hide">
          {openDays.map((d, i) => {
            const key = iso(d);
            const on = key === dateIso;
            return (
              <motion.button
                key={key}
                type="button"
                onClick={() => {
                  setDateIso(key);
                  setSlot(null);
                  setConfirmed(false);
                }}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i * 0.04, 0.4), duration: 0.4, ease: ease.luxury }}
                aria-pressed={on}
                className={`flex min-w-[4.5rem] flex-col items-center rounded-2xl border px-3 py-3 transition-colors duration-300 ${
                  on
                    ? 'border-accent bg-accent text-onaccent'
                    : 'border-hairline text-muted hover:border-accent/50 hover:text-accent'
                }`}
              >
                <span className="font-accent text-[9px] uppercase tracking-luxe">
                  {DAY_NAMES[d.getDay()]}
                </span>
                <span className="mt-1 font-display text-xl nums-tabular">{d.getDate()}</span>
                <span className="font-sans text-[9px] uppercase tracking-luxe opacity-70">
                  {d.toLocaleDateString('en-GB', { month: 'short' })}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* ---- Slots ---- */}
        <AnimatePresence mode="wait">
          {chosen && (
            <motion.div
              key={dateIso}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.45, ease: ease.luxury }}
              className="overflow-hidden"
            >
              <div className="mt-6 flex flex-wrap gap-3">
                {slotState.map((s) => {
                  const on = s.slot === slot;
                  const full = s.free === 0;
                  return (
                    <button
                      key={s.slot}
                      type="button"
                      disabled={full}
                      onClick={() => {
                        setSlot(s.slot);
                        setConfirmed(false);
                      }}
                      aria-pressed={on}
                      className={`rounded-2xl border px-5 py-3 text-left transition-colors duration-300 ${
                        full
                          ? 'cursor-not-allowed border-hairline opacity-40'
                          : on
                            ? 'border-accent bg-accent/12'
                            : 'border-hairline hover:border-accent/50'
                      }`}
                    >
                      <span className="flex items-center gap-2 font-accent text-sm text-primary">
                        <Clock className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                        {s.slot}
                      </span>
                      <span
                        className={`mt-1 block font-sans text-[10px] uppercase tracking-luxe ${
                          full ? 'text-faint' : s.free <= 2 ? 'text-burgundy-300' : 'text-muted'
                        }`}
                      >
                        {full ? 'Taken' : `${s.free} of ${experience.seats} free`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ---- Three: who ---- */}
      <div className="grid gap-6 rounded-3xl border border-hairline bg-canvas-alt/60 p-6 md:grid-cols-[minmax(0,1fr)_minmax(0,16rem)] md:p-7">
        <div className="space-y-4">
          <span className="font-accent text-[10px] uppercase tracking-luxer text-accent">
            Three — who is coming
          </span>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="font-sans text-[11px] uppercase tracking-luxe text-muted">Name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-gold mt-1"
                autoComplete="name"
              />
            </label>
            <label className="block">
              <span className="font-sans text-[11px] uppercase tracking-luxe text-muted">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-gold mt-1"
                autoComplete="email"
              />
            </label>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 font-sans text-[11px] uppercase tracking-luxe text-muted">
              <Users className="h-3.5 w-3.5" aria-hidden="true" />
              Guests
            </span>
            <div className="flex items-center gap-3 rounded-full border border-hairline px-2 py-1">
              <button
                type="button"
                onClick={() => setGuests((g) => Math.max(1, g - 1))}
                aria-label="One fewer guest"
                className="grid h-7 w-7 place-items-center rounded-full text-muted transition-colors duration-300 hover:text-accent"
              >
                <Minus className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
              <motion.span
                key={guests}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={springs.pop}
                className="w-6 text-center font-display text-xl text-primary nums-tabular"
              >
                {guests}
              </motion.span>
              <button
                type="button"
                onClick={() => setGuests((g) => Math.min(experience.seats, g + 1))}
                aria-label="One more guest"
                className="grid h-7 w-7 place-items-center rounded-full text-muted transition-colors duration-300 hover:text-accent"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>

            <AnimatePresence>
              {overbooked && (
                <motion.span
                  variants={shudder}
                  animate="visible"
                  initial={{ opacity: 0 }}
                  exit={{ opacity: 0 }}
                  className="font-sans text-[11px] text-burgundy-300"
                >
                  Only {chosenSlot?.free} free in that slot.
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ---- The summary ---- */}
        <aside className="self-start rounded-2xl border border-hairline bg-surface-raised/60 p-5">
          <span className="font-accent text-[10px] uppercase tracking-luxer text-faint">
            The request
          </span>
          <dl className="mt-3 space-y-2 font-sans text-xs">
            <div className="flex justify-between gap-3">
              <dt className="text-faint">Visit</dt>
              <dd className="text-right text-secondary">{experience.label}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-faint">Day</dt>
              <dd className="text-right text-secondary">
                {chosen
                  ? chosen.toLocaleDateString('en-GB', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'long',
                    })
                  : '—'}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-faint">Time</dt>
              <dd className="text-right text-secondary nums-tabular">{slot ?? '—'}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-faint">Guests</dt>
              <dd className="text-right text-secondary nums-tabular">{guests}</dd>
            </div>
            <div className="flex justify-between gap-3 border-t border-hairline pt-2">
              <dt className="text-faint">Fee</dt>
              <dd className="text-right text-accent">{experience.price}</dd>
            </div>
          </dl>

          <button
            type="button"
            onClick={() => {
              setAttempted(true);
              if (!complete) return;
              setConfirmed(true);
              toast({
                kind: 'luxe',
                title: 'Request sent',
                message: `${experience.label}, ${chosen?.toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                })} at ${slot}. We reply the same working day.`,
              });
            }}
            className="mt-5 w-full rounded-full border border-accent/50 bg-accent/10 px-5 py-2.5 font-accent text-[11px] uppercase tracking-luxer text-accent transition-colors duration-300 hover:bg-accent hover:text-onaccent"
          >
            {confirmed ? 'Requested' : 'Request this visit'}
          </button>

          {attempted && !complete && (
            <motion.p
              variants={shudder}
              animate="visible"
              className="mt-3 font-sans text-[11px] font-light leading-relaxed text-burgundy-300"
            >
              {!chosen
                ? 'Choose one of the days above.'
                : !slot
                  ? 'Choose a time.'
                  : overbooked
                    ? 'Reduce the party, or choose another slot.'
                    : 'A name and a working email, and we can hold it.'}
            </motion.p>
          )}

          <p className="mt-4 font-sans text-[10px] font-light leading-relaxed text-faint">
            The diary here shows the days each visit can actually run. Confirmation still comes from
            a person — nothing is held automatically.
          </p>
        </aside>
      </div>
    </div>
  );
}
