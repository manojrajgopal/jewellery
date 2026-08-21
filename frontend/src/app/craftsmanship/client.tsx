'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import PageBanner from '@/components/ui/PageBanner';
import GlassPanel from '@/components/ui/GlassPanel';
import SectionHeading from '@/components/ui/SectionHeading';
import CTAButton from '@/components/ui/CTAButton';
import GoldDivider from '@/components/ui/GoldDivider';
import GradientOrb from '@/components/ui/GradientOrb';
import Parallax from '@/components/motion/Parallax';
import CurtainReveal from '@/components/motion/CurtainReveal';
import SplitText from '@/components/motion/SplitText';
import DiamondSparkles from '@/components/motion/DiamondSparkles';
import CausticsCanvas from '@/components/motion/CausticsCanvas';
import ParticleField from '@/components/motion/ParticleField';
import LensFlare from '@/components/motion/LensFlare';
import AtelierPanorama, { type PanoramaStation } from '@/components/ui/AtelierPanorama';
import DensityBench from '@/components/ui/DensityBench';
import SolderWeldPath from '@/components/motion/SolderWeldPath';
import FacetMosaicReveal from '@/components/motion/FacetMosaicReveal';
import ScrollStackCards from '@/components/motion/ScrollStackCards';
import ScrollAssembleText from '@/components/motion/ScrollAssembleText';
import LiquidDistortHover from '@/components/motion/LiquidDistortHover';
import RippleGrid from '@/components/motion/RippleGrid';
import MoltenPour from '@/components/motion/MoltenPour';
import VaultDoorReveal from '@/components/motion/VaultDoorReveal';
import GoldRibbonWeave from '@/components/motion/GoldRibbonWeave';
import PrismDispersion from '@/components/motion/PrismDispersion';
import RackFocusPlates, { type FocusPlate } from '@/components/motion/RackFocusPlates';
import SmokeVeil from '@/components/motion/SmokeVeil';
import MetaballGold from '@/components/motion/MetaballGold';
import LightLeakOverlay from '@/components/motion/LightLeakOverlay';
import TypeSlamHeading from '@/components/motion/TypeSlamHeading';
import StageSweep from '@/components/motion/StageSweep';
import HeatShimmer from '@/components/motion/HeatShimmer';
import EnamelAtlas from '@/components/ui/EnamelAtlas';
import SurfaceFinishAtlas from '@/components/ui/SurfaceFinishAtlas';
import { Reveal } from '@/components/animations/Reveal';
import LedgerSection from '@/app/_sections/home/LedgerSection';

/** Hotspots along the pan. `at` is a fraction of the strip's full width. */
const WORKSHOP_STATIONS: PanoramaStation[] = [
  {
    id: 'raising',
    label: 'Raising',
    at: 0.11,
    y: 62,
    detail:
      'A flat disc of gold beaten into a hollow form over a stake, by hand, in perhaps four hundred blows. The loudest bench in the room, and the reason the setters are at the far end.',
  },
  {
    id: 'kundan',
    label: 'Kundan',
    at: 0.33,
    y: 46,
    detail:
      'Uncut stones set into closed collets over burnished gold foil. The foil is what makes an uncut stone glow — it holds light behind the gem rather than passing it through.',
  },
  {
    id: 'setting',
    label: 'Setting',
    at: 0.56,
    y: 58,
    detail:
      'Micro-pavé under ten thousandths of an inch. Arun works to a bead he can barely see and checks it at forty magnifications afterwards. Absolute silence at this bench.',
  },
  {
    id: 'polishing',
    label: 'Polishing',
    at: 0.79,
    y: 50,
    detail:
      'Six grades of compound, coarsest to finest, and the piece is washed between every one. A single grain carried forward from the previous grade puts a scratch through an hour of work.',
  },
  {
    id: 'restoration',
    label: 'Restoration',
    at: 0.93,
    y: 66,
    detail:
      'The 1904 bench, with a burn mark in the left corner from a torch someone put down in 1957. Eighteen-month queue, never advertised.',
  },
];

/**
 * The one way to ruin the piece at each stage. Written as failure modes rather than
 * as a process, because the process strip further up this page already lists the
 * stages — and the failure is what explains the fourteen-week lead time.
 */
const FAILURE_MODES = [
  {
    id: 'f1',
    kicker: 'Stage One · Drawing',
    title: 'Drawing something that cannot be made',
    body: 'A gouache rendering can show a setting that would need the metal to be in two places at once. Nandita builds in the section thicknesses at the drawing stage, which is why our sketches look slightly heavier than the finished piece.',
    image: '/images/products/ring.jpg',
    meta: ['Two to three weeks', 'Nandita Rao'],
    accent: 'gold' as const,
  },
  {
    id: 'f2',
    kicker: 'Stage Two · Raising',
    title: 'Work-hardening the metal past the point of return',
    body: 'Gold beaten without annealing becomes brittle and splits along the stress line. The fix is to stop, heat, and start again — which is why a raised form takes days and a cast one takes hours.',
    image: '/images/hero/craftsmanship.jpg',
    meta: ['Four hundred blows', 'Ravi Menon, 41 years'],
    accent: 'burgundy' as const,
  },
  {
    id: 'f3',
    kicker: 'Stage Three · Setting',
    title: 'Cutting the seat one thousandth too deep',
    body: 'Too shallow and the stone sits proud and catches. Too deep and the girdle rests on nothing and the stone cracks the first time the ring meets a door frame. There is no adjustment afterwards; the seat is cut once.',
    image: '/images/collections/gemstone.jpg',
    meta: ['No second attempt', 'Arun Deshpande'],
    accent: 'amethyst' as const,
  },
  {
    id: 'f4',
    kicker: 'Stage Four · Polishing',
    title: 'Carrying one grain forward',
    body: 'Six compounds, coarsest to finest, and the piece is washed between every one. A single grain of the previous grade puts a scratch through an hour of finished work, and the only remedy is to go back two grades.',
    image: '/images/products/necklace.jpg',
    meta: ['Six compounds', 'Washed between each'],
    accent: 'jade' as const,
  },
  {
    id: 'f5',
    kicker: 'Stage Five · Finishing',
    title: 'Striking the mark through the shank',
    body: 'The hallmark and the artisan\'s mark are struck, not engraved, and a strike misjudged on a thin section distorts the band. It is the last operation on the piece and the one with the least margin.',
    image: '/images/collections/bridal.jpg',
    meta: ['Struck, not engraved', 'The final operation'],
    accent: 'rose' as const,
  },
];

/** Techniques still done by hand, with the reason rather than the romance. */
const TECHNIQUES = [
  {
    name: 'Hand-raising',
    origin: 'Anatolian, c. 2500 BC',
    image: '/images/hero/craftsmanship.jpg',
    why: 'Compresses the grain as it forms. A raised bowl is measurably stronger than a cast one of the same weight.',
  },
  {
    name: 'Kundan',
    origin: 'Mughal, 16th century',
    image: '/images/collections/heritage.jpg',
    why: 'A closed setting over gold foil. Nothing else makes an uncut stone glow, and nothing else holds it on all sides for a century.',
  },
  {
    name: 'Repoussé',
    origin: 'Mycenaean',
    image: '/images/collections/statement.jpg',
    why: 'Raised from behind, chased from the front. The two passes produce a relief with no seam and no solder.',
  },
  {
    name: 'Granulation',
    origin: 'Etruscan, 7th century BC',
    image: '/images/products/earrings.jpg',
    why: 'Grains fused without solder, by heat alone. The technique was lost for a thousand years and reconstructed twice.',
  },
  {
    name: 'Bright-cut',
    origin: 'Georgian, c. 1790',
    image: '/images/products/ring.jpg',
    why: 'A graver facet cut into the metal beside the stone, throwing light back at it. Machine engraving cannot reproduce the burr.',
  },
  {
    name: 'Pearl knotting',
    origin: 'Persian',
    image: '/images/products/necklace.jpg',
    why: 'A knot between every pearl. If the silk parts you lose one pearl instead of the whole strand.',
  },
];

const STAGES = [
  {
    num: '01',
    title: 'Design & Sketching',
    subtitle: 'Every masterpiece begins with a vision',
    desc: 'Our design process starts with an inspiration — a thought, a feeling, or a raw gem begging for the perfect setting. Our artisans hand-sketch intricate designs, capturing the essence of the piece before it enters the digital realm for precise 3D modelling.',
    image: '/images/hero/hero-main.jpg',
  },
  {
    num: '02',
    title: 'Wax Modeling',
    subtitle: 'Precision meets artistry in every curve',
    desc: 'Using the 3D model, we create a flawless wax replica. This delicate stage requires an incredibly steady hand and an eye for minute details, ensuring the final cast will be nothing short of perfect.',
    image: '/images/collections/heritage.jpg',
  },
  {
    num: '03',
    title: 'Gold Casting',
    subtitle: 'Ancient techniques, modern perfection',
    desc: 'The wax model is encased in plaster and fired, leaving a negative space. Molten gold — alloyed in-house to achieve our signature hues — is poured into the mould. The rough cast emerges, ready to be transformed.',
    image: '/images/products/ring.jpg',
  },
  {
    num: '04',
    title: 'Stone Setting',
    subtitle: 'Each gem placed with surgical precision',
    desc: 'Under intense magnification, our master setters secure each diamond and gemstone. Using traditional techniques like pavé, bezel, and prong, they ensure maximum light return and absolute structural integrity.',
    image: '/images/collections/gemstone.jpg',
  },
  {
    num: '05',
    title: 'Final Polish',
    subtitle: 'Revealing the brilliance within',
    desc: 'The final stage involves multiple rounds of polishing using progressively finer compounds. The result is a mirror finish that accentuates the form and prepares the piece for its final quality inspection.',
    image: '/images/hero/craftsmanship.jpg',
  },
];

const MATERIALS = [
  {
    title: 'Ethical Gold',
    desc: 'We source exclusively recycled and Fairtrade gold, minimising our environmental footprint without compromising the luxurious weight and colour of our alloys.',
    image: '/images/collections/bridal.jpg',
  },
  {
    title: 'Conflict-Free Diamonds',
    desc: 'Every diamond is Kimberley Process certified. We hand-select stones for cut, colour, clarity, and undeniable fire.',
    image: '/images/products/bracelet.jpg',
  },
  {
    title: 'Rare Gemstones',
    desc: 'From vibrant Colombian emeralds to deep Ceylon sapphires, we travel the world to procure the most exceptional precious stones.',
    image: '/images/products/earrings.jpg',
  },
];

/**
 * Three depths in the same workshop, for the focus pull.
 *
 * Chosen so the pull travels *inward* \u2014 the room, then the bench, then the work
 * itself \u2014 because a rack focus that jumps between unrelated subjects reads as
 * a slideshow. Going one step deeper each time is what makes it read as one
 * camera making a decision.
 */
const WORKSHOP_PLATES: FocusPlate[] = [
  {
    src: '/images/hero/craftsmanship.jpg',
    alt: 'The workshop floor, benches in a row under north light',
    caption: 'The room. North-facing, because north light does not move through the day.',
    mark: 'The room',
  },
  {
    src: '/images/collections/heritage.jpg',
    alt: 'A single bench with tools laid out',
    caption: 'The bench. Every tool within one arm\u2019s reach, arranged by the person using it.',
    mark: 'The bench',
  },
  {
    src: '/images/products/ring.jpg',
    alt: 'A ring held under the loupe, mid-setting',
    caption: 'The work. Ten magnifications, four claws, and roughly forty minutes.',
    mark: 'The work',
  },
];

export default function CraftsmanshipClient() {
  return (
    <main className="min-h-screen bg-canvas">
      <PageBanner
        title="The Art of Creation"
        subtitle="Where ancient wisdom meets modern mastery"
        breadcrumbs={[{ label: 'Craftsmanship' }]}
        backgroundImage="/images/hero/craftsmanship.jpg"
      />

      {/* Editorial intro */}
      <section className="relative overflow-hidden py-24">
        <CausticsCanvas intensity={0.35} lobes={6} />
        <ParticleField count={38} rise link />

        <GradientOrb color="gold" size="xl" position="left" intensity={0.1} blur="3xl" />

        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 md:px-12 lg:grid-cols-2">
          <div>
            <SplitText
              text="A legacy built on uncompromising precision."
              as="h2"
              mode="words"
              highlightWords={['uncompromising', 'precision.']}
              className="mb-6 font-display text-4xl leading-tight text-primary md:text-5xl"
            />
            <Reveal delay={0.25}>
              <p className="font-sans text-base font-light leading-relaxed text-muted lg:text-lg">
                At AURUM we do not merely manufacture jewellery; we sculpt heirlooms. Our ateliers
                house artisans who have dedicated their lives to mastering techniques passed down
                through generations, combining them with contemporary technology to achieve what
                neither could alone.
              </p>
            </Reveal>
          </div>

          <CurtainReveal
            direction="right"
            className="relative aspect-[4/5] overflow-hidden rounded-2xl"
          >
            <Parallax speed={0.3} scaleRange={[1, 1.12]} className="h-full w-full">
              <Image
                src="/images/collections/statement.jpg"
                alt="Inside the AURUM atelier"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </Parallax>
            <span className="pointer-events-none absolute inset-4 rounded-xl border border-gold-500/25" />
          </CurtainReveal>
        </div>
      </section>

      <GoldDivider variant="jewel" />

      {/* Stages */}
      <section className="bg-surface-raised/30 py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <SectionHeading
            eyebrow="The Process"
            title="From Concept to Heirloom"
            highlightWords={['Heirloom']}
            align="center"
            className="mb-24"
          />

          <div className="space-y-32">
            {STAGES.map((stage, index) => {
              const flipped = index % 2 !== 0;

              return (
                <div
                  key={stage.num}
                  className={`flex flex-col items-center gap-12 lg:gap-24 ${
                    flipped ? 'lg:flex-row-reverse' : 'lg:flex-row'
                  }`}
                >
                  <div className="w-full lg:w-1/2">
                    <Reveal direction={flipped ? 'right' : 'left'}>
                      <div className="group relative aspect-square overflow-hidden rounded-2xl">
                        <Image
                          src={stage.image}
                          alt={stage.title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-cover transition-transform duration-[1400ms] ease-luxury group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 to-transparent" />

                        <span className="absolute left-6 top-4 font-display text-8xl text-gold-100/25 transition-colors duration-700 group-hover:text-gold-400/50">
                          {stage.num}
                        </span>

                        <span className="pointer-events-none absolute inset-5 rounded-xl border border-gold-400/0 transition-colors duration-700 group-hover:border-gold-400/40" />
                      </div>
                    </Reveal>
                  </div>

                  <div className="flex w-full flex-col justify-center lg:w-1/2">
                    <Reveal direction={flipped ? 'left' : 'right'} delay={0.2}>
                      <h3 className="mb-2 font-display text-4xl text-primary">{stage.title}</h3>
                      <p className="mb-6 font-accent text-[11px] uppercase tracking-luxe text-accent">
                        {stage.subtitle}
                      </p>
                      <span className="mb-6 block h-px w-16 bg-accent/50" />
                      <p className="font-sans text-base font-light leading-relaxed text-muted lg:text-lg">
                        {stage.desc}
                      </p>
                    </Reveal>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Materials */}
      <section className="px-6 py-32 md:px-12">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Sourcing"
            title="The Finest Materials"
            highlightWords={['Finest']}
            subtitle="We accept nothing less than extraordinary."
            align="center"
            className="mb-16"
          />

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {MATERIALS.map((mat, idx) => (
              <Reveal key={mat.title} delay={idx * 0.18} className="h-full">
                <GlassPanel interactive className="group h-full overflow-hidden">
                  <div className="relative m-4 aspect-[4/3] overflow-hidden rounded-lg">
                    <Image
                      src={mat.image}
                      alt={mat.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-[1100ms] ease-luxury group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6 pt-2">
                    <h3 className="mb-3 font-display text-2xl text-primary transition-colors duration-300 group-hover:text-accent">
                      {mat.title}
                    </h3>
                    <p className="font-sans text-sm font-light leading-relaxed text-muted">
                      {mat.desc}
                    </p>
                  </div>
                </GlassPanel>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* The workshop, pannable. A photograph shows one bench; a pan shows how far
          apart the benches are, which is the thing visitors are always surprised by. */}
      <section className="relative overflow-hidden border-y border-hairline bg-canvas-alt py-24 md:py-32">
        <div className="relative z-10 mx-auto max-w-[1500px] px-6 md:px-12">
          <SectionHeading
            eyebrow="Pan The Room"
            title="Five benches, forty feet apart"
            highlightWords={['forty']}
            subtitle="Raising, setting, kundan, polishing and restoration — deliberately separated, because a setter needs quiet and a raiser makes noise. Drag across, and press a mark to hear what happens there."
            align="center"
            className="mb-14"
          />

          <AtelierPanorama
            plates={[
              { src: '/images/hero/craftsmanship.jpg', alt: 'The raising bench' },
              { src: '/images/collections/heritage.jpg', alt: 'The kundan bench' },
              { src: '/images/collections/gemstone.jpg', alt: 'The setting bench' },
              { src: '/images/products/necklace.jpg', alt: 'The polishing room' },
            ]}
            stations={WORKSHOP_STATIONS}
            height={480}
          />
        </div>
      </section>

      {/* The five operations, stacked. The process strip earlier on this page names
          the stages; this says what can go wrong at each one, which is the half that
          actually explains why the work takes fourteen weeks. */}
      <section className="relative overflow-hidden bg-canvas py-24 md:py-32">
        <RippleGrid spacing={48} reach={190} dot={1} />

        <div className="relative z-10 mx-auto max-w-5xl px-6 md:px-12">
          <div className="mb-16 text-center">
            <p className="mb-5 font-accent text-[10px] uppercase tracking-luxest text-accent">
              What Can Go Wrong
            </p>
            <ScrollAssembleText
              text="Every stage has one way to ruin the piece"
              as="h2"
              highlightWords={['ruin']}
              spread={74}
              className="mx-auto max-w-3xl font-display text-3xl font-light leading-[1.12] text-primary sm:text-4xl md:text-5xl"
            />
          </div>

          <div className="pb-[28vh]">
            <ScrollStackCards cards={FAILURE_MODES} offset={22} shrink={0.05} />
          </div>
        </div>
      </section>

      {/* ---- The pour ----
           The one operation on this page that is irreversible while you watch it.
           Placed after the failure modes on purpose: the section above explains what
           can go wrong, and this is the ninety seconds in which most of it does. */}
      <section className="relative overflow-hidden border-y border-hairline bg-canvas-alt py-24 md:py-32">
        <PrismDispersion at={{ x: 0.82, y: 0.3 }} size={130} rays={22} interactive={false} />

        <div className="relative z-10 mx-auto max-w-5xl px-6 md:px-12">
          <MoltenPour word="Cast" note="1,064°C · ninety seconds of no second chances" />

          <div className="mx-auto mt-14 grid max-w-4xl gap-8 md:grid-cols-3">
            {[
              {
                figure: '1,064',
                unit: '°C',
                line:
                  'The melting point of pure gold. Alloyed to 22K it moves a little, and the crucible is held forty degrees above it — hot enough to stay liquid across the pour, cool enough not to burn the alloy off.',
              },
              {
                figure: '90',
                unit: 'seconds',
                line:
                  'From tilting the crucible to the tree being quenched. Slow the pour and it freezes mid-sprue; rush it and the metal folds air into itself, which shows up as a pinhole on a finished shank three weeks later.',
              },
              {
                figure: '1 in 6',
                unit: 'trees',
                line:
                  'Comes off the wax tree with something wrong enough to scrap. It goes back into the crucible, which is the only part of this trade where a mistake costs time and not material.',
              },
            ].map((stat, i) => (
              <motion.div
                key={stat.figure}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl border border-hairline bg-surface-raised/50 p-6"
              >
                <span className="flex items-baseline gap-1.5">
                  <span className="font-display text-4xl text-accent nums-tabular">
                    {stat.figure}
                  </span>
                  <span className="font-accent text-[10px] uppercase tracking-luxe text-faint">
                    {stat.unit}
                  </span>
                </span>
                <p className="mt-3 font-sans text-sm font-light leading-relaxed text-secondary">
                  {stat.line}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <GoldRibbonWeave className="px-6" height={110} ribbons={4} />


      {/* ---- Pulling focus through the workshop ----
           The panorama earlier lets a visitor look around the room; this does the
           opposite and looks *into* it. Three plates at three depths \u2014 room,
           bench, work \u2014 with exactly one sharp at a time, pulled by the scroll.

           The order is inward on purpose. A focus pull between unrelated subjects
           reads as a slideshow; going one step deeper each time is what makes it
           read as one camera deciding what matters. */}
      <section className="relative overflow-hidden border-y border-hairline bg-canvas-alt/40 py-24 md:py-32">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <SmokeVeil intensity={0.26} originX={0.22} speed={0.75} count={18} />
          <LightLeakOverlay intensity={0.3} interval={11} onClick />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
          <SectionHeading
            eyebrow="Depth Of Field"
            title="One room, three distances"
            highlightWords={['three']}
            subtitle="Scroll and the focus travels from the floor to the bench to the forty minutes it takes to seat four claws. Or take the focus ring yourself and hold it wherever you want to look."
            align="center"
            className="mb-14"
          />

          <RackFocusPlates plates={WORKSHOP_PLATES} frameClassName="aspect-[16/9]" />
        </div>
      </section>

      {/* ---- The heat ----
           A held shot between the workshop and the closing quotation. The molten
           field is the only place on this page where the atmosphere reads as
           material rather than as light, which is right directly after a section
           about a furnace. */}
      <section className="relative overflow-hidden bg-surface-sunken py-28 md:py-36">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <MetaballGold count={7} intensity={0.42} step={3} />
          <StageSweep intensity={0.2} width={0.28} seconds={18} />
          <div className="absolute inset-0 bg-[radial-gradient(60%_48%_at_50%_50%,rgb(var(--canvas)/0.74),transparent_80%)]" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center md:px-12">
          <p className="mb-8 font-accent text-[10px] uppercase tracking-luxest text-accent">
            1064 degrees
          </p>

          <TypeSlamHeading
            lines={['Gold does not', 'forgive impatience.', 'It forgives everything else.']}
            highlightWords={['impatience.']}
            as="h2"
            gap={0.18}
            className="font-display text-3xl leading-[1.1] text-primary sm:text-4xl md:text-6xl"
          />

          <p className="mx-auto mt-10 max-w-xl font-sans text-base font-light leading-relaxed text-secondary md:text-lg">
            Worked cold for too long it cracks; annealed properly it can be beaten thin enough to
            see through and hammered back into a bangle. Almost nothing else we handle can be
            un-made and re-made this many times, which is the whole reason a piece from here can
            still be something else in eighty years.
          </p>
        </div>
      </section>

      {/* ---- The arithmetic ----
           The question every counter in this trade is asked in exactly these
           words — "but it's the same ring" — and the answer has two halves that
           nobody separates for the customer. Density, then bench hours. It sits
           here because the five benches and the techniques above have just
           established what those hours actually consist of. */}
      <section className="relative overflow-hidden border-y border-hairline bg-canvas py-24 md:py-28">
        <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
          <SectionHeading
            eyebrow="But It Is The Same Ring"
            title="Platinum is cheaper per gram and makes the dearest ring here"
            highlightWords={['dearest']}
            subtitle="One design, six metals, and the price split into metal and bench so the inversion is visible: platinum's metal costs less per gram than gold's, and it is still the most expensive object on the list. That single fact explains more about jewellery pricing than any amount of copy about heritage."
            align="center"
            className="mb-14"
          />

          <DensityBench />

          {/* And the joins those hours are spent on. */}
          <div className="mt-20">
            <p className="text-center font-accent text-[10px] uppercase tracking-luxest text-accent">
              Five of the joins those hours are spent on
            </p>
            <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
              <SolderWeldPath join="shank" duration={2.2} />
              <SolderWeldPath join="bezel" duration={2.4} />
              <SolderWeldPath join="claw" duration={2.8} />
              <SolderWeldPath join="link" duration={2} />
              <SolderWeldPath join="ring" duration={2.6} />
            </div>
          </div>

          <div className="mt-20 grid items-center gap-12 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
            <FacetMosaicReveal
              src="/images/hero/craftsmanship.jpg"
              alt="The bench, assembled facet by facet"
              columns={8}
              order="diagonal"
              ratio={0.8}
              caption="Assembled on a raking light"
            />
            <div>
              <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
                Why platinum has its own everything
              </p>
              <p className="mt-4 font-sans text-sm font-light leading-relaxed text-secondary">
                A trace of gold in a platinum join stays there for ever — it lowers the melting
                point of the alloy at exactly the point where the piece is weakest, and no amount
                of subsequent work removes it. So platinum gets its own torch, its own solders,
                its own files and its own polishing wheels, none of which may ever touch gold.
              </p>
              <p className="mt-4 font-sans text-sm font-light leading-relaxed text-secondary">
                That is not a policy. It is the reason the bench is laid out the way the panorama
                above shows it, with forty feet between two of the stations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- The strongroom ----
           Where work-in-progress sleeps. A mechanism rather than a paragraph,
           because the honest answer to "where is my piece tonight" is a door. */}
      <section className="relative bg-canvas py-6">
        <VaultDoorReveal
          label="Overnight"
          note="Your commission is behind this every night it is not being worked on."
          minHeight="min-h-[80vh]"
        >
          <div className="mx-auto max-w-3xl px-6 py-16 text-center md:py-20">
            <p className="font-accent text-[10px] uppercase tracking-luxest text-accent">
              The Strongroom
            </p>
            <h2 className="mt-5 font-display text-3xl font-light leading-tight text-primary sm:text-4xl md:text-5xl">
              Nothing sleeps on a bench
            </h2>
            <div className="mx-auto mt-6 max-w-2xl space-y-4 font-sans text-base font-light leading-relaxed text-secondary">
              <p>
                Every piece in progress is logged out to an artisan in the morning and logged back
                in at night, by weight. A shank that leaves the strongroom at 6.42 grams comes back
                at 6.42 grams or somebody explains the difference — filings included, which are
                swept, collected and refined.
              </p>
              <p>
                It is a tedious ritual and it is the reason the house has never lost a stone in four
                generations. Ask to see the day book when you visit; it is not a secret.
              </p>
            </div>
          </div>
        </VaultDoorReveal>
      </section>

      {/* Techniques, as plates that warp under the pointer */}
      <section className="relative overflow-hidden border-y border-hairline bg-surface-raised/30 py-24 md:py-32">
        <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
          <SectionHeading
            eyebrow="The Hands"
            title="Six techniques we have not mechanised"
            highlightWords={['mechanised']}
            subtitle="Not out of nostalgia. Each of these produces a result a machine cannot yet match, and where that stops being true we will change our minds."
            align="center"
            className="mb-14"
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TECHNIQUES.map((technique, i) => (
              <motion.div
                key={technique.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <LiquidDistortHover
                  src={technique.image}
                  alt={technique.name}
                  aspect="4 / 5"
                  strength={18}
                  frequency={0.015}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                >
                  <span className="block font-accent text-[9px] uppercase tracking-luxest text-accent">
                    {technique.origin}
                  </span>
                  <span className="mt-1.5 block font-display text-xl font-light text-on-media">
                    {technique.name}
                  </span>
                  <span className="mt-2 block font-sans text-[11px] font-light leading-relaxed text-on-media-muted">
                    {technique.why}
                  </span>
                </LiquidDistortHover>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- The last hour, and the first thing to go ----
           Placed at the close of the workshop tour because a finish genuinely
           is the last operation, and because the page has spent two thousand
           words on processes that leave permanent structure and has not yet
           said that the visible surface of all of it is temporary.

           The eight-year toggle is the argument. The most expensive finish on
           the list is the least durable, the cheapest survives everything, and
           the one that looks hardest-wearing is the only one that cannot be
           restored — which is the exact opposite of what anybody assumes. */}
      <section className="relative overflow-hidden border-y border-hairline bg-canvas-alt py-24 md:py-32">
        <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
          <SectionHeading
            eyebrow="The last hour on the bench"
            title="Seven finishes, and what each looks like in eight years"
            highlightWords={['eight']}
            subtitle="A mirror polish is the most expensive surface here and the least durable — it picks up its first visible scratch within a fortnight. A bead blast is the cheapest and survives everything. Nobody is told this before they choose, so here it is with the wear turned on."
            align="left"
            className="mb-14"
          />

          <SurfaceFinishAtlas />
        </div>
      </section>

      {/* Quote + CTA */}
      {/* ---- Glass on metal ----
           The atelier run above covers everything done to metal by hand. Enamel
           is the one craft on the premises where the maker takes all the risk:
           the piece is finished, engraved and complete before it goes into the
           kiln, and if the glass crazes it is gone. There is no repair.

           Each technique is drawn in section rather than photographed, because
           the drawing is the explanation — the difference between cloisonné and
           champlevé is entirely whether the walls holding the glass were added to
           the surface or carved out of it, and the finished pieces are
           indistinguishable.

           Wrapped in the heat of the kiln it goes into. The shimmer is the only
           treatment on this site that distorts what is behind it rather than
           adding something on top, which is exactly what hot air does. */}
      <HeatShimmer strength={1.3} embers reading="820 °C" className="relative">
        <section className="relative overflow-hidden border-y border-hairline bg-surface-sunken py-24 md:py-32">
          <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
            <SectionHeading
              eyebrow="Fired, Not Set"
              title="The only bench where a mistake cannot be undone"
              highlightWords={['cannot']}
              subtitle="Enamel is glass fused to metal at around eight hundred degrees, and every colour has its own melting point — so a six-colour panel goes through the kiln six times, hottest first, and each pass is another chance to lose the whole piece."
              align="center"
              className="mb-16"
            />

            <EnamelAtlas />
          </div>
        </section>
      </HeatShimmer>

      <LedgerSection />

      <section className="relative overflow-hidden bg-surface-raised/30 px-6 py-32 text-center">
        <LensFlare intensity={0.4} originX={50} originY={20} follow={false} />

        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-900/15 blur-[130px]" />
        <DiamondSparkles density={22} shape="star" className="z-[1]" />

        <div className="relative z-10">
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
            className="mb-[-40px] block font-display text-8xl text-accent/25"
          >
            &ldquo;
          </motion.span>

          <SplitText
            text="True luxury is the evidence of human touch, the dedication of time, and the pursuit of flawlessness."
            as="h2"
            mode="words"
            stagger={0.045}
            highlightWords={['flawlessness.']}
            className="mx-auto mb-12 max-w-4xl font-display text-3xl italic leading-tight text-primary md:text-5xl"
          />

          <CTAButton href="/bespoke" variant="primary" size="lg" showArrow>
            Commission a Bespoke Piece
          </CTAButton>
        </div>
      </section>
    </main>
  );
}
