/**
 * Option sets for the bespoke studio.
 *
 * Prices are additive deltas on a base commission fee, in rupees, so the
 * running estimate can be summed rather than looked up from a matrix. Real
 * jewellery pricing is a matrix — stone weight against metal weight against
 * setting labour — but a commission estimate is genuinely additive at this
 * stage, and the visitor gets a number that moves with every choice.
 */

export const BASE_FEE = 92_000;

export interface Option {
  id: string;
  label: string;
  note: string;
  delta: number;
}

export interface MetalOption extends Option {
  /** Gradient stops for the SVG band, light to shadow. */
  stops: [string, string, string];
  hallmark: string;
}

export interface StoneOption extends Option {
  /** Normalised outline of the stone's table, drawn in a 100×100 box. */
  path: string;
  /** Facet lines drawn over the table. */
  facets: string;
  refraction: string;
}

export const METALS: MetalOption[] = [
  {
    id: 'yellow-22k',
    label: '22K Yellow Gold',
    note: 'The house standard. Warm, deep, unmistakably Indian gold.',
    delta: 0,
    stops: ['#FDF2D3', '#D4A03A', '#714D18'],
    hallmark: 'BIS 916',
  },
  {
    id: 'yellow-18k',
    label: '18K Yellow Gold',
    note: 'Harder alloy, better for pavé and fine claw settings.',
    delta: -14_000,
    stops: ['#F7E2A8', '#C89A3C', '#6A4A1C'],
    hallmark: 'BIS 750',
  },
  {
    id: 'rose-18k',
    label: '18K Rose Gold',
    note: 'Copper-rich blush that warms against most skin tones.',
    delta: -8_000,
    stops: ['#FAE3D9', '#DB9A82', '#A86C57'],
    hallmark: 'BIS 750',
  },
  {
    id: 'white-18k',
    label: '18K White Gold',
    note: 'Rhodium finished. Reads cool and keeps a diamond icy.',
    delta: 6_000,
    stops: ['#FFFFFF', '#D5D8DE', '#8A8F98'],
    hallmark: 'BIS 750',
  },
  {
    id: 'platinum',
    label: 'Platinum 950',
    note: 'Densest of the four. Will outlive everyone who wears it.',
    delta: 48_000,
    stops: ['#F4F6FA', '#C8CCD6', '#7C828E'],
    hallmark: 'PT 950',
  },
];

export const STONES: StoneOption[] = [
  {
    id: 'round',
    label: 'Round Brilliant',
    note: '57 facets. The most light return of any cut ever calculated.',
    delta: 0,
    path: 'M50 8 A42 42 0 1 1 49.9 8 Z',
    facets: 'M50 8 L50 92 M8 50 L92 50 M20 20 L80 80 M80 20 L20 80 M50 22 L72 50 L50 78 L28 50 Z',
    refraction: 'high',
  },
  {
    id: 'emerald',
    label: 'Emerald Cut',
    note: 'Step cut. Trades fire for clarity and a long, calm flash.',
    delta: 34_000,
    path: 'M28 10 H72 L90 26 V74 L72 90 H28 L10 74 V26 Z',
    facets: 'M22 22 H78 V78 H22 Z M32 32 H68 V68 H32 Z M42 42 H58 V58 H42 Z',
    refraction: 'low',
  },
  {
    id: 'oval',
    label: 'Oval Brilliant',
    note: 'Reads larger per carat and lengthens the finger.',
    delta: 18_000,
    path: 'M50 6 C72 6 86 26 86 50 C86 74 72 94 50 94 C28 94 14 74 14 50 C14 26 28 6 50 6 Z',
    facets: 'M50 6 L50 94 M14 50 L86 50 M26 24 L74 76 M74 24 L26 76',
    refraction: 'high',
  },
  {
    id: 'pear',
    label: 'Pear Brilliant',
    note: 'Asymmetric on purpose. Point worn toward the nail.',
    delta: 26_000,
    path: 'M50 4 C70 30 88 52 88 68 C88 84 71 96 50 96 C29 96 12 84 12 68 C12 52 30 30 50 4 Z',
    facets: 'M50 4 L50 96 M14 66 L86 66 M28 40 L72 88 M72 40 L28 88',
    refraction: 'high',
  },
  {
    id: 'cushion',
    label: 'Cushion Cut',
    note: 'Softened square. The antique choice, and forgiving of wear.',
    delta: 12_000,
    path: 'M28 8 H72 C84 8 92 16 92 28 V72 C92 84 84 92 72 92 H28 C16 92 8 84 8 72 V28 C8 16 16 8 28 8 Z',
    facets: 'M50 8 L50 92 M8 50 L92 50 M18 18 L82 82 M82 18 L18 82',
    refraction: 'medium',
  },
  {
    id: 'kundan',
    label: 'Uncut Kundan',
    note: 'Flat polki, foil backed. Lit from behind, not through.',
    delta: 62_000,
    path: 'M50 10 L78 22 L92 50 L78 78 L50 90 L22 78 L8 50 L22 22 Z',
    facets: 'M50 10 L50 90 M8 50 L92 50 M22 22 L78 78 M78 22 L22 78 M36 36 H64 V64 H36 Z',
    refraction: 'low',
  },
];

export const SETTINGS: Option[] = [
  {
    id: 'solitaire',
    label: 'Six-Claw Solitaire',
    note: 'Maximum light beneath the stone. Nothing to hide behind.',
    delta: 0,
  },
  {
    id: 'halo',
    label: 'Diamond Halo',
    note: 'A ring of melee around the centre. Reads a full carat larger.',
    delta: 78_000,
  },
  {
    id: 'bezel',
    label: 'Full Bezel',
    note: 'Metal wrapped to the girdle. The setting for a life with hands in it.',
    delta: 22_000,
  },
  {
    id: 'trilogy',
    label: 'Trilogy',
    note: 'Past, present, future — two tapered shoulders flank the centre.',
    delta: 96_000,
  },
  {
    id: 'cathedral',
    label: 'Cathedral Arch',
    note: 'Shoulders rise to meet the stone. Structural and very old.',
    delta: 38_000,
  },
];

export const BANDS: Option[] = [
  { id: 'court', label: 'Court', note: 'Rounded inside and out. The comfortable default.', delta: 0 },
  { id: 'knife', label: 'Knife Edge', note: 'A raised spine that catches a line of light.', delta: 14_000 },
  { id: 'pave', label: 'Pavé Set', note: 'Melee bead-set along the shoulders.', delta: 64_000 },
  { id: 'twist', label: 'Twist', note: 'Two strands crossing beneath the setting.', delta: 30_000 },
  { id: 'milgrain', label: 'Milgrain', note: 'Beaded edge worked by hand with a knurling wheel.', delta: 26_000 },
];

export const CARATS = [
  { value: 0.5, delta: 0 },
  { value: 0.7, delta: 95_000 },
  { value: 1.0, delta: 245_000 },
  { value: 1.5, delta: 520_000 },
  { value: 2.0, delta: 940_000 },
  { value: 3.0, delta: 1_880_000 },
] as const;

/** The engraving is charged per character, above a free allowance. */
export const ENGRAVING_FREE_CHARS = 12;
export const ENGRAVING_PER_CHAR = 450;
