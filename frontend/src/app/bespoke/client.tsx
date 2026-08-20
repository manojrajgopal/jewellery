'use client';

import { motion } from 'framer-motion';
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
import SettingExplorer from '@/components/ui/SettingExplorer';
import BandProfileSelector from '@/components/ui/BandProfileSelector';
import PackagingConfigurator from '@/components/ui/PackagingConfigurator';
import FlipClock from '@/components/motion/FlipClock';
import FoilCard from '@/components/motion/FoilCard';
import RippleGrid from '@/components/motion/RippleGrid';
import VaultDoorReveal from '@/components/motion/VaultDoorReveal';
import SmokeVeil from '@/components/motion/SmokeVeil';
import VertigoZoom from '@/components/motion/VertigoZoom';
import ChromaSplit from '@/components/motion/ChromaSplit';
import MetaballGold from '@/components/motion/MetaballGold';
import SilkWave from '@/components/motion/SilkWave';
import GoldRibbonWeave from '@/components/motion/GoldRibbonWeave';

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
      {/* ---- The four moments ----
           The journey strip above is what the house does across sixteen weeks. This is
           what the client actually sees in that time, which is four things and no more.
           Worth stating plainly: the commonest anxiety in a commission is silence, and
           the answer to it is knowing in advance how much silence there will be. */}
      <section className="relative overflow-hidden bg-canvas py-24 md:py-32">
        <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
          <SectionHeading
            eyebrow="What You Will See"
            title="Four moments in sixteen weeks"
            highlightWords={['Four']}
            subtitle="Between them, nothing — and that is deliberate. A bench interrupted for progress photographs is a bench working to a camera rather than to a piece."
            align="center"
            className="mb-16"
          />

          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
            <ol className="space-y-5">
              {[
                {
                  week: 'Week 2',
                  title: 'The gouache',
                  body: 'A painted rendering at actual size, by hand, on grey card. Nothing is cut until you have signed the back of it.',
                },
                {
                  week: 'Week 4',
                  title: 'The wax, in your hand',
                  body: 'A carved wax you can wear. It is the only chance to change proportion — after casting, a millimetre costs three weeks.',
                },
                {
                  week: 'Week 9',
                  title: 'The stone, with its paper',
                  body: 'Bought against your specification rather than from stock. You see the certificate before we take possession of it.',
                },
                {
                  week: 'Week 16',
                  title: 'The piece, on the cloth',
                  body: 'Laid out, turned once under the light, and then left with you. If it is wrong, it goes back to the bench and nobody discusses money.',
                },
              ].map((moment, i) => (
                <motion.li
                  key={moment.week}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-8%' }}
                  transition={{ duration: 0.55, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                  className="flex gap-5"
                >
                  <span className="rail-node mt-1 grid h-11 w-11 flex-shrink-0 place-items-center rounded-full bg-canvas">
                    <span className="font-accent text-[9px] uppercase tracking-luxe text-accent">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </span>
                  <span>
                    <span className="font-accent text-[10px] uppercase tracking-luxer text-accent nums-tabular">
                      {moment.week}
                    </span>
                    <span className="mt-1 block font-display text-2xl leading-tight text-primary">
                      {moment.title}
                    </span>
                    <span className="mt-2 block font-sans text-sm font-light leading-relaxed text-secondary">
                      {moment.body}
                    </span>
                  </span>
                </motion.li>
              ))}
            </ol>

            <div>
              <SilkWave
                src="/images/products/ring.jpg"
                alt="The finished commission, uncovered on the cloth"
                ratio={3 / 4}
                panels={12}
                className="rounded-3xl border border-hairline shadow-lift"
              />
              <p className="mt-4 font-accent text-[10px] uppercase tracking-luxer text-faint">
                Week sixteen. The cloth comes off once.
              </p>
            </div>
          </div>
        </div>
      </section>

      <GoldRibbonWeave className="px-6" height={100} />

      {/* ---- Where it waits ----
           A commission spends most of sixteen weeks not being worked on, and the
           honest answer to where it is on a given Tuesday night is a door. */}
      <section className="relative bg-canvas-alt py-6">
        <VaultDoorReveal
          label="Your Stone"
          note="Logged in by weight every night it is not on a bench."
          minHeight="min-h-[80vh]"
        >
          <div className="mx-auto max-w-3xl px-6 py-16 text-center md:py-20">
            <p className="font-accent text-[10px] uppercase tracking-luxest text-accent">
              Between The Moments
            </p>
            <h2 className="mt-5 font-display text-3xl font-light leading-tight text-primary sm:text-4xl md:text-5xl">
              Bought in week nine, set in week fourteen
            </h2>
            <div className="mx-auto mt-6 max-w-2xl space-y-4 font-sans text-base font-light leading-relaxed text-secondary">
              <p>
                Your stone is in the building for about five weeks before anyone touches it, because
                the mount has to be finished, hallmarked and polished first &mdash; a stone set into
                an unfinished mount is a stone that comes out again for the polisher.
              </p>
              <p>
                It is logged out by weight in the morning and logged back in at night, filings
                included. Ask to see the day book at your week-nine appointment; it is not a secret,
                and it is the reason the house has never lost one.
              </p>
            </div>
          </div>
        </VaultDoorReveal>
      </section>

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


      {/* ---------------- In section ----------------
           The two decisions a commission actually turns on, and the two a client
           almost never arrives with an answer to. A ring is chosen from a picture
           of its front, which is the one face that decides nothing: the setting
           decides whether the stone survives a decade, and the inside of the band
           decides whether the ring is still being worn after one.

           Both tools draw sections rather than renders. That is the point — a
           render shows the stone, and what is being chosen here is the metal. */}
      <section className="relative overflow-hidden border-y border-hairline bg-canvas py-24 md:py-32">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <SmokeVeil intensity={0.22} originX={0.8} speed={0.6} count={16} />
          <MetaballGold count={5} intensity={0.22} step={4} attract={false} />
          <div className="absolute inset-0 bg-gradient-to-b from-canvas via-canvas/40 to-canvas" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
          <VertigoZoom intensity={0.5} className="mb-14">
            <SectionHeading
              eyebrow="In Section"
              title="The half nobody photographs"
              highlightWords={['nobody']}
              subtitle="Before we draw anything, two questions have to be settled in metal. How the stone is held, and what the band feels like from the inside. Neither is visible in a photograph and both decide whether the piece is still worn in ten years."
              align="center"
            />
          </VertigoZoom>

          <SettingExplorer className="mb-20" />

          <GoldDivider variant="jewel" className="my-20" />

          <div className="mb-14 text-center">
            <ChromaSplit amount={5} saturateAt={2200}>
              <p className="mb-4 font-accent text-[10px] uppercase tracking-luxest text-accent">
                And the band itself
              </p>
              <h3 className="mx-auto max-w-2xl font-display text-2xl font-light leading-snug text-primary md:text-3xl">
                A court profile runs half a size loose
              </h3>
            </ChromaSplit>
            <p className="mx-auto mt-4 max-w-xl font-sans text-sm font-light leading-relaxed text-muted">
              Which is the single most useful sentence on this page, and it is almost never said
              before a ring is ordered. The correction changes again at every width, so both are
              worked out here rather than discovered at the fitting.
            </p>
          </div>

          <BandProfileSelector />
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
