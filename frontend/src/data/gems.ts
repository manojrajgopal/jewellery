/**
 * The stone library.
 *
 * Figures are the real gemmological ones — Mohs hardness, refractive index,
 * specific gravity — because they are what the comparison bars in the library are
 * drawn from, and a made-up number produces a chart that a customer holding a
 * certificate can immediately tell is wrong.
 *
 * `hardness` is on the Mohs scale (1–10). `refraction` is the principal
 * refractive index; where a stone is birefringent the higher value is used, since
 * that is the figure a grading report leads with.
 */

export type GemFamily = 'diamond' | 'corundum' | 'beryl' | 'quartz' | 'organic' | 'other';

export interface Gem {
  id: string;
  name: string;
  /** The trade name a customer is likely to say. */
  alias?: string;
  family: GemFamily;
  /** Mohs, 1–10. */
  hardness: number;
  /** Principal refractive index. */
  refraction: number;
  /** Specific gravity. */
  density: number;
  /** Months this stone is the birthstone for, 1-indexed. */
  months: number[];
  /** Tailwind-resolvable token for the swatch. Kept to the house palette. */
  swatch: string;
  /** Facet clip used to draw the stone's silhouette. */
  cut: string;
  origin: string[];
  meaning: string;
  note: string;
  /** How scarce, 1–5. Drives the segmented rarity meter. */
  rarity: number;
  /** Care warnings a customer genuinely needs. */
  care: string;
}

export const gems: Gem[] = [
  {
    id: 'diamond',
    name: 'Diamond',
    family: 'diamond',
    hardness: 10,
    refraction: 2.42,
    density: 3.52,
    months: [4],
    swatch: 'from-cream-50 via-diamond to-ink-200',
    cut: 'clip-diamond',
    origin: ['Botswana', 'Canada', 'Russia', 'South Africa'],
    meaning: 'Endurance. The only stone that cannot be scratched by another.',
    note: 'The reference against which every other stone is measured — and the only gem hard enough to be worn daily for a lifetime without a bezel to protect it.',
    rarity: 4,
    care: 'Nothing will scratch it, but a hard knock on the girdle can still chip it. Remove before manual work.',
  },
  {
    id: 'ruby',
    name: 'Ruby',
    alias: 'Red corundum',
    family: 'corundum',
    hardness: 9,
    refraction: 1.77,
    density: 4.0,
    months: [7],
    swatch: 'from-burgundy-300 via-burgundy-500 to-burgundy-900',
    cut: 'clip-cushion',
    origin: ['Myanmar', 'Mozambique', 'Madagascar'],
    meaning: 'Vitality. Historically the stone of sovereigns rather than brides.',
    note: 'Chemically the same mineral as sapphire; the colour is a trace of chromium. Burmese "pigeon blood" material remains the most valuable coloured stone by weight.',
    rarity: 5,
    care: 'Hard and durable. Avoid steam if the stone has been fracture-filled — ask for the treatment disclosure.',
  },
  {
    id: 'sapphire',
    name: 'Sapphire',
    alias: 'Blue corundum',
    family: 'corundum',
    hardness: 9,
    refraction: 1.77,
    density: 4.0,
    months: [9],
    swatch: 'from-amethyst-300 via-amethyst-700 to-ink-900',
    cut: 'clip-oval',
    origin: ['Sri Lanka', 'Kashmir', 'Madagascar', 'Australia'],
    meaning: 'Constancy. The traditional stone of vows before diamond took the role.',
    note: 'Occurs in every colour but red — a red sapphire is a ruby. Kashmir material has a velvety diffusion no other origin reproduces.',
    rarity: 4,
    care: 'Second only to diamond in hardness. Safe for daily wear in any setting.',
  },
  {
    id: 'emerald',
    name: 'Emerald',
    alias: 'Green beryl',
    family: 'beryl',
    hardness: 7.75,
    refraction: 1.58,
    density: 2.72,
    months: [5],
    swatch: 'from-jade-100 via-jade-500 to-jade-900',
    cut: 'clip-emerald',
    origin: ['Colombia', 'Zambia', 'Brazil'],
    meaning: 'Renewal. Worn for clarity of thought as much as for its colour.',
    note: 'Almost every emerald carries internal fissures — the trade calls them the jardin. The step cut named after the stone exists to protect its corners.',
    rarity: 5,
    care: 'Brittle despite its hardness. Never ultrasonic, never steam. Oiling is normal and needs periodic renewal.',
  },
  {
    id: 'pearl',
    name: 'Pearl',
    family: 'organic',
    hardness: 2.75,
    refraction: 1.53,
    density: 2.7,
    months: [6],
    swatch: 'from-cream-50 via-champagne-100 to-champagne-500',
    cut: 'clip-oval',
    origin: ['Japan', 'French Polynesia', 'Australia'],
    meaning: 'Composure. The only gem produced by a living creature without cutting.',
    note: 'Graded on lustre rather than clarity — the depth of nacre is what separates a pearl that glows from one that merely shines.',
    rarity: 3,
    care: 'The softest gem we set. Last on, first off. Perfume and hairspray dull the nacre permanently.',
  },
  {
    id: 'amethyst',
    name: 'Amethyst',
    alias: 'Purple quartz',
    family: 'quartz',
    hardness: 7,
    refraction: 1.55,
    density: 2.65,
    months: [2],
    swatch: 'from-amethyst-300 via-amethyst-500 to-amethyst-900',
    cut: 'clip-trillion',
    origin: ['Brazil', 'Zambia', 'Uruguay'],
    meaning: 'Clear judgement. Roman cups were carved from it for exactly that reason.',
    note: 'Once valued alongside ruby; the Brazilian discoveries of the 1800s made it available to everyone, which is the only reason it is affordable now.',
    rarity: 2,
    care: 'Colour fades in prolonged sunlight. Store in the dark, not on a windowsill.',
  },
  {
    id: 'topaz',
    name: 'Imperial Topaz',
    family: 'other',
    hardness: 8,
    refraction: 1.63,
    density: 3.53,
    months: [11],
    swatch: 'from-champagne-100 via-gold-400 to-burgundy-500',
    cut: 'clip-pear',
    origin: ['Brazil (Ouro Preto)', 'Pakistan'],
    meaning: 'Warmth. The peach-to-cognac range is the only topaz the trade calls imperial.',
    note: 'Hard but with one direction of perfect cleavage, which is why a cutter orients it carefully and a setter never applies pressure across the table.',
    rarity: 4,
    care: 'Avoid sudden temperature change. Warm soapy water only.',
  },
  {
    id: 'opal',
    name: 'Opal',
    family: 'other',
    hardness: 5.75,
    refraction: 1.45,
    density: 2.15,
    months: [10],
    swatch: 'from-jade-100 via-champagne-100 to-amethyst-500',
    cut: 'clip-marquise',
    origin: ['Australia (Lightning Ridge)', 'Ethiopia'],
    meaning: 'Imagination. No two stones show the same play of colour.',
    note: 'Up to a fifth water by weight. The colour is diffraction from a lattice of silica spheres, not pigment — which is why it changes as you move.',
    rarity: 4,
    care: 'Can craze if it dries out. Never ultrasonic. Occasional contact with water is good for it.',
  },
  {
    id: 'garnet',
    name: 'Garnet',
    family: 'other',
    hardness: 7.25,
    refraction: 1.79,
    density: 3.9,
    months: [1],
    swatch: 'from-burgundy-300 via-burgundy-700 to-ink-900',
    cut: 'clip-hexagon',
    origin: ['Tanzania', 'India', 'Sri Lanka'],
    meaning: 'Safe passage. Carried by travellers long before it was set in rings.',
    note: 'A family rather than a single stone — tsavorite and spessartite are garnets too, and both are rarer than most sapphire.',
    rarity: 2,
    care: 'Robust. Warm soapy water and a soft brush.',
  },
  {
    id: 'aquamarine',
    name: 'Aquamarine',
    alias: 'Blue beryl',
    family: 'beryl',
    hardness: 7.75,
    refraction: 1.58,
    density: 2.7,
    months: [3],
    swatch: 'from-jade-100 via-jade-300 to-amethyst-300',
    cut: 'clip-baguette',
    origin: ['Brazil', 'Nigeria', 'Mozambique'],
    meaning: 'Calm. Sailors carried it as insurance against a rough crossing.',
    note: 'The same mineral as emerald without the chromium. Because it grows in clean crystals, large flawless stones are genuinely obtainable.',
    rarity: 2,
    care: 'Durable and free of the fissures that make emerald delicate. Safe for daily wear.',
  },
  {
    id: 'peridot',
    name: 'Peridot',
    family: 'other',
    hardness: 6.75,
    refraction: 1.69,
    density: 3.34,
    months: [8],
    swatch: 'from-jade-100 via-jade-500 to-gold-700',
    cut: 'clip-radiant',
    origin: ['Pakistan', 'Myanmar', 'Arizona'],
    meaning: 'Optimism. One of very few gems that occurs in only one colour.',
    note: 'Some peridot arrives on meteorites — the only gemstone regularly found off this planet.',
    rarity: 3,
    care: 'Sensitive to acid and to rapid temperature change. Never steam.',
  },
  {
    id: 'tanzanite',
    name: 'Tanzanite',
    family: 'other',
    hardness: 6.5,
    refraction: 1.7,
    density: 3.35,
    months: [12],
    swatch: 'from-amethyst-300 via-amethyst-700 to-jade-900',
    cut: 'clip-asscher',
    origin: ['Tanzania (Merelani Hills)'],
    meaning: 'Rarity itself. Found in one place on earth, across roughly eight square miles.',
    note: 'Discovered in 1967, which makes it younger than most of our display cases. Strongly trichroic — it shows blue, violet and burgundy depending on the axis it is cut on.',
    rarity: 5,
    care: 'Soft enough to need a protective setting. No ultrasonic, no steam, no sudden heat.',
  },
];

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

/** The stone (or stones) for a 1-indexed month. */
export const gemsForMonth = (month: number) =>
  gems.filter((g) => g.months.includes(month));

/* -------------------------------------------------------------------------- */

export interface MetalSpec {
  id: string;
  name: string;
  /** Parts per thousand of the precious metal. */
  fineness: number;
  /** Vickers hardness, which is what determines how it wears. */
  hardness: number;
  /** Relative price per gram, indexed against 18K yellow at 100. */
  priceIndex: number;
  /** How warm the colour reads, 0 cool to 100 warm. Editorial, not measured. */
  warmth: number;
  swatch: string;
  best: string;
  caution: string;
  note: string;
}

/**
 * The metals bench. Fineness and Vickers figures are the real ones; `warmth` is
 * an editorial judgement and is labelled as such wherever it is charted, because
 * putting it on the same axis as a measured value without saying so would imply a
 * precision it does not have.
 */
export const metals: MetalSpec[] = [
  {
    id: '24k',
    name: '24K Yellow Gold',
    fineness: 999,
    hardness: 25,
    priceIndex: 138,
    warmth: 100,
    swatch: 'from-gold-200 via-gold-400 to-gold-700',
    best: 'Investment pieces and traditional bridal sets worn occasionally.',
    caution: 'Too soft to hold a stone securely or to survive daily wear.',
    note: 'Pure gold. It will take a fingernail mark, which is precisely why the trade alloys it.',
  },
  {
    id: '22k',
    name: '22K Yellow Gold',
    fineness: 916,
    hardness: 52,
    priceIndex: 127,
    warmth: 92,
    swatch: 'from-gold-200 via-gold-500 to-gold-800',
    best: 'The Indian bridal standard — kundan, jadau, and heavy handwork.',
    caution: 'Still soft. Prong settings in 22K need checking every few years.',
    note: 'The traditional choice on the subcontinent, and the highest karat that can carry granulation and repoussé work.',
  },
  {
    id: '18k',
    name: '18K Yellow Gold',
    fineness: 750,
    hardness: 125,
    priceIndex: 100,
    warmth: 74,
    swatch: 'from-gold-300 via-gold-500 to-gold-800',
    best: 'Everything. The house default for set pieces worn daily.',
    caution: 'None worth listing. This is the compromise the trade settled on for good reason.',
    note: 'Three quarters gold. Hard enough to hold a stone for decades, rich enough to still read unmistakably as gold.',
  },
  {
    id: '18k-rose',
    name: '18K Rose Gold',
    fineness: 750,
    hardness: 135,
    priceIndex: 100,
    warmth: 66,
    swatch: 'from-rose-100 via-rose-300 to-rose-700',
    best: 'Warm skin tones, vintage-inspired settings, mixed-metal stacks.',
    caution: 'The copper content can darken slightly over years. It polishes back.',
    note: 'The same fineness as yellow 18K; the colour is copper in the alloy. Marginally harder than yellow as a result.',
  },
  {
    id: 'platinum',
    name: 'Platinum 950',
    fineness: 950,
    hardness: 137,
    priceIndex: 118,
    warmth: 8,
    swatch: 'from-cream-100 via-platinum to-ink-300',
    best: 'Solitaires and anything where the metal should disappear behind the stone.',
    caution: 'Develops a patina of fine scratches. Many people prefer it; some do not.',
    note: 'Denser than gold, so the same ring weighs noticeably more — and hypoallergenic, which matters more often than people expect.',
  },
  {
    id: 'white-18k',
    name: '18K White Gold',
    fineness: 750,
    hardness: 145,
    priceIndex: 101,
    warmth: 18,
    swatch: 'from-cream-50 via-ink-100 to-ink-400',
    best: 'A platinum look at a lower weight, and the hardest of the golds.',
    caution: 'Rhodium plated. The plating wears and needs renewing every few years.',
    note: 'Yellow gold alloyed pale and then plated. The honest way to sell it is to say the plating is maintenance, which it is.',
  },
];
