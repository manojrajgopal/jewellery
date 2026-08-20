'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ClipboardList, Copy, RotateCcw } from 'lucide-react';

import { useToast } from '@/components/providers/ToastProvider';
import { confirmPop, ease, springs } from '@/lib/motion';

const KEY = 'aurum-visit-checklist';

/**
 * The four reasons people come in, and what each one is wasted without.
 *
 * Written as consequences rather than as instructions. "Bring the certificate"
 * is ignorable; "without it we are grading it again from scratch, which is an hour
 * you are sitting here for" is not.
 */
const PURPOSES = [
  {
    id: 'repair',
    label: 'Something needs mending',
    items: [
      {
        id: 'r1',
        text: 'The piece itself, not a photograph of it',
        why: 'Nothing on this list can be assessed from an image. A claw either moves under a probe or it does not.',
      },
      {
        id: 'r2',
        text: 'Any loose stone, even the chips',
        why: 'A chipped stone can often be reset rather than replaced, and a missing melee is cheaper to reuse than to match.',
      },
      {
        id: 'r3',
        text: 'The original box or pouch, if you still have it',
        why: 'The maker\'s mark inside a box tells us who set it, which tells us what the setting is likely to be made of.',
      },
      {
        id: 'r4',
        text: 'A note of when it was last worked on',
        why: 'A shank straightened twice already should be replaced rather than trued a third time. We cannot see that; you can remember it.',
      },
    ],
  },
  {
    id: 'buy',
    label: 'Choosing a piece',
    items: [
      {
        id: 'b1',
        text: 'A ring you already wear comfortably',
        why: 'The fastest accurate sizing in the trade is measuring a ring that already fits, on the finger it fits.',
      },
      {
        id: 'b2',
        text: 'The outfit, or a photograph of the neckline',
        why: 'Length is decided by the neckline and nothing else. Deciding it from memory is how a pendant ends up sitting on a hem.',
      },
      {
        id: 'b3',
        text: 'Whoever else is deciding',
        why: 'Two people looking at the same tray at the same time will agree in twenty minutes. Two people looking at photographs on separate evenings take a month.',
      },
      {
        id: 'b4',
        text: 'Your saved list, from this site',
        why: 'Read it off your phone at the counter and the advisor pulls those pieces before you sit down.',
      },
    ],
  },
  {
    id: 'value',
    label: 'A valuation or insurance',
    items: [
      {
        id: 'v1',
        text: 'Every certificate you hold',
        why: 'Without the report we grade the stone again from scratch, which is an hour of your afternoon and a fee that need not exist.',
      },
      {
        id: 'v2',
        text: 'The original invoice, if it exists',
        why: 'Provenance affects insurance value in a way the stone alone does not, particularly for anything signed.',
      },
      {
        id: 'v3',
        text: 'Your insurer\'s own valuation form',
        why: 'Most insurers will only accept their own wording. Filling ours in first and theirs afterwards means doing it twice.',
      },
      {
        id: 'v4',
        text: 'Photographs of it being worn',
        why: 'For a claim on a lost piece these are worth more than any description, and almost nobody thinks to keep them.',
      },
    ],
  },
  {
    id: 'commission',
    label: 'Starting a commission',
    items: [
      {
        id: 'c1',
        text: 'Anything you are having remade, and its stones',
        why: 'Reusing a stone is the most common brief we get, and its measurements decide the whole design.',
      },
      {
        id: 'c2',
        text: 'Three pictures of things you like',
        why: 'And ideally one of something you hate. A dislike narrows a brief faster than three likes.',
      },
      {
        id: 'c3',
        text: 'The date it has to be finished by',
        why: 'Twelve weeks is comfortable, eight is tight, and under five we will say no rather than rush a setter.',
      },
      {
        id: 'c4',
        text: 'A number you are working to',
        why: 'Not to be haggled over — to decide where the money goes. The same budget buys a bigger stone or a better setting, never both.',
      },
    ],
  },
] as const;

/**
 * What to bring, and what happens if you do not.
 *
 * The contact page gives an address, opening hours and a form. None of that stops
 * the most common wasted journey in the trade, which is somebody arriving for a
 * valuation without their certificates.
 *
 * Ticks persist to localStorage, so the list survives being packed the night before
 * and read again in the car. Everything else here is a consequence rather than an
 * instruction: each line explains what the visit costs without it, because that is
 * the only version anyone actually acts on.
 */
export default function VisitChecklist({ className = '' }: { className?: string }) {
  const { toast } = useToast();
  const [purpose, setPurpose] = useState<(typeof PURPOSES)[number]['id']>('buy');
  const [ticked, setTicked] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) setTicked(parsed.filter((v) => typeof v === 'string'));
    } catch {
      /* unreadable storage — an empty list is a fine starting point */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(ticked));
    } catch {
      /* storage blocked — the ticks still hold for this session */
    }
  }, [ticked, hydrated]);

  const active = PURPOSES.find((p) => p.id === purpose) ?? PURPOSES[1];

  const done = active.items.filter((i) => ticked.includes(i.id)).length;
  const complete = done === active.items.length;

  const toggle = (id: string) =>
    setTicked((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));

  const asText = useMemo(
    () =>
      [`Bringing to Aurum — ${active.label.toLowerCase()}:`, ...active.items.map((i) => `• ${i.text}`)].join(
        '\n'
      ),
    [active]
  );

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(asText);
      toast({ kind: 'success', title: 'List copied', message: 'Paste it wherever you keep notes.' });
    } catch {
      toast({
        kind: 'error',
        title: 'Could not copy',
        message: 'Your browser blocked clipboard access — the list is all on screen.',
      });
    }
  }, [asText, toast]);

  return (
    <div className={`rounded-3xl border border-hairline bg-canvas-alt/60 p-6 md:p-8 ${className}`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <span className="flex items-center gap-2 font-accent text-[10px] uppercase tracking-luxer text-accent">
          <ClipboardList className="h-3.5 w-3.5" aria-hidden="true" />
          Before you come in
        </span>

        {/* Progress as a ring rather than a bar: it sits beside a heading rather
            than under one, and a four-item list is far more legible as a dial. */}
        <span className="flex items-center gap-3">
          <span className="relative grid h-11 w-11 place-items-center">
            <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90" aria-hidden="true">
              <circle cx="18" cy="18" r="15" fill="none" stroke="rgb(var(--border))" strokeWidth="2" />
              <motion.circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke="rgb(var(--accent))"
                strokeWidth="2"
                strokeLinecap="round"
                pathLength={1}
                animate={{ pathLength: done / active.items.length }}
                transition={{ duration: 0.6, ease: ease.luxury }}
              />
            </svg>
            <span className="font-sans text-[11px] text-accent nums-tabular">
              {done}/{active.items.length}
            </span>
          </span>
        </span>
      </div>

      {/* ---- Purpose ---- */}
      <div className="mt-5 flex flex-wrap gap-2">
        {PURPOSES.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPurpose(p.id)}
            aria-pressed={p.id === purpose}
            className={`rounded-full border px-4 py-1.5 font-accent text-[10px] uppercase tracking-luxe transition-all duration-300 ${
              p.id === purpose
                ? 'border-accent bg-accent text-onaccent'
                : 'border-hairline text-muted hover:border-accent/50 hover:text-accent'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* ---- The list ---- */}
      <AnimatePresence mode="wait">
        <motion.ul
          key={active.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.4, ease: ease.luxury }}
          className="mt-7 space-y-3"
        >
          {active.items.map((item, i) => {
            const on = ticked.includes(item.id);
            return (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07, duration: 0.4, ease: ease.luxury }}
              >
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  aria-pressed={on}
                  className={`flex w-full items-start gap-4 rounded-2xl border px-4 py-4 text-left transition-colors duration-300 ${
                    on
                      ? 'border-jade-500/35 bg-jade-900/[0.08]'
                      : 'border-hairline bg-surface-raised/40 hover:border-accent/40'
                  }`}
                >
                  <motion.span
                    variants={confirmPop}
                    animate={on ? 'visible' : undefined}
                    className={`mt-0.5 grid h-6 w-6 flex-shrink-0 place-items-center rounded-md border transition-colors duration-300 ${
                      on
                        ? 'border-jade-500/60 bg-jade-500/25 text-jade-300'
                        : 'border-line-strong text-transparent'
                    }`}
                  >
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  </motion.span>

                  <span className="min-w-0">
                    <span
                      className={`block font-sans text-sm ${
                        on ? 'text-muted line-through decoration-line-strong' : 'text-primary'
                      }`}
                    >
                      {item.text}
                    </span>
                    <span className="mt-1 block font-sans text-[11px] font-light leading-relaxed text-muted">
                      {item.why}
                    </span>
                  </span>
                </button>
              </motion.li>
            );
          })}
        </motion.ul>
      </AnimatePresence>

      <AnimatePresence>
        {complete && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={springs.plate}
            className="overflow-hidden"
          >
            <span className="mt-5 block rounded-2xl border border-jade-500/35 bg-jade-900/10 px-4 py-3 font-sans text-xs font-light leading-relaxed text-secondary">
              That is everything. Walk in without an appointment for any of it except a commission —
              for that, half an hour booked ahead means the gemmologist is in the building.
            </span>
          </motion.p>
        )}
      </AnimatePresence>

      <div className="mt-6 flex flex-wrap gap-3 border-t border-hairline pt-5">
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-2 rounded-full border border-accent/50 bg-accent/10 px-4 py-2 font-accent text-[10px] uppercase tracking-luxe text-accent transition-colors duration-300 hover:bg-accent hover:text-onaccent"
        >
          <Copy className="h-3.5 w-3.5" aria-hidden="true" />
          Copy the list
        </button>
        <button
          type="button"
          onClick={() => setTicked((prev) => prev.filter((id) => !active.items.some((i) => i.id === id)))}
          disabled={done === 0}
          className="inline-flex items-center gap-2 rounded-full border border-hairline px-4 py-2 font-accent text-[10px] uppercase tracking-luxe text-muted transition-colors duration-300 hover:border-accent/50 hover:text-accent disabled:opacity-40"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Untick these
        </button>
      </div>
    </div>
  );
}
