'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ClipboardCheck, Copy, Printer, RotateCcw } from 'lucide-react';

import { useToast } from '@/components/providers/ToastProvider';
import { easeCine } from '@/lib/motion';

const KEY = 'aurum-brief';

/**
 * The six questions a bench actually needs answered before it can draw anything,
 * in the order a designer asks them.
 *
 * The order is not arbitrary and it is the most useful thing here. Every
 * commission conversation that goes wrong went wrong because it started at
 * question five — the metal, the stone, the budget — before anybody had answered
 * question one, which is who is going to wear it and what they do all day. A
 * platinum bezel and a high-set solitaire are answers to different lives, not
 * different tastes.
 *
 * `why` is shown to the visitor. It is there because a form that explains why it
 * is asking gets answers rather than guesses.
 */
interface Question {
  id: string;
  label: string;
  why: string;
  placeholder: string;
  /** Suggested lines. Pressing one appends rather than replaces. */
  prompts: string[];
  rows: number;
}

const QUESTIONS: Question[] = [
  {
    id: 'wearer',
    label: 'Who wears it, and what do their hands do all day',
    why:
      'This decides the setting before anything else. A surgeon and a pianist and somebody who gardens at the weekend cannot have the same claws, and no amount of budget changes that.',
    placeholder: 'She is a paediatrician, washes her hands forty times a day, and never takes anything off.',
    prompts: [
      'Never takes it off, including sleeping',
      'Works with their hands — tools, soil, patients',
      'Types all day, otherwise careful',
      'Only worn for occasions',
    ],
    rows: 3,
  },
  {
    id: 'occasion',
    label: 'What the piece is for',
    why:
      'A commission for a fortieth anniversary and one for a first job are the same brief with a different centre of gravity. It changes what we protect when something has to give.',
    placeholder: 'Twenty-fifth anniversary. She has worn the original since 1999 and it is now too thin to resize again.',
    prompts: [
      'An engagement',
      'An anniversary',
      'Remaking something inherited',
      'For myself, no occasion',
    ],
    rows: 3,
  },
  {
    id: 'existing',
    label: 'What already exists, and what has to be used',
    why:
      'Stones, metal, a broken piece, a photograph of a piece that is gone. Anything on this line constrains the drawing, and finding out about it late is how a design gets thrown away.',
    placeholder: 'Her mother’s 1.1ct old-cut, slightly off-round, and about 6g of 22K from a bangle that broke.',
    prompts: [
      'An inherited stone that must be used',
      'Old gold to be credited in',
      'Nothing — start from scratch',
      'A photograph of a piece I want it to resemble',
    ],
    rows: 3,
  },
  {
    id: 'refuse',
    label: 'What it must not be',
    why:
      'The single most useful line on this form. Most people cannot describe what they want and every one of them can describe what they would hate, and a brief that rules out four things is worth more than one that asks for one.',
    placeholder: 'Not a halo. Nothing that looks like it was bought in 2015. No rose gold at all.',
    prompts: [
      'No halo',
      'Nothing that will date',
      'Nothing that catches on clothing',
      'Not yellow gold',
      'Nothing ostentatious',
    ],
    rows: 3,
  },
  {
    id: 'budget',
    label: 'The figure, and which part of it can move',
    why:
      'We would rather know the ceiling than guess at it. And knowing whether the stone or the workmanship is the part you would rather spend on decides the whole design — those are the only two places the money can go.',
    placeholder: 'Around ₹4,00,000. I would rather have a smaller better stone than a bigger setting.',
    prompts: [
      'Stone matters more than setting',
      'Setting matters more than stone',
      'Hard ceiling, no flexibility',
      'Flexible if there is a reason',
    ],
    rows: 3,
  },
  {
    id: 'date',
    label: 'When it has to exist by',
    why:
      'A commission is twelve weeks and engraving is another ten days. If the date is closer than that we will say so now rather than in week nine, and there are usually two honest ways round it.',
    placeholder: 'Her birthday is 14 March. Anything after that is pointless.',
    prompts: ['No fixed date', 'Within three months', 'Within six weeks — I know that is tight'],
    rows: 2,
  },
];

type Answers = Record<string, string>;

/**
 * The brief, written before the conversation rather than during it.
 *
 * Every bespoke page on every jeweller's site ends in a contact form with a box
 * marked "tell us about your project", which is the hardest possible way to ask
 * this. Nobody can answer it cold, so what arrives is two sentences and a budget,
 * and the first meeting is spent extracting the other five things — usually in
 * the wrong order.
 *
 * So this asks the six questions a designer actually asks, in the order they are
 * asked, with the reason for each one visible. The reasons are the point: a form
 * that says why it wants to know gets an answer instead of a guess.
 *
 * It saves to this browser as you type, because a brief is written over several
 * evenings rather than in one sitting — which is also why there is a print
 * button and no send button. The finished thing is yours; bring it in, or paste
 * it into an email, or read it off a phone across the counter. We would rather
 * you owned the document than that we did.
 */
export default function CommissionBrief({ className = '' }: { className?: string }) {
  const reduced = useReducedMotion();
  const { toast } = useToast();
  const [answers, setAnswers] = useState<Answers>({});
  const [hydrated, setHydrated] = useState(false);

  // Read once on mount, then write on every change. A brief is written over
  // several evenings, and losing it to a closed tab is the one failure that
  // would make this worse than a blank sheet of paper.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      if (parsed && typeof parsed === 'object') setAnswers(parsed as Answers);
    } catch {
      /* unreadable or blocked — start empty */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(answers));
    } catch {
      /* blocked storage — the brief still works for this session */
    }
  }, [answers, hydrated]);

  const answered = QUESTIONS.filter((q) => (answers[q.id] ?? '').trim().length > 0).length;

  // Named `brief` rather than `document`: a local called `document` shadows the
  // global one, and this file calls window.print() a few lines down.
  const brief = useMemo(() => {
    const lines = QUESTIONS.filter((q) => (answers[q.id] ?? '').trim())
      .map((q) => `${q.label.toUpperCase()}\n${answers[q.id].trim()}`)
      .join('\n\n');
    return lines
      ? `AURUM — COMMISSION BRIEF\n\n${lines}\n\nWritten by the client. Not yet discussed with the bench.`
      : '';
  }, [answers]);

  const set = (id: string, value: string) => setAnswers((prev) => ({ ...prev, [id]: value }));

  const append = (id: string, line: string) =>
    setAnswers((prev) => {
      const current = (prev[id] ?? '').trim();
      if (current.includes(line)) return prev;
      return { ...prev, [id]: current ? `${current}. ${line}` : line };
    });

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Progress, as questions answered rather than as a percentage. Six is a
          small enough number that a fraction is more honest than a bar. */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-hairline bg-surface-raised/40 p-5">
        <p className="flex items-center gap-2.5 font-sans text-sm font-light text-secondary">
          <ClipboardCheck className="h-4 w-4 text-accent" aria-hidden="true" />
          {answered === 0
            ? 'Six questions. Start anywhere — most people find the fourth one easiest.'
            : `${answered} of ${QUESTIONS.length} answered. Saved in this browser as you type.`}
        </p>

        <div className="flex gap-1.5" aria-hidden="true">
          {QUESTIONS.map((q, i) => (
            <motion.span
              key={q.id}
              initial={false}
              animate={{
                opacity: (answers[q.id] ?? '').trim() ? 1 : 0.18,
                scaleY: (answers[q.id] ?? '').trim() ? 1 : 0.5,
              }}
              transition={{ duration: 0.35, delay: reduced ? 0 : i * 0.03 }}
              className="block h-2 w-8 origin-bottom rounded-sm bg-accent"
            />
          ))}
        </div>
      </div>

      {/* The questions. */}
      <div className="space-y-6">
        {QUESTIONS.map((q, i) => (
          <motion.div
            key={q.id}
            initial={reduced ? undefined : { opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-6% 0px' }}
            transition={{ duration: 0.55, delay: reduced ? 0 : i * 0.04, ease: easeCine.glass }}
            className="rounded-2xl border border-hairline bg-surface-raised/30 p-6 md:p-7"
          >
            <div className="flex items-baseline gap-3">
              <span className="nums-tabular font-accent text-[10px] uppercase tracking-luxe text-accent">
                {String(i + 1).padStart(2, '0')}
              </span>
              <label
                htmlFor={`brief-${q.id}`}
                className="font-display text-xl leading-snug text-primary md:text-2xl"
              >
                {q.label}
              </label>
            </div>

            <p className="mt-2.5 font-sans text-xs font-light leading-relaxed text-faint">
              {q.why}
            </p>

            <textarea
              id={`brief-${q.id}`}
              value={answers[q.id] ?? ''}
              onChange={(e) => set(q.id, e.target.value)}
              rows={q.rows}
              placeholder={q.placeholder}
              className="input-gold mt-4 w-full resize-y"
            />

            {/* Prompts append rather than replace, so a half-written answer is
                never destroyed by pressing one. */}
            <div className="mt-3 flex flex-wrap gap-2">
              {q.prompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => append(q.id, prompt)}
                  className="rounded-full border border-hairline px-3 py-1 font-sans text-[11px] font-light text-faint transition-colors duration-300 hover:border-accent/40 hover:text-accent"
                >
                  + {prompt}
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* The document. */}
      {brief && (
        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeCine.glass }}
          className="paper-stock stock-ruled rounded-2xl border border-hairline p-6 md:p-8"
        >
          <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
            Your brief, as it stands
          </p>

          <pre className="mt-5 whitespace-pre-wrap font-sans text-sm font-light leading-relaxed text-primary">
            {brief}
          </pre>

          <div className="mt-6 flex flex-wrap gap-3 border-t border-hairline pt-5">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard
                  ?.writeText(brief)
                  .then(() =>
                    toast({
                      kind: 'success',
                      title: 'Brief copied',
                      message: 'Paste it into an email, or bring it in on a phone.',
                    })
                  )
                  .catch(() =>
                    toast({
                      kind: 'error',
                      title: 'Could not copy',
                      message: 'Select the text above and copy it by hand.',
                    })
                  );
              }}
              className="flex items-center gap-2 rounded-full border border-accent/50 px-5 py-2 font-accent text-[10px] uppercase tracking-luxe text-accent transition-colors duration-300 hover:bg-accent/10"
            >
              <Copy className="h-3.5 w-3.5" aria-hidden="true" />
              Copy it
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-2 rounded-full border border-hairline px-5 py-2 font-accent text-[10px] uppercase tracking-luxe text-muted transition-colors duration-300 hover:border-accent/40 hover:text-accent"
            >
              <Printer className="h-3.5 w-3.5" aria-hidden="true" />
              Print it
            </button>

            <button
              type="button"
              onClick={() => {
                setAnswers({});
                toast({ kind: 'info', title: 'Brief cleared', message: 'Removed from this browser.' });
              }}
              className="flex items-center gap-2 rounded-full border border-hairline px-5 py-2 font-accent text-[10px] uppercase tracking-luxe text-faint transition-colors duration-300 hover:border-burgundy-300/50 hover:text-burgundy-300"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Start again
            </button>
          </div>

          <p className="mt-5 font-sans text-[11px] font-light leading-relaxed text-faint">
            There is deliberately no send button. This stays in your browser and belongs to you —
            bring it in, paste it into an email, or read it off a phone across the counter. A brief
            the client owns is a brief the client can change their mind about.
          </p>
        </motion.div>
      )}
    </div>
  );
}
