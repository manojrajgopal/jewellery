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
import ParallaxColumns, { type ColumnPlate } from '@/components/motion/ParallaxColumns';
import ScrollAssembleText from '@/components/motion/ScrollAssembleText';
import CylinderMarquee from '@/components/motion/CylinderMarquee';
import VelvetTray from '@/components/motion/VelvetTray';
import RippleGrid from '@/components/motion/RippleGrid';
import MosaicShuffle from '@/components/motion/MosaicShuffle';
import GoldRibbonWeave from '@/components/motion/GoldRibbonWeave';
import PriceLadder from '@/components/ui/PriceLadder';
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

/**
 * The plate wall. Built from the catalogue rather than hand-listed, so a new
 * collection or product appears here without anyone remembering to add it — and
 * captions come from the real record rather than from a parallel copy of it.
 */
const PLATE_WALL: ColumnPlate[] = [
  ...collections.map((c) => ({
    src: c.image,
    alt: c.name,
    caption: c.name,
    href: `/collections/${c.id}`,
  })),
  ...products.slice(0, 6).map((p) => ({
    src: p.images?.[0] ?? p.image ?? '/images/products/ring.jpg',
    alt: p.name,
    caption: `${p.name} · ${p.formattedPrice ?? p.price}`,
    href: `/collections/${p.collection}`,
  })),
];

/** Derived from the catalogue's own category field, so the drum cannot go stale. */
const CATEGORY_WORDS = Array.from(new Set(products.map((p) => p.category))).map(
  (c) => c.charAt(0).toUpperCase() + c.slice(1)
);

export default function CollectionsClient() {
  const [active, setActive] = useState('all');

  const visible = useMemo(
    () => (active === 'all' ? collections : collections.filter((c) => c.id === active)),
    [active]
  );

  const countFor = (id: string) => products.filter((p) => p.collection === id).length;

  // The bestseller, or the first piece if nothing is flagged — never undefined, so
  // the case section does not have to be conditional on the data.
  const featured = products.find((p) => p.isBestseller) ?? products[0];

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

          {/* The season's plates — the same catalogue read as an editorial wall
              rather than as a set of collection cards. Columns travel at different
              rates, so scanning it has depth the grid above deliberately does not. */}
          <section className="relative -mx-6 overflow-hidden px-6 py-8 md:-mx-12 md:px-12">
            <RippleGrid spacing={48} reach={190} dot={1} />

            <div className="relative z-10">
              <div className="mb-14 text-center">
                <p className="mb-5 font-accent text-[10px] uppercase tracking-luxest text-accent">
                  The Same Pieces, Differently
                </p>
                <ScrollAssembleText
                  text="Twelve plates, no captions until you ask"
                  as="h2"
                  highlightWords={['ask']}
                  spread={72}
                  className="mx-auto max-w-2xl font-display text-3xl font-light leading-[1.12] text-primary sm:text-4xl"
                />
                <p className="mx-auto mt-5 max-w-xl font-sans text-sm font-light leading-relaxed text-muted">
                  A grid tells you what each collection is called. This tells you what it
                  looks like next to the others, which is the comparison you were making
                  anyway.
                </p>
              </div>

              <ParallaxColumns plates={PLATE_WALL} columns={4} depth={135} />
            </div>
          </section>

          {/* The one piece worth pulling out, in its case */}
          <section className="mt-24 grid gap-14 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:items-center">
            {featured && (
              <VelvetTray
                image={featured.images?.[0] ?? '/images/products/ring.jpg'}
                alt={featured.name}
                title={featured.name}
                subtitle={featured.gemstone ?? 'Presented by hand'}
                meta={[
                  featured.formattedPrice ?? featured.price,
                  featured.metal.replace('-', ' '),
                  featured.category,
                ]}
                trigger="click"
              />
            )}

            <div>
              <p className="mb-5 font-accent text-[10px] uppercase tracking-luxest text-accent">
                The House Piece
              </p>
              <h2 className="font-display text-2xl font-light leading-tight text-primary md:text-4xl">
                {featured?.name ?? 'The signature piece'}
              </h2>
              <p className="mt-5 max-w-prose font-sans text-base font-light leading-relaxed text-muted">
                {featured?.description}
              </p>
              <p className="mt-5 font-display text-lg italic leading-snug text-secondary">
                Press the case to open it. Everything in these collections arrives this way
                — tooled, blind-stamped, and lined against the metal rather than against
                the case.
              </p>

              <div className="mt-9 flex flex-wrap gap-4">
                <CTAButton
                  variant="primary"
                  size="md"
                  href={`/collections/${featured?.collection ?? collections[0].id}`}
                  showArrow
                >
                  See it in the collection
                </CTAButton>
                <CTAButton variant="secondary" size="md" href="/lookbook">
                  The bound lookbook
                </CTAButton>
              </div>
            </div>
          </section>

          {/* Categories, on a drum */}
          {/* ---- The ladder ----
               Filters sort the wall by collection and category; neither answers the
               question a visitor arrives with, which is what a particular number
               buys. Built from the live catalogue, so a new piece moves a rung
               without anyone maintaining a second table. */}
          <section className="mt-24">
            <SectionHeading
              eyebrow="What It Buys"
              title="Four rungs, and what each one is for"
              highlightWords={['for']}
              subtitle="Set the figure you have in mind. The bands above it stay on the ladder rather than disappearing — a price you are not spending is still worth knowing."
              align="center"
              className="mb-14"
            />
            <PriceLadder />
          </section>

          <GoldRibbonWeave className="mt-24" height={100} ribbons={4} />

          {/* ---- One collection, assembling ----
               A wordless beat between the ladder and the advisory block below. The
               tiles are one image, offset per cell, so this costs a single request. */}
          <section className="mt-20 grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]">
            <MosaicShuffle
              src="/images/collections/bridal.jpg"
              alt="A bridal suite, assembled from its own contact sheet"
              columns={8}
              ratio={16 / 10}
              from="centre"
              className="rounded-3xl border border-hairline"
            />
            <div>
              <p className="font-accent text-[10px] uppercase tracking-luxest text-accent">
                Photographed Once
              </p>
              <h3 className="mt-4 font-display text-3xl font-light leading-tight text-primary">
                Every collection is shot in a single afternoon
              </h3>
              <p className="mt-5 font-sans text-sm font-light leading-relaxed text-secondary">
                One light, one bench, one afternoon &mdash; so the metals in a collection can be
                trusted against each other. Two shoots on two days means two colour temperatures,
                and a rose gold that looks warmer than it is beside a piece it will actually be
                worn with.
              </p>
              <p className="mt-4 font-accent text-[10px] uppercase tracking-luxer text-faint">
                Hover a tile to lift it out of the sheet
              </p>
            </div>
          </section>

          <section className="mt-24">
            <p className="mb-8 text-center font-accent text-[10px] uppercase tracking-luxest text-accent">
              What we make
            </p>
            <CylinderMarquee items={CATEGORY_WORDS} radius={130} speed={11} />
          </section>

          <GoldDivider variant="wide" className="my-24" />

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
