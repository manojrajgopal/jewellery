'use client';

import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Info } from 'lucide-react';

import { easeLens, springsHeavy } from '@/lib/motion';

/**
 * Undertone rather than depth.
 *
 * The usual version of this tool asks how light or dark your skin is, which is
 * both crude and the wrong question — depth has almost no bearing on which metal
 * flatters. What matters is *undertone*: whether the skin's own colour sits
 * warm (yellow/golden), cool (pink/blue) or neutral. A deep cool complexion and
 * a fair cool complexion suit the same metals.
 *
 * The vein test is the one reliable at-home check and it costs nothing, so it is
 * the primary route in. `swatch` values are drawn from the house palette rather
 * than approximating skin, because approximating skin in six swatches is how
 * these tools end up insulting.
 */
const UNDERTONES = [
  {
    id: 'warm',
    label: 'Warm',
    test: 'Veins at your wrist look green. Gold jewellery has always looked "right" on you.',
    also: 'Cream and camel flatter you more than pure white.',
  },
  {
    id: 'cool',
    label: 'Cool',
    test: 'Veins look blue or purple. Silver has always been the easier choice.',
    also: 'Pure white and charcoal sit better on you than cream.',
  },
  {
    id: 'neutral',
    label: 'Neutral',
    test: 'You cannot tell — the veins read somewhere between, and both metals seem fine.',
    also: 'This is the commonest answer and it is a genuine advantage.',
  },
  {
    id: 'olive',
    label: 'Olive',
    test: 'Veins look green but the skin has a distinct grey-green cast in daylight.',
    also: 'Often mistaken for warm. It behaves differently and deserves its own answer.',
  },
] as const;

type Undertone = (typeof UNDERTONES)[number]['id'];

/**
 * The metals, scored against each undertone.
 *
 * Scores are 1–5 and they are judgements from the counter rather than
 * measurements — there is no physics here, only what forty years of watching
 * people try things on produces. They are stated as opinion below the grid.
 */
interface Metal {
  id: string;
  name: string;
  karat?: string;
  /** Tailwind gradient for the swatch. */
  swatch: string;
  scores: Record<Undertone, number>;
  /** Why it works or does not. */
  reasons: Record<Undertone, string>;
  /** The practical caveat, independent of tone. */
  practical: string;
}

const METALS: Metal[] = [
  {
    id: 'yellow-22',
    name: 'Yellow gold',
    karat: '22k',
    swatch: 'from-gold-300 via-gold-400 to-gold-600',
    scores: { warm: 5, cool: 2, neutral: 4, olive: 5 },
    reasons: {
      warm: 'The saturated yellow of 22k picks up the gold already in warm skin and reads as continuous with it.',
      cool: 'Deep yellow against pink undertones creates a visible boundary — the metal looks applied rather than worn.',
      neutral: 'Works, and reads as traditional rather than as a considered choice.',
      olive: 'The best pairing there is. High-karat yellow is the one metal that makes an olive cast look deliberate.',
    },
    practical:
      'Too soft to hold a stone securely for daily wear. Correct for a bangle or a chain, wrong for a solitaire.',
  },
  {
    id: 'yellow-18',
    name: 'Yellow gold',
    karat: '18k',
    swatch: 'from-gold-200 via-gold-400 to-gold-500',
    scores: { warm: 5, cool: 3, neutral: 4, olive: 4 },
    reasons: {
      warm: 'Slightly paler than 22k, which flatters warm skin without the deep yellow overwhelming a fair complexion.',
      cool: 'Paler yellow is far more forgiving against cool skin than 22k. Workable, particularly in a thin section.',
      neutral: 'The safest yellow. Suits almost everyone at almost any width.',
      olive: 'Very good, though 22k is better if the piece can take the softness.',
    },
    practical:
      'The standard for set pieces worldwide. Hard enough for prongs, warm enough to read as gold.',
  },
  {
    id: 'rose-18',
    name: 'Rose gold',
    karat: '18k',
    swatch: 'from-rose-100 via-rose-300 to-rose-500',
    scores: { warm: 4, cool: 5, neutral: 5, olive: 3 },
    reasons: {
      warm: 'Good, though the copper in the alloy competes with warm skin rather than complementing it.',
      cool: 'The one warm-family metal that genuinely suits cool skin — the pink in the alloy meets the pink in the complexion.',
      neutral: 'Excellent, and the most flattering choice for a neutral tone in photographs.',
      olive: 'The copper tends to pull the grey-green in olive skin forward. Try it in daylight before committing.',
    },
    practical:
      'The copper makes it the hardest of the golds, and the least likely to bend out of round. It does not tarnish.',
  },
  {
    id: 'white-18',
    name: 'White gold',
    karat: '18k',
    swatch: 'from-ink-100 via-ink-200 to-ink-400',
    scores: { warm: 2, cool: 5, neutral: 4, olive: 2 },
    reasons: {
      warm: 'The bright cool white sits against warm skin as a contrast rather than a complement. Some people want exactly that.',
      cool: 'Native. Nothing flatters cool undertones more directly.',
      neutral: 'Very good, and the more modern-looking of the two safe choices.',
      olive: 'Tends to make olive skin look sallow by comparison. Platinum is the better cool metal here.',
    },
    practical:
      'Rhodium-plated, and the plating wears through in 12–24 months on a ring worn daily. Re-plating is a recurring cost for the life of the piece.',
  },
  {
    id: 'platinum',
    name: 'Platinum',
    swatch: 'from-ink-50 via-platinum to-ink-300',
    scores: { warm: 3, cool: 5, neutral: 5, olive: 4 },
    reasons: {
      warm: 'Cooler than warm skin wants, but its softer, greyer white is much kinder than rhodium-plated gold.',
      cool: 'The best possible pairing, and it stays that colour permanently.',
      neutral: 'Effectively perfect. There is no complexion platinum actively fights.',
      olive: 'The grey in platinum meets the grey in olive skin rather than exposing it. Far better than white gold.',
    },
    practical:
      'Naturally white all the way through, so there is nothing to re-plate, ever. Denser than gold, so the same ring feels heavier and costs more per gram.',
  },
];

interface SkinToneMatcherProps {
  className?: string;
}

/**
 * Which metal against which undertone, and why.
 *
 * The usual version of this asks how light your skin is, which is the wrong
 * question — depth barely matters, undertone decides almost everything, and a
 * deep cool complexion and a fair cool complexion want the same metals. So this
 * asks about undertone, and it asks through the vein test, which is the one
 * at-home check that actually works and costs nothing.
 *
 * The scores are opinions and are labelled as opinions. What is not an opinion
 * is the practical column: rhodium plating wears through in eighteen months,
 * 22k is too soft to hold a stone, platinum never needs re-plating. Those are
 * facts with money attached and they sit at the same weight as the flattery,
 * because for most people the recurring cost matters more than the half-grade of
 * suitability.
 *
 * Olive is given its own answer rather than being folded into warm. It behaves
 * differently — high-karat yellow is its best pairing and white gold its worst —
 * and every tool that collapses it into 'warm' gets that backwards.
 */
export default function SkinToneMatcher({ className = '' }: SkinToneMatcherProps) {
  const reduced = useReducedMotion();
  const [tone, setTone] = useState<Undertone | null>(null);

  const ranked = useMemo(() => {
    if (!tone) return METALS;
    return [...METALS].sort((a, b) => b.scores[tone] - a.scores[tone]);
  }, [tone]);

  const undertone = UNDERTONES.find((u) => u.id === tone);

  return (
    <div className={className}>
      {/* ================= The vein test ================= */}
      <div className="rounded-3xl border border-hairline bg-canvas-alt/60 p-6 md:p-8">
        <span className="font-accent text-[10px] uppercase tracking-luxer text-accent">
          Turn your wrist over, in daylight
        </span>
        <p className="mt-3 max-w-2xl font-sans text-sm font-light leading-relaxed text-secondary">
          Not under a lamp — daylight, near a window. Look at the veins on the inside of your wrist
          and pick whichever line below is truest. This is the only at-home test that works, and it
          is asking about undertone, not about how light or dark you are. Depth barely matters here.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {UNDERTONES.map((u) => {
            const on = tone === u.id;
            return (
              <button
                key={u.id}
                type="button"
                onClick={() => setTone(on ? null : u.id)}
                aria-pressed={on}
                className={`rounded-2xl border p-5 text-left transition-all duration-400 ${
                  on
                    ? 'border-accent bg-accent/[0.08]'
                    : 'border-hairline hover:border-accent/40 hover:bg-canvas-alt/40'
                }`}
              >
                <span
                  className={`font-accent text-xs uppercase tracking-luxe ${
                    on ? 'text-accent' : 'text-secondary'
                  }`}
                >
                  {u.label}
                </span>
                <p className="mt-2 font-sans text-sm font-light leading-relaxed text-muted">
                  {u.test}
                </p>
              </button>
            );
          })}
        </div>

        {undertone && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springsHeavy.leaf}
            className="mt-5 flex gap-3 font-sans text-xs font-light leading-relaxed text-faint"
          >
            <Info aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
            {undertone.also}
          </motion.p>
        )}
      </div>

      {/* ================= The metals ================= */}
      <div className="mt-8 space-y-3">
        {ranked.map((metal, i) => {
          const score = tone ? metal.scores[tone] : null;
          const reason = tone ? metal.reasons[tone] : null;
          const best = tone !== null && i === 0;

          return (
            <motion.div
              key={metal.id}
              layout={!reduced}
              transition={reduced ? { duration: 0 } : springsHeavy.tray}
              className={`overflow-hidden rounded-3xl border p-6 transition-colors duration-500 ${
                best ? 'border-accent bg-accent/[0.07]' : 'border-hairline bg-canvas-alt/40'
              }`}
            >
              <div className="flex flex-wrap items-start gap-5">
                {/* Swatch */}
                <motion.span
                  aria-hidden="true"
                  animate={{ scale: best ? 1.08 : 1 }}
                  transition={reduced ? { duration: 0 } : springsHeavy.detent}
                  className={`h-14 w-14 shrink-0 rounded-full bg-gradient-to-br ${metal.swatch} ${
                    best ? 'shadow-[0_0_22px_4px_rgb(var(--gold-500)/0.35)]' : ''
                  }`}
                />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <h3 className="font-display text-2xl text-primary">{metal.name}</h3>
                    {metal.karat && (
                      <span className="font-accent text-[10px] uppercase tracking-luxer text-faint">
                        {metal.karat}
                      </span>
                    )}
                    {best && (
                      <motion.span
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="rounded-full border border-accent/50 bg-accent/10 px-3 py-1 font-accent text-[9px] uppercase tracking-luxe text-accent"
                      >
                        Best for you
                      </motion.span>
                    )}
                  </div>

                  {/* Score, as pips, only once a tone has been chosen. */}
                  {score !== null && (
                    <div className="mt-3 flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <motion.span
                          key={n}
                          initial={false}
                          animate={{ opacity: n <= score ? 1 : 0.18 }}
                          transition={
                            reduced ? { duration: 0 } : { ...springsHeavy.detent, delay: n * 0.03 }
                          }
                          className="h-1.5 w-7 rounded-full bg-accent"
                        />
                      ))}
                      <span className="ml-2 font-accent text-[10px] text-faint nums-tabular">
                        {score}/5
                      </span>
                    </div>
                  )}

                  {reason && (
                    <motion.p
                      key={`${metal.id}-${tone}`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, ease: easeLens.focusRing }}
                      className="mt-4 font-sans text-sm font-light leading-relaxed text-secondary"
                    >
                      {reason}
                    </motion.p>
                  )}

                  <p className="mt-4 border-l border-accent/30 pl-4 font-sans text-xs font-light leading-relaxed text-muted">
                    <span className="font-accent uppercase tracking-luxe text-accent">
                      Practically ·{' '}
                    </span>
                    {metal.practical}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <p className="mt-6 font-sans text-xs font-light leading-relaxed text-faint">
        The suitability scores are our opinion, formed at a counter over four generations, and you
        should overrule them if a metal looks right to you in a mirror. The practical notes are not
        opinion — rhodium does wear through, 22k is too soft for prongs, and platinum never needs
        re-plating. For most people the recurring cost decides this more than the half-grade of
        flattery does.
      </p>
    </div>
  );
}
