'use client';

import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Eye, FileWarning, ShieldCheck } from 'lucide-react';

import { easeCine } from '@/lib/motion';

/**
 * What has been done to the stone, and whether anybody has to tell you.
 *
 * Practically every coloured stone on the market has been treated. That is not a
 * scandal — heating ruby and sapphire has been standard practice for two thousand
 * years and an untreated fine sapphire is a museum object at a museum price. The
 * scandal is selectively *not mentioning it*, because the same stone is worth
 * between a tenth and ten times as much depending on which treatment it has had,
 * and the treatments are invisible without a laboratory.
 *
 * The distinction that matters to a buyer is not treated-versus-untreated. It is:
 *
 *  - **Permanent or not.** Heat is permanent; oil dries out and diffusion polishes
 *    off. A stone whose colour will leave is a stone whose value will leave.
 *  - **Does it survive the bench?** Several treatments are destroyed by ordinary
 *    repair heat, which means the stone comes out of a routine resize a different
 *    colour. The customer is never warned, because the shop does not know either.
 *  - **Is disclosure mandatory?** Under CIBJO rules some treatments must be
 *    declared and some need only be declared on request — and the second
 *    category is where the money is made.
 *
 * `share` is the proportion of that species on the market carrying the treatment,
 * which is the number that makes the case: at 95%, the untreated stone is the
 * exception and pretending otherwise is the deception.
 */
interface Treatment {
  id: string;
  name: string;
  species: string[];
  /** Proportion of the market carrying it. */
  share: number;
  permanent: boolean;
  /** Survives a jeweller's torch at repair temperature. */
  benchSafe: boolean;
  /** Whether disclosure is required, optional, or on request only. */
  disclosure: 'mandatory' | 'on-request' | 'undetectable';
  /** Effect on value against the untreated equivalent, as a multiplier. */
  value: number;
  what: string;
  risk: string;
}

const TREATMENTS: Treatment[] = [
  {
    id: 'heat',
    name: 'Heat',
    species: ['Sapphire', 'Ruby', 'Tanzanite', 'Aquamarine', 'Zircon'],
    share: 0.95,
    permanent: true,
    benchSafe: true,
    disclosure: 'on-request',
    value: 1,
    what: 'The stone is taken to somewhere between 800 and 1800°C, which dissolves fine silk inclusions and deepens the colour. Practised since antiquity and completely stable.',
    risk: 'None worth worrying about. This is the treatment we recommend people stop worrying about — it is the baseline, not the exception.',
  },
  {
    id: 'oil',
    name: 'Oil or resin',
    species: ['Emerald'],
    share: 0.99,
    permanent: false,
    benchSafe: false,
    disclosure: 'mandatory',
    value: 0.95,
    what: 'Cedarwood oil or a polymer is drawn into the surface-reaching fissures every emerald has, which makes them far less visible. Graded as minor, moderate or significant by how much went in.',
    risk: 'It dries out and leaches, so the fissures reappear over ten to twenty years — and an ultrasonic cleaner or a torch removes it in seconds. Re-oiling is a routine service and we do it; the grading is the number to ask for.',
  },
  {
    id: 'diffusion',
    name: 'Lattice diffusion',
    species: ['Sapphire', 'Ruby'],
    share: 0.12,
    permanent: false,
    benchSafe: false,
    disclosure: 'mandatory',
    value: 0.08,
    what: 'Beryllium or titanium is driven into the outer layer of the stone at high temperature, creating colour that exists only in a shell a fraction of a millimetre deep.',
    risk: 'The colour is skin-deep, literally. A re-polish after a knock takes it off and the stone underneath is pale. Worth under a tenth of the natural equivalent and frequently sold as though it were one.',
  },
  {
    id: 'glass-fill',
    name: 'Lead-glass filling',
    species: ['Ruby'],
    share: 0.3,
    permanent: false,
    benchSafe: false,
    disclosure: 'mandatory',
    value: 0.03,
    what: 'Heavily fractured low-grade material is impregnated with high-lead glass, which fills the cracks and makes an opaque stone appear transparent.',
    risk: 'Lemon juice will etch it. A torch destroys it. The honest description is a composite rather than a ruby, and we will not sell one at any price — this is the single most common misrepresented stone in the trade.',
  },
  {
    id: 'irradiation',
    name: 'Irradiation',
    species: ['Diamond', 'Topaz', 'Pearl'],
    share: 0.4,
    permanent: true,
    benchSafe: true,
    disclosure: 'mandatory',
    value: 0.3,
    what: 'Exposure to electrons or gamma rays alters the colour centres in the crystal. Almost every blue topaz on earth started colourless and was irradiated.',
    risk: 'Stable and safe — residual radioactivity is measured and regulated, and cleared material is inert. The only real issue is price: an irradiated blue diamond is a fraction of a natural one and must be declared as such.',
  },
  {
    id: 'hpht',
    name: 'HPHT',
    species: ['Diamond'],
    share: 0.05,
    permanent: true,
    benchSafe: true,
    disclosure: 'mandatory',
    value: 0.55,
    what: 'High pressure and high temperature rearranges the crystal lattice, taking a brownish diamond several colour grades whiter or turning one a vivid fancy colour.',
    risk: 'Entirely permanent and undetectable by eye — only a laboratory can identify it. Which is precisely why the certificate matters more than the stone looks.',
  },
  {
    id: 'fracture-fill-dia',
    name: 'Fracture filling',
    species: ['Diamond'],
    share: 0.02,
    permanent: false,
    benchSafe: false,
    disclosure: 'mandatory',
    value: 0.4,
    what: 'A high-refraction glass is drawn into feathers in the stone so they stop reflecting light and effectively vanish.',
    risk: 'The filler leaves at repair temperature and the inclusions come back. Identifiable by a characteristic flash of orange or blue at the right angle, which is worth learning to see.',
  },
  {
    id: 'dye',
    name: 'Dyeing',
    species: ['Jade', 'Pearl', 'Lapis', 'Coral'],
    share: 0.55,
    permanent: false,
    benchSafe: false,
    disclosure: 'mandatory',
    value: 0.15,
    what: 'Colour introduced into a porous or fractured stone. Ubiquitous in jade and in black pearls, and often the entire reason the colour is even in the case.',
    risk: 'Fades in sunlight and bleeds in solvents, including perfume. On jade it is the difference between a piece worth thousands and one worth tens — and it is the treatment most often simply not mentioned.',
  },
  {
    id: 'clarity-none',
    name: 'None',
    species: ['Spinel', 'Garnet', 'Tourmaline', 'Peridot'],
    share: 0.85,
    permanent: true,
    benchSafe: true,
    disclosure: 'undetectable',
    value: 1,
    what: 'Some species are almost never treated, because they do not need it — spinel, garnet, peridot and most tourmaline come out of the ground the colour they stay.',
    risk: 'Nothing to declare. Worth knowing as the counter-argument to the idea that everything is treated: these four are why a buyer worried about treatment should be looking at spinel.',
  },
];

const DISCLOSURE_LABEL = {
  mandatory: 'Must be declared',
  'on-request': 'Declared on request only',
  undetectable: 'Nothing to declare',
} as const;

export default function TreatmentDisclosure() {
  const [species, setSpecies] = useState('All');
  const [open, setOpen] = useState('glass-fill');
  const reduced = useReducedMotion();

  const allSpecies = useMemo(() => {
    const set = new Set<string>();
    TREATMENTS.forEach((t) => t.species.forEach((s) => set.add(s)));
    return ['All', ...Array.from(set).sort()];
  }, []);

  const shown = useMemo(
    () =>
      (species === 'All'
        ? TREATMENTS
        : TREATMENTS.filter((t) => t.species.includes(species))
      ).slice().sort((a, b) => a.value - b.value),
    [species]
  );

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by species">
        {allSpecies.map((s) => {
          const on = s === species;
          return (
            <button
              key={s}
              type="button"
              onClick={() => setSpecies(s)}
              aria-pressed={on}
              className={`rounded-full border px-4 py-1.5 font-accent text-[10px] uppercase tracking-luxe transition-colors duration-300 ${
                on
                  ? 'border-accent bg-accent text-onaccent'
                  : 'border-hairline text-muted hover:border-accent/50 hover:text-accent'
              }`}
            >
              {s}
            </button>
          );
        })}
      </div>

      {/* Sorted worst-value-first, deliberately. A list of treatments in
          alphabetical order buries the three that actually cost people money. */}
      <ul className="mt-10 space-y-3">
        {shown.map((t) => {
          const isOpen = open === t.id;
          return (
            <li
              key={t.id}
              className={`rounded-xl border transition-colors duration-400 ${
                t.value >= 0.9
                  ? 'border-jade-500/25 bg-jade-900/[0.03]'
                  : t.value >= 0.3
                    ? 'border-hairline bg-surface-raised/40'
                    : 'border-burgundy-500/30 bg-burgundy-900/[0.04]'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? '' : t.id)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-4 p-5 text-left"
              >
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-lg text-primary">{t.name}</span>
                  <span className="mt-1 block font-accent text-[10px] uppercase tracking-luxe text-faint">
                    {t.species.join(' · ')}
                  </span>
                </span>

                {/* How much of the market has it. The bar is the argument. */}
                <span className="hidden w-28 shrink-0 sm:block">
                  <span className="relative block h-1 rounded-full bg-line/50">
                    <motion.span
                      className="absolute inset-y-0 left-0 block rounded-full bg-accent/70"
                      initial={false}
                      animate={{ width: `${t.share * 100}%` }}
                      transition={reduced ? { duration: 0 } : { duration: 0.6, ease: easeCine.glass }}
                    />
                  </span>
                  <span className="nums-instrument mt-2 block font-accent text-[9px] uppercase tracking-luxe text-faint">
                    {Math.round(t.share * 100)}% of market
                  </span>
                </span>

                {/* What it does to the value. The single most useful figure and
                    the one that never appears beside a stone. */}
                <span className="w-16 shrink-0 text-right">
                  <span
                    className={`nums-instrument block font-display text-xl ${
                      t.value >= 0.9
                        ? 'text-jade-500'
                        : t.value >= 0.3
                          ? 'text-accent'
                          : 'text-burgundy-500'
                    }`}
                  >
                    {t.value >= 1 ? '1.0×' : `${t.value.toFixed(2)}×`}
                  </span>
                  <span className="block font-accent text-[9px] uppercase tracking-luxe text-faint">
                    of value
                  </span>
                </span>
              </button>

              <motion.div
                initial={false}
                animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                transition={reduced ? { duration: 0 } : { duration: 0.45, ease: easeCine.glass }}
                className="overflow-hidden"
              >
                <div className="border-t border-hairline px-5 pb-5 pt-4">
                  <p className="font-sans text-sm font-light leading-relaxed text-muted">
                    <span className="text-primary">What it is. </span>
                    {t.what}
                  </p>
                  <p className="mt-3 font-sans text-sm font-light leading-relaxed text-muted">
                    <span className="text-primary">What it means for you. </span>
                    {t.risk}
                  </p>

                  {/* The three yes/no facts, as marks rather than prose — these
                      are the ones a buyer wants to compare across rows. */}
                  <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
                    <li className="flex items-center gap-2">
                      <ShieldCheck
                        className={`h-4 w-4 ${t.permanent ? 'text-jade-500' : 'text-burgundy-500'}`}
                        aria-hidden="true"
                      />
                      <span className="font-accent text-[10px] uppercase tracking-luxe text-muted">
                        {t.permanent ? 'Permanent' : 'Will change with time'}
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FileWarning
                        className={`h-4 w-4 ${t.benchSafe ? 'text-jade-500' : 'text-burgundy-500'}`}
                        aria-hidden="true"
                      />
                      <span className="font-accent text-[10px] uppercase tracking-luxe text-muted">
                        {t.benchSafe ? 'Survives repair heat' : 'Destroyed by repair heat'}
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-accent" aria-hidden="true" />
                      <span className="font-accent text-[10px] uppercase tracking-luxe text-muted">
                        {DISCLOSURE_LABEL[t.disclosure]}
                      </span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </li>
          );
        })}
      </ul>

      <p className="mt-10 border-t border-hairline pt-6 font-sans text-sm font-light leading-relaxed text-muted">
        Everything we sell carries its treatment on the invoice whether or not the rules require it,
        including the treatments in the &ldquo;on request&rdquo; category — because a disclosure a
        customer has to know to ask for is not a disclosure. If a stone in this list is one you
        already own and you are not sure which treatment it has, bring it in. Most of them are
        identifiable across a bench in a few minutes, and we do not charge to look.
      </p>
    </div>
  );
}
