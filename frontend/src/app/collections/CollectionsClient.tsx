'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PageBanner from '@/components/ui/PageBanner';
import CTAButton from '@/components/ui/CTAButton';
import MotionCard from '@/components/motion/MotionCard';
import RevealImage from '@/components/motion/RevealImage';
import { StaggerContainer, StaggerItem } from '@/components/animations/Reveal';
import { collections } from '@/data/collections';

const categories = ['All', 'Bridal', 'Heritage', 'Everyday', 'Statement', 'Gemstone', "Men's"];

export default function CollectionsClient() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredCollections = activeCategory === 'All'
    ? collections
    : collections.filter(c => c.name === activeCategory);

  return (
    <>
      <PageBanner
        title="Our Collections"
        subtitle="Discover worlds of beauty crafted across generations"
        breadcrumbs={[{ label: 'Collections' }]}
        backgroundImage="/images/hero/hero-main.jpg"
      />
      <div className="min-h-screen bg-ink-950 text-ink-50 py-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          {/* Filters */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative px-6 py-2 rounded-full text-sm tracking-widest uppercase transition-colors duration-300 ${
                  activeCategory === cat ? 'text-ink-950' : 'text-gold-300 hover:text-gold-100'
                }`}
              >
                {activeCategory === cat && (
                  <motion.div
                    layoutId="activeFilter"
                    className="absolute inset-0 bg-gold-500 rounded-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            ))}
          </div>

          {/* Grid */}
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCollections.map((collection) => (
              <StaggerItem key={collection.id}>
                <Link href={`/collections/${collection.id}`}>
                  <MotionCard className="group cursor-pointer rounded-2xl overflow-hidden bg-ink-900 border border-ink-800 hover:border-gold-500/50 transition-colors">
                    <div className="relative aspect-4/3 overflow-hidden">
                      <RevealImage
                        src={collection.image || '/images/collections/bridal.jpg'}
                        alt={collection.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                    </div>
                    <div className="p-8 text-center">
                      <h3 className="font-serif text-2xl text-gold-300 mb-2">{collection.name}</h3>
                      <p className="text-sm text-ink-300 mb-4">{collection.tagline}</p>
                      <span className="text-xs uppercase tracking-widest text-gold-500/70 group-hover:text-gold-500 transition-colors">
                        Explore Collection
                      </span>
                    </div>
                  </MotionCard>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* CTA */}
          <div className="mt-32 text-center">
            <h3 className="font-serif text-3xl text-gold-100 mb-6">Can&apos;t find what you&apos;re looking for?</h3>
            <p className="text-ink-300 mb-8 max-w-xl mx-auto">
              Visit us for a personal consultation. Our experts will guide you to the perfect piece.
            </p>
            <CTAButton variant="primary" showArrow href="/contact">
              Book a Consultation
            </CTAButton>
          </div>
        </div>
      </div>
    </>
  );
}
