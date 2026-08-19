'use client';

import { CalendarClock, Clock, FileText, Gem, Hammer, PenTool, Truck } from 'lucide-react';

import PageBanner from '@/components/ui/PageBanner';
import SectionHeading from '@/components/ui/SectionHeading';
import BespokeStudio from '@/components/ui/BespokeStudio';
import GoldDivider from '@/components/ui/GoldDivider';
import FAQAccordion from '@/components/ui/FAQAccordion';
import StaggerReveal from '@/components/motion/StaggerReveal';
import TiltCard from '@/components/motion/TiltCard';
import ParticleField from '@/components/motion/ParticleField';
import CausticsCanvas from '@/components/motion/CausticsCanvas';
import MetalText from '@/components/motion/MetalText';
import Odometer from '@/components/motion/Odometer';
import ScrollTextMask from '@/components/motion/ScrollTextMask';
import CTAButton from '@/components/ui/CTAButton';
import EngravingStudio from '@/components/ui/EngravingStudio';
import PackagingConfigurator from '@/components/ui/PackagingConfigurator';
import FlipClock from '@/components/motion/FlipClock';
import FoilCard from '@/components/motion/FoilCard';
import RippleGrid from '@/components/motion/RippleGrid';

const JOURNEY = [
  {
    icon: PenTool,
    step: '01',
    title: 'The drawing',
    body: 'You build it here, or you bring us a sketch on the back of an envelope. Both arrive at the same bench.',
    days: 1,
  },
  {
    icon: FileText,
    step: '02',
    title: 'The proof',
    body: 'A hand-rendered gouache and a wax model, photographed from six angles. Nothing is cut until you sign it off.',
    days: 12,
  },
  {
    icon: Gem,
    step: '03',
    title: 'The stone',
    body: 'We buy against your specification, not from stock. You see the certificate before we take possession.',
    days: 21,
  },
  {
    icon: Hammer,
    step: '04',
    title: 'The bench',
    body: 'One goldsmith, start to finish. You get their name, and photographs at each stage of the setting.',
    days: 34,
  },
  {
    icon: Clock,
    step: '05',
    title: 'The finish',
    body: 'Polishing, rhodium where it applies, hallmarking, and the hand engraving last of all.',
    days: 46,
  },
  {
    icon: Truck,
    step: '06',
    title: 'The handover',
    body: 'In the boutique, over tea, with the goldsmith present. Insured courier if you would rather not travel.',
    days: 52,
  },
];

const FAQS = [
  {
    question: 'Is the estimate in the studio the price I will pay?',
    answer:
      'No — it is an honest indication, and it is deliberately built from published components so you can see what drives it. The firm quote comes after a bench review, because two rings with identical specifications can differ by a fifth depending on the stone actually available that month.',
  },
  {
    question: 'Can I commission something that is not a ring?',
    answer:
      'Yes. The studio draws rings because they are the most configured piece we make, but roughly a third of our commissions are necklaces, and we have made cufflinks, a cigarette case and one christening spoon. Build the closest ring you can and tell us what it should really be.',
  },
  {
    question: 'What if I do not like the proof?',
    answer:
      'You walk away and owe nothing. The proof stage exists precisely so that the expensive commitments happen after you have seen the piece, not before. Around one commission in eight is redrawn at least once.',
  },
  {
    question: 'Do you work with stones I already own?',
    answer:
      'Often. Inherited stones are our favourite commissions. We will assess the stone free of charge and tell you honestly whether it is safe to reset — old cuts sometimes carry feathers that will not survive a modern claw setting.',
  },
  {
    question: 'How long does a commission really take?',
    answer:
      'Eight weeks is typical and twelve is common. If someone quotes you three, they are working from stock castings. The single longest variable is the stone: the right one, at the right weight and colour, may take a season to find.',
  },
];

export default function BespokeClient() {
  return (
    <>
      <PageBanner
        title="The Bespoke Studio"
        subtitle="Four thousand five hundred combinations, one bench, and nothing cut until you have seen it drawn."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Bespoke' }]}
        backgroundImage="/images/hero/hero-main.jpg"
      />

      {/* ---------------- The studio ---------------- */}
      <section className="relative overflow-hidden bg-canvas py-24 md:py-32">
        <CausticsCanvas intensity={0.35} lobes={5} />
        <ParticleField count={45} rise />

        <div className="relative mx-auto max-w-7xl px-6 md:px-12">
          <BespokeStudio />
        </div>
      </section>

      <GoldDivider variant="wide" className="px-6" />

      {/* ---------------- The journey ---------------- */}
      <section className="relative overflow-hidden bg-canvas-alt py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <SectionHeading
            eyebrow="What happens next"
            title="Fifty-two days, six hands"
            highlightWords={['six']}
            subtitle="A commission is not a transaction with a longer delivery date. Here is every stage, in the order it happens, with the day count we actually hold ourselves to."
            className="mb-16"
          />

          <StaggerReveal
            mode="facet"
            order="forward"
            stagger={0.09}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            itemClassName="h-full"
          >
            {JOURNEY.map((j) => {
              const Icon = j.icon;
              return (
                <TiltCard key={j.step} strength={9} className="h-full">
                  <div className="plate-metal group relative h-full overflow-hidden rounded-3xl p-7">
                    <span className="pointer-events-none absolute -right-4 -top-6 font-display text-8xl text-accent/[0.07]">
                      {j.step}
                    </span>

                    <span
                      data-tilt-depth="2"
                      className="mb-5 flex h-11 w-11 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-accent"
                    >
                      <Icon className="h-5 w-5" strokeWidth={1.5} />
                    </span>

                    <h3
                      data-tilt-depth="1"
                      className="mb-3 font-display text-2xl text-primary"
                    >
                      {j.title}
                    </h3>
                    <p className="mb-5 font-sans text-sm leading-relaxed text-muted">
                      {j.body}
                    </p>

                    <span className="flex items-baseline gap-2 border-t border-hairline pt-4 font-accent text-[10px] uppercase tracking-luxe text-faint">
                      By day
                      <span className="font-display text-lg text-accent">
                        <Odometer value={j.days} duration={1.1} />
                      </span>
                    </span>
                  </div>
                </TiltCard>
              );
            })}
          </StaggerReveal>
        </div>
      </section>

      {/* ---------------- A word from the bench ---------------- */}
      <section className="relative overflow-hidden bg-canvas py-24 md:py-32">
        <div className="mx-auto max-w-4xl px-6 text-center md:px-12">
          <MetalText
            as="p"
            alloy="gold"
            className="mb-8 font-display text-3xl leading-tight md:text-5xl"
          >
            The best commissions arrive as a story, not a specification.
          </MetalText>

          <ScrollTextMask
            text="Someone brings us a photograph of a hand, and on that hand a ring nobody can find any more. We are not copying it — we are reading what the person who commissioned it in 1954 was trying to say, and saying it again in metal that will outlast us both. That is the job. The stone is only the part that catches the light."
            highlightWords={['reading', 'outlast', 'light.']}
            className="mx-auto max-w-3xl font-sans text-lg leading-relaxed md:text-xl"
          />

          <p className="mt-8 font-accent text-[11px] uppercase tracking-luxer text-accent">
            Devrath Shah · Fourth-generation master goldsmith
          </p>
        </div>
      </section>

      {/* ---------------- The inscription ----------------
           The studio above settles the metal, the stone and the setting. This is the
           last decision, and the only one that cannot be undone afterwards — so it
           gets its own section rather than a field in the configurator. */}
      <section className="relative overflow-hidden border-y border-hairline bg-canvas-alt py-24 md:py-32">
        <RippleGrid spacing={46} reach={190} dot={1.1} />

        <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
          <SectionHeading
            eyebrow="The Last Decision"
            title="What it will say, for ever"
            highlightWords={['ever']}
            subtitle="Engraving is included and cannot be reversed. Set it on the band here and see whether it fits before the graver goes anywhere near the metal."
            className="mb-14"
          />

          <EngravingStudio />
        </div>
      </section>

      {/* ---------------- The commission window ---------------- */}
      <section className="relative overflow-hidden bg-canvas py-24 md:py-32">
        <CausticsCanvas intensity={0.3} lobes={5} speed={34} />

        <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
          <div className="mb-20">
            <FoilCard tilt={5} travel={85}>
              <div className="grid gap-10 p-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:p-12">
                <div>
                  <p className="mb-4 flex items-center gap-2.5 font-accent text-[10px] uppercase tracking-luxest text-accent">
                    <CalendarClock size={13} strokeWidth={1.8} />
                    The Christmas Window
                  </p>

                  <h2 className="text-emboss-gold font-display text-2xl font-light leading-tight md:text-4xl">
                    The bench stops taking commissions when the queue reaches fourteen weeks
                  </h2>

                  <p className="mt-5 max-w-xl font-sans text-base font-light leading-relaxed text-muted">
                    Not a sales tactic — a capacity limit. Six pairs of hands, and every
                    stage held to its real day count. Once the book is full for a season it
                    is full, and the next opening is the following one.
                  </p>

                  <div className="mt-8 flex flex-wrap gap-4">
                    <CTAButton variant="primary" size="md" href="/contact" showArrow>
                      Take a place in the book
                    </CTAButton>
                    <CTAButton variant="secondary" size="md" href="/services">
                      All the lead times
                    </CTAButton>
                  </div>
                </div>

                <div className="flex flex-col items-start gap-4 md:items-end">
                  <span className="font-accent text-[9px] uppercase tracking-luxest text-faint">
                    Book closes in
                  </span>
                  {/* A fixed date. A window that resets on reload is not a window. */}
                  <FlipClock to="2026-09-30T20:00:00" expiredLabel="Closed for the season" />
                  <span className="nums-tabular font-sans text-[11px] font-light italic text-faint">
                    30 September 2026 · 8pm
                  </span>
                </div>
              </div>
            </FoilCard>
          </div>

          {/* And what it arrives in */}
          <SectionHeading
            eyebrow="Presented"
            title="And what it arrives in"
            highlightWords={['arrives']}
            subtitle="Made to order alongside the piece. The lining is chosen against the metal rather than against the case — cream under yellow gold, black under platinum."
            className="mb-14"
          />

          <PackagingConfigurator />
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section className="relative bg-canvas-alt py-24 md:py-32">
        <div className="mx-auto max-w-4xl px-6 md:px-12">
          <SectionHeading
            eyebrow="Before you ask"
            title="The awkward questions"
            highlightWords={['awkward']}
            className="mb-14"
          />
          <FAQAccordion items={FAQS} />
        </div>
      </section>
    </>
  );
}
