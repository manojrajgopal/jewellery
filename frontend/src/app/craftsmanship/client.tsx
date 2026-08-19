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
import { Reveal } from '@/components/animations/Reveal';

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

      {/* Quote + CTA */}
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

          <CTAButton href="/contact" variant="primary" size="lg" showArrow>
            Commission a Bespoke Piece
          </CTAButton>
        </div>
      </section>
    </main>
  );
}
