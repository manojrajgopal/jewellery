'use client';

import React from 'react';
import SectionHeading from '@/components/ui/SectionHeading';
import GlassPanel from '@/components/ui/GlassPanel';
import { StaggerContainer, StaggerItem } from '@/components/animations/Reveal';
import { Gem, Wrench, ShieldCheck, Sparkles, ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';
import { services } from '@/data/services';

const fallbackServices = [
  { id: 1, title: 'Bespoke Design', description: 'Collaborate with our master artisans to create a unique piece that tells your personal story.', features: ['Private consultation', '3D rendering', 'Material selection'], icon: 'Gem', link: '/services/bespoke' },
  { id: 2, title: 'Restoration', description: 'Breathe new life into family heirlooms with our meticulous restoration and polishing services.', features: ['Expert cleaning', 'Prong retipping', 'Stone replacement'], icon: 'Wrench', link: '/services/restoration' },
  { id: 3, title: 'Authentication', description: 'Comprehensive valuation and certification for your fine jewelry and luxury timepieces.', features: ['GIA certified gemologists', 'Detailed documentation', 'Insurance appraisal'], icon: 'ShieldCheck', link: '/services/authentication' },
  { id: 4, title: 'Concierge Care', description: 'Complimentary lifetime maintenance for all AURUM creations to ensure enduring brilliance.', features: ['Annual inspection', 'Ultrasonic cleaning', 'Secure shipping'], icon: 'Sparkles', link: '/services/care' }
];

const iconMap: Record<string, React.ElementType> = {
  Gem,
  Wrench,
  ShieldCheck,
  Sparkles
};

export default function ServicesSection() {
  const data = services?.length ? services : fallbackServices;

  return (
    <section id="services" className="relative w-full py-24 bg-ink-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="BEYOND THE SHOWCASE"
          title="Our Services"
          highlightWords={['Services']}
          align="center"
          className="mb-16"
        />

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.map((service) => {
            const IconComponent = iconMap[service.icon] || Gem;

            return (
              <StaggerItem key={service.id}>
                <GlassPanel 
                  variant="default" 
                  className="h-full group hover:-translate-y-2 transition-transform duration-500 hover:shadow-[0_0_30px_rgba(212,168,67,0.15)] flex flex-col"
                >
                  <div className="mb-6 inline-flex p-4 rounded-xl bg-gold-500/10 text-gold-500">
                    <IconComponent className="w-8 h-8" strokeWidth={1.5} />
                  </div>
                  
                  <h3 className="font-display text-2xl text-cream-50 mb-3">{service.title}</h3>
                  <p className="text-ink-400 text-sm leading-relaxed mb-6 flex-grow">
                    {service.description}
                  </p>
                  
                  <ul className="space-y-2 mb-8">
                    {service.features.map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-center text-sm text-ink-300">
                        <Check className="w-4 h-4 text-gold-500 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link 
                    href={service.link || '#'} 
                    className="inline-flex items-center text-gold-500 hover:text-gold-300 text-sm uppercase tracking-wider font-medium transition-colors mt-auto"
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Link>
                </GlassPanel>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
