'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import PageBanner from '@/components/ui/PageBanner';
import CTAButton from '@/components/ui/CTAButton';
import MotionCard from '@/components/motion/MotionCard';
import RevealImage from '@/components/motion/RevealImage';
import GoldDivider from '@/components/ui/GoldDivider';
import SectionHeading from '@/components/ui/SectionHeading';
import { StaggerContainer, StaggerItem } from '@/components/animations/Reveal';
import { collections } from '@/data/collections';
import { products } from '@/data/products';

/**
 * Filters key off collection ids. The previous version matched a short label
 * ('Bridal') against the full name ('Bridal Elegance'), so every filter but
 * "All" rendered an empty grid.
 */
const FILTERS = [
  { value: 'all', label: 'All' },
  ...collections.map((c) => ({ value: c.id, label: c.name })),
];

export default function CollectionsClient() {
  const [active, setActive] = useState('all');

  const visible = useMemo(
    () => (active === 'all' ? collections : collections.filter((c) => c.id === active)),
    [active]
  );

  const countFor = (id: string) => products.filter((p) => p.collection === id).length;

  return (
    <>
      <PageBanner
        title="Our Collections"
        subtitle="Discover worlds of beauty crafted across generations"
        breadcrumbs={[{ label: 'Collections' }]}
        backgroundImage="/images/hero/hero-main.jpg"
      />

      <div className="min-h-screen bg-canvas px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-7xl">
          {/* Filter rail */}
          <div className="scrollbar-hide mb-16 flex flex-wrap items-center justify-center gap-3">
            {FILTERS.map((filter) => {
              const isActive = active === filter.value;
              return (
                <button
                  key={filter.value}
                  onClick={() => setActive(filter.value)}
                  aria-pressed={isActive}
                  className={`relative whitespace-nowrap rounded-full px-6 py-2.5 font-accent text-[11px] uppercase tracking-luxe transition-colors duration-300 ${
                    isActive ? 'text-onaccent' : 'text-muted hover:text-accent'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="collections-filter"
                      className="absolute inset-0 rounded-full bg-accent shadow-gold"
                      transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{filter.label}</span>
                </button>
              );
            })}
          </div>

          {/* Grid */}
          <StaggerContainer
            staggerChildren={0.11}
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {visible.map((collection, idx) => {
              const count = collection.itemCount ?? countFor(collection.id);

              return (
                <StaggerItem key={collection.id}>
                  <Link
                    href={`/collections/${collection.id}`}
                    data-cursor="Explore"
                    className="block h-full"
                  >
                    <MotionCard
                      className="group h-full overflow-hidden rounded-2xl border border-hairline bg-surface-raised transition-colors duration-500 hover:border-gold-500/40"
                      tiltAmount={6}
                    >
                      <div className="relative overflow-hidden">
                        <RevealImage
                          src={collection.image}
                          alt={collection.name}
                          aspectRatio="4/3"
                          curtain={idx < 3}
                          priority={idx < 3}
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <span className="absolute right-4 top-4 z-30 flex h-9 w-9 -translate-y-2 items-center justify-center rounded-full border border-white/25 bg-black/35 text-white opacity-0 backdrop-blur-md transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                          <ArrowUpRight size={15} />
                        </span>
                      </div>

                      <div className="p-8 text-center">
                        <h3 className="mb-2 font-display text-2xl text-primary transition-colors duration-300 group-hover:text-accent">
                          {collection.name}
                        </h3>

                        <p className="mb-4 line-clamp-2 font-sans text-sm font-light text-muted">
                          {collection.tagline ?? collection.description}
                        </p>

                        <span className="mx-auto mb-4 block h-px w-10 scale-x-0 bg-accent transition-transform duration-500 group-hover:scale-x-100" />

                        <span className="font-accent text-[10px] uppercase tracking-luxe text-accent/70 transition-colors group-hover:text-accent">
                          {count > 0 ? `${count} ${count === 1 ? 'Piece' : 'Pieces'} · ` : ''}
                          Explore Collection
                        </span>
                      </div>
                    </MotionCard>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerContainer>

          <GoldDivider variant="jewel" className="my-24" />

          {/* Closing CTA */}
          <div className="text-center">
            <SectionHeading
              eyebrow="Personal Guidance"
              title="Can't find what you're looking for?"
              highlightWords={["Can't"]}
              subtitle="Visit us for a personal consultation. Our experts will guide you to the perfect piece — or design one that does not yet exist."
              align="center"
              className="mb-10"
            />
            <CTAButton variant="primary" size="lg" showArrow href="/contact">
              Book a Consultation
            </CTAButton>
          </div>
        </div>
      </div>
    </>
  );
}
