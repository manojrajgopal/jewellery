'use client';

import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Check, Copy, FileText, ShieldAlert } from 'lucide-react';

import { easeLens, springsHeavy } from '@/lib/motion';
import { useToast } from '@/components/providers/ToastProvider';

/**
 * What an insurer actually needs, and what they will refuse a claim over.
 *
 * The order here is by claim risk rather than by how easy the item is to obtain.
 * A photograph of the piece on the wearer's own hand is worth more at claim time
 * than any certificate, because it establishes possession on a date — and it is
 * the one item nobody thinks of. A valuation more than three years old is the
 * commonest reason a settlement comes in low, and it is entirely avoidable.
 *
 * `risk` drives the ordering and the wording of the consequence line: what
 * specifically goes wrong if this is missing.
 */
interface KitItem {
  id: string;
  label: string;
  /** Why an insurer wants it. */
  why: string;
  /** What happens at claim time without it. Only on the ones that bite. */
  consequence?: string;
  /** 1–5. How badly its absence hurts a claim. */
  risk: number;
  /** Only relevant if the piece has a certified centre stone. */
  certifiedOnly?: boolean;
  /** Only relevant above the insurer's single-article limit. */
  highValueOnly?: boolean;
}

const ITEMS: KitItem[] = [
  {
    id: 'valuation',
    label: 'Valuation at replacement cost, dated within three years',
    why: 'Fixes the sum insured. Metal and stone prices move, and a policy written against an old figure pays out against that figure.',
    consequence:
      'The commonest cause of a low settlement. Gold has moved enough in three years that a 2021 valuation can underinsure a piece by a third.',
    risk: 5,
  },
  {
    id: 'photos-worn',
    label: 'Photographs of the piece being worn, by you',
    why: 'Establishes possession on a date, in a way a studio photograph of the item cannot.',
    consequence:
      'Insurers do query whether a claimed piece was ever in the claimant\'s possession. Almost nobody has this, and it is free.',
    risk: 5,
  },
  {
    id: 'photos-detail',
    label: 'Close photographs, including any inscription and the hallmark',
    why: 'Identifies this specific piece rather than the model. A laser inscription on a girdle is a serial number.',
    consequence:
      'Without it, a recovered piece cannot be proven to be yours, and a replacement can be specified down rather than matched.',
    risk: 4,
  },
  {
    id: 'invoice',
    label: 'Original invoice, showing the maker and the date',
    why: 'Proves purchase and establishes the piece\'s age for a depreciation or antique clause.',
    risk: 4,
  },
  {
    id: 'certificate',
    label: 'Grading report for the centre stone',
    why: 'Establishes the four grades, which is what a replacement stone has to match.',
    consequence:
      'Without it, an insurer replaces to a written description. "One carat brilliant" spans a fivefold range of price.',
    risk: 5,
    certifiedOnly: true,
  },
  {
    id: 'certificate-number',
    label: 'Report number recorded separately from the report',
    why: 'A grading report can be verified online from its number alone, so the number survives losing the paper.',
    risk: 3,
    certifiedOnly: true,
  },
  {
    id: 'weight',
    label: 'Total metal weight, in grams',
    why: 'The floor value of the piece, and the figure a total-loss settlement starts from.',
    risk: 3,
  },
  {
    id: 'schedule',
    label: 'Piece named individually on the policy schedule',
    why: 'Contents policies carry a single-article limit — often ₹50,000 to ₹1,00,000 — and anything above it is only covered if named.',
    consequence:
      'This is the failure that surprises people most: the piece was insured, but only up to the single-article limit, and the rest is simply not covered.',
    risk: 5,
    highValueOnly: true,
  },
  {
    id: 'away-cover',
    label: 'Confirmation that cover extends away from the home',
    why: 'Many contents policies cover jewellery in the house and nowhere else. Most jewellery is lost elsewhere.',
    consequence:
      'A ring lost on holiday under a home-only policy is not a claim at all. Check the wording, not the summary.',
    risk: 5,
  },
  {
    id: 'wear-clause',
    label: 'Whether the policy excludes loss while being worn',
    why: 'Some policies cover theft and fire but exclude a stone falling out of its setting during ordinary wear.',
    consequence:
      'The single most common actual loss — a stone gone from a claw — is excluded by more policies than people expect.',
    risk: 4,
  },
  {
    id: 'copies-offsite',
    label: 'Everything above, stored somewhere other than the house',
    why: 'The fire that takes the jewellery takes the documents in the drawer beside it.',
    consequence: 'Obvious, and routinely skipped. A photograph of each document in cloud storage is enough.',
    risk: 4,
    highValueOnly: true,
  },
  {
    id: 'appraiser',
    label: 'Valuer\'s credentials, recorded with the valuation',
    why: 'An insurer can reject a valuation from an unqualified source, including from the shop that sold the piece.',
    risk: 2,
    highValueOnly: true,
  },
];

interface AppraisalKitProps {
  className?: string;
}

/**
 * The file a claim actually needs, built as a checklist that produces something.
 *
 * Insurance for jewellery fails in a small number of predictable ways and all of
 * them are avoidable in an afternoon. So this is not an explainer — it is a
 * checklist with two switches on it, and it emits a plain-text record the visitor
 * can paste into wherever they keep documents.
 *
 * The ordering is by claim risk rather than by how easy an item is to get, which
 * puts two unglamorous items at the top. A photograph of the piece *being worn*
 * outranks any certificate, because it establishes possession on a date and
 * essentially nobody has one. And a valuation older than three years is the
 * single commonest cause of a settlement coming in low.
 *
 * The two switches matter because the list is genuinely different for different
 * pieces: a certified centre stone adds two items, and a piece above the policy's
 * single-article limit adds four. Showing all sixteen to someone with a ₹40,000
 * pendant is how a checklist gets abandoned.
 *
 * The readiness figure is weighted by risk, not by count — ticking the four
 * easiest items should not read as 'most of the way there', because at claim time
 * it is not.
 */
export default function AppraisalKit({ className = '' }: AppraisalKitProps) {
  const reduced = useReducedMotion();
  const { toast } = useToast();

  const [certified, setCertified] = useState(true);
  const [highValue, setHighValue] = useState(true);
  const [done, setDone] = useState<Set<string>>(new Set());

  const relevant = useMemo(
    () =>
      ITEMS.filter(
        (i) => (!i.certifiedOnly || certified) && (!i.highValueOnly || highValue),
      ).sort((a, b) => b.risk - a.risk),
    [certified, highValue],
  );

  /** Weighted by risk: the easy items should not read as most of the way there. */
  const readiness = useMemo(() => {
    const total = relevant.reduce((s, i) => s + i.risk, 0);
    const held = relevant.reduce((s, i) => s + (done.has(i.id) ? i.risk : 0), 0);
    return total === 0 ? 0 : Math.round((held / total) * 100);
  }, [relevant, done]);

  /** The highest-risk item still missing — the one thing to do next. */
  const nextUp = relevant.find((i) => !done.has(i.id)) ?? null;

  const toggle = (id: string) => {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  /** Emit the checklist as plain text, so it is portable to anywhere. */
  const copy = async () => {
    const lines = [
      'JEWELLERY INSURANCE FILE',
      `Prepared for a piece that is ${certified ? 'certified' : 'not certified'} and ${
        highValue ? 'above' : 'within'
      } the single-article limit.`,
      '',
      ...relevant.map((i) => `[${done.has(i.id) ? 'x' : ' '}] ${i.label}`),
      '',
      `Readiness, weighted by claim risk: ${readiness}%`,
      nextUp ? `Next: ${nextUp.label}` : 'Complete.',
    ];
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      toast({
        title: 'On your clipboard',
        message: 'Paste it wherever you keep the documents themselves.',
        kind: 'success',
      });
    } catch {
      toast({
        title: 'Clipboard unavailable',
        message: 'Your browser blocked the copy. Select the list and copy it by hand.',
        kind: 'error',
      });
    }
  };

  return (
    <div className={className}>
      {/* ================= What kind of piece ================= */}
      <div className="flex flex-wrap gap-3">
        {[
          {
            on: certified,
            set: setCertified,
            label: 'Certified centre stone',
            off: 'No grading report',
          },
          {
            on: highValue,
            set: setHighValue,
            label: 'Above the single-article limit',
            off: 'Within the ordinary limit',
          },
        ].map((sw) => (
          <button
            key={sw.label}
            type="button"
            onClick={() => sw.set(!sw.on)}
            aria-pressed={sw.on}
            className={`rounded-full border px-4 py-2 font-accent text-[10px] uppercase tracking-luxe transition-all duration-300 ${
              sw.on
                ? 'border-accent bg-accent text-onaccent'
                : 'border-hairline text-muted hover:border-accent/50 hover:text-accent'
            }`}
          >
            {sw.on ? sw.label : sw.off}
          </button>
        ))}
      </div>

      <div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]">
        {/* ================= The list ================= */}
        <ol className="space-y-2.5">
          {relevant.map((item, i) => {
            const ticked = done.has(item.id);
            return (
              <motion.li
                key={item.id}
                layout={!reduced}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: Math.min(i * 0.03, 0.25) }}
              >
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  aria-pressed={ticked}
                  className={`flex w-full gap-4 rounded-2xl border p-5 text-left transition-all duration-400 ${
                    ticked
                      ? 'border-jade-500/40 bg-jade-500/[0.06]'
                      : 'border-hairline bg-canvas-alt/40 hover:border-accent/40'
                  }`}
                >
                  <motion.span
                    animate={{ scale: ticked ? 1 : 0.92 }}
                    transition={reduced ? { duration: 0 } : springsHeavy.detent}
                    className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md border ${
                      ticked
                        ? 'border-jade-500 bg-jade-500/20 text-jade-300'
                        : 'border-line-strong text-transparent'
                    }`}
                  >
                    <Check aria-hidden="true" className="h-3.5 w-3.5" />
                  </motion.span>

                  <span className="min-w-0 flex-1">
                    <span
                      className={`block font-sans text-sm leading-snug ${
                        ticked ? 'text-muted line-through decoration-jade-500/40' : 'text-primary'
                      }`}
                    >
                      {item.label}
                    </span>
                    <span className="mt-2 block font-sans text-xs font-light leading-relaxed text-muted">
                      {item.why}
                    </span>

                    {item.consequence && !ticked && (
                      <span className="mt-3 flex gap-2.5 rounded-xl border border-accent/25 bg-accent/[0.06] p-3">
                        <ShieldAlert
                          aria-hidden="true"
                          className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent"
                        />
                        <span className="font-sans text-xs font-light leading-relaxed text-secondary">
                          {item.consequence}
                        </span>
                      </span>
                    )}
                  </span>

                  {/* Claim risk, as pips. */}
                  <span
                    className="mt-1 flex shrink-0 flex-col gap-0.5"
                    aria-label={`Claim risk ${item.risk} of 5`}
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <span
                        key={n}
                        aria-hidden="true"
                        className={`h-1 w-4 rounded-full ${
                          n <= item.risk ? 'bg-accent' : 'bg-line'
                        }`}
                      />
                    ))}
                  </span>
                </button>
              </motion.li>
            );
          })}
        </ol>

        {/* ================= Readiness ================= */}
        <div className="space-y-5 lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-3xl border border-accent/30 bg-accent/[0.06] p-6">
            <span className="font-accent text-[10px] uppercase tracking-luxer text-accent">
              Ready to claim
            </span>

            <motion.p
              key={readiness}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: easeLens.focusRing }}
              className="mt-2 font-display text-5xl text-primary nums-tabular"
            >
              {readiness}%
            </motion.p>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-sunken">
              <motion.div
                animate={{ scaleX: readiness / 100 }}
                transition={reduced ? { duration: 0 } : springsHeavy.tray}
                className="h-full origin-left rounded-full bg-gradient-to-r from-accent/50 to-accent"
              />
            </div>

            <p className="mt-3 font-sans text-xs font-light leading-relaxed text-muted">
              Weighted by what each item is worth at claim time, not by how many you have ticked.
              The four easiest items are worth about a fifth of this.
            </p>
          </div>

          {nextUp && (
            <motion.div
              key={nextUp.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={springsHeavy.leaf}
              className="rounded-3xl border border-hairline bg-canvas-alt/60 p-6"
            >
              <span className="font-accent text-[10px] uppercase tracking-luxer text-accent">
                Do this one first
              </span>
              <p className="mt-2 font-display text-lg leading-snug text-primary">{nextUp.label}</p>
            </motion.div>
          )}

          <button
            type="button"
            onClick={copy}
            className="flex w-full items-center justify-center gap-2.5 rounded-full border border-accent/40 bg-accent/10 px-6 py-3.5 font-accent text-[10px] uppercase tracking-luxe text-accent transition-all duration-300 hover:bg-accent hover:text-onaccent"
          >
            <Copy aria-hidden="true" className="h-3.5 w-3.5" />
            Copy the file list
          </button>

          <p className="flex gap-2.5 font-sans text-xs font-light leading-relaxed text-faint">
            <FileText aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
            Nothing you tick is stored or sent anywhere — the list lives in this tab only. Copy it
            out before you close it.
          </p>
        </div>
      </div>
    </div>
  );
}
