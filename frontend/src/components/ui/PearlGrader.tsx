'use client';

import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { easeCine } from '@/lib/motion';

/**
 * Grading a pearl, which is nothing like grading a diamond.
 *
 * The site teaches the four Cs at length, and every one of them is the wrong
 * tool here. A pearl has no cut, its colour is a preference rather than a scale,
 * and carat weight is close to irrelevant because size is measured in
 * millimetres and priced separately. What actually decides whether a pearl is
 * worth ten pounds or ten thousand is nacre thickness — and nacre thickness is
 * the one figure almost no retailer will quote.
 *
 * The reason it is not quoted is that it cannot be seen. Nacre is the layered
 * aragonite the oyster deposits over the bead, and a cultured pearl with 0.3mm
 * of it looks identical, on a tray, to one with 2mm. The difference appears in
 * about eight years, when the thin one wears through at the drill hole and the
 * bead shows as a dull grey ring. That is the whole of it, and it is why lustre
 * is weighted hardest below: lustre is the only factor a buyer can see that
 * *correlates* with nacre depth, because deep nacre is what produces the sharp,
 * almost metallic reflection that thin nacre cannot.
 *
 * The five factors and their weights are the ones the trade actually uses. They
 * are not equal, and presenting them as five equal dials — which is what most
 * educational pages do — hands a buyer a rubric that scores a bad pearl well.
 */
interface Factor {
  id: string;
  name: string;
  /** Share of the grade. Sums to 1. */
  weight: number;
  /** What each of the five steps means, worst first. */
  steps: [string, string, string, string, string];
  /** Why it is weighted this way. */
  why: string;
}

const FACTORS: Factor[] = [
  {
    id: 'lustre',
    name: 'Lustre',
    weight: 0.36,
    steps: [
      'Chalky. No reflection at all — the surface looks like matte paint.',
      'Dull. A reflection exists but has no edges to it.',
      'Good. Your outline is visible in it, softly.',
      'High. Reflections have hard edges and there is depth behind them.',
      'Metallic. Reads almost like polished silver, with a visible glow from under the surface.',
    ],
    why: 'Weighted hardest because it is the only visible proxy for nacre depth, which is the thing that decides whether the pearl survives a generation.',
  },
  {
    id: 'nacre',
    name: 'Nacre thickness',
    weight: 0.24,
    steps: [
      'Under 0.25 mm. Will wear through at the drill hole inside a decade.',
      '0.25–0.4 mm. The commercial minimum, and the reason so many strands look tired at twenty years.',
      '0.4–0.8 mm. Sound. Will outlive its first owner with reasonable care.',
      '0.8–1.5 mm. Excellent, and where the price begins to climb steeply.',
      'Over 1.5 mm, or a natural pearl with no bead at all. Effectively permanent.',
    ],
    why: 'The figure that determines lifespan. Ask for it in millimetres; a house that will not answer is telling you the answer.',
  },
  {
    id: 'surface',
    name: 'Surface',
    weight: 0.16,
    steps: [
      'Heavily marked. Pitting and ridges visible across most of the pearl.',
      'Noticeably marked. Blemishes findable at arm&rsquo;s length.',
      'Lightly marked. Visible on close inspection, hidden by the drill hole or the setting.',
      'Nearly clean. One or two marks under a loupe.',
      'Clean. Genuinely rare, and priced accordingly.',
    ],
    why: 'Third rather than first, because a mark that can be turned to the back of a strand costs the wearer nothing — unlike thin nacre, which cannot be hidden anywhere.',
  },
  {
    id: 'shape',
    name: 'Shape',
    weight: 0.14,
    steps: [
      'Baroque, irregular. A legitimate choice, priced low by convention rather than by quality.',
      'Drop or button, uneven.',
      'Drop or button, symmetrical.',
      'Near-round. Off by a fraction that only a caliper finds.',
      'Round. Under two percent variation in diameter, which is about one pearl in ten thousand.',
    ],
    why: 'Round is rare and therefore dear, but a fine baroque with metallic lustre is a better pearl than a round one with dull nacre — and about a fifth of the price.',
  },
  {
    id: 'match',
    name: 'Matching',
    weight: 0.1,
    steps: [
      'Unmatched. Obvious variation in size and colour along the strand.',
      'Loosely matched.',
      'Well matched, with a visible graduation.',
      'Closely matched. Differences findable but not noticeable.',
      'Indistinguishable. Months of sorting, and the reason a fine strand costs more than the sum of its pearls.',
    ],
    why: 'Only applies to a strand, and it is the factor that explains the price gap between a strand and the same pearls sold singly.',
  },
];

/** What the composite score is called, and what it is worth saying about it. */
const GRADES: { at: number; label: string; note: string }[] = [
  {
    at: 0.86,
    label: 'Heirloom',
    note: 'The strand that gets left to somebody and is still right when they get it. We see perhaps a dozen a year.',
  },
  {
    at: 0.7,
    label: 'Fine',
    note: 'Genuinely good pearls with a long life in them. This is what we would put on our own family.',
  },
  {
    at: 0.52,
    label: 'Good',
    note: 'Sound and honest. Will look like this in twenty years if it is restrung on schedule.',
  },
  {
    at: 0.34,
    label: 'Commercial',
    note: 'The grade most jewellery is made from. Nothing wrong with it — but it is not an heirloom and should not be sold as one.',
  },
  {
    at: 0,
    label: 'Costume',
    note: 'Thin nacre over a bead. It will wear through, and knowing that in advance is the difference between a disappointment and a choice.',
  },
];

const TYPES = [
  { id: 'akoya', name: 'Akoya', mm: '6–9 mm', note: 'The classic white strand. Bead-nucleated, so nacre thickness is the whole question.' },
  { id: 'freshwater', name: 'Freshwater', mm: '5–12 mm', note: 'Usually tissue-nucleated, meaning solid nacre and no bead to wear through to. Underrated for exactly that reason.' },
  { id: 'south-sea', name: 'South Sea', mm: '9–20 mm', note: 'The largest, and grown for two to four years, so the nacre is thick almost by definition.' },
  { id: 'tahitian', name: 'Tahitian', mm: '8–16 mm', note: 'Naturally dark, and the only pearls where the overtone — peacock, aubergine, green — is priced above the body colour.' },
];

export default function PearlGrader() {
  const [scores, setScores] = useState<Record<string, number>>({
    lustre: 3,
    nacre: 2,
    surface: 3,
    shape: 3,
    match: 3,
  });
  const [type, setType] = useState('akoya');
  const reduced = useReducedMotion();

  const composite = useMemo(
    () =>
      FACTORS.reduce((sum, f) => sum + ((scores[f.id] ?? 0) / 4) * f.weight, 0),
    [scores]
  );

  const grade = GRADES.find((g) => composite >= g.at) ?? GRADES[GRADES.length - 1];
  const selected = TYPES.find((t) => t.id === type)!;

  return (
    <div className="mx-auto max-w-5xl">
      {/* Type first, because it changes what the nacre figure even means. */}
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Pearl type">
        {TYPES.map((t) => {
          const on = t.id === type;
          return (
            <button
              key={t.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => setType(t.id)}
              className={`rounded-full border px-5 py-2 font-accent text-[10px] uppercase tracking-luxe transition-colors duration-300 ${
                on
                  ? 'border-accent bg-accent text-onaccent'
                  : 'border-hairline text-muted hover:border-accent/50 hover:text-accent'
              }`}
            >
              {t.name}
            </button>
          );
        })}
      </div>

      <p className="mt-4 max-w-2xl font-sans text-sm font-light leading-relaxed text-muted">
        <span className="nums-instrument text-primary">{selected.mm}</span> — {selected.note}
      </p>

      <div className="mt-12 grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] md:gap-16">
        {/* ---- The five dials ---- */}
        <div className="space-y-8">
          {FACTORS.map((f) => {
            const value = scores[f.id] ?? 0;
            return (
              <div key={f.id}>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-display text-lg text-primary">{f.name}</span>
                  {/* The weight, printed. A hidden weighting is a rubric that
                      lies, and this whole component exists because of one. */}
                  <span className="nums-instrument shrink-0 font-accent text-[9px] uppercase tracking-luxe text-faint">
                    {Math.round(f.weight * 100)}% of grade
                  </span>
                </div>

                {/* Five steps as five buttons rather than a slider: these are
                    named categories from a grading sheet, not a continuum, and a
                    slider implies you can be between two of them. */}
                <div className="mt-3 flex gap-1.5">
                  {[0, 1, 2, 3, 4].map((s) => {
                    const on = value >= s;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setScores((p) => ({ ...p, [f.id]: s }))}
                        aria-label={`${f.name}, step ${s + 1} of 5`}
                        aria-pressed={value === s}
                        className={`h-2 flex-1 rounded-full transition-colors duration-300 ${
                          on ? 'bg-accent' : 'bg-line/50 hover:bg-accent/40'
                        }`}
                      />
                    );
                  })}
                </div>

                <motion.p
                  key={value}
                  initial={reduced ? false : { opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="mt-3 font-sans text-sm font-light leading-relaxed text-muted"
                  dangerouslySetInnerHTML={{ __html: f.steps[value] }}
                />

                <p className="mt-2 font-accent text-[10px] uppercase leading-relaxed tracking-luxe text-faint">
                  {f.why}
                </p>
              </div>
            );
          })}
        </div>

        {/* ---- The pearl itself, and the verdict ---- */}
        <div className="md:sticky md:top-28 md:self-start">
          {/* Drawn rather than photographed, because the point is that the four
              things being varied are visible — and no single photograph can be
              re-lit by a slider. */}
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-hairline bg-surface-sunken">
            <motion.div
              className="absolute left-1/2 top-1/2 h-[62%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full"
              animate={{
                // Shape: round at 4, increasingly irregular below it.
                borderRadius:
                  (scores.shape ?? 4) >= 4
                    ? '50%'
                    : (scores.shape ?? 0) >= 2
                      ? '50% 46% 52% 48% / 48% 52% 46% 50%'
                      : '58% 40% 52% 46% / 42% 56% 40% 58%',
                // Lustre: the specular highlight's tightness and strength.
                filter: `contrast(${0.85 + (scores.lustre ?? 0) * 0.09}) saturate(${0.8 + (scores.lustre ?? 0) * 0.08})`,
              }}
              transition={reduced ? { duration: 0 } : { duration: 0.6, ease: easeCine.glass }}
              style={{
                background: `radial-gradient(38% 34% at 34% 28%, rgb(var(--cream-50) / ${0.35 + (scores.lustre ?? 0) * 0.16}), transparent ${58 - (scores.lustre ?? 0) * 6}%), radial-gradient(circle at 62% 72%, rgb(var(--rose-100) / 0.3), transparent 60%), linear-gradient(150deg, rgb(var(--cream-100)), rgb(var(--ink-200)))`,
                boxShadow: `inset 0 0 40px -10px rgb(var(--shadow-color) / 0.4), 0 20px 50px -24px rgb(var(--shadow-color) / 0.6)`,
              }}
            >
              {/* Surface blemishes, appearing as the surface score falls. Placed
                  deterministically so they do not dance while another slider is
                  being moved. */}
              {[0, 1, 2, 3, 4, 5].slice(0, 5 - (scores.surface ?? 4)).map((i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  className="absolute rounded-full bg-[rgb(var(--ink-500))] opacity-30"
                  style={{
                    left: `${22 + ((i * 47) % 58)}%`,
                    top: `${30 + ((i * 31) % 52)}%`,
                    width: `${3 + (i % 3) * 2}px`,
                    height: `${2 + (i % 2) * 2}px`,
                  }}
                />
              ))}
            </motion.div>

            {/* The drill hole, and the nacre section through it. This is the
                drawing nobody is shown: it is where the wear happens. */}
            <div className="absolute bottom-4 left-4 right-4">
              <p className="mb-2 font-accent text-[9px] uppercase tracking-luxe text-faint">
                Section at the drill hole
              </p>
              <div className="flex h-6 overflow-hidden rounded-sm border border-hairline">
                <motion.span
                  className="bg-[linear-gradient(90deg,rgb(var(--cream-50)/0.9),rgb(var(--cream-100)/0.6))]"
                  animate={{ width: `${12 + (scores.nacre ?? 0) * 14}%` }}
                  transition={reduced ? { duration: 0 } : { duration: 0.5, ease: easeCine.glass }}
                />
                <span className="flex-1 bg-[rgb(var(--ink-400))] opacity-50" />
                <motion.span
                  className="bg-[linear-gradient(90deg,rgb(var(--cream-100)/0.6),rgb(var(--cream-50)/0.9))]"
                  animate={{ width: `${12 + (scores.nacre ?? 0) * 14}%` }}
                  transition={reduced ? { duration: 0 } : { duration: 0.5, ease: easeCine.glass }}
                />
              </div>
              <p className="mt-1.5 font-accent text-[9px] uppercase tracking-luxe text-faint">
                nacre · bead · nacre
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-hairline bg-surface-raised/40 p-6">
            <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
              Composite grade
            </p>
            <div className="mt-2 flex items-baseline gap-4">
              <p className="font-display text-3xl text-primary">{grade.label}</p>
              <p className="nums-instrument font-accent text-[10px] uppercase tracking-luxe text-faint">
                {(composite * 100).toFixed(0)} / 100
              </p>
            </div>

            <span className="mt-4 block h-1 rounded-full bg-line/50">
              <motion.span
                className="block h-full rounded-full bg-accent"
                initial={false}
                animate={{ width: `${composite * 100}%` }}
                transition={reduced ? { duration: 0 } : { duration: 0.6, ease: easeCine.glass }}
              />
            </span>

            <p className="mt-4 font-sans text-sm font-light leading-relaxed text-muted">
              {grade.note}
            </p>
          </div>

          <p className="mt-5 font-sans text-sm font-light leading-relaxed text-muted">
            Restring every eighteen months if worn weekly, and on silk with a knot between each
            pearl. The knots are not decoration — they stop the pearls abrading each other, and they
            mean a broken strand loses one pearl instead of forty.
          </p>
        </div>
      </div>
    </div>
  );
}
