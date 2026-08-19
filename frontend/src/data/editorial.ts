import type { LookbookLeaf } from '@/components/motion/LookbookFlip';
import type { FilmFrame } from '@/components/motion/FilmstripScroller';

/**
 * Editorial copy: the bound lookbook, the journal, and the contact sheet.
 *
 * Written as data rather than as markup so the same set can be paged through in
 * the lookbook, laid out as a grid on the journal index, and pulled as a rail on
 * the home page — three presentations, one source. The alternative, hand-marking
 * up each presentation, is how three copies of the same paragraph end up
 * disagreeing with each other.
 */

export interface JournalEntry {
  id: string;
  slug: string;
  kicker: string;
  title: string;
  standfirst: string;
  /** Paragraphs. Kept short — this is a house journal, not a longread. */
  body: string[];
  /** A line worth pulling out at scale. */
  pull?: string;
  image: string;
  author: string;
  /** ISO date. Printed as a month and year. */
  date: string;
  /** Minutes. Honest figure at ~220 words a minute. */
  read: number;
  topic: 'Craft' | 'Stones' | 'The House' | 'Style' | 'Care';
}

export const journal: JournalEntry[] = [
  {
    id: 'j1',
    slug: 'why-we-lose-weight-on-purpose',
    kicker: 'Craft',
    topic: 'Craft',
    title: 'Why we lose weight on purpose',
    standfirst:
      'A cutter paid by yield will always give you a heavier stone. We ask for a lighter one, and here is the arithmetic behind that.',
    body: [
      'A piece of rough can be cut two ways. One preserves as much carat weight as possible, which means keeping the pavilion deep and the table wide. The other cuts to the proportions that return light through the crown, and accepts whatever weight that costs.',
      'The difference is rarely small. On a two-carat rough we routinely give up eleven or twelve per cent of the finished weight. On paper that is a worse stone: it will grade the same colour, the same clarity, and weigh less. Held under a lamp it is not a close contest.',
      'This is the one place where our interests and a customer\'s can quietly diverge, because weight is the figure on the invoice and light is the thing nobody can put a number on. So we make the choice in the open, log the rough-to-polished loss on the passport, and let the stone argue its own case in the showroom.',
    ],
    pull: 'Weight is the figure on the invoice. Light is the reason anyone wears it.',
    image: '/images/products/ring.jpg',
    author: 'Meera Krishnan',
    date: '2026-05-14',
    read: 4,
  },
  {
    id: 'j2',
    slug: 'the-jardin-is-not-a-flaw',
    kicker: 'Stones',
    topic: 'Stones',
    title: 'The jardin is not a flaw',
    standfirst:
      'Emerald is the one stone where the trade has a French word for its inclusions — and a good reason not to mind them.',
    body: [
      'Almost every emerald that has ever been set carries internal fissures. The trade calls the network of them the jardin, the garden, and a stone without one is so unusual that a gemmologist will check whether it is emerald at all.',
      'The reason is geological. Emerald forms where beryllium and chromium meet, which happens in violently unstable conditions — the crystal grows, cracks, and grows again. A flawless emerald means a calm formation, and calm formations do not produce this colour.',
      'What this changes is not grading but handling. Emerald is hard, nearly eight on Mohs, and simultaneously brittle: an ultrasonic tank that a sapphire shrugs off will open every fissure in an emerald at once. It is why the step cut named after the stone exists — the corners are cut off because corners are where it breaks.',
    ],
    pull: 'A flawless emerald means a calm formation, and calm formations do not produce this colour.',
    image: '/images/collections/gemstone.jpg',
    author: 'Meera Krishnan',
    date: '2026-04-02',
    read: 5,
  },
  {
    id: 'j3',
    slug: 'four-generations-one-bench',
    kicker: 'The House',
    topic: 'The House',
    title: 'Four generations, one bench',
    standfirst:
      'The bench in our restoration room was bought in 1904. Every person who has worked at it is on record.',
    body: [
      'It is a plain steel-topped bench with a pin, a sweeps drawer, and a burn mark on the left corner from a torch someone put down in 1957. Four generations of the family have worked at it, and so have eleven artisans who were not family at all.',
      'We keep the ledger for a practical reason rather than a sentimental one. When a piece comes back for service — and pieces come back after fifty years — the mark inside tells us who set it, and the ledger tells us how they worked. Knowing that a setter favoured a slightly deeper seat changes how you approach a retip four decades later.',
      'The bench is also the reason the restoration queue is eighteen months long, which we have never advertised and have never needed to.',
    ],
    image: '/images/hero/craftsmanship.jpg',
    author: 'Joseph Fernandes',
    date: '2026-03-09',
    read: 3,
  },
  {
    id: 'j4',
    slug: 'how-to-wear-22k-daily',
    kicker: 'Style',
    topic: 'Style',
    title: 'How to wear 22K daily (and when not to)',
    standfirst:
      'The traditional bridal karat is soft. That is a design constraint, not a warning.',
    body: [
      'Twenty-two karat gold measures around 52 Vickers. Eighteen karat measures 125. In practice this means a 22K bangle worn every day will pick up a soft polish of fine marks within a year, and a 22K prong holding a stone will need checking far sooner than most people expect.',
      'None of that argues against wearing it. It argues for choosing the right form: closed settings rather than prongs, bezels rather than claws, and weight distributed through a wide section rather than a thin one. Handwork — granulation, repoussé, kundan — actually needs the softness, which is why the tradition settled on this karat and not a harder one.',
      'The failure mode is a 22K solitaire with four thin claws, which is a piece designed in 18K and executed in the wrong alloy. We will talk you out of it.',
    ],
    pull: 'Softness is why the tradition chose this karat. It is not a compromise it made.',
    image: '/images/collections/bridal.jpg',
    author: 'Lakshmi Iyer',
    date: '2026-02-18',
    read: 4,
  },
  {
    id: 'j5',
    slug: 'the-drain-and-other-disasters',
    kicker: 'Care',
    topic: 'Care',
    title: 'The drain, and other disasters',
    standfirst:
      'Every jeweller has the same five stories. Here they are, so you can avoid being in one.',
    body: [
      'The drain is first because it is the most common and the most complete: a ring rinsed over an open sink, and a plumbing job that occasionally recovers it. Close the plug. That is the entire lesson.',
      'The second is hand sanitiser on plated white gold, which strips rhodium faster than anything else in ordinary life. The third is a pearl necklace stored in a sealed bag, where the nacre dries and crazes. The fourth is an emerald in a hotel ultrasonic cleaner. The fifth is a bracelet clasp that had been catching for a month before it finally let go.',
      'Four of those five are preventable in under a minute. The fifth is why we check clasps free of charge, for the life of anything we have made, whether or not you bought it from us.',
    ],
    image: '/images/products/necklace.jpg',
    author: 'Nandita Rao',
    date: '2026-01-27',
    read: 3,
  },
  {
    id: 'j6',
    slug: 'reading-a-grading-report',
    kicker: 'Stones',
    topic: 'Stones',
    title: 'Reading a grading report properly',
    standfirst:
      'Four letters and a number get all the attention. The useful information is further down the page.',
    body: [
      'Colour and clarity grades are what a report is bought for and what a customer remembers. They are also the two figures with the least effect on how a stone looks across a table, once you are inside the range any reputable house sells.',
      'The lines that matter are the proportions: table percentage, crown and pavilion angles, girdle thickness. A stone cut to a 57 per cent table with a 34.5 degree crown will out-perform a higher-graded stone cut for weight, every time, in any light.',
      'The other line worth finding is the fluorescence note, which is the one place where the trade\'s consensus and physical reality most often part company. Strong blue fluorescence is discounted, and in a stone in the faint-yellow range it is frequently an improvement.',
    ],
    pull: 'The two figures everyone remembers are the two with the least effect across a table.',
    image: '/images/products/earrings.jpg',
    author: 'Arun Deshpande',
    date: '2025-12-11',
    read: 6,
  },
];

export const journalTopics = [
  'All',
  'Craft',
  'Stones',
  'The House',
  'Style',
  'Care',
] as const;

/* -------------------------------------------------------------------------- */

/**
 * The bound lookbook. Each leaf carries a recto and a verso, and the pairing is
 * deliberate — a plate faces the copy that belongs to it, so a spread reads as
 * one composition rather than as two unrelated pages that happen to be adjacent.
 */
export const lookbookLeaves: LookbookLeaf[] = [
  {
    id: 'l1',
    recto: {
      image: '/images/collections/bridal.jpg',
      plate: 'I',
    },
    verso: {
      kicker: 'Chapter One',
      title: 'Vows',
      quote: 'A bridal piece is worn once for a photograph and forever afterwards.',
      body: 'The bridal suite is the only work where we design for two occasions at once: a single day under a photographer\'s lights, and forty years of ordinary Tuesdays. The second is the harder brief, and it is the one that decides the setting.',
      notes: ['22K & Platinum', 'Kundan · Uncut · Brilliant', 'Six to fourteen weeks'],
      plate: 'II',
    },
  },
  {
    id: 'l2',
    recto: {
      image: '/images/collections/heritage.jpg',
      kicker: 'Chapter Two',
      title: 'The Nizam Line',
      body: 'Drawn from court pieces of the 1890s, executed with the same foil-backing technique and none of the shortcuts that replaced it.',
      plate: 'III',
    },
    verso: {
      kicker: 'On Technique',
      title: 'Foil, and why it survives',
      quote: 'Kundan holds light behind a stone instead of through it.',
      body: 'A closed setting with a burnished gold foil beneath the stone was the only way to make an uncut gem shine before faceting arrived. It never left, because nothing else produces the same interior glow — and because a foil-backed stone is held on all sides, which is why hundred-year-old kundan is still tight.',
      notes: ['Lakshmi Iyer, Head of Kundan', '33 years at the bench'],
      plate: 'IV',
    },
  },
  {
    id: 'l3',
    recto: {
      image: '/images/products/ring.jpg',
      plate: 'V',
    },
    verso: {
      kicker: 'Chapter Three',
      title: 'The Solitaire Question',
      body: 'One stone, nothing to hide behind. Everything about a solitaire is a decision about proportion — the height of the seat, the taper of the shank, and how much metal you are willing to let the eye see.',
      notes: ['Platinum 950', '0.70 – 3.00ct', 'Cut to house proportions'],
      plate: 'VI',
    },
  },
  {
    id: 'l4',
    recto: {
      image: '/images/collections/statement.jpg',
      kicker: 'Chapter Four',
      title: 'Statement',
      body: 'Scale is easy. Scale that still reads as jewellery rather than as costume is the whole discipline.',
      plate: 'VII',
    },
    verso: {
      kicker: 'On Colour',
      title: 'Against the matched set',
      quote: 'A perfectly matched suite is a technical achievement and an aesthetic dead end.',
      body: 'Matching six stones for colour and cut across a necklace is genuinely difficult and takes months of sourcing. It also produces a piece with no internal argument. We increasingly build the deliberate mismatch in — one stone a shade deeper, set where the eye lands last.',
      notes: ['Emerald · Burmese ruby · Tanzanite'],
      plate: 'VIII',
    },
  },
  {
    id: 'l5',
    recto: {
      image: '/images/collections/everyday.jpg',
      plate: 'IX',
    },
    verso: {
      kicker: 'Chapter Five',
      title: 'Everyday',
      body: 'The pieces that never come off are the hardest to design and the least photographed. They have to survive a keyboard, a coat sleeve and a car door, and still be worth looking at.',
      notes: ['18K', 'Bezel & flush set', 'Lifetime service'],
      plate: 'X',
    },
  },
  {
    id: 'l6',
    recto: {
      image: '/images/hero/craftsmanship.jpg',
      kicker: 'Colophon',
      title: 'Made at the bench',
      body: 'Every piece in this book was raised, set and finished by a named artisan whose mark is inside it.',
      plate: 'XI',
    },
    verso: {
      kicker: 'Aurum',
      title: 'Established 1892',
      quote: 'Four generations. One bench. Bought in 1904 and still in use.',
      notes: ['Mumbai', 'BIS Hallmarked', 'RJC Certified'],
      plate: 'XII',
    },
  },
];

/* -------------------------------------------------------------------------- */

/** The contact sheet: frames as they would come off a shoot, in shoot order. */
export const contactSheet: FilmFrame[] = [
  {
    src: '/images/hero/craftsmanship.jpg',
    alt: 'A goldsmith raising a hollow form',
    slate: 'Bench 4 — raising, take 2',
    code: 'A01',
  },
  {
    src: '/images/products/ring.jpg',
    alt: 'Solitaire on the setting block',
    slate: 'Setting block — seat check',
    code: 'A04',
  },
  {
    src: '/images/collections/bridal.jpg',
    alt: 'Bridal suite laid out on velvet',
    slate: 'Velvet tray — suite laid out',
    code: 'A09',
  },
  {
    src: '/images/products/necklace.jpg',
    alt: 'Handwoven chain under raking light',
    slate: 'Raking light — chain detail',
    code: 'B02',
  },
  {
    src: '/images/collections/heritage.jpg',
    alt: 'Kundan foil-backing in progress',
    slate: 'Kundan bench — foil, held',
    code: 'B07',
  },
  {
    src: '/images/products/earrings.jpg',
    alt: 'Pearl drops against a dark ground',
    slate: 'Dark ground — nacre lustre',
    code: 'B11',
  },
  {
    src: '/images/collections/gemstone.jpg',
    alt: 'Loose stones sorted by colour',
    slate: 'Sorting tray — colour run',
    code: 'C03',
  },
  {
    src: '/images/collections/statement.jpg',
    alt: 'Statement collar on the mandrel',
    slate: 'Mandrel — collar, final form',
    code: 'C08',
  },
  {
    src: '/images/collections/mens.jpg',
    alt: 'Signet rings in a row',
    slate: 'Signet row — engraving check',
    code: 'C12',
  },
  {
    src: '/images/collections/everyday.jpg',
    alt: 'Everyday stack on the hand',
    slate: 'On hand — stack, natural light',
    code: 'D02',
  },
];
