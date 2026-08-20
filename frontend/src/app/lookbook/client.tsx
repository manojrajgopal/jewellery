'use client';

import Image from 'next/image';
import PageBanner from '@/components/ui/PageBanner';
import SectionHeading from '@/components/ui/SectionHeading';
import GoldDivider from '@/components/ui/GoldDivider';
import CTAButton from '@/components/ui/CTAButton';
import GradientOrb from '@/components/ui/GradientOrb';

import LookbookFlip from '@/components/motion/LookbookFlip';
import FilmstripScroller from '@/components/motion/FilmstripScroller';
import CylinderMarquee from '@/components/motion/CylinderMarquee';
import ParallaxColumns from '@/components/motion/ParallaxColumns';
import ScrollAssembleText from '@/components/motion/ScrollAssembleText';
import ScrollStackCards from '@/components/motion/ScrollStackCards';
import VelvetTray from '@/components/motion/VelvetTray';
import RippleGrid from '@/components/motion/RippleGrid';
import CausticsCanvas from '@/components/motion/CausticsCanvas';
import FlipClock from '@/components/motion/FlipClock';
import KaleidoscopeGem from '@/components/motion/KaleidoscopeGem';
import CinematicLetterbox from '@/components/motion/CinematicLetterbox';
import InkBleedReveal from '@/components/motion/InkBleedReveal';
import GoldRibbonWeave from '@/components/motion/GoldRibbonWeave';
import DeckShuffle, { type DeckCard } from '@/components/motion/DeckShuffle';
import GemFacetTunnel from '@/components/motion/GemFacetTunnel';
import BokehDrift from '@/components/motion/BokehDrift';
import LightLeakOverlay from '@/components/motion/LightLeakOverlay';
import TypeSlamHeading from '@/components/motion/TypeSlamHeading';

import { lookbookLeaves, contactSheet } from '@/data/editorial';
import { collections } from '@/data/collections';
import GravityChainRail from '@/components/motion/GravityChainRail';
import ElasticRail from '@/components/motion/ElasticRail';
import TypeOnPath from '@/components/motion/TypeOnPath';
import SeasonPalette from '@/components/ui/SeasonPalette';
import { products } from '@/data/products';

/** The chapters, as a pile of cards that stack up while the reader scrolls. */
const CHAPTERS = [
  {
    id: 'ch1',
    kicker: 'Chapter One',
    title: 'Vows',
    body: 'The only work designed for two occasions at once — a single day under a photographer\'s lights, and forty years of ordinary Tuesdays. The second is the harder brief, and it decides the setting.',
    image: '/images/collections/bridal.jpg',
    meta: ['22K & Platinum', 'Six to fourteen weeks'],
    accent: 'gold' as const,
  },
  {
    id: 'ch2',
    kicker: 'Chapter Two',
    title: 'The Nizam Line',
    body: 'Drawn from court pieces of the 1890s and executed with the same foil-backing technique, not the shortcuts that replaced it. Kundan holds light behind a stone instead of through it.',
    image: '/images/collections/heritage.jpg',
    meta: ['Kundan · Jadau', 'Lakshmi Iyer, 33 years'],
    accent: 'burgundy' as const,
  },
  {
    id: 'ch3',
    kicker: 'Chapter Three',
    title: 'The Solitaire Question',
    body: 'One stone and nothing to hide behind. Everything about a solitaire is a decision about proportion — the height of the seat, the taper of the shank, and how much metal you will let the eye see.',
    image: '/images/products/ring.jpg',
    meta: ['Platinum 950', 'House proportions'],
    accent: 'amethyst' as const,
  },
  {
    id: 'ch4',
    kicker: 'Chapter Four',
    title: 'Against the Matched Set',
    body: 'Matching six stones across a necklace takes months of sourcing and produces a piece with no internal argument. We build the deliberate mismatch in — one stone a shade deeper, set where the eye lands last.',
    image: '/images/collections/statement.jpg',
    meta: ['Emerald · Ruby · Tanzanite'],
    accent: 'jade' as const,
  },
  {
    id: 'ch5',
    kicker: 'Chapter Five',
    title: 'Everyday',
    body: 'The pieces that never come off are the hardest to design and the least photographed. They have to survive a keyboard, a coat sleeve and a car door, and still be worth looking at.',
    image: '/images/collections/everyday.jpg',
    meta: ['18K', 'Bezel & flush set'],
    accent: 'rose' as const,
  },
];

const PLATES = [
  { src: '/images/collections/bridal.jpg', alt: 'Bridal suite', caption: 'Plate I · Bridal' },
  { src: '/images/products/ring.jpg', alt: 'Solitaire', caption: 'Plate II · Solitaire' },
  { src: '/images/collections/heritage.jpg', alt: 'Heritage choker', caption: 'Plate III · Heritage' },
  { src: '/images/products/necklace.jpg', alt: 'Handwoven chain', caption: 'Plate IV · Chain' },
  { src: '/images/collections/statement.jpg', alt: 'Statement collar', caption: 'Plate V · Statement' },
  { src: '/images/products/earrings.jpg', alt: 'Pearl drops', caption: 'Plate VI · Drops' },
  { src: '/images/collections/gemstone.jpg', alt: 'Loose stones', caption: 'Plate VII · Stones' },
  { src: '/images/collections/everyday.jpg', alt: 'Everyday stack', caption: 'Plate VIII · Stack' },
  { src: '/images/hero/craftsmanship.jpg', alt: 'The bench', caption: 'Plate IX · The Bench' },
  { src: '/images/collections/mens.jpg', alt: 'Signet row', caption: 'Plate X · Signets' },
  { src: '/images/products/bracelet.jpg', alt: 'Tennis bracelet', caption: 'Plate XI · Line' },
  { src: '/images/hero/hero-main.jpg', alt: 'The suite', caption: 'Plate XII · Suite' },
];

/**
 * The season's lookbook, presented three ways: bound as a book, laid out as a
 * contact sheet, and stacked as chapters.
 *
 * Three presentations of the same set is the point rather than a redundancy — a
 * reader either wants to turn pages, scan everything at once, or be walked through
 * it, and which one they want is not something the page can know in advance.
 */
/**
 * The season's chapters, as a hand rather than a bound book.
 *
 * Built from the lookbook leaves rather than from the contact sheet, because a
 * leaf already carries the two things a card needs — a title and a line worth
 * reading — where a contact frame carries only a slate.
 *
 * Every field on a leaf face is optional, and the imagery is not consistently on
 * one side: some leaves carry the plate on the recto and the words on the verso,
 * others the reverse. So each field is taken from whichever face has it, and any
 * leaf that ends up without a picture is dropped rather than rendered as an empty
 * card. Dropping is right here — a deck is a selection, not a complete index, and
 * the bound book above already shows everything.
 */
const SEASON_CARDS: DeckCard[] = lookbookLeaves
  .map((leaf) => {
    const image = leaf.recto.image ?? leaf.verso.image;
    if (!image) return null;
    return {
      id: leaf.id,
      title: leaf.verso.title ?? leaf.recto.title ?? 'This season',
      meta: leaf.verso.kicker ?? leaf.recto.kicker ?? leaf.verso.plate ?? 'Plate',
      image,
      note:
        leaf.verso.quote ??
        leaf.recto.quote ??
        leaf.verso.body ??
        'Shot on the floor, under the light the piece will actually be seen in.',
    } satisfies DeckCard;
  })
  .filter((card): card is DeckCard => card !== null)
  .slice(0, 6);

export default function LookbookClient() {
  // A fixed date rather than a computed one: the private view is a real event, and a
  // countdown to "three weeks from whenever you loaded this" is theatre.
  const privateView = '2026-11-14T18:00:00';

  const hero = products.find((p) => p.isBestseller) ?? products[0];

  return (
    <>
      <PageBanner
        title="The Lookbook"
        subtitle="Twelve plates, bound — turn the leaves at your own pace"
        breadcrumbs={[{ label: 'Lookbook' }]}
        backgroundImage="/images/collections/statement.jpg"
      />

      <div className="overflow-hidden bg-canvas">
        {/* ---- The bound book ---- */}
        <section className="relative py-20 md:py-28">
          <GradientOrb color="gold" size="lg" position="top-right" intensity={0.1} />
          <RippleGrid spacing={40} reach={190} />

          <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
            <SectionHeading
              eyebrow="Bound"
              title="Turn the leaves"
              highlightWords={['leaves']}
              subtitle="Six spreads, hinged and shadowed. Take hold of a page and drag it across, press either side of the gutter, or use the arrow keys."
              align="center"
              className="mb-14"
            />

            <LookbookFlip leaves={lookbookLeaves} title="Aurum · The Season" />
          </div>
        </section>

        <GoldDivider variant="jewel" />

        {/* ---- Contact sheet ---- */}
        <section className="relative border-y border-hairline bg-surface-raised/30 py-20 md:py-28">
          <div className="relative z-10 mx-auto max-w-[1600px] px-6 md:px-12">
            <SectionHeading
              eyebrow="Unedited"
              title="The contact sheet"
              highlightWords={['contact']}
              subtitle="Every frame as it came off the shoot, in shoot order. Scroll and the strip runs."
              align="left"
              ornament={false}
              className="mb-14"
            />

            <FilmstripScroller
              frames={contactSheet}
              height={380}
              travel={0.78}
              title="Aurum · Season Shoot"
            />
          </div>
        </section>

        {/* ---- The word drum ---- */}
        <section className="relative py-16 md:py-24">
          <CausticsCanvas intensity={0.28} lobes={5} />
          <div className="relative z-10 mx-auto max-w-4xl px-6">
            <p className="mb-8 text-center font-accent text-[10px] uppercase tracking-luxest text-accent">
              What the season is about
            </p>
            <CylinderMarquee
              items={[
                'Proportion',
                'Restraint',
                'Weight',
                'Foil',
                'Symmetry',
                'Patina',
                'Light',
                'Argument',
              ]}
              radius={140}
              speed={11}
            />
          </div>
        </section>

        {/* ---- Chapters, stacked ---- */}
        <section className="relative bg-canvas-alt py-20 md:py-28">
          <div className="relative z-10 mx-auto max-w-5xl px-6 md:px-12">
            <div className="mb-16">
              <p className="mb-5 font-accent text-[10px] uppercase tracking-luxest text-accent">
                Five chapters
              </p>
              <ScrollAssembleText
                text="Each one an argument with the last"
                as="h2"
                highlightWords={['argument']}
                spread={80}
                className="max-w-3xl font-display text-3xl font-light leading-[1.1] text-primary sm:text-4xl md:text-5xl"
              />
            </div>

            {/* Extra bottom room so the last card has scroll left to stick against */}
            <div className="pb-[30vh]">
              <ScrollStackCards cards={CHAPTERS} offset={22} />
            </div>
          </div>
        </section>

        <GoldDivider variant="wide" className="px-6" />

        {/* ---- The plate wall ---- */}
        <section className="relative py-20 md:py-28">
          <div className="relative z-10 mx-auto max-w-[1500px] px-6 md:px-12">
            <SectionHeading
              eyebrow="All Twelve"
              title="The plate wall"
              highlightWords={['plate']}
              subtitle="Columns travelling at different rates, so the wall has depth as you pass it."
              align="center"
              className="mb-14"
            />

            <ParallaxColumns plates={PLATES} columns={4} depth={140} />
          </div>
        </section>

        {/* ---- The piece in its case, and the private view ---- */}
        <section className="relative border-y border-hairline bg-surface-raised/30 py-20 md:py-28">
          <CausticsCanvas intensity={0.32} lobes={6} speed={30} />

          <div className="relative z-10 mx-auto grid max-w-6xl gap-14 px-6 md:px-12 lg:grid-cols-2 lg:items-center">
            <VelvetTray
              image={hero.images?.[0] ?? '/images/products/ring.jpg'}
              alt={hero.name}
              title={hero.name}
              subtitle={hero.gemstone ?? 'Presented by hand'}
              meta={[
                hero.formattedPrice ?? hero.price,
                hero.metal.replace('-', ' '),
                hero.category,
              ]}
              trigger="view"
            />

            <div>
              <p className="font-accent text-[10px] uppercase tracking-luxest text-accent">
                The Private View
              </p>
              <h2 className="mt-4 font-display text-3xl font-light leading-tight text-primary md:text-4xl">
                The whole season, on velvet, for one evening
              </h2>
              <p className="mt-5 max-w-prose font-sans text-base font-light leading-relaxed text-muted">
                Every plate in this book laid out in the boutique, with the artisan who
                made it standing next to it. Forty places, by invitation, and the bench
                answers questions until it closes.
              </p>

              <div className="mt-9">
                <FlipClock to={privateView} expiredLabel="The doors are open" />
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                <CTAButton variant="primary" size="lg" href="/contact" showArrow>
                  Request an invitation
                </CTAButton>
                <CTAButton variant="secondary" size="lg" href="/journal">
                  Read the journal
                </CTAButton>
              </div>
            </div>
          </div>
        </section>


        {/* ---- The season, dealt ----
             The plate wall above is the season arranged; this is the season
             handed over. Cut the deck or throw the top card aside \u2014 it is the
             same six looks and an entirely different relationship to them, and it
             is the only place on the site where the imagery can be touched
             rather than only scrolled past. */}
        <section className="relative overflow-hidden border-y border-hairline bg-canvas-alt/40 py-20 md:py-28">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <BokehDrift count={18} intensity={0.4} speed={0.6} blades={6} />
            <LightLeakOverlay intensity={0.32} interval={10} onClick />
          </div>

          <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
            <SectionHeading
              eyebrow="The Hand"
              title="Six looks, dealt rather than hung"
              highlightWords={['dealt']}
              subtitle="Drag the top card off, or cut the deck and see where it lands. The order is not curated once you start moving them, which is roughly how a season actually gets chosen."
              align="center"
              className="mb-14"
            />

            <DeckShuffle cards={SEASON_CARDS} />
          </div>
        </section>

        {/* ---- Into the stone ----
             A short held passage before the closing invitation. The facet tunnel
             is the one effect on the site that reads as going *inside* something
             rather than looking at it, which is the right last note for a book of
             surfaces. */}
        <section className="relative overflow-hidden bg-surface-sunken py-28 md:py-36">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <GemFacetTunnel rings={13} sides={8} intensity={0.5} twist={38} />
            <div className="absolute inset-0 bg-[radial-gradient(56%_44%_at_50%_50%,rgb(var(--canvas)/0.78),transparent_78%)]" />
          </div>

          <div className="relative z-10 mx-auto max-w-3xl px-6 text-center md:px-12">
            <p className="mb-8 font-accent text-[10px] uppercase tracking-luxest text-accent">
              Past the surface
            </p>
            <TypeSlamHeading
              lines={['Every plate here', 'is the outside', 'of something.']}
              highlightWords={['outside']}
              as="h2"
              gap={0.18}
              className="font-display text-3xl leading-[1.1] text-primary md:text-5xl"
            />
            <p className="mx-auto mt-8 max-w-xl font-sans text-base font-light leading-relaxed text-secondary">
              A lookbook can only ever photograph the face of a thing. What decides whether you keep
              it is underneath \u2014 the setting, the profile of the band, and the forty minutes at
              the bench that none of this shows.
            </p>
          </div>
        </section>

        {/* ---- The wire ----
             How a season is actually assembled before it is bound: the plates are
             pegged to a wire across the studio, in order, and moved along it until
             the sequence reads. The book upstairs is the finished object; this is
             the thing it was chosen on.

             The wire genuinely hangs — a catenary rather than a parabola — and it
             swings with the page's own scroll velocity, so the section establishes
             that its subject is a physical object under load before a word of it
             is read. */}
        <section className="relative overflow-hidden bg-canvas py-20 md:py-28">
          <div className="relative z-10 mx-auto max-w-[1500px] px-6 md:px-12">
            <GravityChainRail
              className="mb-14"
              links={52}
              sag={0.2}
              height={250}
              charms={[
                { at: 0.18, label: 'Plate I' },
                { at: 0.4, label: 'Plate IV' },
                { at: 0.62, label: 'Plate VII' },
                { at: 0.84, label: 'Plate XII' },
              ]}
            />

            <div className="mb-12 max-w-2xl">
              <TypeOnPath
                text="Pegged, then moved"
                curve="dip"
                size={58}
                travel
                className="mb-6 max-w-md"
              />
              <p className="font-accent text-[10px] uppercase tracking-luxest text-accent">
                Before The Binding
              </p>
              <h2 className="mt-4 font-display text-3xl leading-tight text-primary md:text-4xl">
                A season is chosen on a wire, not on a screen
              </h2>
              <p className="mt-4 font-sans text-sm font-light leading-relaxed text-secondary">
                Twelve plates pegged across the studio in order, and then moved along it for a
                week until the sequence reads. Below is the same run as it stood on the Friday —
                take hold of it and throw it, the way it was actually handled.
              </p>
            </div>

            <ElasticRail label="The season as it stood on the wire" gap={18}>
              {/* A leaf is two faces and the recto is the one seen before it is
                  turned, so that is the face pegged to the wire. Falling back to
                  the verso covers the one spread whose recto is a quote plate. */}
              {lookbookLeaves.map((leaf, i) => {
                const face = leaf.recto.image ? leaf.recto : leaf.verso;
                return (
                <figure
                  key={leaf.id}
                  className="w-72 flex-shrink-0 rounded-2xl border border-hairline bg-surface-raised/40 p-4"
                >
                  <span className="relative block h-80 overflow-hidden rounded-xl">
                    <Image
                      src={face.image ?? '/images/collections/statement.jpg'}
                      alt={face.title ?? `Plate ${i + 1}`}
                      fill
                      sizes="288px"
                      className="object-cover"
                    />
                    <span aria-hidden="true" className="absolute inset-0 bg-vitrine" />
                    {/* The peg. Two of them, at the top corners, because that is
                        how a plate hangs off a wire without curling. */}
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-4 top-2 flex justify-between"
                    >
                      <span className="block h-2 w-2 rounded-full bg-accent/70" />
                      <span className="block h-2 w-2 rounded-full bg-accent/70" />
                    </span>
                  </span>

                  <figcaption className="pt-4">
                    <p className="nums-tabular font-accent text-[9px] uppercase tracking-luxe text-faint">
                      Plate {String(i + 1).padStart(2, '0')}
                    </p>
                    <p className="mt-1.5 font-display text-lg leading-tight text-primary">
                      {face.title ?? face.kicker ?? 'Untitled plate'}
                    </p>
                  </figcaption>
                </figure>
                );
              })}
            </ElasticRail>
          </div>
        </section>

        {/* ---- Onward ---- */}
        {/* ---- The pattern study ----
             Where the endpapers come from. Every season's printed matter takes its
             repeat from one detail of one piece, run through mirrors until it stops
             looking like jewellery — and the plates opposite are the same three
             details as wet proofs. A page about a printed book should show how the
             printing was decided. */}
        <CinematicLetterbox slate="Endpapers" slateNote="Three details, mirrored" barHeight={0.09}>
          <section className="relative overflow-hidden bg-canvas py-20 md:py-28">
            <div className="relative z-10 mx-auto max-w-6xl px-6">
              <SectionHeading
                eyebrow="The Repeat"
                title="Every season's paper comes out of one detail"
                highlightWords={['one']}
                subtitle="A kundan collet, a woven chain link, a pavé field. Turned through mirrors until the repeat stops reading as jewellery and starts reading as pattern."
                align="center"
                className="mb-16"
              />

              <div className="grid gap-10 md:grid-cols-3">
                {[
                  {
                    src: '/images/collections/heritage.jpg',
                    segments: 12,
                    label: 'Kundan collet',
                    note: 'Twelve mirrors. The foil behind an uncut stone is what throws the colour back, and it is the warmest of the three.',
                  },
                  {
                    src: '/images/products/necklace.jpg',
                    segments: 16,
                    label: 'Woven link',
                    note: 'Sixteen. A hand-woven chain already repeats, so the mirrors are doubling a rhythm rather than inventing one.',
                  },
                  {
                    src: '/images/collections/gemstone.jpg',
                    segments: 20,
                    label: 'Pavé field',
                    note: 'Twenty, which is past the point of legibility — and the endpaper we chose, because at this density it reads as texture.',
                  },
                ].map((study) => (
                  <figure key={study.label} className="flex flex-col items-center">
                    <KaleidoscopeGem
                      src={study.src}
                      segments={study.segments}
                      spin={5}
                      caption={`${study.segments} mirrors`}
                      className="w-full max-w-[16rem]"
                    />
                    <figcaption className="mt-5 text-center">
                      <span className="font-accent text-[10px] uppercase tracking-luxer text-accent">
                        {study.label}
                      </span>
                      <p className="mt-2 font-sans text-xs font-light leading-relaxed text-muted">
                        {study.note}
                      </p>
                    </figcaption>
                  </figure>
                ))}
              </div>

              <div className="mt-20 grid items-center gap-12 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
                <div>
                  <p className="font-accent text-[10px] uppercase tracking-luxest text-accent">
                    Proofed Wet
                  </p>
                  <h3 className="mt-4 font-display text-3xl font-light leading-tight text-primary">
                    The plate is signed off damp, not dry
                  </h3>
                  <p className="mt-5 font-sans text-sm font-light leading-relaxed text-secondary">
                    Ink sits differently on damp stock, and a plate approved dry comes back from the
                    press half a stop darker. So every plate in the book is passed while the proof is
                    still wet at the edges &mdash; which is the state this one is in.
                  </p>
                </div>
                <InkBleedReveal
                  src="/images/collections/statement.jpg"
                  alt="A lookbook plate, proofed wet"
                  ratio={16 / 10}
                  roughness={20}
                  className="rounded-3xl border border-hairline"
                />
              </div>
            </div>
          </section>
        </CinematicLetterbox>

        <GoldRibbonWeave className="px-6" height={110} ribbons={4} />

        {/* ---- The palette, sourced ----
             Every lookbook has a palette and almost none of them say where it
             came from, which turns the most concrete decision of the season into
             decoration. A palette is a set of instructions to a bench about which
             metals go next to which stones, and it is arrived at by looking at
             specific physical things — a mango cut open, ink on a ledger page,
             cold charcoal from the hearth.

             The mixing strip is why this is not a list. Two colours held together
             with a hard join is the only way anybody has ever chosen a
             combination, and a gradient between them blurs away exactly the
             question being asked. The entry that matters most on each swatch is
             the metal it *fights*, because the question at the counter is always
             about the piece somebody already owns. */}
        <section className="relative overflow-hidden border-y border-hairline bg-canvas py-20 md:py-28">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <BokehDrift count={10} />
          </div>

          <div className="relative z-10 mx-auto max-w-6xl px-6">
            <SectionHeading
              eyebrow="Six Colours, Six Sources"
              title="A palette is an instruction, not a mood"
              highlightWords={['instruction,']}
              subtitle="Each of these was taken from a specific physical thing in or near the workshop, and each one carries the metal it fights as well as the metals it works with. The second list is the useful one."
              align="center"
              className="mb-16"
            />

            <SeasonPalette />
          </div>
        </section>

        <section className="relative px-6 py-24 text-center md:py-32">
          <SectionHeading
            eyebrow="Or Begin"
            title="Have one made instead"
            highlightWords={['made']}
            subtitle="Nothing in this book has to be bought as it is. Every plate started as a drawing, and the bench will start another."
            align="center"
            className="mb-10"
          />
          <div className="flex flex-wrap justify-center gap-4">
            <CTAButton variant="primary" size="lg" href="/bespoke" showArrow>
              Commission a piece
            </CTAButton>
            <CTAButton variant="secondary" size="lg" href={`/collections/${collections[0].id}`}>
              Browse the collections
            </CTAButton>
          </div>
        </section>
      </div>
    </>
  );
}
