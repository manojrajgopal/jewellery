'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { useToast } from '@/components/providers/ToastProvider';

/**
 * The house diary: dated events, with the constraint that makes each one real.
 *
 * `ExperienceBooker` on this page books the standing experiences — the things
 * that happen whenever somebody asks for them. This is the other kind: events
 * that happen once, on a date, because somebody has flown in or a parcel is in
 * the building for a fortnight and then it is not.
 *
 * The field that makes it worth building is `seats`, and specifically the fact
 * that the numbers are small and stated. A stone-sourcing viewing takes six
 * people because there are six chairs round the table and the parcel does not
 * leave it. An engraving demonstration takes twelve because that is how many
 * can see a graver at working distance. Publishing the real number is the
 * difference between an invitation and a marketing email, and it is also the
 * reason these fill.
 *
 * `registered` is held in component state only. Nothing here posts anywhere —
 * the panel says so at the foot rather than implying a booking has been made,
 * which is the one thing a calendar like this must never be vague about.
 */

interface Event {
  id: string;
  title: string;
  /** ISO date, and the day of the week is derived rather than typed. */
  date: string;
  window: string;
  kind: 'viewing' | 'bench' | 'lecture' | 'clinic';
  seats: number;
  taken: number;
  who: string;
  detail: string;
  /** The honest constraint. Every event has one. */
  constraint: string;
}

const EVENTS: Event[] = [
  {
    id: 'parcel-oct',
    title: 'Burmese ruby parcel, viewing',
    date: '2026-09-12',
    window: '11:00 – 16:00',
    kind: 'viewing',
    seats: 6,
    taken: 4,
    who: 'With our Bangkok sourcing partner, in the building for four days',
    detail:
      'Eighteen unheated stones between 0.8 and 3.4 carats, laid out under daylight-balanced light and under tungsten, because they are not the same stone under the two. Every one has a laboratory report and every report is on the table beside it.',
    constraint:
      'Six chairs, and the parcel does not leave the table. If you cannot make the date the stones will be gone — a parcel like this is with us for four days and then it is somebody else’s.',
  },
  {
    id: 'engraving-oct',
    title: 'Hand engraving, at the bench',
    date: '2026-09-27',
    window: '15:00 – 17:00',
    kind: 'bench',
    seats: 12,
    taken: 7,
    who: 'Shalini Rao, who has cut for this house for nineteen years',
    detail:
      'A graver, a copper practice plate and two hours. You will cut a straight line badly, then a slightly less bad one, and you will leave understanding exactly why hand engraving costs what it costs. Everyone takes their plate home.',
    constraint:
      'Twelve, because that is how many people can see a graver at working distance. Beyond that you are watching a screen, and you can do that anywhere.',
  },
  {
    id: 'pearl-nov',
    title: 'Grading pearls, with a strand in your hands',
    date: '2026-10-08',
    window: '17:30 – 19:00',
    kind: 'lecture',
    seats: 16,
    taken: 3,
    who: 'Our buyer, back from Hyderabad',
    detail:
      'Six strands on the table, ranging from ordinary to genuinely fine, with the prices covered. You will sort them into order before anybody tells you anything. Most people get the top and the bottom right and the middle four wrong, which is the entire lesson.',
    constraint:
      'Sixteen, and the strands are passed hand to hand — this does not work as a demonstration from the front of a room.',
  },
  {
    id: 'clinic-nov',
    title: 'Open repair clinic',
    date: '2026-10-19',
    window: '10:00 – 18:00',
    kind: 'clinic',
    seats: 40,
    taken: 22,
    who: 'Three benches, running all day',
    detail:
      'Bring anything, from anywhere, made by anyone. Free assessment, a written estimate, and a great deal of small work — tightened claws, a re-threaded strand, a cleaned setting — done while you wait at no charge. We do this twice a year and it is the busiest day in the diary.',
    constraint:
      'Forty slots across eight hours, and structural work goes on the book rather than being done on the day. If a claw has actually gone, that is a bench job and not a clinic one.',
  },
  {
    id: 'archive-dec',
    title: 'The archive, opened',
    date: '2026-11-14',
    window: '18:00 – 20:00',
    kind: 'viewing',
    seats: 20,
    taken: 11,
    who: 'The fourth generation, in person',
    detail:
      'The drawing books from 1892 onward, out of the cabinet and on the table. Commission ledgers, the wartime years when the workshop made almost nothing, and the 1978 order book that is the single strangest object in this building.',
    constraint:
      'Twenty, cotton gloves provided, and no photography of the ledgers — they carry customers’ names and addresses and some of those customers have grandchildren.',
  },
];

const KIND: Record<Event['kind'], { label: string; tone: string }> = {
  viewing: { label: 'Viewing', tone: 'var(--series-1)' },
  bench: { label: 'At the bench', tone: 'var(--series-2)' },
  lecture: { label: 'Talk', tone: 'var(--series-3)' },
  clinic: { label: 'Clinic', tone: 'var(--series-4)' },
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function TrunkShowCalendar({ className = '' }: { className?: string }) {
  const { toast } = useToast();
  const [open, setOpen] = useState<string | null>(EVENTS[0].id);
  const [held, setHeld] = useState<string[]>([]);
  const [filter, setFilter] = useState<Event['kind'] | 'all'>('all');

  const visible = useMemo(
    () => (filter === 'all' ? EVENTS : EVENTS.filter((e) => e.kind === filter)),
    [filter]
  );

  const hold = (event: Event) => {
    if (held.includes(event.id)) return;
    setHeld((current) => [...current, event.id]);
    toast({
      title: 'Place held',
      message: `${event.title} — we will confirm by telephone within a working day.`,
      kind: 'luxe',
    });
  };

  return (
    <div className={className}>
      <div className="mb-6 flex flex-wrap gap-2">
        {(['all', 'viewing', 'bench', 'lecture', 'clinic'] as const).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setFilter(k)}
            aria-pressed={filter === k}
            className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-accent text-[10px] uppercase tracking-luxe transition-colors duration-300 ${
              filter === k
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-hairline text-muted hover:border-accent/50 hover:text-accent'
            }`}
          >
            {k !== 'all' && (
              <span
                className="series-swatch"
                style={{ background: `rgb(${KIND[k].tone})` }}
                aria-hidden="true"
              />
            )}
            {k === 'all' ? 'Everything' : KIND[k].label}
          </button>
        ))}
      </div>

      <div className="divide-y divide-line-subtle border-y border-line-subtle">
        {visible.map((event) => {
          const d = new Date(`${event.date}T00:00:00`);
          const isOpen = open === event.id;
          const kind = KIND[event.kind];
          const left = event.seats - event.taken - (held.includes(event.id) ? 1 : 0);
          const nearlyFull = left <= 3;

          return (
            <div key={event.id}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : event.id)}
                aria-expanded={isOpen}
                className="group grid w-full grid-cols-[auto_1fr_auto] items-center gap-5 py-5 text-left"
              >
                {/* The date, as a torn calendar leaf. */}
                <span className="spec-plate flex h-16 w-16 flex-col items-center justify-center">
                  <span className="nums-instrument font-display text-2xl leading-none text-primary">
                    {d.getDate()}
                  </span>
                  <span className="mt-0.5 font-accent text-[9px] uppercase tracking-luxe text-accent">
                    {MONTHS[d.getMonth()]}
                  </span>
                </span>

                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span
                      className="series-swatch"
                      style={{ background: `rgb(${kind.tone})` }}
                      aria-hidden="true"
                    />
                    <span className="font-accent text-[9px] uppercase tracking-luxe text-faint">
                      {kind.label} · {DAYS[d.getDay()]} · {event.window}
                    </span>
                  </span>
                  <span className="mt-1 block font-display text-xl text-primary transition-colors group-hover:text-accent md:text-2xl">
                    {event.title}
                  </span>
                  <span className="mt-1 block font-sans text-sm font-light text-muted">
                    {event.who}
                  </span>
                </span>

                <span className="text-right">
                  <span
                    className={`nums-instrument block font-display text-2xl ${
                      nearlyFull ? 'text-accent' : 'text-primary'
                    }`}
                  >
                    {Math.max(0, left)}
                  </span>
                  <span className="font-accent text-[9px] uppercase tracking-luxe text-faint">
                    of {event.seats} left
                  </span>
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="grid gap-6 pb-7 md:grid-cols-[minmax(0,1fr)_minmax(0,18rem)]">
                      <div>
                        <p className="font-sans text-sm font-light leading-relaxed text-muted">
                          {event.detail}
                        </p>
                        <p className="mt-4 border-l-2 border-accent/40 pl-4 font-sans text-sm font-light italic leading-relaxed text-muted">
                          {event.constraint}
                        </p>
                      </div>

                      <div className="spec-plate flex flex-col justify-between gap-4 p-4">
                        {/* Occupancy, as a bar. One measure, one axis, and the
                            figure printed beside it rather than inferred. */}
                        <div>
                          <div className="flex items-baseline justify-between">
                            <span className="font-accent text-[9px] uppercase tracking-luxe text-faint">
                              Taken
                            </span>
                            <span className="nums-instrument font-accent text-[9px] text-primary">
                              {event.taken + (held.includes(event.id) ? 1 : 0)} / {event.seats}
                            </span>
                          </div>
                          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-sunken">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ background: `rgb(${kind.tone})` }}
                              animate={{
                                width: `${
                                  ((event.taken + (held.includes(event.id) ? 1 : 0)) /
                                    event.seats) *
                                  100
                                }%`,
                              }}
                              transition={{ type: 'spring', stiffness: 180, damping: 26 }}
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => hold(event)}
                          disabled={held.includes(event.id) || left <= 0}
                          className={`w-full rounded-full border px-5 py-2.5 font-accent text-[10px] uppercase tracking-luxe transition-colors duration-300 ${
                            held.includes(event.id)
                              ? 'border-accent/40 bg-accent/10 text-accent'
                              : left <= 0
                                ? 'border-hairline text-faint'
                                : 'border-accent bg-accent text-onaccent hover:bg-accent-soft'
                          }`}
                        >
                          {held.includes(event.id)
                            ? 'Held — we will call you'
                            : left <= 0
                              ? 'Full'
                              : 'Hold me a place'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <p className="mt-6 font-sans text-xs font-light leading-relaxed text-faint">
        Holding a place here marks it on this device and nothing else — no
        message is sent. A real booking is a telephone call, which is deliberate:
        every one of these has a constraint that is easier to talk about than to
        put in a form.
      </p>
    </div>
  );
}
