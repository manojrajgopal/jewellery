'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Gem, ShieldCheck, Sparkles, Wrench } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import SpotlightCard from '@/components/motion/SpotlightCard';
import { StaggerContainer, StaggerItem } from '@/components/animations/Reveal';
import { services } from '@/data/services';

const ICONS: Record<string, React.ElementType> = {
  Gem,
  Wrench,
  ShieldCheck,
  Sparkles,
};

export default function ServicesSection() {
  return (
    <section id="services" className="relative w-full bg-canvas py-24 md:py-32">
      {/* Hairline grid wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-hairline bg-grid [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
      />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Beyond the Showcase"
          title="Our Services"
          highlightWords={['Services']}
          subtitle="From a first sketch to a lifetime of care — the work does not end when a piece leaves the atelier."
          align="center"
          className="mb-16"
        />

        <StaggerContainer
          staggerChildren={0.11}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {services.map((service, idx) => {
            const Icon = ICONS[service.icon] ?? Gem;

            return (
              <StaggerItem key={service.id} className="h-full">
                <SpotlightCard className="h-full border border-hairline bg-surface-raised/60 backdrop-blur-xl">
                  <div className="group flex h-full flex-col p-7">
                    {/* Index watermark */}
                    <span className="absolute right-5 top-4 font-display text-5xl leading-none text-accent/10 transition-colors duration-500 group-hover:text-accent/20">
                      {String(idx + 1).padStart(2, '0')}
                    </span>

                    <motion.div
                      whileHover={{ rotate: -8, scale: 1.08 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 16 }}
                      className="mb-6 inline-flex w-fit rounded-xl border border-gold-500/20 bg-gold-500/10 p-4 text-accent"
                    >
                      <Icon className="h-7 w-7" strokeWidth={1.4} />
                    </motion.div>

                    <h3 className="mb-3 font-display text-2xl text-primary transition-colors duration-300 group-hover:text-accent">
                      {service.title}
                    </h3>

                    <p className="mb-6 flex-grow font-sans text-sm font-light leading-relaxed text-muted">
                      {service.description}
                    </p>

                    <ul className="mb-8 space-y-2.5">
                      {service.features.map((feature, i) => (
                        <motion.li
                          key={feature}
                          initial={{ opacity: 0, x: -8 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.2 + i * 0.06, duration: 0.4 }}
                          className="flex items-start gap-2.5 font-sans text-xs text-secondary"
                        >
                          <Check
                            className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-accent"
                            strokeWidth={2.2}
                          />
                          <span>{feature}</span>
                        </motion.li>
                      ))}
                    </ul>

                    <Link
                      href={service.link ?? '/services'}
                      className="mt-auto inline-flex items-center gap-2 font-accent text-[10px] uppercase tracking-luxe text-accent transition-colors hover:text-accent-soft"
                    >
                      Learn More
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
                    </Link>
                  </div>
                </SpotlightCard>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
