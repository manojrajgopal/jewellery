'use client';

import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { BookMarked, BookOpen, Check, Clock, X } from 'lucide-react';

import { useToast } from '@/components/providers/ToastProvider';
import { useReadingQueue } from '@/hooks/useReadingQueue';
import { easeCine } from '@/lib/motion';

interface ReadingQueueProps {
  className?: string;
  /** Render nothing at all while the queue is empty. */
  hideWhenEmpty?: boolean;
}

/**
 * The reading list, as a panel.
 *
 * Worth having on this journal in particular. The entries are long, they are
 * written by the people at the bench rather than by a marketing desk, and they
 * are genuinely not skimmable — which means somebody who finds three of them
 * interesting in one visit reads none of them. A queue turns that into one now
 * and two later.
 *
 * Two details are deliberate. The total is stated in *minutes owed* rather than
 * as a count, because "four entries" is a number nobody weighs and "nineteen
 * minutes" is a decision. And finished entries are kept rather than deleted, in
 * a separate list, because several of these pieces argue with each other and
 * having read one changes the next — so what has been read is worth knowing.
 */
export default function ReadingQueue({ className = '', hideWhenEmpty = false }: ReadingQueueProps) {
  const reduced = useReducedMotion();
  const { pending, finished, minutes, remove, toggleRead, clear, hydrated } = useReadingQueue();
  const { toast } = useToast();

  if (hideWhenEmpty && hydrated && pending.length === 0 && finished.length === 0) return null;

  return (
    <div
      className={`rounded-2xl border border-hairline bg-surface-raised/40 p-6 md:p-8 ${className}`}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <p className="flex items-center gap-2.5 font-accent text-[10px] uppercase tracking-luxe text-accent">
          <BookMarked className="h-3.5 w-3.5" aria-hidden="true" />
          Put aside to read
        </p>

        {/* Minutes owed, not entries queued. */}
        {pending.length > 0 && (
          <p className="flex items-center gap-2 nums-tabular font-accent text-[10px] uppercase tracking-luxe text-faint">
            <Clock className="h-3 w-3" aria-hidden="true" />
            {minutes} minute{minutes === 1 ? '' : 's'} owed
          </p>
        )}
      </div>

      {!hydrated ? (
        <p className="mt-5 font-sans text-sm font-light text-faint">Reading this browser…</p>
      ) : pending.length === 0 && finished.length === 0 ? (
        <p className="mt-5 font-sans text-sm font-light leading-relaxed text-secondary">
          Nothing put aside yet. Every entry has a bookmark beside its title — the list stays in
          this browser and is never sent to us, so it is safe to be greedy with it.
        </p>
      ) : (
        <div className="mt-6 space-y-6">
          {pending.length > 0 && (
            <ul className="space-y-2.5">
              <AnimatePresence initial={false}>
                {pending.map((entry) => (
                  <motion.li
                    key={entry.slug}
                    layout
                    initial={reduced ? { opacity: 0 } : { opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={reduced ? { opacity: 0 } : { opacity: 0, x: 20 }}
                    transition={{ duration: reduced ? 0.15 : 0.4, ease: easeCine.glass }}
                    className="flex items-center gap-4 rounded-xl border border-hairline bg-surface-raised/30 p-4"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        toggleRead(entry.slug);
                        toast({ kind: 'success', title: 'Marked as read' });
                      }}
                      aria-label={`Mark “${entry.title}” as read`}
                      className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full border border-hairline text-muted transition-colors duration-300 hover:border-jade-300/60 hover:text-jade-300"
                    >
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>

                    <Link
                      href={`/journal/${entry.slug}`}
                      className="link-underline min-w-0 flex-1 font-sans text-sm font-light text-secondary hover:text-accent"
                    >
                      {entry.title}
                    </Link>

                    <span className="nums-tabular flex-shrink-0 font-accent text-[9px] uppercase tracking-luxe text-faint">
                      {entry.minutes} min
                    </span>

                    <button
                      type="button"
                      onClick={() => remove(entry.slug)}
                      aria-label={`Remove “${entry.title}” from the list`}
                      className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full text-faint transition-colors duration-300 hover:text-burgundy-300"
                    >
                      <X className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}

          {finished.length > 0 && (
            <div className="border-t border-hairline pt-5">
              <p className="flex items-center gap-2 font-accent text-[10px] uppercase tracking-luxe text-faint">
                <BookOpen className="h-3 w-3" aria-hidden="true" />
                Already read · {finished.length}
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {finished.map((entry) => (
                  <li key={entry.slug}>
                    <button
                      type="button"
                      onClick={() => toggleRead(entry.slug)}
                      className="rounded-full border border-hairline px-3 py-1 font-sans text-[11px] font-light text-faint line-through transition-colors duration-300 hover:border-accent/40 hover:text-accent hover:no-underline"
                      title="Put it back on the list"
                    >
                      {entry.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              clear();
              toast({ kind: 'info', title: 'Reading list cleared' });
            }}
            className="font-accent text-[9px] uppercase tracking-luxe text-faint transition-colors duration-300 hover:text-burgundy-300"
          >
            Clear the whole list
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * The bookmark control, for use beside an entry's title. Kept in this file so
 * the two halves of the feature — the list and the thing that fills it — cannot
 * drift apart.
 */
export function QueueToggle({
  slug,
  title,
  minutes,
  className = '',
}: {
  slug: string;
  title: string;
  minutes: number;
  className?: string;
}) {
  const { has, add, remove, hydrated } = useReadingQueue();
  const { toast } = useToast();
  const queued = hydrated && has(slug);

  return (
    <button
      type="button"
      onClick={() => {
        if (queued) {
          remove(slug);
          return;
        }
        add({ slug, title, minutes });
        toast({
          kind: 'luxe',
          title: 'Put aside to read',
          message: `${minutes} minutes, whenever you like. The list stays in this browser.`,
        });
      }}
      aria-pressed={queued}
      aria-label={queued ? `Remove “${title}” from your reading list` : `Put “${title}” aside to read`}
      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-accent text-[9px] uppercase tracking-luxe transition-colors duration-300 ${
        queued
          ? 'border-accent/60 bg-accent/12 text-accent'
          : 'border-hairline text-faint hover:border-accent/40 hover:text-accent'
      } ${className}`}
    >
      <BookMarked className="h-3 w-3" aria-hidden="true" />
      {queued ? 'On your list' : 'Read later'}
    </button>
  );
}
