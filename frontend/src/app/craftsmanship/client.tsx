'use client';

import React from 'react';
import PageBanner from '@/components/ui/PageBanner';
import GlassPanel from '@/components/ui/GlassPanel';
import SectionHeading from '@/components/ui/SectionHeading';
import CTAButton from '@/components/ui/CTAButton';
import Parallax from '@/components/motion/Parallax';
import { Reveal } from '@/components/animations/Reveal';
import Image from 'next/image';

const stages = [
  {
    num: '01',
    title: 'Design & Sketching',
    subtitle: 'Every masterpiece begins with a vision',
    desc: 'Our design process starts with an inspiration—a thought, a feeling, or a raw gem begging for the perfect setting. Our artisans hand-sketch intricate designs, capturing the essence of the piece before it enters the digital realm for precise 3D modeling.',
    image: '/images/hero/hero-main.jpg'
  },
  {
    num: '02',
    title: 'Wax Modeling',
    subtitle: 'Precision meets artistry in every curve',
    desc: 'Using the 3D model, we create a flawless wax replica. This delicate stage requires an incredibly steady hand and an eye for minute details, ensuring that the final cast will be nothing short of perfection.',
    image: '/images/collections/heritage.jpg'
  },
  {
    num: '03',
    title: 'Gold Casting',
    subtitle: 'Ancient techniques, modern perfection',
    desc: 'The wax model is encased in plaster and fired, leaving a negative space. Molten gold—alloyed in-house to achieve our signature hues—is poured into the mold. The rough cast emerges, ready to be transformed.',
    image: '/images/products/ring.jpg'
  },
  {
    num: '04',
    title: 'Stone Setting',
    subtitle: 'Each gem placed with surgical precision',
    desc: 'Under intense magnification, our master setters secure each diamond and gemstone. Using traditional techniques like pavé, bezel, and prong, they ensure maximum light return and absolute structural integrity.',
    image: '/images/collections/gemstone.jpg'
  },
  {
    num: '05',
    title: 'Final Polish',
    subtitle: 'Revealing the brilliance within',
    desc: 'The final stage involves multiple rounds of polishing using progressively finer compounds. The result is a mirror-like finish that accentuates the piece\'s form and prepares it for its final quality inspection.',
    image: '/images/hero/craftsmanship.jpg'
  }
];

const materials = [
  {
    title: 'Ethical Gold',
    desc: 'We source exclusively recycled and Fairtrade gold, ensuring our environmental footprint is minimized without compromising on the luxurious weight and color of our alloys.',
    image: '/images/collections/bridal.jpg'
  },
  {
    title: 'Conflict-Free Diamonds',
    desc: 'Every diamond is Kimberley Process certified. We meticulously hand-select stones for their cut, color, clarity, and undeniable fire.',
    image: '/images/products/bracelet.jpg'
  },
  {
    title: 'Rare Gemstones',
    desc: 'From vibrant Colombian emeralds to deep Ceylon sapphires, we travel the world to procure the most exceptional and vibrant precious stones.',
    image: '/images/products/earrings.jpg'
  }
];

export default function CraftsmanshipClient() {
  return (
    <main className="min-h-screen bg-[#060504] text-gold-100">
      <PageBanner
        title="The Art of Creation"
        subtitle="Where ancient wisdom meets modern mastery"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Craftsmanship' }]}
        backgroundImage="/images/hero/craftsmanship.jpg"
      />

      {/* Editorial Intro */}
      <section className="py-24 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <h2 className="font-display text-4xl md:text-5xl leading-tight mb-6">
              A legacy built on <span className="text-gold-500 italic">uncompromising precision</span>.
            </h2>
            <p className="text-white/70 font-body text-lg leading-relaxed">
              At AURUM, we do not merely manufacture jewellery; we sculpt heirlooms. Our ateliers house artisans who have dedicated their lives to mastering techniques passed down through generations, combining them with cutting-edge technology to achieve the impossible.
            </p>
          </Reveal>
          <Reveal delay={0.2} direction="left">
            <Parallax speed={-0.05}>
              <div className="aspect-[4/5] relative rounded-2xl overflow-hidden">
                <Image src="/images/collections/statement.jpg" alt="Atelier Craftsmanship" fill className="object-cover" />
                <div className="absolute inset-0 border border-gold-500/20 m-4 rounded-xl" />
              </div>
            </Parallax>
          </Reveal>
        </div>
      </section>

      {/* Craft Stages */}
      <section className="py-24 bg-ink-950">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <SectionHeading 
            eyebrow="The Process"
            title="From Concept to Heirloom"
            align="center"
            className="mb-24"
          />

          <div className="space-y-32">
            {stages.map((stage, index) => {
              const isEven = index % 2 !== 0;
              return (
                <div key={stage.num} className={`flex flex-col ${isEven ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 lg:gap-24 items-center`}>
                  
                  {/* Image Side */}
                  <div className="w-full lg:w-1/2">
                    <Reveal direction={isEven ? 'right' : 'left'}>
                      <div className="relative aspect-square rounded-2xl overflow-hidden group">
                        <Image src={stage.image} alt={stage.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-ink-950/20" />
                        <span className="absolute top-6 left-6 font-display text-8xl text-gold-100/30 group-hover:text-gold-500/50 transition-colors duration-500">
                          {stage.num}
                        </span>
                      </div>
                    </Reveal>
                  </div>

                  {/* Text Side */}
                  <div className="w-full lg:w-1/2 flex flex-col justify-center">
                    <Reveal direction={isEven ? 'left' : 'right'} delay={0.2}>
                      <h3 className="font-display text-4xl mb-2">{stage.title}</h3>
                      <p className="text-gold-500 font-body text-sm tracking-widest uppercase mb-6">{stage.subtitle}</p>
                      <p className="text-white/70 font-body text-lg leading-relaxed">
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

      {/* Materials Section */}
      <section className="py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <SectionHeading 
            eyebrow="Sourcing"
            title="The Finest Materials"
            subtitle="We accept nothing less than extraordinary"
            align="center"
            className="mb-16"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {materials.map((mat, idx) => (
              <Reveal key={idx} delay={idx * 0.2}>
                <GlassPanel className="overflow-hidden group h-full">
                  <div className="aspect-[4/3] relative overflow-hidden mb-6 rounded-lg m-4">
                    <Image src={mat.image} alt={mat.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  </div>
                  <div className="p-6 pt-0">
                    <h4 className="font-display text-2xl mb-3">{mat.title}</h4>
                    <p className="text-white/60 font-body text-sm leading-relaxed">
                      {mat.desc}
                    </p>
                  </div>
                </GlassPanel>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Quote & CTA */}
      <section className="py-32 bg-ink-950 relative overflow-hidden text-center px-6">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold-900/10 blur-[120px] rounded-full pointer-events-none" />
        
        <Reveal>
          <span className="font-display text-8xl text-gold-500/20 block mb-[-40px]">&ldquo;</span>
          <h2 className="font-display text-4xl md:text-5xl max-w-4xl mx-auto leading-tight italic text-gold-100 mb-12">
            True luxury is the evidence of human touch, the dedication of time, and the pursuit of flawlessness.
          </h2>
          <CTAButton href="/contact" variant="primary" size="lg" showArrow>
            Commission a Bespoke Piece
          </CTAButton>
        </Reveal>
      </section>

    </main>
  );
}
