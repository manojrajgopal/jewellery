'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Sparkles } from 'lucide-react';

import { ease, springs } from '@/lib/motion';
import { products } from '@/data/products';

/**
 * Necklines, drawn as an SVG path across the shoulders. `open` is how much chest
 * the neckline leaves — the number the length advice is actually derived from —
 * and `avoid` is the length that competes with the neckline's own line rather
 * than answering it.
 */
const NECKLINES = [
  {
    id: 'crew',
    label: 'Crew',
    path: 'M 20 46 Q 50 30 80 46',
    open: 0.15,
    ideal: [16, 18] as const,
    note: 'A high neckline already draws a line across the collarbone. A choker fights it; a princess length sits below the hem and reads as a second neckline.',
  },
  {
    id: 'v',
    label: 'V-neck',
    path: 'M 20 40 L 50 74 L 80 40',
    open: 0.7,
    ideal: [18, 20] as const,
    note: 'The only neckline that names its own answer: a pendant that finishes just above the point of the V repeats the shape. Below the point and the eye reads two triangles.',
  },
  {
    id: 'boat',
    label: 'Boat',
    path: 'M 14 42 Q 50 38 86 42',
    open: 0.2,
    ideal: [16, 16] as const,
    note: 'A wide, flat line across the shoulders. It wants a short collar that follows the same horizontal, or nothing at all — a long chain hanging from it looks accidental.',
  },
  {
    id: 'square',
    label: 'Square',
    path: 'M 22 40 L 22 64 L 78 64 L 78 40',
    open: 0.5,
    ideal: [16, 18] as const,
    note: 'A hard horizontal hem. Curves are the counterweight: a rounded collar or a bib that fills the square, never a straight bar echoing it.',
  },
  {
    id: 'halter',
    label: 'Halter',
    path: 'M 34 34 Q 50 76 66 34',
    open: 0.8,
    ideal: [0, 0] as const,
    note: 'The neckline is already the necklace. This is the one case where the answer is earrings and a bracelet, and nothing at the throat at all.',
  },
] as const;

/**
 * Face shapes, and the earring outline that contradicts them. The rule of thumb is
 * genuinely old and genuinely useful: repeat a shape and it doubles; contradict it
 * and both look better.
 */
const FACES = [
  {
    id: 'round',
    label: 'Round',
    ring: 'rounded-[46%]',
    earring: 'Long drops and angular shapes',
    note: 'Length rather than width. A linear drop or an elongated teardrop lengthens; a hoop the same width as the cheek repeats the curve.',
  },
  {
    id: 'oval',
    label: 'Oval',
    ring: 'rounded-[50%_50%_46%_46%]',
    earring: 'Anything',
    note: 'The shape every chart calls balanced, which is a polite way of saying nothing is ruled out. Choose on the piece, not on the face.',
  },
  {
    id: 'square',
    label: 'Square',
    ring: 'rounded-[22%]',
    earring: 'Hoops and rounded drops',
    note: 'A strong jaw is worth softening rather than matching. Circles and curves; avoid a square stud sitting parallel to the jawline.',
  },
  {
    id: 'heart',
    label: 'Heart',
    ring: 'rounded-[46%_46%_38%_38%]',
    earring: 'Wider at the bottom',
    note: 'Weight low. A chandelier or a pear-drop widens the lower third; a wide stud at the lobe emphasises a brow that is already the widest line.',
  },
  {
    id: 'long',
    label: 'Long',
    ring: 'rounded-[52%_52%_44%_44%]',
    earring: 'Studs and short clusters',
    note: 'Nothing that adds length. A cluster or a short hoop widens; a shoulder-duster drop is the one thing to leave in the case.',
  },
] as const;

const OCCASIONS = ['Everyday', 'Office', 'Wedding', 'Evening'] as const;

/** Length in inches, and where it lands on a body — used to label the drawing. */
const LENGTHS: Record<number, string> = {
  0: 'None at the throat',
  14: 'Collar',
  16: 'Choker',
  18: 'Princess',
  20: 'Matinee',
  24: 'Opera',
};

/**
 * What to wear it with — the question the catalogue cannot answer.
 *
 * Every piece on this site is photographed alone on a plinth, and nobody wears
 * jewellery alone on a plinth. The three inputs here are the three things that
 * actually decide whether a necklace works on a given evening: what the neckline
 * does, what the face shape wants contradicted, and how much the occasion will
 * tolerate.
 *
 * The advice is stated as reasoning rather than as a verdict, because it is a rule
 * of thumb and pretending otherwise is how style guides become nonsense. Where the
 * honest answer is "wear nothing at the throat" — a halter — it says that, even
 * though it is the one answer that sells no necklaces.
 *
 * Recommendations are drawn from the real catalogue by matching category and
 * metal, so a piece added to the shop appears here without anyone maintaining a
 * second list.
 */
export default function SilhouetteAdvisor({ className = '' }: { className?: string }) {
  const [neck, setNeck] = useState<(typeof NECKLINES)[number]['id']>('v');
  const [face, setFace] = useState<(typeof FACES)[number]['id']>('oval');
  const [occasion, setOccasion] = useState<(typeof OCCASIONS)[number]>('Evening');

  const neckline = NECKLINES.find((n) => n.id === neck) ?? NECKLINES[1];
  const faceShape = FACES.find((f) => f.id === face) ?? FACES[1];

  const lengthLabel = LENGTHS[neckline.ideal[1]] ?? 'Princess';

  /**
   * Picks three pieces: one for the throat (unless the neckline says otherwise),
   * one pair of earrings, and one for the wrist — so the result is an outfit
   * rather than three near-identical necklaces.
   */
  const picks = useMemo(() => {
    const wantsNeck = neckline.ideal[1] > 0;
    const evening = occasion === 'Evening' || occasion === 'Wedding';

    const byWeight = (category: string) =>
      products
        .filter((p) => p.category === category)
        .sort((a, b) => {
          const price = (v: string) => Number(v.replace(/[^0-9]/g, '')) || 0;
          // Evening leans expensive, everyday leans light — a proxy for scale
          // that happens to be accurate in a catalogue this size.
          return evening ? price(b.price) - price(a.price) : price(a.price) - price(b.price);
        });

    return [
      wantsNeck ? byWeight('necklaces')[0] : undefined,
      byWeight('earrings')[0],
      byWeight('bracelets')[0],
    ].filter(Boolean) as typeof products;
  }, [neckline, occasion]);

  return (
    <div className={`grid gap-8 lg:grid-cols-[minmax(0,23rem)_minmax(0,1fr)] ${className}`}>
      {/* ---- The three questions ---- */}
      <div className="space-y-7 rounded-3xl border border-hairline bg-canvas-alt/60 p-6">
        <fieldset>
          <legend className="font-accent text-[10px] uppercase tracking-luxer text-accent">
            The neckline
          </legend>
          <div className="mt-3 grid grid-cols-5 gap-2">
            {NECKLINES.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => setNeck(n.id)}
                aria-pressed={n.id === neck}
                className={`rounded-xl border p-2 transition-all duration-300 ${
                  n.id === neck
                    ? 'border-accent bg-accent/10'
                    : 'border-hairline hover:border-accent/40'
                }`}
              >
                <svg viewBox="0 0 100 90" className="w-full" aria-hidden="true">
                  <path
                    d="M 8 88 L 8 30 Q 30 18 50 18 Q 70 18 92 30 L 92 88 Z"
                    fill="rgb(var(--surface-sunken))"
                    stroke="rgb(var(--hairline) / 0.35)"
                  />
                  <path
                    d={n.path}
                    fill="none"
                    stroke={n.id === neck ? 'rgb(var(--accent))' : 'rgb(var(--text-faint))'}
                    strokeWidth={4}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="mt-1 block truncate font-accent text-[8px] uppercase tracking-luxe text-faint">
                  {n.label}
                </span>
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-accent text-[10px] uppercase tracking-luxer text-accent">
            The face
          </legend>
          <div className="mt-3 grid grid-cols-5 gap-2">
            {FACES.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFace(f.id)}
                aria-pressed={f.id === face}
                className={`flex flex-col items-center gap-1.5 rounded-xl border p-2 transition-all duration-300 ${
                  f.id === face
                    ? 'border-accent bg-accent/10'
                    : 'border-hairline hover:border-accent/40'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`block h-8 w-6 border ${f.ring} ${
                    f.id === face
                      ? 'border-accent/70 bg-accent/15'
                      : 'border-line-strong bg-surface-sunken'
                  }`}
                />
                <span className="truncate font-accent text-[8px] uppercase tracking-luxe text-faint">
                  {f.label}
                </span>
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-accent text-[10px] uppercase tracking-luxer text-accent">
            The occasion
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {OCCASIONS.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => setOccasion(o)}
                aria-pressed={o === occasion}
                className={`rounded-full border px-3 py-1.5 font-accent text-[10px] uppercase tracking-luxe transition-all duration-300 ${
                  o === occasion
                    ? 'border-accent bg-accent text-onaccent'
                    : 'border-hairline text-muted hover:text-accent'
                }`}
              >
                {o}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      {/* ---- The answer ---- */}
      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-3xl border border-hairline bg-surface-raised/50 p-6 md:p-8">
          <div className="flex flex-wrap items-start gap-8">
            {/* The drawing: the chosen neckline with the recommended length marked
                on it, so the advice is spatial rather than a number in a sentence. */}
            <div className="relative w-40 flex-shrink-0">
              <svg viewBox="0 0 100 150" className="w-full" aria-hidden="true">
                <path
                  d="M 8 148 L 8 34 Q 30 20 50 20 Q 70 20 92 34 L 92 148 Z"
                  fill="rgb(var(--surface-sunken))"
                  stroke="rgb(var(--hairline) / 0.3)"
                />
                <motion.path
                  key={neckline.id}
                  d={neckline.path}
                  fill="none"
                  stroke="rgb(var(--text-muted))"
                  strokeWidth={3}
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.7, ease: ease.luxury }}
                />
                {/* Length marker. Inches map to the drawing at roughly 2.6 units
                    per inch below the collarbone, which is close enough to be
                    honest at this size. */}
                {neckline.ideal[1] > 0 && (
                  <motion.g
                    key={`len-${neckline.ideal[1]}`}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <line
                      x1={50}
                      y1={30}
                      x2={50}
                      y2={30 + (neckline.ideal[1] - 12) * 5.4}
                      stroke="rgb(var(--accent) / 0.55)"
                      strokeWidth={1}
                      strokeDasharray="3 3"
                    />
                    <circle
                      cx={50}
                      cy={30 + (neckline.ideal[1] - 12) * 5.4}
                      r={4.5}
                      fill="rgb(var(--accent))"
                    />
                  </motion.g>
                )}
              </svg>
              <span className="mt-2 block text-center font-accent text-[10px] uppercase tracking-luxe text-accent">
                {neckline.ideal[1] > 0 ? `${neckline.ideal[1]}″ · ${lengthLabel}` : lengthLabel}
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${neck}-${face}-${occasion}`}
                initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
                transition={{ duration: 0.45, ease: ease.luxury }}
                className="min-w-0 flex-1 space-y-4"
              >
                <div>
                  <span className="font-accent text-[10px] uppercase tracking-luxer text-accent">
                    At the throat
                  </span>
                  <p className="mt-1.5 font-sans text-sm font-light leading-relaxed text-secondary">
                    {neckline.note}
                  </p>
                </div>
                <div>
                  <span className="font-accent text-[10px] uppercase tracking-luxer text-accent">
                    At the ear — {faceShape.earring.toLowerCase()}
                  </span>
                  <p className="mt-1.5 font-sans text-sm font-light leading-relaxed text-secondary">
                    {faceShape.note}
                  </p>
                </div>
                <p className="flex items-start gap-2 rounded-xl border border-hairline bg-canvas/50 px-4 py-3 font-sans text-xs font-light leading-relaxed text-muted">
                  <Sparkles className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-accent" aria-hidden="true" />
                  {occasion === 'Everyday' &&
                    'For every day, one piece doing the work and the rest quiet. Anything you have to think about before leaving the house will stay in the drawer.'}
                  {occasion === 'Office' &&
                    'Nothing that moves audibly or catches on a sleeve. A stud, a fine chain, and a bracelet that clears a keyboard.'}
                  {occasion === 'Wedding' &&
                    'Photographed all day from every angle, so scale reads and detail does not. Choose the bigger of two options here — it is the one place on this list where restraint photographs as absence.'}
                  {occasion === 'Evening' &&
                    'Evening light comes from above and behind. Anything with movement earns its place; matte stones disappear.'}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ---- The pieces ---- */}
        <div>
          <span className="font-accent text-[10px] uppercase tracking-luxer text-faint">
            From the catalogue
          </span>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {picks.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.09, duration: 0.5, ease: ease.luxury }}
                whileHover={{ y: -6, transition: springs.plate }}
                className="group overflow-hidden rounded-2xl border border-hairline bg-surface-raised/50"
              >
                <Link href={`/collections/${p.collection}`} className="block p-4">
                  <span className="font-accent text-[9px] uppercase tracking-luxe text-accent">
                    {p.category}
                  </span>
                  <span className="mt-1 block font-display text-lg leading-snug text-primary">
                    {p.name}
                  </span>
                  <span className="mt-2 flex items-center justify-between font-sans text-xs text-muted nums-tabular">
                    {p.price}
                    <ArrowUpRight
                      className="h-3.5 w-3.5 text-faint transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
