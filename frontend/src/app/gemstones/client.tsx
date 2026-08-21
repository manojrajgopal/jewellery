'use client';

import PageBanner from '@/components/ui/PageBanner';
import SectionHeading from '@/components/ui/SectionHeading';
import GoldDivider from '@/components/ui/GoldDivider';
import CTAButton from '@/components/ui/CTAButton';
import GradientOrb from '@/components/ui/GradientOrb';
import GemLibrary from '@/components/ui/GemLibrary';
import BirthstoneWheel from '@/components/ui/BirthstoneWheel';
import MetalComparator from '@/components/ui/MetalComparator';
import ProvenanceMap from '@/components/ui/ProvenanceMap';

import CaratScaleComparator from '@/components/ui/CaratScaleComparator';
import GemSpectroscope from '@/components/ui/GemSpectroscope';
import FluorescenceViewer from '@/components/ui/FluorescenceViewer';
import HallmarkDecoder from '@/components/ui/HallmarkDecoder';
import InclusionPlotter from '@/components/ui/InclusionPlotter';

import MorphGemPath from '@/components/motion/MorphGemPath';
import GemFacetTunnel from '@/components/motion/GemFacetTunnel';
import StageSweep from '@/components/motion/StageSweep';
import BokehDrift from '@/components/motion/BokehDrift';
import TypeSlamHeading from '@/components/motion/TypeSlamHeading';
import MosaicShuffle from '@/components/motion/MosaicShuffle';
import PrismDispersion from '@/components/motion/PrismDispersion';
import GoldRibbonWeave from '@/components/motion/GoldRibbonWeave';
import JewellerLoupe from '@/components/motion/JewellerLoupe';
import ScrollAssembleText from '@/components/motion/ScrollAssembleText';
import RippleGrid from '@/components/motion/RippleGrid';
import CausticsCanvas from '@/components/motion/CausticsCanvas';
import ParticleField from '@/components/motion/ParticleField';
import CylinderMarquee from '@/components/motion/CylinderMarquee';
import CanvasGemRain from '@/components/motion/CanvasGemRain';
import TypeOnPath from '@/components/motion/TypeOnPath';
import FacetMosaicReveal from '@/components/motion/FacetMosaicReveal';
import PearlGrader from '@/components/ui/PearlGrader';
import TreatmentDisclosure from '@/components/ui/TreatmentDisclosure';
import ProportionScope from '@/components/ui/ProportionScope';
import StoneCutYield from '@/components/ui/StoneCutYield';
import LabGrownLedger from '@/components/ui/LabGrownLedger';

import LexiconSection from '@/app/_sections/home/LexiconSection';
import LightingRoomSection from '@/app/_sections/home/LightingRoomSection';

/**
 * The stone library — the reference half of the site.
 *
 * Ordered by how a customer actually arrives at a stone: they know their month, or
 * they know a name, or they know neither and want to be shown the cuts. So the dial
 * comes first, the library second, and the recut animation sits between them as the
 * thing to look at while deciding.
 *
 * The metals bench and the provenance chain are here rather than on the craftsmanship
 * page because both are questions about *the stone in front of you* — what it will be
 * set in, and where it came from — not about how the house works.
 */
export default function GemstonesClient() {
  return (
    <>
      <PageBanner
        title="The Stone Library"
        subtitle="Every gem we set, and the figures that decide how it can be worn"
        breadcrumbs={[{ label: 'Stones' }]}
        backgroundImage="/images/collections/gemstone.jpg"
      />

      <div className="overflow-hidden bg-canvas">
        {/* ---- Opening: the recut ---- */}
        <section className="relative py-20 md:py-28">
          <GradientOrb color="gold" size="lg" position="top-right" intensity={0.1} />
          <ParticleField count={26} rise />

          <div className="relative z-10 mx-auto grid max-w-6xl gap-14 px-6 md:px-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="mb-5 font-accent text-[10px] uppercase tracking-luxest text-accent">
                Six Cuts
              </p>

              <ScrollAssembleText
                text="One stone, recut six ways"
                as="h2"
                highlightWords={['recut']}
                spread={76}
                className="font-display text-3xl font-light leading-[1.1] text-primary sm:text-4xl md:text-5xl"
              />

              <div className="mt-7 space-y-5 font-sans text-base font-light leading-relaxed text-muted">
                <p>
                  A cut is not decoration. It is the decision about where light enters a
                  stone and where it leaves, and it is the single largest influence on how
                  a gem looks across a table — larger than colour, larger than clarity, and
                  larger than a grading report will ever suggest.
                </p>
                <p>
                  Every silhouette here is drawn to the same girdle diameter, so what you
                  are watching is the same stone being reproportioned rather than six
                  stones of different sizes. The weight changes. The spread changes. What
                  comes back at you changes most of all.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <CTAButton variant="primary" size="md" href="/bespoke" showArrow>
                  Have one cut for you
                </CTAButton>
                <CTAButton variant="secondary" size="md" href="/journal/why-we-lose-weight-on-purpose">
                  Why we lose weight
                </CTAButton>
              </div>
            </div>

            <div className="flex justify-center">
              <MorphGemPath size={300} selectable hold={2.6} />
            </div>
          </div>
        </section>

        <GoldDivider variant="jewel" />

        {/* ---- The birthstone dial ---- */}
        <section className="relative border-y border-hairline bg-surface-raised/30 py-20 md:py-28">
          <CausticsCanvas intensity={0.32} lobes={6} speed={30} />

          <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
            <SectionHeading
              eyebrow="By Month"
              title="Turn the dial to your month"
              highlightWords={['dial']}
              subtitle="Opened on the month you are in. Drag it, or press a stone to bring it under the mark."
              align="center"
              className="mb-16"
            />

            <BirthstoneWheel size={400} />
          </div>
        </section>

        {/* ---- The library ---- */}
        <section className="relative py-20 md:py-28">
          <RippleGrid spacing={44} reach={190} dot={1.1} />

          <div className="relative z-10 mx-auto max-w-[1500px] px-6 md:px-12">
            <SectionHeading
              eyebrow="The Reference"
              title="Twelve stones, honestly graded"
              highlightWords={['honestly']}
              subtitle="Sort by hardness to find what survives daily wear, or by fire to find what sparkles hardest. The bars run on a fixed scale, so a short bar is genuinely short."
              align="center"
              className="mb-16"
            />

            <GemLibrary />
          </div>
        </section>

        {/* ---- Under the loupe ---- */}
        <section className="relative border-y border-hairline bg-canvas-alt py-20 md:py-28">
          <div className="relative z-10 mx-auto grid max-w-6xl gap-14 px-6 md:px-12 lg:grid-cols-2 lg:items-center">
            <JewellerLoupe
              src="/images/collections/gemstone.jpg"
              alt="A parcel of loose stones on the sorting tray"
              zoom={2.4}
              size={200}
              readout="10× loupe"
              aspect="4 / 3"
            />

            <div>
              <p className="mb-5 font-accent text-[10px] uppercase tracking-luxest text-accent">
                Ten Times
              </p>
              <h2 className="font-display text-3xl font-light leading-tight text-primary md:text-4xl">
                Everything we sell is judged at ten magnifications
              </h2>
              <div className="mt-6 space-y-5 font-sans text-base font-light leading-relaxed text-muted">
                <p>
                  Ten is not arbitrary. It is the magnification the entire clarity scale is
                  defined at — a stone graded &ldquo;eye clean&rdquo; means clean to an
                  unaided eye, and &ldquo;VS&rdquo; means what a trained grader can find at
                  exactly ten times and no more.
                </p>
                <p>
                  Which means a loupe is not a way of finding fault. It is the instrument
                  the grade was written with, and the only honest way to check that the
                  report and the stone are describing the same object. Move across the
                  parcel and look for yourself.
                </p>
              </div>

              <dl className="mt-9 grid grid-cols-3 gap-5 border-t border-hairline pt-6">
                {[
                  { k: 'Graded at', v: '10×' },
                  { k: 'Photographed at', v: '40×' },
                  { k: 'Above 0.30ct', v: '100%' },
                ].map((row) => (
                  <div key={row.k}>
                    <dd className="nums-tabular font-display text-2xl text-accent">{row.v}</dd>
                    <dt className="mt-1 font-accent text-[9px] uppercase tracking-luxe text-faint">
                      {row.k}
                    </dt>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>


        {/* ---- What the stone does to light ----
             Straight after the loupe, and deliberately so. The loupe above teaches
             a visitor to look *into* a stone for flaws; this asks the opposite
             question — what is coming back out of it — and the two together are
             the whole of what a grading report describes. The tunnel behind the
             heading is the only place on the site it appears at full strength. */}
        <section className="relative overflow-hidden border-y border-hairline bg-canvas py-20 md:py-28">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <GemFacetTunnel rings={12} sides={8} intensity={0.35} twist={26} />
            <StageSweep scrollDriven intensity={0.22} width={0.2} crossed />
            <div className="absolute inset-0 bg-gradient-to-b from-canvas via-transparent to-canvas" />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
            <SectionHeading
              eyebrow="The Spectroscope"
              title="Two numbers decide everything"
              highlightWords={['everything']}
              subtitle="How hard the stone bends light, and how far it pulls the colours apart. Both are printed on every certificate and neither is ever explained. Change the light source and watch the spectrum change with it — nothing here is decorative, every band is the product of two real figures."
              align="center"
              className="mb-14"
            />

            <GemSpectroscope />
          </div>
        </section>

        {/* ---- The grade the market prices backwards ----
             Needs the spectroscope above it: the fluorescence argument only works
             once a visitor has seen that blue and yellow are opposite ends of the
             same spectrum. */}
        <section className="relative overflow-hidden py-20 md:py-28">
          <BokehDrift count={18} intensity={0.4} speed={0.6} blades={8} />

          <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
            <div className="mb-14 text-center">
              <p className="mb-5 font-accent text-[10px] uppercase tracking-luxest text-accent">
                Under the lamp
              </p>
              <TypeSlamHeading
                lines={['One grade is discounted', 'for making a stone', 'look better.']}
                highlightWords={['better.']}
                as="h2"
                className="mx-auto max-w-3xl font-display text-3xl leading-[1.12] text-primary md:text-5xl"
              />
              <p className="mx-auto mt-6 max-w-xl font-sans text-base font-light leading-relaxed text-muted">
                Blue fluorescence is the complement of yellow body colour, so it cancels it. In a
                J-grade stone that is a visible improvement in daylight, and the trade discounts the
                stone for it anyway. Turn the lamp on and change the colour grade.
              </p>
            </div>

            <FluorescenceViewer />
          </div>
        </section>

        {/* ---- Size against weight ----
             Placed directly before the metals bench: the two questions a customer
             asks after choosing a stone are how big it will look and what will hold
             it, in that order. */}
        <section className="relative border-y border-hairline bg-canvas-alt py-20 md:py-28">
          <PrismDispersion at={{ x: 0.14, y: 0.28 }} size={140} rays={28} />
          <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
            <SectionHeading
              eyebrow="Weight Is Not Size"
              title="What a carat actually covers"
              highlightWords={['actually']}
              subtitle="Two stones of identical weight can differ by a fifth in the size they look, because weight hides in the pavilion where nobody sees it. Calibrate the ruler against a coin and everything below is drawn at true size."
              align="center"
              className="mb-14"
            />

            <CaratScaleComparator />
          </div>
        </section>

        {/* ---- The plot ----
             The one page of a grading report everybody looks at and nobody can
             read: two little outlines covered in red and green marks, with no
             legend. The whole page above teaches the vocabulary of grading and
             none of it explains the diagram, so this runs the diagram backwards —
             draw one, and watch the grade come out. */}
        <section className="relative overflow-hidden border-y border-hairline bg-canvas-alt py-20 md:py-28">
          <CanvasGemRain count={22} speed={34} part={140} outline className="opacity-50" />

          <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
            <TypeOnPath
              text="Red is inside. Green is not."
              curve="swell"
              size={64}
              travel
              className="mx-auto mb-4 max-w-3xl"
            />

            <SectionHeading
              eyebrow="Reading The Plot"
              title="Two marks can be worse than five"
              highlightWords={['worse']}
              subtitle="Place inclusions on the diagram and the grade is derived in front of you. It teaches the three things a table of grades cannot: that green marks are external and mostly harmless, that where a feature sits matters as much as what it is, and that a report covered in symbols is not a report describing a poor stone."
              align="center"
              className="mb-14"
            />

            <InclusionPlotter />

            <div className="mt-20 grid items-center gap-12 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
              <FacetMosaicReveal
                src="/images/collections/gemstone.jpg"
                alt="A stone assembled out of triangular facets"
                columns={7}
                order="radial"
                ratio={1}
                caption="Assembled from the table outward"
              />

              <div>
                <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
                  And why the table is the worst place for anything
                </p>
                <p className="mt-4 font-sans text-sm font-light leading-relaxed text-secondary">
                  Light enters a brilliant cut through the table, reflects off two pavilion facets
                  and leaves the way it came. That path crosses the centre of the stone twice,
                  which is why an inclusion under the table is looked straight through and one at
                  the girdle is not — and why a setter can hide the second and can do nothing
                  about the first.
                </p>
                <p className="mt-4 font-sans text-sm font-light leading-relaxed text-secondary">
                  It is also why two stones with identical certificates can differ. A plot shows
                  what is in a stone. It does not show where the light goes, and nobody has ever
                  managed to print that on a page.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ---- The stamp ----
             The assurance half of the page. It sits after the reference material
             because a hallmark is the answer to "how do I know", and nobody asks
             that until they have decided they want the thing. */}
        <section className="relative py-20 md:py-28">
          <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
            <SectionHeading
              eyebrow="The Stamp"
              title="Four marks, one of them a guarantee"
              highlightWords={['guarantee']}
              subtitle="Everything struck into a hallmarked piece is about a millimetre across and unreadable in the hand. Here it is at forty times the size, with what each mark proves."
              align="center"
              className="mb-14"
            />

            <HallmarkDecoder />
          </div>
        </section>

        <GoldRibbonWeave className="px-6" height={100} />

        {/* ---- The rough, assembling ----
             A single stone reassembled out of its own contact sheet. Placed as a
             breath between the two dense interactive blocks above and the metals
             bench below. */}
        <section className="relative overflow-hidden bg-canvas py-16 md:py-24">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] md:px-12">
            <MosaicShuffle
              src="/images/collections/gemstone.jpg"
              alt="A single stone, reassembled from the grading sheet"
              columns={8}
              ratio={4 / 3}
              from="bottom-right"
              className="rounded-3xl border border-hairline"
            />
            <div>
              <h3 className="font-display text-3xl leading-tight text-primary">
                Every stone arrives as <span className="text-spectral">forty photographs</span>
              </h3>
              <p className="mt-5 font-sans text-sm font-light leading-relaxed text-secondary">
                A stone is bought on paper long before anyone holds it: the certificate, a plot of
                the inclusions, and a contact sheet shot from every axis under three light
                temperatures. We buy against that sheet, then re-check the stone against it on
                arrival — and about one parcel in nine goes back.
              </p>
              <p className="mt-4 font-accent text-[10px] uppercase tracking-luxer text-faint">
                Hover a tile to lift it out of the sheet
              </p>
            </div>
          </div>
        </section>

        {/* ---- The metals bench ---- */}
        <section className="relative py-20 md:py-28">
          <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
            <SectionHeading
              eyebrow="What It Sits In"
              title="The metals bench"
              highlightWords={['metals']}
              subtitle="A stone is only as secure as the metal holding it. Compare up to three, and note which figures are measured and which are our own judgement."
              align="center"
              className="mb-14"
            />

            <MetalComparator />
          </div>
        </section>

        <GoldDivider variant="wide" className="px-6" />

        {/* ---- Provenance ---- */}
        <section className="relative py-20 md:py-28">
          <CausticsCanvas intensity={0.24} lobes={4} speed={40} />

          <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
            <SectionHeading
              eyebrow="Where It Came From"
              title="Five stops, five checks"
              highlightWords={['checks']}
              subtitle="Custody rather than geography. Each stop names what is verified there, and the passport that ships with the piece reproduces the whole chain."
              align="center"
              className="mb-16"
            />

            <ProvenanceMap />
          </div>
        </section>

        {/* ---- The terms drum ---- */}
        <section className="relative border-y border-hairline bg-surface-raised/30 py-16 md:py-20">
          <div className="relative z-10 mx-auto max-w-4xl px-6">
            <p className="mb-8 text-center font-accent text-[10px] uppercase tracking-luxest text-accent">
              Words the trade uses
            </p>
            <CylinderMarquee
              items={[
                'Girdle',
                'Pavilion',
                'Table',
                'Culet',
                'Jardin',
                'Nacre',
                'Trichroic',
                'Fluorescence',
                'Cleavage',
              ]}
              radius={130}
              speed={12}
              reverse
            />
          </div>
        </section>

        {/* ---- Onward ---- */}
        {/* ---- Graded on five things, not four ----
             The 4Cs are on the home page and in the explorer above, and every one
             of them is the wrong tool for a pearl: no cut, colour is a preference
             rather than a scale, and carat weight is close to irrelevant because
             size is sold in millimetres. What decides a pearl is nacre thickness,
             and nacre thickness is the one figure almost no retailer will quote.

             The weights below are the trade's real ones and they are printed on
             the dials. Five equal sliders — which is what most educational pages
             offer — hands a buyer a rubric that scores a bad pearl well. */}
        <section className="relative overflow-hidden border-y border-hairline bg-canvas py-20 md:py-28">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <BokehDrift count={12} />
          </div>

          <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
            <SectionHeading
              eyebrow="Not The Four Cs"
              title="A pearl is graded on five things and weighted on one"
              highlightWords={['one']}
              subtitle="Lustre carries a third of the grade, because it is the only thing a buyer can see that tells them how deep the nacre is — and nacre depth is what decides whether the pearl survives its first owner or wears through to the bead in eight years."
              align="center"
              className="mb-16"
            />

            <PearlGrader />
          </div>
        </section>

        {/* ---- What was done to it ----
             The spectroscope, the fluorescence viewer and the inclusion plotter
             above are all instruments for looking at a stone. This is the
             paperwork question instead, and it moves the price by a factor of
             thirty in the worst case.

             Sorted worst-value-first on purpose. A list of treatments in
             alphabetical order buries the three that actually cost people money. */}
        <section className="relative overflow-hidden py-20 md:py-28">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <PrismDispersion at={{ x: 0.88, y: 0.2 }} size={120} rays={22} interactive={false} />
          </div>

          <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
            <SectionHeading
              eyebrow="Disclosure"
              title="Nearly every coloured stone has been treated"
              highlightWords={['treated']}
              subtitle="Which is not a scandal — heating sapphire is two thousand years old and completely stable. The scandal is selectively not mentioning it, because the same stone is worth between a thirtieth and all of its value depending on which treatment it has had, and none of them is visible without a laboratory."
              align="center"
              className="mb-16"
            />

            <TreatmentDisclosure />
          </div>
        </section>

        {/* ---- The three angles, and the physics behind them ----
             The page has taught the four Cs, the mineral library and what has
             been done to the stone. What none of that covers is the one thing
             a cutter actually controls, which is a set of angles measured to a
             tenth of a degree.

             It goes here rather than beside the grading dials because it is
             the answer to the question those dials produce: a visitor who now
             knows what "excellent cut" means on a report immediately wants to
             know what it means in the stone. */}
        <section className="relative overflow-hidden border-y border-hairline bg-canvas-alt py-24 md:py-32">
          <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
            <SectionHeading
              eyebrow="Under a degree"
              title="A diamond is a mirror box, and the walls have a tolerance"
              highlightWords={['mirror']}
              subtitle="Light that hits an internal facet at more than 24.4° from the normal cannot get out — it is trapped and has to bounce again. Everything the trade calls a well-cut stone is that one number being respected, and every leak is it being ignored to keep weight."
              align="left"
              className="mb-14"
            />

            <ProportionScope />
          </div>
        </section>

        {/* ---- What it cost to get there ----
             Straight after the proportions, because the two are the same
             argument seen from opposite ends. The panel above says what the
             right angles are; this says what the right angles cost in carats,
             and therefore why so many stones do not have them. */}
        <section className="relative overflow-hidden bg-canvas py-24 md:py-32">
          <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
            <SectionHeading
              eyebrow="The part nobody prices out loud"
              title="Most of what came out of the ground is dust"
              highlightWords={['dust']}
              subtitle="A polished stone is the survivor of a much larger one. Between a third and two thirds of the rough is sawn off and swept up — and the price you are quoted contains all of it, including the part that no longer exists."
              align="left"
              className="mb-14"
            />

            <StoneCutYield />
          </div>
        </section>

        {/* ---- Grown and mined ----
             The last reference section on the page and the most loaded
             question on any counter. Placed after the yield bench on purpose:
             a visitor who has just watched two thirds of a crystal become dust
             is in the right frame of mind for a conversation about where the
             price of a mined stone actually comes from. */}
        <section className="relative overflow-hidden border-y border-hairline bg-canvas-alt py-24 md:py-32">
          <div className="relative z-10 mx-auto max-w-5xl px-6 md:px-12">
            <SectionHeading
              eyebrow="The question everybody asks last"
              title="Grown, mined, and the four rows where it genuinely matters"
              highlightWords={['genuinely']}
              subtitle="Same lattice, same hardness, same fire, same laboratories. Three of the seven rows below are differences a wearer will never encounter and two of them will decide what the piece is worth in twenty years. We sell both and we will not tell you one of them is not a real diamond."
              align="left"
              className="mb-14"
            />

            <LabGrownLedger />
          </div>
        </section>

        <LightingRoomSection />

        <LexiconSection />

        <section className="relative px-6 py-24 text-center md:py-32">
          <SectionHeading
            eyebrow="Next"
            title="Now look after it"
            highlightWords={['after']}
            subtitle="A stone chosen well and cleaned badly will still lose its light. The care ritual takes twenty-four minutes and knows which steps your stone cannot take."
            align="center"
            className="mb-10"
          />
          <div className="flex flex-wrap justify-center gap-4">
            <CTAButton variant="primary" size="lg" href="/care" showArrow>
              The care ritual
            </CTAButton>
            <CTAButton variant="secondary" size="lg" href="/collections">
              See what they are set in
            </CTAButton>
          </div>
        </section>
      </div>
    </>
  );
}
