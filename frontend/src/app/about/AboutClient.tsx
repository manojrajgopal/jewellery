'use client';

import React from 'react';
import Image from 'next/image';
import { ShieldCheck, Gem, Crown } from 'lucide-react';
import PageBanner from '@/components/ui/PageBanner';
import CTAButton from '@/components/ui/CTAButton';
import GlassPanel from '@/components/ui/GlassPanel';
import Parallax from '@/components/motion/Parallax';
import CountUp from '@/components/motion/CountUp';
import FadeInOnView from '@/components/animations/FadeInOnView';
import { brandData } from '@/data/brand';

const milestones = [
  { year: '1892', title: 'Founded by Master Goldsmith', description: 'Our first boutique opens in the heart of the city, establishing a tradition of excellence.' },
  { year: '1940', title: 'Second Generation', description: 'Expanding our craft to include rare gemstones and complex settings, gaining royal patronage.' },
  { year: '1978', title: 'Third Generation', description: 'International recognition and the establishment of our signature diamond cut.' },
  { year: '2010', title: 'Fourth Generation', description: 'Embracing digital innovation while preserving our ancestral crafting techniques.' }
];

const values = [
  { icon: ShieldCheck, title: 'Integrity', description: 'Uncompromising ethical standards in sourcing and creating every piece.' },
  { icon: Gem, title: 'Artistry', description: 'A relentless pursuit of perfection in design and execution.' },
  { icon: Crown, title: 'Legacy', description: 'Crafting heirlooms designed to be passed down through generations.' }
];

const stats = [
  { label: 'Years of Heritage', value: 130, suffix: '+' },
  { label: 'Master Artisans', value: 45, suffix: '' },
  { label: 'Awards Won', value: 120, suffix: '+' },
  { label: 'Unique Designs', value: 5000, suffix: '+' }
];

export default function AboutClient() {
  return (
    <>
      <PageBanner
        title="Our Heritage"
        subtitle="Four generations of master artisans"
        breadcrumbs={[{ label: 'About' }]}
        backgroundImage="/images/hero/craftsmanship.jpg"
      />

      <div className="bg-ink-950 text-ink-50 overflow-hidden">
        {/* Brand Story */}
        <section className="py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <Parallax speed={0.1} className="relative aspect-[3/4] rounded-2xl overflow-hidden">
              {/* Using a standard img since RevealImage doesn't play well with Parallax directly sometimes, or just use RevealImage */}
              <Image src="/images/hero/craftsmanship.jpg" alt="Master craftsman at work" fill className="object-cover" />
              <div className="absolute inset-0 border border-gold-500/20 m-6 rounded-xl pointer-events-none" />
            </Parallax>
            
            <FadeInOnView direction="left">
              <h2 className="font-serif text-4xl lg:text-5xl text-gold-300 mb-8">A Legacy of Light</h2>
              <div className="space-y-6 text-ink-300 text-lg leading-relaxed">
                <p>{brandData.description || 'For over a century, AURUM has been synonymous with the pinnacle of luxury jewellery.'}</p>
                <p>Every gemstone we select tells a story of the earth, and every setting we craft is a testament to human ingenuity. Our artisans spend thousands of hours perfecting techniques passed down through generations.</p>
                <p>We are more than jewelers; we are custodians of legacy, capturing your most precious moments in eternal brilliance.</p>
              </div>
            </FadeInOnView>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-24 bg-ink-900 border-y border-ink-800">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="font-serif text-4xl text-center text-gold-100 mb-20">The Journey</h2>
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-[27px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold-700/50 to-transparent" />
              
              <div className="space-y-24">
                {milestones.map((milestone, index) => (
                  <FadeInOnView key={milestone.year} delay={index * 0.1} className="relative flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-0">
                    <div className={`md:w-1/2 flex ${index % 2 === 0 ? 'md:justify-end md:pr-16' : 'md:order-last md:pl-16'} pl-20 md:pl-0`}>
                      <div className={`text-left ${index % 2 === 0 ? 'md:text-right' : ''}`}>
                        <h3 className="font-serif text-2xl text-gold-300 mb-2">{milestone.title}</h3>
                        <p className="text-ink-400">{milestone.description}</p>
                      </div>
                    </div>
                    
                    <div className="absolute left-0 md:left-1/2 w-14 h-14 -translate-x-0 md:-translate-x-1/2 rounded-full bg-ink-950 border border-gold-500/50 flex items-center justify-center z-10 text-gold-100 font-serif text-sm shadow-[0_0_15px_rgba(212,168,67,0.2)]">
                      {milestone.year}
                    </div>
                  </FadeInOnView>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl text-gold-100 mb-4">Our Core Values</h2>
            <p className="text-ink-300 max-w-2xl mx-auto">The principles that guide every decision we make and every piece we create.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <FadeInOnView key={value.title} delay={index * 0.2}>
                  <GlassPanel variant="strong" className="p-8 text-center h-full group hover:-translate-y-2 transition-transform duration-500 cursor-default">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold-900/20 border border-gold-500/30 flex items-center justify-center text-gold-300 group-hover:scale-110 group-hover:bg-gold-900/40 transition-all duration-500">
                      <Icon size={32} strokeWidth={1.5} />
                    </div>
                    <h3 className="font-serif text-2xl text-gold-100 mb-4">{value.title}</h3>
                    <p className="text-ink-400 text-sm leading-relaxed">{value.description}</p>
                  </GlassPanel>
                </FadeInOnView>
              );
            })}
          </div>
        </section>

        {/* Stats */}
        <section className="py-20 bg-ink-900/50 border-t border-ink-800">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center">
              {stats.map((stat, index) => (
                <FadeInOnView key={stat.label} delay={index * 0.1}>
                  <div className="font-serif text-4xl md:text-5xl text-gold-300 mb-2 flex items-center justify-center">
                    <CountUp end={stat.value} duration={2.5} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm uppercase tracking-widest text-ink-400">{stat.label}</div>
                </FadeInOnView>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-32 px-6 text-center">
          <h2 className="font-serif text-4xl text-gold-100 mb-6">Experience Our Boutique</h2>
          <p className="text-ink-300 max-w-xl mx-auto mb-10 text-lg">
            Step into our world and discover the artistry behind every piece firsthand. 
            Our expert advisors await to guide your journey.
          </p>
          <CTAButton variant="primary" size="lg" href="/boutiques" showArrow>
            Find a Boutique
          </CTAButton>
        </section>
      </div>
    </>
  );
}
