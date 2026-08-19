'use client';

import { motion } from 'framer-motion';
import { Ban, Droplets, Sparkles, Wrench } from 'lucide-react';

import PageBanner from '@/components/ui/PageBanner';
import SectionHeading from '@/components/ui/SectionHeading';
import GoldDivider from '@/components/ui/GoldDivider';
import CTAButton from '@/components/ui/CTAButton';
import GradientOrb from '@/components/ui/GradientOrb';
import FAQAccordion from '@/components/ui/FAQAccordion';

import CareRitual from '@/components/ui/CareRitual';
import NecklaceLengthGuide from '@/components/ui/NecklaceLengthGuide';
import OccasionReminder from '@/components/ui/OccasionReminder';
import RingSizer from '@/components/ui/RingSizer';

import ScrollAssembleText from '@/components/motion/ScrollAssembleText';
import RippleGrid from '@/components/motion/RippleGrid';
import CausticsCanvas from '@/components/motion/CausticsCanvas';
import ImageCompare from '@/components/motion/ImageCompare';
import CountUp from '@/components/motion/CountUp';
import Marquee from '@/components/motion/Marquee';

/** The five stories every jeweller has. Rendered as warnings, not as anecdotes. */
const DISASTERS = [
  {
    icon: Droplets,
    title: 'The open drain',
    body: 'A ring rinsed over an unplugged sink, and a plumbing job that sometimes recovers it. Close the plug. That is the whole lesson.',
  },
  {
    icon: Ban,
    title: 'Sanitiser on white gold',
    body: 'Alcohol strips rhodium faster than anything else in ordinary life. Rings off before the pump, every time.',
  },
  {
    icon: Sparkles,
    title: 'Pearls in a sealed bag',
    body: 'Nacre needs some humidity. Sealed away it dries, crazes, and does not come back. A soft pouch, not plastic.',
  },
  {
    icon: Wrench,
    title: 'The clasp that had been catching',
    body: 'It catches for a month before it lets go. We check clasps free, for the life of anything we made — bring it in the first time it snags.',
  },
];

const CARE_FAQ = [
  {
    question: 'How often does a piece worn daily actually need servicing?',
    answer:
      'Once a year for anything with stones in prongs, and every two for bezels and closed settings. The service is prongs checked, seats tightened and a professional polish, and it is free for the life of anything we made — whether or not you were the person who bought it.',
  },
  {
    question: 'Can I use an ultrasonic cleaner at home?',
    answer:
      'On diamond, sapphire, ruby and plain gold, yes. On emerald, opal, pearl, tanzanite or anything fracture-filled, never — an ultrasonic tank opens existing fissures and there is no repair for that. The care ritual above will grey out the soak entirely if you tell it what your stone is.',
  },
  {
    question: 'My white gold has gone slightly yellow. Is it fake?',
    answer:
      'No — it is doing exactly what white gold does. White gold is yellow gold alloyed pale and then rhodium plated, and the plating wears through in two to four years of daily wear. Replating is routine and inexpensive. If you would rather never think about it again, platinum is the answer.',
  },
  {
    question: 'How do I know my ring size will not change?',
    answer:
      'It will. Fingers swell in heat and after salt, and most people move half a size across their life. Size to a warm hand at the end of the day rather than a cold one in the morning, and we resize free within the first year.',
  },
  {
    question: 'Is it worth insuring, and what do you need to provide?',
    answer:
      'Anything above roughly a month of your income, yes. Insurers want an independent valuation, not a receipt — our gemmologists issue one with a full grading report and photographs at forty magnifications, and we will reissue it every five years so the figure keeps up with the metal rate.',
  },
];

/**
 * Care and sizing — the practical page.
 *
 * Deliberately three tools and a set of warnings rather than an essay. Everything here
 * answers a question somebody asks across the counter, and the two that get asked most
 * — what size am I, and can I clean this — are the two at the top.
 *
 * The sizing tools sit together on purpose. A visitor measuring themselves is in a
 * particular frame of mind and will measure everything at once if the instruments are
 * to hand; splitting rings and chains across two pages means the chain never gets
 * measured at all.
 */
export default function CareClient() {
  return (
    <>
      <PageBanner
        title="Care & Sizing"
        subtitle="Twenty-four minutes a season, and the piece outlives all of us"
        breadcrumbs={[{ label: 'Care' }]}
        backgroundImage="/images/products/necklace.jpg"
      />

      <div className="overflow-hidden bg-canvas">
        {/* ---- Opening ---- */}
        <section className="relative py-20 md:py-24">
          <GradientOrb color="gold" size="lg" position="top-right" intensity={0.09} />
          <RippleGrid spacing={44} reach={180} dot={1.1} />

          <div className="relative z-10 mx-auto max-w-4xl px-6 text-center md:px-12">
            <ScrollAssembleText
              text="Almost all lost brilliance is film, not damage"
              as="h2"
              highlightWords={['film,']}
              spread={74}
              className="mx-auto max-w-3xl font-display text-3xl font-light leading-[1.12] text-primary sm:text-4xl md:text-5xl"
            />

            <p className="mx-auto mt-7 max-w-2xl font-sans text-base font-light leading-relaxed text-muted md:text-lg">
              A stone that has stopped sparkling has almost never lost anything. It has a
              film of soap and skin oil on its pavilion — the underside nobody thinks to
              clean — and the light that used to come back at you is being absorbed there
              instead. Four minutes with a soft brush from beneath will usually restore it
              completely.
            </p>

            <dl className="mx-auto mt-12 grid max-w-2xl grid-cols-3 gap-6 border-y border-hairline py-8">
              {[
                { k: 'Minutes a season', v: 24, s: '' },
                { k: 'Cost of a service', v: 0, s: '' },
                { k: 'Pieces restored', v: 4200, s: '+' },
              ].map((row) => (
                <div key={row.k}>
                  <dd className="nums-tabular font-display text-3xl text-accent md:text-4xl">
                    <CountUp end={row.v} duration={2} suffix={row.s} separator />
                  </dd>
                  <dt className="mt-2 font-accent text-[9px] uppercase tracking-luxe text-faint">
                    {row.k}
                  </dt>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ---- The ritual ---- */}
        <section className="relative border-y border-hairline bg-surface-raised/30 py-20 md:py-28">
          <CausticsCanvas intensity={0.3} lobes={5} speed={34} />

          <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
            <SectionHeading
              eyebrow="The Ritual"
              title="Six steps, adapted to your stone"
              highlightWords={['your']}
              subtitle="Tell it what you own and it will strike out the steps that stone cannot take. The soak alone is unsafe for four of the twelve gems we set."
              align="center"
              className="mb-14"
            />

            <CareRitual />
          </div>
        </section>

        {/* ---- Sizing ---- */}
        <section className="relative py-20 md:py-28">
          <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
            <SectionHeading
              eyebrow="Measure Once"
              title="Sizing, both kinds"
              highlightWords={['both']}
              subtitle="Rings by diameter, chains by where they fall. Measure a warm hand at the end of the day, never a cold one in the morning."
              align="center"
              className="mb-14"
            />

            <div className="grid gap-8 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 34 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <RingSizer />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 34 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <NecklaceLengthGuide />
              </motion.div>
            </div>
          </div>
        </section>

        <GoldDivider variant="jewel" />

        {/* ---- The five disasters ---- */}
        <section className="relative bg-canvas-alt py-20 md:py-28">
          <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
            <SectionHeading
              eyebrow="Avoid These"
              title="The five stories every jeweller has"
              highlightWords={['five']}
              subtitle="Four of them are preventable in under a minute. The fifth is why we check clasps for free."
              align="center"
              className="mb-14"
            />

            <div className="grid gap-5 sm:grid-cols-2">
              {DISASTERS.map((d, i) => {
                const Icon = d.icon;
                return (
                  <motion.article
                    key={d.title}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-10%' }}
                    transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    className="group relative flex gap-4 overflow-hidden rounded-2xl border border-burgundy-500/20 bg-burgundy-900/[0.05] p-6 transition-colors duration-500 hover:border-burgundy-500/40"
                  >
                    <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-burgundy-500/30 text-burgundy-300">
                      <Icon size={17} strokeWidth={1.6} />
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-light text-primary">
                        {d.title}
                      </h3>
                      <p className="mt-2 font-sans text-sm font-light leading-relaxed text-muted">
                        {d.body}
                      </p>
                    </div>

                    {/* Index, faint, so the set reads as a numbered list of warnings */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -bottom-4 right-3 font-display text-5xl leading-none text-burgundy-300/[0.08]"
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---- The bench ---- */}
        <section className="relative border-y border-hairline py-20 md:py-28">
          <CausticsCanvas intensity={0.26} lobes={5} />

          <div className="relative z-10 mx-auto grid max-w-6xl gap-14 px-6 md:px-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="mb-5 font-accent text-[10px] uppercase tracking-luxest text-accent">
                When It Is Too Late For A Brush
              </p>
              <h2 className="font-display text-3xl font-light leading-tight text-primary md:text-4xl">
                Forty years comes off at the bench, not the sink
              </h2>
              <div className="mt-6 space-y-5 font-sans text-base font-light leading-relaxed text-muted">
                <p>
                  There is a point past which cleaning is not the answer: a worn seat, a
                  thinned prong, a chain that has stretched at one link. Those are bench
                  work, and the honest advice is to bring the piece in rather than to keep
                  polishing something that is structurally tired.
                </p>
                <p>
                  Our restoration room has an eighteen-month queue and we have never
                  advertised it. Drag the handle across and see why.
                </p>
              </div>

              <div className="mt-9">
                <CTAButton variant="primary" size="md" href="/services" showArrow>
                  What the bench does
                </CTAButton>
              </div>
            </div>

            <ImageCompare
              beforeImage="/images/collections/heritage.jpg"
              afterImage="/images/collections/statement.jpg"
              beforeLabel="As received"
              afterLabel="After the bench"
              className="h-80 md:h-96"
            />
          </div>
        </section>

        {/* ---- Dates ---- */}
        <section className="relative py-20 md:py-28">
          <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
            <SectionHeading
              eyebrow="Lead Times"
              title="Dates worth keeping"
              highlightWords={['Dates']}
              subtitle="A commission needs six weeks and engraving needs ten days. Keep a date here and we will tell you which is still possible — the list never leaves your browser."
              align="center"
              className="mb-14"
            />

            <OccasionReminder />
          </div>
        </section>

        {/* ---- Services ticker ---- */}
        <div className="relative border-y border-hairline py-5">
          <Marquee speed="slow" pauseOnHover>
            {[
              'Prong retipping',
              'Rhodium replating',
              'Stone replacement',
              'Chain soldering',
              'Pearl restringing',
              'Clasp renewal',
              'Antique cleaning',
              'Enamel repair',
              'Resizing',
              'Valuation',
              'Laser welding',
            ].map((service) => (
              <span
                key={service}
                className="mx-8 inline-flex items-center gap-8 font-accent text-sm uppercase tracking-luxe text-muted"
              >
                {service}
                <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-accent/50" />
              </span>
            ))}
          </Marquee>
        </div>

        {/* ---- FAQ ---- */}
        <section className="relative py-20 md:py-28">
          <div className="relative z-10 mx-auto max-w-3xl px-6">
            <SectionHeading
              eyebrow="Asked Often"
              title="The questions that come up"
              highlightWords={['questions']}
              align="center"
              className="mb-14"
            />

            <FAQAccordion items={CARE_FAQ} />
          </div>
        </section>

        {/* ---- Onward ---- */}
        <section className="relative px-6 pb-28 text-center">
          <SectionHeading
            eyebrow="Bring It In"
            title="Service is free, for ever"
            highlightWords={['free,']}
            subtitle="Anything we made, whether or not you were the one who bought it. No receipt needed and no time limit — the mark inside tells us it is ours."
            align="center"
            className="mb-10"
          />
          <div className="flex flex-wrap justify-center gap-4">
            <CTAButton variant="primary" size="lg" href="/contact" showArrow>
              Book the bench
            </CTAButton>
            <CTAButton variant="secondary" size="lg" href="/gemstones">
              The stone library
            </CTAButton>
          </div>
        </section>
      </div>
    </>
  );
}
