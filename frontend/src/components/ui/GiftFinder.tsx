'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, Sparkles } from 'lucide-react';

import { products } from '@/data/products';
import type { Product } from '@/types';
import SparkleBurst from '@/components/motion/SparkleBurst';

interface Question {
  id: string;
  prompt: string;
  hint: string;
  options: { id: string; label: string; note: string }[];
}

const QUESTIONS: Question[] = [
  {
    id: 'occasion',
    prompt: 'What is the occasion?',
    hint: 'This decides how loudly the piece is allowed to speak.',
    options: [
      { id: 'wedding', label: 'A wedding', note: 'Theirs, or one they are in' },
      { id: 'milestone', label: 'A milestone', note: 'An anniversary, a promotion, a birth' },
      { id: 'everyday', label: 'No occasion', note: 'The best reason there is' },
      { id: 'heirloom', label: 'To be kept', note: 'Something to hand on' },
    ],
  },
  {
    id: 'wearer',
    prompt: 'How do they actually dress?',
    hint: 'Be honest rather than aspirational — the piece has to be worn.',
    options: [
      { id: 'minimal', label: 'Quietly', note: 'One thing, well chosen' },
      { id: 'classic', label: 'Classically', note: 'Nothing that will date' },
      { id: 'bold', label: 'Boldly', note: 'They enjoy being looked at' },
      { id: 'traditional', label: 'Traditionally', note: 'Heritage work, worn properly' },
    ],
  },
  {
    id: 'metal',
    prompt: 'What is already in their jewellery box?',
    hint: 'New pieces should sit beside the old ones, not argue with them.',
    options: [
      { id: 'gold', label: 'Yellow gold', note: 'Warm, and mostly Indian gold' },
      { id: 'rose-gold', label: 'Rose gold', note: 'Blush, softer against the skin' },
      { id: 'platinum', label: 'White metals', note: 'Platinum or white gold' },
      { id: 'any', label: 'A bit of everything', note: 'They mix without worrying' },
    ],
  },
  {
    id: 'budget',
    prompt: 'What is the ceiling?',
    hint: 'No judgement, and nothing above it will be shown.',
    options: [
      { id: 'to-1', label: 'Under ₹1 lakh', note: 'More choice here than people expect' },
      { id: 'to-4', label: '₹1 – 4 lakh', note: 'Where the fine work starts' },
      { id: 'to-8', label: '₹4 – 8 lakh', note: 'Serious stones, serious settings' },
      { id: 'open', label: 'Open', note: 'Show me the best you have' },
    ],
  },
];

/** Rupee ceilings for the budget answers. */
const CEILINGS: Record<string, number> = {
  'to-1': 100_000,
  'to-4': 400_000,
  'to-8': 800_000,
  open: Infinity,
};

const priceOf = (p: Product) => Number(p.price.replace(/[^\d]/g, '')) || 0;

/**
 * Category weights per style answer. Positive attracts, negative repels — a
 * flat "matches / does not match" filter tends to return either everything or
 * nothing on a catalogue this size.
 */
const STYLE_WEIGHTS: Record<string, Partial<Record<Product['category'], number>>> = {
  minimal: { earrings: 3, necklaces: 2, rings: 2, bracelets: 1, sets: -2 },
  classic: { rings: 3, necklaces: 2, earrings: 2, bracelets: 2, sets: 0 },
  bold: { necklaces: 3, sets: 3, rings: 2, earrings: 1, bracelets: 1 },
  traditional: { sets: 4, necklaces: 3, bracelets: 2, earrings: 1, rings: 0 },
};

const OCCASION_WEIGHTS: Record<string, (p: Product) => number> = {
  wedding: (p) => (p.collection === 'bridal-elegance' ? 5 : 0) + (p.category === 'sets' ? 2 : 0),
  milestone: (p) => (p.isBestseller ? 3 : 0) + (p.gemstone?.includes('Diamond') ? 2 : 0),
  everyday: (p) => (p.collection === 'everyday-luxe' ? 5 : 0) + (priceOf(p) < 150_000 ? 2 : 0),
  heirloom: (p) => (p.collection === 'heritage' ? 5 : 0) + (priceOf(p) > 400_000 ? 2 : 0),
};

/**
 * A four-question quiz that narrows the catalogue to three pieces.
 *
 * Recommendations are *scored* rather than filtered. Hard filters are the obvious
 * approach and they fail in the same way every time: someone answers "under a
 * lakh, traditional, wedding" and the intersection is empty, so the quiz has to
 * apologise. Scoring means every combination of answers returns a ranked three,
 * and the reason each piece scored is shown alongside it — which is also what
 * makes the result feel considered rather than random.
 *
 * Budget stays a hard ceiling, because showing someone something they told you
 * they cannot afford is the one genuinely rude outcome.
 */
export default function GiftFinder({ className = '' }: { className?: string }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const done = step >= QUESTIONS.length;

  const results = useMemo(() => {
    if (!done) return [];
    const ceiling = CEILINGS[answers.budget] ?? Infinity;
    const styleW = STYLE_WEIGHTS[answers.wearer] ?? {};
    const occasionW = OCCASION_WEIGHTS[answers.occasion] ?? (() => 0);

    return products
      .filter((p) => priceOf(p) <= ceiling)
      .map((p) => {
        const reasons: string[] = [];
        let score = 0;

        const s = styleW[p.category] ?? 0;
        if (s > 0) {
          score += s;
          if (s >= 3) reasons.push(`${p.category} suit how they dress`);
        } else {
          score += s;
        }

        const o = occasionW(p);
        if (o > 0) {
          score += o;
          reasons.push(
            answers.occasion === 'wedding'
              ? 'made for bridal wear'
              : answers.occasion === 'heirloom'
                ? 'built to be handed on'
                : answers.occasion === 'everyday'
                  ? 'light enough to actually wear'
                  : 'a piece that marks something'
          );
        }

        if (answers.metal === 'any' || p.metal === answers.metal) {
          score += 3;
          if (answers.metal !== 'any') reasons.push(`in the ${p.metal.replace('-', ' ')} they wear`);
        }

        // Nudge toward the top of the stated budget rather than the bottom: the
        // best piece someone can afford is usually the one they wanted.
        if (ceiling !== Infinity && priceOf(p) > ceiling * 0.55) score += 1.5;
        if (p.isBestseller) score += 0.5;

        return { product: p, score, reasons: reasons.slice(0, 2) };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [done, answers]);

  const q = QUESTIONS[step];

  const answer = (id: string) => {
    setAnswers((a) => ({ ...a, [q.id]: id }));
    setStep((s) => s + 1);
  };

  const restart = () => {
    setAnswers({});
    setStep(0);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Progress rail */}
      <div className="mb-10 flex items-center gap-3">
        {QUESTIONS.map((_, i) => (
          <div key={i} className="h-px flex-1 overflow-hidden bg-line">
            <motion.span
              initial={false}
              animate={{ scaleX: i < step ? 1 : 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="block h-px origin-left bg-gradient-to-r from-gold-600 to-gold-300"
            />
          </div>
        ))}
        <span className="nums-tabular shrink-0 font-accent text-[10px] uppercase tracking-luxe text-faint">
          {Math.min(step + 1, QUESTIONS.length)} / {QUESTIONS.length}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, x: 40, filter: 'blur(10px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: -40, filter: 'blur(10px)' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <h3 className="mb-3 font-display text-3xl text-primary md:text-4xl">
              {q.prompt}
            </h3>
            <p className="mb-8 font-sans text-sm text-muted">{q.hint}</p>

            <div className="grid gap-3 sm:grid-cols-2">
              {q.options.map((o, i) => (
                <motion.button
                  key={o.id}
                  onClick={() => answer(o.id)}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.08 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className="group sweep-hover relative overflow-hidden rounded-2xl border border-line bg-surface/40 p-5 text-left transition-colors duration-500 hover:border-accent/50"
                >
                  <span className="mb-1.5 block font-accent text-sm uppercase tracking-luxe text-primary transition-colors group-hover:text-accent">
                    {o.label}
                  </span>
                  <span className="block font-sans text-[11px] leading-relaxed text-muted">
                    {o.note}
                  </span>
                </motion.button>
              ))}
            </div>

            {step > 0 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="mt-8 flex items-center gap-2 font-accent text-[10px] uppercase tracking-luxe text-faint transition-colors hover:text-accent"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Previous question
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-8 flex items-start justify-between gap-6">
              <div>
                <span className="mb-2 flex items-center gap-2 font-accent text-[10px] uppercase tracking-luxer text-accent">
                  <Sparkles className="h-3.5 w-3.5" /> Three suggestions
                </span>
                <h3 className="font-display text-3xl text-primary md:text-4xl">
                  Chosen for the person, not the price
                </h3>
              </div>
              <button
                onClick={restart}
                className="flex shrink-0 items-center gap-2 rounded-full border border-line px-4 py-2 font-accent text-[10px] uppercase tracking-luxe text-muted transition-colors hover:border-accent hover:text-accent"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Again
              </button>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              {results.map(({ product, reasons }, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 40, rotateY: -18 }}
                  animate={{ opacity: 1, y: 0, rotateY: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.15 + i * 0.14,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="group relative"
                  style={{ perspective: 1000 }}
                >
                  {/* The top match gets the sparkle. */}
                  {i === 0 && <SparkleBurst active count={14} className="z-20" />}

                  <Link
                    href={`/collections/${product.collection}`}
                    className="block overflow-hidden rounded-3xl border border-line bg-surface/50 transition-colors duration-500 hover:border-accent/45"
                  >
                    <span className="relative block aspect-[4/5] overflow-hidden">
                      <Image
                        src={product.images?.[0] ?? '/images/hero/hero-main.jpg'}
                        alt={product.name}
                        fill
                        sizes="(min-width: 640px) 30vw, 90vw"
                        className="media-tone object-cover transition-transform duration-[1200ms] ease-luxury group-hover:scale-110"
                      />
                      <span className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent" />
                      {i === 0 && (
                        <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 font-accent text-[9px] uppercase tracking-luxe text-onaccent">
                          Best match
                        </span>
                      )}
                    </span>

                    <span className="block p-5">
                      <span className="mb-1 block font-display text-lg leading-snug text-primary">
                        {product.name}
                      </span>
                      <span className="mb-3 block font-accent text-xs tracking-luxe text-accent">
                        {product.price}
                      </span>
                      <span className="space-y-1">
                        {reasons.map((r) => (
                          <span
                            key={r}
                            className="flex items-start gap-2 font-sans text-[11px] leading-snug text-muted"
                          >
                            <span className="mt-1.5 block h-1 w-1 shrink-0 rotate-45 bg-accent" />
                            {r}
                          </span>
                        ))}
                      </span>
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>

            {!results.length && (
              <p className="font-sans text-sm text-muted">
                Nothing in the catalogue sits under that ceiling yet — but the
                bespoke studio starts below it, and a commission at this level is
                genuinely better value than stock.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
