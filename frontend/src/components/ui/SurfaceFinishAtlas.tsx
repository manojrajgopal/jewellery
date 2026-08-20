'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * The seven finishes, and what each of them looks like in eight years.
 *
 * A finish is the last hour of work on a piece and the first thing to go. That
 * asymmetry is the whole subject: a mirror polish is the most expensive surface
 * on this list and the least durable, and a bead-blast matt is the cheapest and
 * survives everything — which is the exact opposite of what the prices imply
 * and the exact opposite of what customers assume.
 *
 * The `ages` field on each is the honest one. Every surface here changes, and
 * the ones that are described as "low maintenance" are simply the ones whose
 * change is a wearer would not notice, rather than the ones that do not change.
 *
 * The `restore` field says whether it can be put back, and this is the field
 * that should decide the choice. A mirror polish restores completely in twenty
 * minutes for as long as there is metal left. A hand-applied Florentine engraved
 * texture cannot be restored at all without re-cutting it, and re-cutting it
 * removes metal that is not coming back. Which means the finish that looks
 * hardest-wearing is the one that is genuinely gone when it goes.
 */

interface Finish {
  id: string;
  name: string;
  /** The CSS that draws the swatch. Real surfaces, not photographs. */
  swatch: string;
  how: string;
  ages: string;
  restore: string;
  /** Bench hours, relative to a mirror polish on the same piece. */
  hours: number;
  /** How well it hides daily scratching, 1–5. */
  hides: number;
}

const FINISHES: Finish[] = [
  {
    id: 'mirror',
    name: 'Mirror polish',
    swatch:
      'linear-gradient(126deg, rgb(var(--gold-700)) 0%, rgb(var(--gold-300)) 22%, rgb(var(--gold-50)) 40%, rgb(var(--gold-400)) 58%, rgb(var(--gold-800)) 78%, rgb(var(--gold-400)) 100%)',
    how: 'Four wheels in a fixed order — emery, tripoli, white diamond, rouge — each removing the scratches of the one before it. The last is half a micron and does not cut at all; it burnishes, smearing the surface metal into a genuine mirror.',
    ages: 'Badly, and immediately. A polished ring picks up its first visible scratch within a fortnight and settles into a soft haze of thousands of them within two years. Everyone who has ever owned one knows this and almost nobody is told it beforehand.',
    restore: 'Completely, in about twenty minutes, for as long as there is metal to take. We do it free on anything of ours, and most people bring a piece in every three or four years.',
    hours: 1,
    hides: 1,
  },
  {
    id: 'satin',
    name: 'Satin',
    swatch:
      'repeating-linear-gradient(97deg, rgb(var(--gold-500)) 0 1px, rgb(var(--gold-300)) 1px 2px, rgb(var(--gold-600)) 2px 3.5px)',
    how: 'A fine unidirectional grain, laid with a Scotch-Brite wheel or a hand pad in one direction only. The direction matters more than the grit: a satin finish that changes direction across a curve reads as a mistake.',
    ages: 'Well, and it is the most flattering ageing of the seven — new scratches run more or less along the grain and simply join it. What it does lose is direction, gradually going from a grain to a general softness over about a decade.',
    restore: 'Yes, in one pass, and it can be re-laid at home on a flat surface with a green pad if you are brave. We would rather you did not.',
    hours: 0.6,
    hides: 4,
  },
  {
    id: 'matt',
    name: 'Bead blast',
    swatch:
      'radial-gradient(circle at 20% 30%, rgb(var(--gold-200)/0.6) 0 1px, transparent 1px), radial-gradient(circle at 62% 71%, rgb(var(--gold-200)/0.5) 0 1px, transparent 1px), radial-gradient(circle at 84% 22%, rgb(var(--gold-100)/0.4) 0 1px, transparent 1px), linear-gradient(180deg, rgb(var(--gold-500)), rgb(var(--gold-600)))',
    how: 'Glass beads fired at the surface under air pressure. Not sand — sand cuts and leaves a grey, tired finish; beads peen, which work-hardens the very top of the metal as it textures it.',
    ages: 'The best of the seven, and the least fashionable. There is no direction to lose and no gloss to dull, so the surface at eight years is very close to the surface at eight weeks. What it does do is slowly acquire a faint sheen on the high points, which most people rather like.',
    restore: 'Yes, in about ten minutes, and it is the cheapest restoration on the list.',
    hours: 0.4,
    hides: 5,
  },
  {
    id: 'hammered',
    name: 'Hammered',
    swatch:
      'radial-gradient(ellipse 12px 9px at 22% 28%, rgb(var(--gold-200)/0.85), transparent 70%), radial-gradient(ellipse 13px 10px at 62% 62%, rgb(var(--gold-100)/0.7), transparent 70%), radial-gradient(ellipse 11px 8px at 84% 24%, rgb(var(--gold-300)/0.8), transparent 70%), radial-gradient(ellipse 14px 10px at 38% 78%, rgb(var(--gold-200)/0.6), transparent 70%), linear-gradient(160deg, rgb(var(--gold-500)), rgb(var(--gold-700)))',
    how: 'A planishing hammer with a domed, mirror-polished face, struck by hand, overlapping. Every facet is a shallow dish and every dish is a tiny mirror at a different angle — which is why hammered gold catches light from everywhere and polished gold catches it from one place.',
    ages: 'Very well. The facets are already irregular, so irregularity does not read as damage. It also work-hardens as it is made, so a hammered band is genuinely stiffer than a smooth one of the same section.',
    restore: 'Partly. The polish inside the facets comes back; the facets themselves cannot be recut without changing the pattern, so a repaired hammered band is never quite the band you had.',
    hours: 1.8,
    hides: 5,
  },
  {
    id: 'florentine',
    name: 'Florentine',
    swatch:
      'repeating-linear-gradient(46deg, rgb(var(--gold-700)) 0 1px, transparent 1px 4px), repeating-linear-gradient(-44deg, rgb(var(--gold-800)) 0 1px, transparent 1px 4px), linear-gradient(180deg, rgb(var(--gold-400)), rgb(var(--gold-600)))',
    how: 'Two sets of fine parallel lines cut at right angles with a liner graver, by hand, at about forty lines to the centimetre. It is engraving, it takes a day on a bangle, and there are perhaps six people in this city who can still cut it properly.',
    ages: 'The pattern holds for decades and the crispness does not. The cut edges soften from the moment it leaves the bench, and by thirty years it is a texture rather than a pattern — which is beautiful and is not what it was.',
    restore: 'No. It can only be re-cut, which removes metal that is not replaceable, and the second cutting is never in exactly the register of the first. Choose this knowing it is a one-time surface.',
    hours: 6,
    hides: 4,
  },
  {
    id: 'milgrain',
    name: 'Milgrain',
    swatch:
      'radial-gradient(circle at 6% 50%, rgb(var(--gold-100)) 0 2px, transparent 2px), radial-gradient(circle at 18% 50%, rgb(var(--gold-100)) 0 2px, transparent 2px), radial-gradient(circle at 30% 50%, rgb(var(--gold-100)) 0 2px, transparent 2px), radial-gradient(circle at 42% 50%, rgb(var(--gold-100)) 0 2px, transparent 2px), radial-gradient(circle at 54% 50%, rgb(var(--gold-100)) 0 2px, transparent 2px), radial-gradient(circle at 66% 50%, rgb(var(--gold-100)) 0 2px, transparent 2px), radial-gradient(circle at 78% 50%, rgb(var(--gold-100)) 0 2px, transparent 2px), radial-gradient(circle at 90% 50%, rgb(var(--gold-100)) 0 2px, transparent 2px), linear-gradient(180deg, rgb(var(--gold-500)), rgb(var(--gold-700)))',
    how: 'A knurling wheel run along an edge under pressure, raising a row of tiny beads. An edge treatment rather than a surface — it exists to soften a hard line and to catch light along it, and it is the single detail that makes a modern ring read as antique.',
    ages: 'It wears from the outside in. The beads on the outer edge of a ring flatten first, so a milgrain band develops a smooth stretch at the bottom and keeps its beading everywhere else. It is the clearest wear pattern on this list, and it maps exactly onto how the ring is held.',
    restore: 'Yes, by re-running the wheel, and it is one of the more satisfying things done at this bench. Two or three restorations is the practical limit before the edge has lost too much metal to raise beads from.',
    hours: 1.2,
    hides: 2,
  },
  {
    id: 'frost',
    name: 'Acid frost',
    swatch:
      'radial-gradient(circle at 30% 20%, rgb(var(--cream-50)/0.55), transparent 60%), radial-gradient(circle at 70% 70%, rgb(var(--cream-100)/0.4), transparent 62%), linear-gradient(140deg, rgb(var(--gold-300)), rgb(var(--gold-500)))',
    how: 'The piece is depletion-gilded in acid, which dissolves the alloying metals out of the top few microns and leaves a surface that is almost pure gold and microscopically porous. The oldest finish here by about three thousand years.',
    ages: 'Uniquely. The surface is nearly fine gold, so it does not tarnish at all — but it is soft, so it burnishes bright wherever it is touched. A frosted piece worn for a decade has polished itself only where the wearer handles it, which is a record of how it has been used.',
    restore: 'Yes, by re-frosting, and it can be done any number of times because it removes almost nothing. It is also the only finish here that gets slightly purer every time.',
    hours: 0.9,
    hides: 3,
  },
];

export default function SurfaceFinishAtlas({ className = '' }: { className?: string }) {
  const [active, setActive] = useState(FINISHES[0].id);
  const [aged, setAged] = useState(false);
  const finish = FINISHES.find((f) => f.id === active) ?? FINISHES[0];

  return (
    <div className={className}>
      {/* The seven swatches, as a row of real surfaces rather than as labels. */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {FINISHES.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setActive(f.id)}
            aria-pressed={active === f.id}
            className="group text-left"
          >
            <div
              className={`relative aspect-square overflow-hidden rounded-lg border transition-all duration-400 ${
                active === f.id
                  ? 'border-accent shadow-gold'
                  : 'border-hairline group-hover:border-accent/50'
              }`}
            >
              <div className="h-full w-full" style={{ background: f.swatch }} />

              {/* Eight years of wear, laid over the surface. A haze of fine
                  scratches, weighted by how well the finish hides them — which
                  is why the mirror is ruined and the blast is untouched. */}
              <motion.div
                aria-hidden="true"
                animate={{ opacity: aged ? (6 - f.hides) * 0.16 : 0 }}
                transition={{ duration: 0.5 }}
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(38deg, rgba(255,255,255,0.5) 0 0.5px, transparent 0.5px 3px), repeating-linear-gradient(-52deg, rgba(0,0,0,0.35) 0 0.5px, transparent 0.5px 5px)',
                }}
              />
            </div>
            <p
              className={`mt-2 font-accent text-[9px] uppercase tracking-luxe transition-colors ${
                active === f.id ? 'text-accent' : 'text-muted group-hover:text-accent'
              }`}
            >
              {f.name}
            </p>
          </button>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between border-b border-line-subtle pb-5">
        <button
          type="button"
          onClick={() => setAged((v) => !v)}
          aria-pressed={aged}
          className={`rounded-full border px-4 py-2 font-accent text-[10px] uppercase tracking-luxe transition-colors duration-300 ${
            aged
              ? 'border-accent bg-accent/10 text-accent'
              : 'border-hairline text-muted hover:border-accent/50 hover:text-accent'
          }`}
        >
          {aged ? 'Showing eight years of wear' : 'Show eight years of wear'}
        </button>
        <p className="hidden font-accent text-[9px] uppercase tracking-luxe text-faint sm:block">
          Daily wear, no restoration
        </p>
      </div>

      <motion.div
        key={finish.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8"
      >
        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
          <h3 className="font-display text-3xl text-primary">{finish.name}</h3>
          <span className="nums-instrument font-accent text-[10px] uppercase tracking-luxe text-accent">
            {finish.hours}× the bench time of a polish
          </span>
        </div>

        <div className="mt-6 grid gap-8 md:grid-cols-3">
          {[
            { title: 'How it is made', body: finish.how },
            { title: 'How it ages', body: finish.ages },
            { title: 'Whether it comes back', body: finish.restore },
          ].map((block) => (
            <div key={block.title}>
              <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
                {block.title}
              </p>
              <p className="mt-2 font-sans text-sm font-light leading-relaxed text-muted">
                {block.body}
              </p>
            </div>
          ))}
        </div>

        {/* One axis, one measure. How much daily damage the surface hides. */}
        <div className="mt-8 max-w-sm">
          <div className="flex items-baseline justify-between">
            <span className="font-accent text-[10px] uppercase tracking-luxe text-muted">
              Hides daily wear
            </span>
            <span className="nums-instrument font-accent text-[10px] text-primary">
              {finish.hides}/5
            </span>
          </div>
          <div className="mt-2 flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <span
                key={n}
                className="h-1.5 flex-1 rounded-full"
                style={{
                  background:
                    n <= finish.hides ? 'rgb(var(--series-1))' : 'rgb(var(--surface-sunken))',
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
