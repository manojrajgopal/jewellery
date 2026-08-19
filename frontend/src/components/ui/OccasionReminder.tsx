'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarHeart, Lock, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/components/providers/ToastProvider';
import { useOccasions, daysUntil, nextDate, type Occasion } from '@/hooks/useOccasions';
import { gemsForMonth } from '@/data/gems';

interface OccasionReminderProps {
  className?: string;
}

const KINDS: { value: Occasion['kind']; label: string }[] = [
  { value: 'anniversary', label: 'Anniversary' },
  { value: 'birthday', label: 'Birthday' },
  { value: 'wedding', label: 'Wedding' },
  { value: 'other', label: 'Other' },
];

/** Lead times the bench actually needs, so the warnings mean something. */
const LEAD = { bespoke: 42, engraving: 10, restock: 5 } as const;

const fmtDate = (d: Date) =>
  d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

/**
 * Dates worth remembering, kept in the browser.
 *
 * The useful part is not the countdown — it is the lead-time warning. A commission
 * takes six weeks and engraving takes ten days, so an anniversary thirty days out
 * is already too late for bespoke and comfortably fine for an engraved piece. The
 * component says which, per occasion, because that is the decision the visitor is
 * actually trying to make and a bare "23 days" does not answer it.
 *
 * The birthstone for the month comes along for free, which is the one genuinely
 * charming thing a jeweller can do with a stored date.
 *
 * Nothing is sent anywhere. The list lives in localStorage only, and the panel says
 * so plainly — a form that looks like a newsletter signup but is not should not be
 * ambiguous about it.
 */
export default function OccasionReminder({ className = '' }: OccasionReminderProps) {
  const { upcoming, add, remove, hydrated, count } = useOccasions();
  const { toast } = useToast();

  const [label, setLabel] = useState('');
  const [date, setDate] = useState('');
  const [kind, setKind] = useState<Occasion['kind']>('anniversary');
  const [annual, setAnnual] = useState(true);

  const canSubmit = label.trim().length > 0 && /^\d{4}-\d{2}-\d{2}$/.test(date);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    add({ label: label.trim(), date, kind, annual });
    const days = daysUntil(date, annual);
    toast({
      kind: 'luxe',
      title: 'Kept in this browser',
      message:
        days < 0
          ? `${label.trim()} has passed. Set it to repeat annually and we will count to next year.`
          : `${days} days to ${label.trim()}. ${
              days < LEAD.engraving
                ? 'Too close for engraving — come and see us.'
                : days < LEAD.bespoke
                  ? 'Still time for an engraved piece.'
                  : 'Time enough for a commission.'
            }`,
    });
    setLabel('');
    setDate('');
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-hairline bg-surface-raised/60 p-6 backdrop-blur-xl md:p-8 ${className}`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-spotlight-soft opacity-[var(--bloom)]"
      />

      <header className="relative mb-7 flex items-start gap-3">
        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-gold-500/30 text-accent">
          <CalendarHeart size={16} strokeWidth={1.7} />
        </span>
        <div>
          <h3 className="font-display text-xl font-light text-primary md:text-2xl">
            Dates Worth Keeping
          </h3>
          <p className="mt-0.5 font-sans text-[11px] font-light text-muted">
            We will tell you when there is still time to have something made.
          </p>
        </div>
      </header>

      <div className="relative grid gap-8 lg:grid-cols-2 lg:gap-10">
        {/* ---- Add ---- */}
        <form onSubmit={submit} className="flex flex-col gap-5">
          <div>
            <label
              htmlFor="occasion-label"
              className="mb-2 block font-accent text-[10px] uppercase tracking-luxe text-muted"
            >
              What is it
            </label>
            <input
              id="occasion-label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Our tenth"
              maxLength={40}
              className="input-gold w-full rounded-lg px-4 py-3 text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="occasion-date"
              className="mb-2 block font-accent text-[10px] uppercase tracking-luxe text-muted"
            >
              The day
            </label>
            <input
              id="occasion-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-gold w-full rounded-lg px-4 py-3 text-sm"
            />
          </div>

          <div>
            <p className="mb-2 font-accent text-[10px] uppercase tracking-luxe text-muted">
              Kind
            </p>
            <div className="flex flex-wrap gap-2">
              {KINDS.map((k) => (
                <button
                  key={k.value}
                  type="button"
                  onClick={() => setKind(k.value)}
                  aria-pressed={kind === k.value}
                  className={`rounded-full border px-4 py-2 font-accent text-[9px] uppercase tracking-luxe transition-all duration-300 ${
                    kind === k.value
                      ? 'border-gold-500/60 bg-gold-500/12 text-accent'
                      : 'border-hairline text-muted hover:border-gold-500/40 hover:text-accent'
                  }`}
                >
                  {k.label}
                </button>
              ))}
            </div>
          </div>

          {/* Annual */}
          <button
            type="button"
            onClick={() => setAnnual((v) => !v)}
            aria-pressed={annual}
            className="flex items-center gap-3 text-left"
          >
            <span
              className={`relative flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors duration-300 ${
                annual ? 'bg-accent' : 'bg-line'
              }`}
            >
              <motion.span
                className="block h-3.5 w-3.5 rounded-full bg-canvas shadow"
                animate={{ x: annual ? 18 : 3 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </span>
            <span className="font-sans text-xs font-light text-muted">
              Repeats every year
            </span>
          </button>

          <button
            type="submit"
            disabled={!canSubmit}
            className="group inline-flex w-fit items-center gap-2.5 rounded-full bg-accent px-6 py-3 font-accent text-[10px] uppercase tracking-luxe text-onaccent shadow-gold transition-shadow hover:shadow-gold-lg disabled:opacity-40 disabled:shadow-none"
          >
            <Plus size={13} strokeWidth={2.2} />
            Keep this date
          </button>

          <p className="flex items-start gap-2 font-sans text-[10px] font-light italic leading-relaxed text-faint">
            <Lock size={11} strokeWidth={1.8} className="mt-0.5 flex-shrink-0" />
            Kept in this browser and nowhere else. Nothing is sent to us, and clearing
            your site data clears the list.
          </p>
        </form>

        {/* ---- The list ---- */}
        <div>
          <div className="mb-4 flex items-baseline justify-between gap-4 border-b border-hairline pb-3">
            <p className="font-accent text-[10px] uppercase tracking-luxe text-muted">
              Coming up
            </p>
            {hydrated && (
              <span className="nums-tabular font-sans text-[10px] font-light text-faint">
                {count} kept
              </span>
            )}
          </div>

          {!hydrated ? (
            <div className="flex flex-col gap-2.5">
              {[0, 1].map((i) => (
                <span key={i} className="skeleton block h-20 rounded-xl" />
              ))}
            </div>
          ) : upcoming.length === 0 ? (
            <p className="font-sans text-sm font-light italic leading-relaxed text-faint">
              Nothing kept yet. Add an anniversary and we will count the weeks down to
              it — and tell you when the bench needs to hear from you.
            </p>
          ) : (
            <ul className="flex flex-col gap-2.5">
              <AnimatePresence initial={false}>
                {upcoming.map((o) => (
                  <OccasionRow key={o.id} occasion={o} onRemove={() => remove(o.id)} />
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function OccasionRow({
  occasion,
  onRemove,
}: {
  occasion: Occasion;
  onRemove: () => void;
}) {
  const days = daysUntil(occasion.date, occasion.annual);
  const when = nextDate(occasion.date, occasion.annual);
  const stone = useMemo(() => gemsForMonth(when.getMonth() + 1)[0], [when]);

  const passed = days < 0;

  // The whole point of the component. Ordered from tightest constraint outward.
  const advice = passed
    ? { text: 'This one has passed', tone: 'text-faint', href: null }
    : days < LEAD.restock
      ? { text: 'Come in — we will find something on the day', tone: 'text-burgundy-300', href: '/contact' }
      : days < LEAD.engraving
        ? { text: 'Too close for engraving. A stocked piece still works', tone: 'text-burgundy-300', href: '/collections' }
        : days < LEAD.bespoke
          ? { text: 'Time for an engraved piece, not a commission', tone: 'text-accent', href: '/services' }
          : { text: 'Time enough for a full commission', tone: 'text-jade-300', href: '/bespoke' };

  return (
    <motion.li
      layout
      initial={{ opacity: 0, x: -16, height: 0 }}
      animate={{ opacity: 1, x: 0, height: 'auto' }}
      exit={{ opacity: 0, x: 24, height: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden"
    >
      <div
        className={`group relative flex items-start gap-4 rounded-xl border p-4 transition-colors duration-400 ${
          passed ? 'border-hairline opacity-60' : 'border-hairline hover:border-gold-500/35'
        }`}
      >
        {/* Birthstone for the month it falls in */}
        <span
          aria-hidden="true"
          title={stone?.name}
          className={`mt-0.5 block h-8 w-8 flex-shrink-0 bg-gradient-to-br ${stone?.swatch ?? ''} ${
            stone?.cut ?? 'clip-diamond'
          } transition-transform duration-500 group-hover:scale-110`}
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <span className="font-display text-base font-light text-primary">
              {occasion.label}
            </span>
            <span className="nums-tabular flex-shrink-0 font-display text-lg text-accent">
              {passed ? '—' : days === 0 ? 'Today' : `${days}d`}
            </span>
          </div>

          <p className="nums-tabular mt-0.5 font-sans text-[11px] font-light text-faint">
            {fmtDate(when)}
            {occasion.annual && ' · yearly'}
            {stone && ` · ${stone.name}`}
          </p>

          {advice.href ? (
            <Link
              href={advice.href}
              className={`mt-2 inline-flex items-center gap-1.5 font-accent text-[9px] uppercase tracking-luxe transition-opacity hover:opacity-75 ${advice.tone}`}
            >
              <span aria-hidden="true" className="block h-1 w-1 rotate-45 bg-current" />
              {advice.text}
            </Link>
          ) : (
            <p
              className={`mt-2 flex items-center gap-1.5 font-accent text-[9px] uppercase tracking-luxe ${advice.tone}`}
            >
              <span aria-hidden="true" className="block h-1 w-1 rotate-45 bg-current" />
              {advice.text}
            </p>
          )}
        </div>

        <button
          onClick={onRemove}
          aria-label={`Forget ${occasion.label}`}
          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-hairline text-faint opacity-0 transition-all duration-300 hover:border-burgundy-500/50 hover:text-burgundy-300 group-hover:opacity-100 focus-visible:opacity-100"
        >
          <Trash2 size={12} strokeWidth={1.9} />
        </button>
      </div>
    </motion.li>
  );
}
