/**
 * The trade's vocabulary, defined plainly.
 *
 * Every entry here is a word a customer will actually hear across a counter or
 * read on a certificate, and every definition is written to be useful to the
 * person being sold to rather than to the person selling. Where a term is
 * routinely used to obscure something — `enhanced`, `total carat weight`,
 * `hallmark` — the entry says so. That is the point of publishing it.
 *
 * `sense` groups a term so the glossary can be filtered by what part of the
 * transaction it belongs to. `seeAlso` holds ids, not labels, so a rename does
 * not silently break a cross-reference.
 */

export type GlossarySense = 'stone' | 'metal' | 'making' | 'paper' | 'wearing';

export interface GlossaryTerm {
  id: string;
  term: string;
  /** The way it is usually said out loud, if that differs. */
  alias?: string;
  sense: GlossarySense;
  definition: string;
  /** The part a customer is not usually told. Rendered as the caution line. */
  candour?: string;
  seeAlso?: string[];
}

export const glossarySenses: { id: GlossarySense; label: string; note: string }[] = [
  { id: 'stone', label: 'The stone', note: 'What is being graded, and how' },
  { id: 'metal', label: 'The metal', note: 'Alloys, purity and colour' },
  { id: 'making', label: 'The making', note: 'What happens at the bench' },
  { id: 'paper', label: 'The paper', note: 'Certificates, marks and claims' },
  { id: 'wearing', label: 'The wearing', note: 'Fit, sizing and daily life' },
];

export const glossary: GlossaryTerm[] = [
  {
    id: 'brilliance',
    term: 'Brilliance',
    sense: 'stone',
    definition:
      'The white light a stone returns straight back to your eye. It is a function of how well the facets are angled, not of how clean or how large the stone is.',
    candour:
      'Brilliance is the one optical property that a poorly cut stone cannot fake, and it is the one grade most retailers quote last.',
    seeAlso: ['fire', 'scintillation', 'cut-grade'],
  },
  {
    id: 'fire',
    term: 'Fire',
    alias: 'dispersion',
    sense: 'stone',
    definition:
      'The coloured flashes thrown when a stone splits white light into its spectrum. Diamond disperses strongly; a sapphire of the same cut barely at all.',
    seeAlso: ['brilliance', 'refraction'],
  },
  {
    id: 'scintillation',
    term: 'Scintillation',
    sense: 'stone',
    definition:
      'The flash-and-dark pattern as the stone, the light, or your head moves. It is what makes a diamond look alive across a dinner table.',
    seeAlso: ['brilliance', 'fire'],
  },
  {
    id: 'refraction',
    term: 'Refractive index',
    alias: 'RI',
    sense: 'stone',
    definition:
      'How sharply a material bends light. Diamond is 2.42, glass about 1.5 — which is why no amount of polishing makes glass look like diamond.',
    seeAlso: ['fire'],
  },
  {
    id: 'cut-grade',
    term: 'Cut grade',
    sense: 'stone',
    definition:
      'A judgement on proportion and finish, from Excellent to Poor. The only one of the four Cs that is about workmanship rather than luck.',
    candour:
      'Weight hides in the pavilion, where nobody looks. A deep stone weighs more and looks smaller, and it is priced on the weight.',
    seeAlso: ['brilliance', 'spread', 'carat'],
  },
  {
    id: 'spread',
    term: 'Spread',
    sense: 'stone',
    definition:
      'How large a stone looks face-up for its weight. Two one-carat stones can differ by 15% in apparent size depending on how they were cut.',
    seeAlso: ['cut-grade', 'carat'],
  },
  {
    id: 'carat',
    term: 'Carat',
    sense: 'stone',
    definition:
      'A unit of weight — 0.2 grams — not of size. From the carob seed, which was close enough to uniform to trade against.',
    candour:
      'Prices step sharply at the round numbers. A 0.95ct stone can cost a fifth less than a 1.00ct and no one will ever be able to tell them apart.',
    seeAlso: ['spread', 'tcw'],
  },
  {
    id: 'tcw',
    term: 'Total carat weight',
    alias: 'TCW',
    sense: 'paper',
    definition:
      'The weight of every stone in a piece added together.',
    candour:
      'A ring advertised at "1ct TCW" may be a 0.4ct centre surrounded by sixty tiny stones. It is a true number that answers a question nobody asked.',
    seeAlso: ['carat'],
  },
  {
    id: 'eye-clean',
    term: 'Eye-clean',
    sense: 'stone',
    definition:
      'No inclusion visible to an unaided eye at normal viewing distance. Usually somewhere around VS2 to SI1, depending on where the inclusions sit.',
    candour:
      'Above eye-clean you are paying for something only a loupe can find. That money buys a visibly better cut instead.',
    seeAlso: ['inclusion', 'clarity'],
  },
  {
    id: 'inclusion',
    term: 'Inclusion',
    sense: 'stone',
    definition:
      "Anything inside the stone that is not the stone — a crystal, a feather, a cloud. They are the stone's own record of how it formed.",
    seeAlso: ['eye-clean', 'clarity'],
  },
  {
    id: 'clarity',
    term: 'Clarity',
    sense: 'stone',
    definition:
      'A scale from Flawless to Included, describing how few and how hidden the inclusions are.',
    seeAlso: ['inclusion', 'eye-clean'],
  },
  {
    id: 'fluorescence',
    term: 'Fluorescence',
    sense: 'stone',
    definition:
      'A glow, usually blue, under ultraviolet light. Around a third of diamonds do it to some degree.',
    candour:
      'Strong fluorescence discounts a stone by up to 15% and in a faintly yellow stone it actively helps, by cancelling the yellow in daylight.',
    seeAlso: ['colour-grade'],
  },
  {
    id: 'colour-grade',
    term: 'Colour grade',
    sense: 'stone',
    definition:
      'D to Z, measuring the absence of yellow. D–F is colourless, G–J near-colourless.',
    candour:
      'Colour is graded face-down against a white card, which is the one position nobody wears a ring in. Set in yellow gold, a G and a J are hard to separate.',
    seeAlso: ['fluorescence'],
  },
  {
    id: 'girdle',
    term: 'Girdle',
    sense: 'stone',
    definition:
      "The stone's outer edge, where the crown meets the pavilion. It is where prongs grip and where a knock is most likely to chip it.",
    seeAlso: ['pavilion', 'prong'],
  },
  {
    id: 'pavilion',
    term: 'Pavilion',
    sense: 'stone',
    definition:
      'Everything below the girdle — the cone that does the work of throwing light back up through the table.',
    seeAlso: ['girdle', 'table'],
  },
  {
    id: 'table',
    term: 'Table',
    sense: 'stone',
    definition:
      'The flat facet on top. Its width relative to the whole stone is one of the numbers a cut grade is built from.',
    seeAlso: ['pavilion', 'cut-grade'],
  },
  {
    id: 'karat',
    term: 'Karat',
    sense: 'metal',
    definition:
      'Gold purity in twenty-fourths. 24k is pure, 22k is 91.6% gold, 18k is 75%, 14k is 58.3%.',
    candour:
      'Purer is not better for everything. 22k is too soft to hold a stone securely for daily wear, which is why solitaires are set in 18k or platinum.',
    seeAlso: ['alloy', 'hallmark'],
  },
  {
    id: 'alloy',
    term: 'Alloy',
    sense: 'metal',
    definition:
      "The metals added to gold for strength and colour. Copper makes it rose, silver and palladium make it pale, nickel makes it white — and makes some people's skin react.",
    seeAlso: ['karat', 'rhodium'],
  },
  {
    id: 'rhodium',
    term: 'Rhodium plating',
    sense: 'metal',
    definition:
      'A hard bright-white plating over white gold, which underneath is faintly yellow.',
    candour:
      'It wears through in 12 to 24 months on a ring worn daily, and re-plating is a recurring cost for the life of the piece. Platinum has no such requirement.',
    seeAlso: ['alloy', 'platinum'],
  },
  {
    id: 'platinum',
    term: 'Platinum',
    sense: 'metal',
    definition:
      'Denser and rarer than gold, and naturally white all the way through. It does not wear away so much as move aside, developing a soft patina.',
    seeAlso: ['rhodium', 'karat'],
  },
  {
    id: 'hallmark',
    term: 'Hallmark',
    sense: 'paper',
    definition:
      'A struck mark certifying purity, applied by an assay office rather than by the maker.',
    candour:
      'A maker\'s own "18k" stamp is a claim. A hallmark is a test. They look similar and are not the same thing.',
    seeAlso: ['karat', 'assay'],
  },
  {
    id: 'assay',
    term: 'Assay',
    sense: 'paper',
    definition:
      'The destructive test that establishes what an alloy actually contains — a scraping is taken and analysed.',
    seeAlso: ['hallmark'],
  },
  {
    id: 'enhanced',
    term: 'Enhanced',
    sense: 'paper',
    definition:
      'A catch-all for treatment: heat, oil, resin, irradiation, glass filling.',
    candour:
      'Some enhancements are permanent and universally accepted, like heating a sapphire. Others, like glass-filled ruby, will not survive a jeweller\'s torch during a later repair. The word alone does not tell you which.',
    seeAlso: ['certificate'],
  },
  {
    id: 'certificate',
    term: 'Certificate',
    alias: 'grading report',
    sense: 'paper',
    definition:
      'An independent laboratory\'s opinion on a stone\'s grades. GIA and IGI are the names that carry weight.',
    candour:
      'A certificate grades the stone, not the price. It is also not a valuation, and the two are routinely presented together as though they were.',
    seeAlso: ['appraisal', 'enhanced'],
  },
  {
    id: 'appraisal',
    term: 'Appraisal',
    sense: 'paper',
    definition:
      'A monetary valuation, usually for insurance, at replacement cost.',
    candour:
      'Appraisals are commonly written high, because a high number flatters the buyer and raises the premium. It is not what the piece would fetch if sold.',
    seeAlso: ['certificate'],
  },
  {
    id: 'prong',
    term: 'Prong',
    alias: 'claw',
    sense: 'making',
    definition:
      'A metal finger bent over the girdle to hold a stone. Four shows more of the stone, six holds it better.',
    seeAlso: ['bezel', 'girdle'],
  },
  {
    id: 'bezel',
    term: 'Bezel',
    sense: 'making',
    definition:
      'A continuous rim of metal around the stone. The most secure setting there is, and the kindest to a stone that chips.',
    seeAlso: ['prong'],
  },
  {
    id: 'pave',
    term: 'Pavé',
    sense: 'making',
    definition:
      'Small stones set flush and close, so the metal beneath nearly disappears. From the French for a cobbled road.',
    candour:
      'Pavé stones are held by tiny beads of raised metal. They do come loose, and a ring with sixty of them is a maintenance commitment.',
    seeAlso: ['prong'],
  },
  {
    id: 'lost-wax',
    term: 'Lost-wax casting',
    sense: 'making',
    definition:
      'A wax model is invested in plaster, burnt out, and the void filled with molten metal. Four thousand years old and still how most rings are made.',
    seeAlso: ['chasing'],
  },
  {
    id: 'chasing',
    term: 'Chasing & repoussé',
    sense: 'making',
    definition:
      'Working sheet metal into relief from the front and the back respectively, with punches rather than by cutting.',
    seeAlso: ['lost-wax'],
  },
  {
    id: 'annealing',
    term: 'Annealing',
    sense: 'making',
    definition:
      'Heating metal to relieve the stress that working introduces. Without it, gold that has been hammered or drawn eventually cracks.',
    seeAlso: ['lost-wax'],
  },
  {
    id: 'shank',
    term: 'Shank',
    sense: 'wearing',
    definition:
      'The band of a ring — the part that goes round the finger. The place where wear shows first and where resizing is done.',
    seeAlso: ['comfort-fit', 'sizing'],
  },
  {
    id: 'comfort-fit',
    term: 'Comfort fit',
    sense: 'wearing',
    definition:
      'A band domed on the inside so it rides on a curve rather than on two edges. Noticeably easier over a knuckle.',
    candour:
      'A comfort-fit band runs about half a size tighter than a flat one of the same nominal size, because there is more metal in contact.',
    seeAlso: ['shank', 'sizing'],
  },
  {
    id: 'sizing',
    term: 'Sizing',
    sense: 'wearing',
    definition:
      'Cutting the shank and adding or removing metal. Straightforward on a plain band, and much less so on one set all the way round.',
    candour:
      'A full eternity band generally cannot be resized at all. That is a decision made at the point of purchase, not later.',
    seeAlso: ['shank', 'comfort-fit'],
  },
  {
    id: 'patina',
    term: 'Patina',
    sense: 'wearing',
    definition:
      'The soft surface a metal acquires from thousands of tiny contacts. On platinum it is a satin sheen; on silver it darkens.',
    candour:
      'Polishing removes patina by removing metal. Done repeatedly over decades it visibly thins a piece — which is why a good bench polishes as little as it can.',
    seeAlso: ['platinum'],
  },
  {
    id: 'knuckle-ratio',
    term: 'Knuckle ratio',
    sense: 'wearing',
    definition:
      'How much wider your knuckle is than the base of your finger. Above about 1.6 a plain round band will always spin once it is on.',
    seeAlso: ['sizing', 'comfort-fit'],
  },
];
