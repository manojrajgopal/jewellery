'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CalendarCheck, Plus, Trash2, TriangleAlert, Wrench } from 'lucide-react';

import { useToast } from '@/components/providers/ToastProvider';
import {
  monthsUntilService,
  serviceInterval,
  useOwnedPieces,
  type OwnedPiece,
  type WearRate,
} from '@/hooks/useOwnedPieces';
import { easeCine } from '@/lib/motion';

const KINDS: { id: OwnedPiece['kind']; label: string }[] = [
  { id: 'ring', label: 'Ring' },
  { id: 'necklace', label: 'Necklace' },
  { id: 'earrings', label: 'Earrings' },
  { id: 'bracelet', label: 'Bracelet' },
  { id: 'other', label: 'Something else' },
];

const WEARS: { id: WearRate; label: string; note: string }[] = [
  { id: 'daily', label: 'Every day', note: 'Never comes off. Showers, washing up, sleeping.' },
  { id: 'weekly', label: 'Most weeks', note: 'Worn out of the house regularly and put away between.' },
  { id: 'occasional', label: 'A few times a year', note: 'Weddings, festivals, one or two dinners.' },
  { id: 'vault', label: 'Almost never', note: 'Lives in a safe. Comes out for photographs.' },
];

const today = () => new Date().toISOString().slice(0, 10);

/**
 * What a piece is due for, said the way it would be said across a counter.
 * Overdue is stated in months rather than softened, because "overdue by two
 * years" is the only version of this sentence anybody acts on.
 */
function dueLabel(piece: OwnedPiece) {
  const months = monthsUntilService(piece);
  if (months <= -12)
    return { text: `Overdue by ${Math.floor(-months / 12)} year${-months >= 24 ? 's' : ''}`, kind: 'poor' as const };
  if (months <= 0) return { text: `Overdue by ${-months} month${-months === 1 ? '' : 's'}`, kind: 'poor' as const };
  if (months <= 3) return { text: `Due within ${months} month${months === 1 ? '' : 's'}`, kind: 'fair' as const };
  return { text: `Due in ${months} months`, kind: 'good' as const };
}

const TONE = {
  good: 'text-jade-300',
  fair: 'text-gold-300',
  poor: 'text-burgundy-300',
} as const;

/**
 * The part of ownership that happens after the purchase.
 *
 * Everything else this browser remembers is about choosing: pieces saved, pieces
 * compared, dates that matter. This is the only list here that assumes the
 * decision was made years ago — three pieces bought over a decade, no paperwork,
 * and a claw that has been slowly opening since 2019.
 *
 * Two design decisions carry the whole thing. The service interval is *computed*
 * from two things the owner definitely knows — how often it is worn and whether
 * it has stones in it — rather than asked for, because a field asking somebody
 * to nominate an interval gets a guess and the guess is always too long. And the
 * interval halves for a set piece, which is the single most useful fact on the
 * page: it is almost never the metal that fails.
 *
 * Nothing here is sent anywhere. It is the most personal list on the site and
 * there is no account to attach it to, so it stays in this browser and the panel
 * says so plainly rather than in a footnote.
 */
export default function OwnershipLedger({ className = '' }: { className?: string }) {
  const reduced = useReducedMotion();
  const { byDue, overdue, add, update, remove, clear, hydrated } = useOwnedPieces();
  const { toast } = useToast();

  const [adding, setAdding] = useState(false);
  const [label, setLabel] = useState('');
  const [acquired, setAcquired] = useState(today());
  const [kind, setKind] = useState<OwnedPiece['kind']>('ring');
  const [stones, setStones] = useState(true);
  const [wear, setWear] = useState<WearRate>('daily');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;
    add({ label: label.trim(), acquired, kind, stones, wear });
    toast({
      kind: 'luxe',
      title: 'Added to your ledger',
      message: 'Held in this browser only. Nothing was sent to us.',
    });
    setLabel('');
    setAdding(false);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* The standing of the whole collection, in one line. */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-hairline bg-surface-raised/40 p-5">
        <div className="flex items-center gap-3">
          <Wrench className="h-4 w-4 text-accent" aria-hidden="true" />
          <p className="font-sans text-sm font-light text-secondary">
            {!hydrated
              ? 'Reading this browser…'
              : byDue.length === 0
                ? 'Nothing recorded yet. Add the piece you wear most often first — it is the one with the shortest interval.'
                : overdue.length > 0
                  ? `${overdue.length} of ${byDue.length} ${overdue.length === 1 ? 'piece is' : 'pieces are'} past due for a check.`
                  : `All ${byDue.length} recorded ${byDue.length === 1 ? 'piece is' : 'pieces are'} within their interval.`}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setAdding((v) => !v)}
            className="flex items-center gap-2 rounded-full border border-accent/50 px-4 py-1.5 font-accent text-[10px] uppercase tracking-luxe text-accent transition-colors duration-300 hover:bg-accent/10"
          >
            <Plus className="h-3 w-3" aria-hidden="true" />
            {adding ? 'Cancel' : 'Record a piece'}
          </button>
          {byDue.length > 0 && (
            <button
              type="button"
              onClick={() => {
                clear();
                toast({ kind: 'info', title: 'Ledger cleared', message: 'Removed from this browser.' });
              }}
              className="rounded-full border border-hairline px-4 py-1.5 font-accent text-[10px] uppercase tracking-luxe text-faint transition-colors duration-300 hover:border-burgundy-300/50 hover:text-burgundy-300"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* The form. */}
      <AnimatePresence initial={false}>
        {adding && (
          <motion.form
            onSubmit={submit}
            initial={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: reduced ? 0.15 : 0.5, ease: easeCine.curtain }}
            className="overflow-hidden"
          >
            <div className="space-y-6 rounded-2xl border border-accent/35 bg-surface-raised/60 p-6 md:p-8">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="own-label" className="font-accent text-[10px] uppercase tracking-luxe text-accent">
                    What you call it
                  </label>
                  <input
                    id="own-label"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder="Ma’s emerald ring"
                    className="input-gold mt-2 w-full"
                    required
                  />
                  <p className="mt-1.5 font-sans text-[11px] font-light text-faint">
                    Your name for it, not ours. This list is for you to read.
                  </p>
                </div>

                <div>
                  <label htmlFor="own-date" className="font-accent text-[10px] uppercase tracking-luxe text-accent">
                    When it came to you
                  </label>
                  <input
                    id="own-date"
                    type="date"
                    value={acquired}
                    max={today()}
                    onChange={(e) => setAcquired(e.target.value)}
                    className="input-gold mt-2 w-full"
                  />
                  <p className="mt-1.5 font-sans text-[11px] font-light text-faint">
                    Inherited pieces count from when you received them — the history before that
                    is unknown, which is a reason to check early rather than late.
                  </p>
                </div>
              </div>

              <fieldset>
                <legend className="font-accent text-[10px] uppercase tracking-luxe text-accent">
                  What it is
                </legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {KINDS.map((k) => (
                    <button
                      key={k.id}
                      type="button"
                      onClick={() => setKind(k.id)}
                      aria-pressed={kind === k.id}
                      className={`rounded-full border px-4 py-1.5 font-accent text-[10px] uppercase tracking-luxe transition-colors duration-300 ${
                        kind === k.id
                          ? 'border-accent/60 bg-accent/12 text-accent'
                          : 'border-hairline text-muted hover:border-accent/40 hover:text-accent'
                      }`}
                    >
                      {k.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="font-accent text-[10px] uppercase tracking-luxe text-accent">
                  How often it is worn
                </legend>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {WEARS.map((w) => (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => setWear(w.id)}
                      aria-pressed={wear === w.id}
                      className={`rounded-xl border p-3 text-left transition-colors duration-300 ${
                        wear === w.id
                          ? 'border-accent/55 bg-surface-raised/80'
                          : 'border-hairline hover:border-accent/35'
                      }`}
                    >
                      <span
                        className={`block font-sans text-sm font-light ${
                          wear === w.id ? 'text-accent' : 'text-primary'
                        }`}
                      >
                        {w.label}
                      </span>
                      <span className="mt-0.5 block font-sans text-[11px] font-light text-faint">
                        {w.note}
                      </span>
                    </button>
                  ))}
                </div>
              </fieldset>

              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={stones}
                  onChange={(e) => setStones(e.target.checked)}
                  className="mt-1 h-4 w-4 accent-[rgb(var(--accent))]"
                />
                <span>
                  <span className="block font-sans text-sm font-light text-secondary">
                    It has stones set in it
                  </span>
                  <span className="mt-0.5 block font-sans text-[11px] font-light text-faint">
                    This halves the interval, and it is the most important thing on the form.
                    Metal rarely fails on its own — settings do.
                  </span>
                </span>
              </label>

              <button
                type="submit"
                className="w-full rounded-full bg-accent py-3 font-accent text-[11px] uppercase tracking-luxe text-onaccent shadow-gold transition-shadow duration-300 hover:shadow-gold-lg"
              >
                Add to the ledger
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* The ledger. */}
      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {byDue.map((piece) => {
            const due = dueLabel(piece);
            const interval = serviceInterval(piece);

            return (
              <motion.article
                key={piece.id}
                layout
                initial={reduced ? { opacity: 0 } : { opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, x: 24 }}
                transition={{ duration: reduced ? 0.15 : 0.45, ease: easeCine.glass }}
                className={`flex flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-2xl border p-5 ${
                  due.kind === 'poor'
                    ? 'border-burgundy-300/40 bg-burgundy-900/[0.06]'
                    : 'border-hairline bg-surface-raised/30'
                }`}
              >
                <div className="min-w-0">
                  <p className="flex items-center gap-2 font-display text-xl leading-tight text-primary">
                    {due.kind === 'poor' && (
                      <TriangleAlert className="h-4 w-4 flex-shrink-0 text-burgundy-300" aria-hidden="true" />
                    )}
                    {piece.label}
                  </p>
                  <p className="nums-tabular mt-1 font-accent text-[9px] uppercase tracking-luxe text-faint">
                    {piece.kind} · {piece.stones ? 'set with stones' : 'plain metal'} ·{' '}
                    {WEARS.find((w) => w.id === piece.wear)?.label.toLowerCase()} · checked every{' '}
                    {interval} months
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`font-accent text-[10px] uppercase tracking-luxe ${TONE[due.kind]}`}>
                    {due.text}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      update(piece.id, { serviced: today() });
                      toast({
                        kind: 'success',
                        title: 'Marked as checked',
                        message: `Next due in ${interval} months.`,
                      });
                    }}
                    aria-label={`Mark ${piece.label} as checked today`}
                    className="grid h-9 w-9 place-items-center rounded-full border border-hairline text-muted transition-colors duration-300 hover:border-accent/50 hover:text-accent"
                  >
                    <CalendarCheck className="h-4 w-4" aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    onClick={() => remove(piece.id)}
                    aria-label={`Remove ${piece.label}`}
                    className="grid h-9 w-9 place-items-center rounded-full border border-hairline text-muted transition-colors duration-300 hover:border-burgundy-300/50 hover:text-burgundy-300"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </div>

      <p className="font-sans text-xs font-light leading-relaxed text-faint">
        Held in this browser and nowhere else — there is no account behind this and nothing is
        sent to us. Bring the list in on a phone and we will check every piece on it in one
        sitting, which takes about ten minutes each and costs nothing.
      </p>
    </div>
  );
}
