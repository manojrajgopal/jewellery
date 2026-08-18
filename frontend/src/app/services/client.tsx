'use client';

import React from 'react';
import PageBanner from '@/components/ui/PageBanner';
import GlassPanel from '@/components/ui/GlassPanel';
import CTAButton from '@/components/ui/CTAButton';
import SectionHeading from '@/components/ui/SectionHeading';
import { StaggerContainer, StaggerItem, Reveal } from '@/components/animations/Reveal';
import { Gem, Wrench, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';


const services = [
  {
    icon: Gem,
    title: 'Bespoke Design',
    description: 'Transform your vision into reality with our master artisans. We guide you through every step, from initial sketches to selecting the perfect stones, ensuring your custom piece is as unique as your story.',
    features: ['Private consultation', 'Hand-drawn sketches', '3D CAD rendering', 'Stone selection viewing'],
  },
  {
    icon: Wrench,
    title: 'Restoration & Repair',
    description: 'Breathe new life into cherished heirlooms. Our delicate restoration process preserves the character of vintage pieces while ensuring their longevity for generations to come.',
    features: ['Prong retipping', 'Stone replacement', 'Polishing & rhodium plating', 'Resizing & adjustments'],
  },
  {
    icon: ShieldCheck,
    title: 'Appraisal & Valuation',
    description: 'Receive comprehensive documentation for your precious pieces. Our certified gemologists provide detailed reports for insurance, estate planning, or personal peace of mind.',
    features: ['Certified gemologists', 'Detailed grading reports', 'Market value assessment', 'Laser inscription checks'],
  },
  {
    icon: Sparkles,
    title: 'Jewellery Spa',
    description: 'Experience our ultra-sonic deep cleaning service that returns your pieces to their original brilliance. We meticulously check settings and restore that day-one sparkle.',
    features: ['Ultrasonic cleaning', 'Steam purification', 'Setting integrity check', 'Complimentary for AURUM pieces'],
  }
];

const processSteps = [
  { num: '01', title: 'Consultation', desc: 'Discuss your vision, budget, and timeline in a private setting.' },
  { num: '02', title: 'Design', desc: 'Review custom sketches and 3D renderings of your unique piece.' },
  { num: '03', title: 'Creation', desc: 'Our master craftsmen bring the design to life using ancient techniques.' },
  { num: '04', title: 'Delivery', desc: 'Unveil your finished masterpiece in a celebratory presentation.' }
];

export default function ServicesClient() {
  return (
    <main className="min-h-screen bg-[#060504] text-gold-100">
      <PageBanner
        title="Our Services"
        subtitle="Beyond the showcase — excellence in every detail"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Services' }]}
        backgroundImage="/images/hero/craftsmanship.jpg"
      />

      {/* Services Grid */}
      <section className="py-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <SectionHeading 
            eyebrow="Expertise"
            title="Exceptional Services"
            subtitle="Tailored care for your most precious possessions"
            align="center"
            className="mb-16"
          />

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <StaggerItem key={index}>
                <GlassPanel className="h-full p-8 md:p-12 hover:-translate-y-2 transition-transform duration-500">
                  <div className="flex flex-col h-full">
                    <service.icon className="w-12 h-12 text-gold-500 mb-6" strokeWidth={1.5} />
                    <h3 className="font-display text-3xl mb-4">{service.title}</h3>
                    <p className="text-white/70 font-body leading-relaxed mb-8 flex-grow">
                      {service.description}
                    </p>
                    <ul className="space-y-3 mb-8">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm font-body text-white/80">
                          <CheckCircle2 className="w-4 h-4 text-gold-500 mr-3" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <CTAButton variant="ghost" className="self-start">Learn More</CTAButton>
                  </div>
                </GlassPanel>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-ink-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 relative z-10">
          <SectionHeading 
            eyebrow="The Journey"
            title="How We Work"
            subtitle="A transparent and collaborative process to ensure absolute perfection"
            align="center"
            className="mb-20"
          />

          <div className="relative">
            {/* Dotted Line */}
            <div className="hidden lg:block absolute top-12 left-0 w-full border-t border-dashed border-gold-700/30" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
              {processSteps.map((step, index) => (
                <Reveal key={index} delay={index * 0.2}>
                  <div className="relative flex flex-col items-center text-center group">
                    <div className="w-24 h-24 rounded-full bg-[#060504] border border-gold-500/20 flex items-center justify-center mb-6 relative z-10 group-hover:border-gold-500/50 transition-colors duration-500">
                      <span className="font-display text-3xl text-gold-500">{step.num}</span>
                    </div>
                    <h4 className="font-display text-2xl mb-3">{step.title}</h4>
                    <p className="text-white/60 font-body text-sm leading-relaxed max-w-[250px]">
                      {step.desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 text-center">
        <Reveal>
          <h2 className="font-display text-5xl md:text-6xl mb-6">Ready to begin?</h2>
          <p className="text-white/70 font-body max-w-xl mx-auto mb-10 text-lg">
            Schedule a private consultation with our artisans and take the first step towards your bespoke masterpiece.
          </p>
          <CTAButton href="/contact" variant="primary" size="lg" showArrow>
            Book an Appointment
          </CTAButton>
        </Reveal>
      </section>
    </main>
  );
}
