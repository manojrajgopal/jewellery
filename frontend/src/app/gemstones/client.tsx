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
import HallmarkDecoder from '@/components/ui/HallmarkDecoder';

import MorphGemPath from '@/components/motion/MorphGemPath';
import MosaicShuffle from '@/components/motion/MosaicShuffle';
import PrismDispersion from '@/components/motion/PrismDispersion';
import GoldRibbonWeave from '@/components/motion/GoldRibbonWeave';
import JewellerLoupe from '@/components/motion/JewellerLoupe';
import ScrollAssembleText from '@/components/motion/ScrollAssembleText';
import RippleGrid from '@/components/motion/RippleGrid';
import CausticsCanvas from '@/components/motion/CausticsCanvas';
import ParticleField from '@/components/motion/ParticleField';
import CylinderMarquee from '@/components/motion/CylinderMarquee';

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
