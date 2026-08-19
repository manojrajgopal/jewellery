/**
 * The people, the presses and the provenance — the house's editorial supporting
 * cast. Kept in one module because these four sets are only ever used together,
 * by the atelier and journal pages.
 */

export interface Artisan {
  id: string;
  name: string;
  /** Two or three letters, used when there is no portrait. */
  initials: string;
  discipline: string;
  /** Years at the bench, not years at the house. */
  years: number;
  generation: 1 | 2 | 3 | 4;
  /** The one thing this person is the house's authority on. */
  speciality: string;
  quote: string;
  /** Techniques they hold, printed as chips. */
  skills: string[];
  /** Portrait, when there is one. Falls back to an initial plate. */
  portrait?: string;
}

export const artisans: Artisan[] = [
  {
    id: 'ravi',
    name: 'Ravi Menon',
    initials: 'RM',
    discipline: 'Master Goldsmith',
    years: 41,
    generation: 2,
    speciality: 'Hand-raised hollow forms',
    quote:
      'A machine can cut a shape. It cannot decide, halfway through, that the shape was wrong.',
    skills: ['Repoussé', 'Chasing', 'Granulation', 'Hand-raising'],
    portrait: '/images/hero/craftsmanship.jpg',
  },
  {
    id: 'lakshmi',
    name: 'Lakshmi Iyer',
    initials: 'LI',
    discipline: 'Head of Kundan',
    years: 33,
    generation: 3,
    speciality: 'Uncut stone setting in 22K',
    quote:
      'Kundan is not setting a stone. It is persuading gold foil to hold light behind it for a hundred years.',
    skills: ['Kundan', 'Jadau', 'Meenakari', 'Foil-backing'],
  },
  {
    id: 'arun',
    name: 'Arun Deshpande',
    initials: 'AD',
    discipline: 'Senior Diamond Setter',
    years: 28,
    generation: 3,
    speciality: 'Micro-pavé under ten thousandths',
    quote:
      'The bead is the whole job. Everything before it is preparation, and everything after it is polish.',
    skills: ['Micro-pavé', 'Channel', 'Bezel', 'Bright-cut'],
  },
  {
    id: 'meera',
    name: 'Meera Krishnan',
    initials: 'MK',
    discipline: 'Gemmologist, FGA',
    years: 19,
    generation: 4,
    speciality: 'Origin determination in corundum',
    quote:
      'Every stone carries where it came from in its inclusions. You only have to be patient enough to read it.',
    skills: ['Grading', 'Origin', 'Treatment detection', 'Spectroscopy'],
  },
  {
    id: 'joseph',
    name: 'Joseph Fernandes',
    initials: 'JF',
    discipline: 'Restoration Bench',
    years: 36,
    generation: 2,
    speciality: 'Victorian and Edwardian repair',
    quote:
      'The goal is that nobody can tell I was here. If the repair is visible, I have failed twice.',
    skills: ['Retipping', 'Laser welding', 'Pearl restringing', 'Enamel repair'],
  },
  {
    id: 'nandita',
    name: 'Nandita Rao',
    initials: 'NR',
    discipline: 'Design Director',
    years: 15,
    generation: 4,
    speciality: 'Translating a commission into a drawing',
    quote:
      'People rarely know what they want. They know exactly what they mean, which is a different problem.',
    skills: ['Gouache rendering', 'CAD', 'Wax carving', 'Commission briefs'],
  },
];

/* -------------------------------------------------------------------------- */

export interface PressItem {
  id: string;
  outlet: string;
  /** Year of publication. */
  year: number;
  headline: string;
  quote: string;
  /** 'award' entries are rendered with a seal rather than as a quotation. */
  kind: 'press' | 'award';
}

export const press: PressItem[] = [
  {
    id: 'p1',
    outlet: 'The Jeweller Quarterly',
    year: 2025,
    headline: 'The last house still raising gold by hand',
    quote:
      'Aurum has resisted every efficiency that would have made it larger, and is the better house for it.',
    kind: 'press',
  },
  {
    id: 'p2',
    outlet: 'Council of Indian Craft',
    year: 2024,
    headline: 'Master Atelier of the Year',
    quote: 'For the preservation of kundan technique at commercial scale.',
    kind: 'award',
  },
  {
    id: 'p3',
    outlet: 'Design Review',
    year: 2024,
    headline: 'A bridal suite that argues with tradition',
    quote:
      'The Nizam choker is the rare heritage piece that does not read as a costume.',
    kind: 'press',
  },
  {
    id: 'p4',
    outlet: 'Responsible Jewellery Index',
    year: 2023,
    headline: 'Full-chain traceability, verified',
    quote: 'One of nine houses worldwide to clear every tier of the audit.',
    kind: 'award',
  },
  {
    id: 'p5',
    outlet: 'Atelier & Bench',
    year: 2023,
    headline: 'Inside the restoration room',
    quote:
      'Four decades of Edwardian repair, and a queue eighteen months long. Nobody advertises it.',
    kind: 'press',
  },
  {
    id: 'p6',
    outlet: 'Gemmological Association',
    year: 2022,
    headline: 'Fellowship, origin determination',
    quote: 'Awarded to Meera Krishnan for work on Mozambican ruby signatures.',
    kind: 'award',
  },
];

/* -------------------------------------------------------------------------- */

export interface ProvenanceStop {
  id: string;
  label: string;
  place: string;
  /** Position on the stylised map, as percentages of the plate. */
  x: number;
  y: number;
  detail: string;
  /** What is verified at this stop. */
  check: string;
}

/**
 * The mine-to-showcase chain, plotted on a stylised plate rather than a real
 * projection. A schematic is the honest choice here: a real map would imply
 * precise mine locations we do not publish, and a stylised one makes the *chain*
 * — which is the actual claim — the thing the reader follows.
 */
export const provenance: ProvenanceStop[] = [
  {
    id: 'mine',
    label: 'Origin',
    place: 'Certified mine',
    x: 14,
    y: 62,
    detail:
      'Sourced only from operations on the Responsible Jewellery Council register, with a named site of extraction on every parcel.',
    check: 'Site of extraction recorded',
  },
  {
    id: 'cut',
    label: 'Cutting',
    place: 'Surat & Antwerp',
    x: 38,
    y: 38,
    detail:
      'Rough is cut to our own proportions rather than for maximum yield. We accept the weight loss; it is where the light comes from.',
    check: 'Rough-to-polished weight logged',
  },
  {
    id: 'grade',
    label: 'Grading',
    place: 'Independent laboratory',
    x: 58,
    y: 62,
    detail:
      'Every stone above 0.30ct is graded by a laboratory with no commercial relationship to the house. We never grade our own goods.',
    check: 'Third-party report issued',
  },
  {
    id: 'bench',
    label: 'The Bench',
    place: 'Aurum atelier, Mumbai',
    x: 78,
    y: 34,
    detail:
      'Set, finished and signed by one named artisan, whose mark goes inside the piece alongside the hallmark.',
    check: 'Artisan mark struck',
  },
  {
    id: 'vault',
    label: 'Presentation',
    place: 'The showcase',
    x: 92,
    y: 58,
    detail:
      'Hallmarked, photographed at 40× and issued with a passport that reproduces this entire chain.',
    check: 'Passport issued',
  },
];

/* -------------------------------------------------------------------------- */

export interface CareStep {
  id: string;
  title: string;
  /** Minutes the step should take, used by the ritual timer. */
  minutes: number;
  instruction: string;
  /** What not to do. The half of a care guide people actually need. */
  avoid: string;
  /** Stones this step is unsafe for, by gem id. */
  unsafeFor?: string[];
}

export const careSteps: CareStep[] = [
  {
    id: 'inspect',
    title: 'Inspect under light',
    minutes: 2,
    instruction:
      'Hold the piece to a lamp and look along the setting, not at it. A loose stone shows as a fractional shadow that moves.',
    avoid: 'Do not test a stone by pressing it. If it is loose, pressure enlarges the seat.',
  },
  {
    id: 'soak',
    title: 'Warm soak',
    minutes: 12,
    instruction:
      'Five minutes in warm water with a drop of unscented dish soap. Warm, not hot — the temperature of a comfortable bath.',
    avoid: 'No boiling water, no ultrasonic tank, and never a jump from cold to hot.',
    unsafeFor: ['emerald', 'opal', 'pearl', 'tanzanite'],
  },
  {
    id: 'brush',
    title: 'Brush the underside',
    minutes: 4,
    instruction:
      'A soft baby toothbrush, working from beneath. Almost all lost brilliance is film on the pavilion, where nobody thinks to clean.',
    avoid: 'Never a stiff brush on a plated surface, and never toothpaste — it is an abrasive.',
  },
  {
    id: 'rinse',
    title: 'Rinse and blot',
    minutes: 3,
    instruction:
      'Rinse in clean water and blot with a lint-free cloth. Leave to air-dry fully before it goes away.',
    avoid: 'Do not rinse over an open drain. Every jeweller has a story about this.',
  },
  {
    id: 'store',
    title: 'Store apart',
    minutes: 2,
    instruction:
      'Each piece in its own soft pouch or a lined compartment. Diamond scratches everything, including other diamonds.',
    avoid: 'Never a shared box, never a bathroom, and never a sealed bag for pearls or opal — both need some humidity.',
  },
  {
    id: 'service',
    title: 'Book the bench',
    minutes: 1,
    instruction:
      'Once a year for a set piece worn daily: prongs checked, seats tightened, and a professional polish. Free for the life of anything we made.',
    avoid: 'Do not wait for a stone to move. By then the seat has already worn.',
  },
];
