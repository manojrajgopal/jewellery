'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PageBanner from '@/components/ui/PageBanner';
import CTAButton from '@/components/ui/CTAButton';
import MotionCard from '@/components/motion/MotionCard';
import RevealImage from '@/components/motion/RevealImage';
import ProductCard from '@/components/ui/ProductCard';
import QuickViewModal from '@/components/ui/QuickViewModal';
import RecentlyViewed from '@/components/ui/RecentlyViewed';
import GoldDivider from '@/components/ui/GoldDivider';
import SectionHeading from '@/components/ui/SectionHeading';
import CurtainReveal from '@/components/motion/CurtainReveal';
import GradientOrb from '@/components/ui/GradientOrb';
import { StaggerContainer, StaggerItem } from '@/components/animations/Reveal';
import { collections } from '@/data/collections';
import { products } from '@/data/products';
import type { Product } from '@/types';

export default function CollectionClient({ id }: { id: string }) {
  const [quickView, setQuickView] = useState<Product | null>(null);

  const collection = collections.find((c) => c.id === id);

  // Products store the collection *id*, not its display name. Matching on
  // `collection.name` meant no piece ever appeared on these pages.
  const collectionProducts = products.filter((p) => p.collection === id);
  const related = collections.filter((c) => c.id !== id).slice(0, 3);

  if (!collection) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-6 text-center">
        <h2 className="font-display text-3xl text-primary">Collection not found</h2>
        <p className="font-sans text-muted">
          This collection may have been retired or renamed.
        </p>
        <CTAButton variant="secondary" href="/collections" showArrow>
          Browse all collections
        </CTAButton>
      </div>
    );
  }

  return (
    <>
      <PageBanner
        title={collection.name}
        subtitle={collection.tagline ?? collection.description}
        breadcrumbs={[{ label: 'Collections', href: '/collections' }, { label: collection.name }]}
        backgroundImage={collection.image}
      />

      <div className="relative min-h-screen overflow-hidden bg-canvas px-6 py-24 md:px-12 lg:px-24">
        <GradientOrb color="gold" size="xl" position="top-right" intensity={0.1} blur="3xl" />

        <div className="relative z-10 mx-auto max-w-7xl">
          {/* Essence */}
          <div className="mb-24 grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <div>
              <SectionHeading
                eyebrow="The Essence"
                title={`The Essence of ${collection.name}`}
                highlightWords={['Essence']}
                align="left"
                ornament={false}
                className="mb-6"
              />
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="font-sans text-base font-light leading-relaxed text-muted lg:text-lg"
              >
                {collection.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.45 }}
                className="mt-10 flex flex-wrap gap-4"
              >
                <CTAButton variant="primary" size="md" href="/contact" showArrow>
                  Enquire About This Collection
                </CTAButton>
              </motion.div>
            </div>

            <CurtainReveal
              direction="right"
              className="relative aspect-[4/5] overflow-hidden rounded-2xl"
            >
              <RevealImage
                src={collection.image}
                alt={collection.name}
                aspectRatio="4/5"
                curtain={false}
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </CurtainReveal>
          </div>

          <GoldDivider variant="ornate" className="mb-24" />

          {/* Pieces */}
          <div className="mb-32">
            <SectionHeading
              eyebrow="The Pieces"
              title="Featured Pieces"
              highlightWords={['Featured']}
              align="center"
              className="mb-14"
            />

            {collectionProducts.length > 0 ? (
              <StaggerContainer
                staggerChildren={0.1}
                className="grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-2 xl:grid-cols-3"
              >
                {collectionProducts.map((product, idx) => (
                  <StaggerItem key={product.id}>
                    <ProductCard product={product} index={idx} onQuickView={setQuickView} />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            ) : (
              <div className="rounded-2xl border border-hairline bg-surface-raised/50 py-20 text-center">
                <h3 className="mb-4 font-display text-2xl text-accent">
                  Masterpieces in Progress
                </h3>
                <p className="font-sans font-light text-muted">
                  New creations for this collection are taking shape in the atelier.
                </p>
                <div className="mt-8">
                  <CTAButton variant="secondary" size="md" href="/contact">
                    Register your interest
                  </CTAButton>
                </div>
              </div>
            )}
          </div>

          {/* Related */}
          <div>
            <SectionHeading
              eyebrow="Continue"
              title="Explore More"
              highlightWords={['More']}
              align="center"
              className="mb-14"
            />

            <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-3">
              {related.map((rel) => (
                <Link key={rel.id} href={`/collections/${rel.id}`} data-cursor="Explore">
                  <MotionCard
                    className="group relative aspect-[3/4] overflow-hidden rounded-xl"
                    tiltAmount={6}
                  >
                    <RevealImage
                      src={rel.image}
                      alt={rel.name}
                      aspectRatio="3/4"
                      curtain={false}
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 z-30 p-6 text-center">
                      <h4 className="mb-1 font-display text-xl text-white">{rel.name}</h4>
                      <p className="font-accent text-[10px] uppercase tracking-luxe text-white/60 transition-colors group-hover:text-gold-300">
                        Discover
                      </p>
                    </div>
                  </MotionCard>
                </Link>
              ))}
            </div>

            <div className="text-center">
              <CTAButton variant="secondary" size="lg" href="/collections" showArrow>
                Explore All Collections
              </CTAButton>
            </div>
          </div>
        </div>
      </div>

      <RecentlyViewed />

      <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />
    </>
  );
}
