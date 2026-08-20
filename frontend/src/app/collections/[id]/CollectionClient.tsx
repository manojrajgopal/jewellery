'use client';

import React, { useState } from 'react';
import Image from 'next/image';
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
import JewellerLoupe from '@/components/motion/JewellerLoupe';
import VelvetTray from '@/components/motion/VelvetTray';
import MosaicShuffle from '@/components/motion/MosaicShuffle';
import SilkWave from '@/components/motion/SilkWave';
import GoldRibbonWeave from '@/components/motion/GoldRibbonWeave';
import GradientOrb from '@/components/ui/GradientOrb';
import { StaggerContainer, StaggerItem } from '@/components/animations/Reveal';
import { collections } from '@/data/collections';
import { products } from '@/data/products';
import FacetMosaicReveal from '@/components/motion/FacetMosaicReveal';
import CanvasGemRain from '@/components/motion/CanvasGemRain';
import ElasticRail from '@/components/motion/ElasticRail';
import ShadowStage from '@/components/motion/ShadowStage';
import type { Product } from '@/types';

export default function CollectionClient({ id }: { id: string }) {
  const [quickView, setQuickView] = useState<Product | null>(null);

  const collection = collections.find((c) => c.id === id);

  // Products store the collection *id*, not its display name. Matching on
  // `collection.name` meant no piece ever appeared on these pages.
  const collectionProducts = products.filter((p) => p.collection === id);
  const related = collections.filter((c) => c.id !== id).slice(0, 3);

  // The piece this collection is best represented by: its bestseller, or failing
  // that whatever it has. Undefined for a collection with nothing in it yet, which
  // is why the loupe section below is conditional.
  const hero =
    collectionProducts.find((p) => p.isBestseller) ?? collectionProducts[0];

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

          {/* Under the loupe, and in its case. Only rendered when the collection
              actually has a piece to feature — an empty collection gets the
              "in progress" plate above and nothing else. */}
          {hero && (
            <div className="mb-32">
              <SectionHeading
                eyebrow="Look Closer"
                title="The piece, at ten magnifications"
                highlightWords={['ten']}
                subtitle="The figure the whole clarity scale is defined at, and the only honest way to check that the report and the stone describe the same object."
                align="center"
                className="mb-14"
              />

              <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                <JewellerLoupe
                  src={hero.images?.[0] ?? hero.image ?? '/images/products/ring.jpg'}
                  alt={hero.name}
                  zoom={2.4}
                  size={190}
                  readout="10×"
                  aspect="4 / 3"
                />

                <VelvetTray
                  image={hero.images?.[0] ?? hero.image ?? '/images/products/ring.jpg'}
                  alt={hero.name}
                  title={hero.name}
                  subtitle={hero.gemstone ?? 'Presented by hand'}
                  meta={[
                    hero.formattedPrice ?? hero.price,
                    hero.metal.replace('-', ' '),
                    hero.karat ?? hero.category,
                  ]}
                  trigger="click"
                />
              </div>
            </div>
          )}

          {/* ---- The rest of the house ----
               A collection page ends by asking the visitor to leave it, and the
               usual way of doing that is a row of small cards labelled "explore
               more". This does it as a thrown rail instead, because the gesture
               matters: flicking through what else exists is browsing, and clicking
               a card is committing. At this point in the page the visitor should
               be doing the first. */}
          <div className="relative mb-32">
            <CanvasGemRain count={20} speed={32} part={130} outline className="opacity-50" />

            <div className="relative z-10">
              <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
                Everything else in the house
              </p>
              <p className="mt-2 max-w-2xl font-sans text-sm font-light leading-relaxed text-secondary">
                Thrown rather than listed. Past either end the rail resists instead of stopping,
                which is the one thing a row of cards can never do.
              </p>

              <ElasticRail label="Every other piece in the house" className="mt-8" gap={18}>
                {products
                  .filter((product) => product.collection !== collection.id)
                  .map((product) => (
                    <figure key={product.id} className="w-60 flex-shrink-0">
                      <span className="relative block h-72 overflow-hidden rounded-xl border border-hairline">
                        <Image
                          src={product.images?.[0] ?? '/images/products/ring.jpg'}
                          alt={product.name}
                          fill
                          sizes="240px"
                          className="object-cover"
                        />
                        <span aria-hidden="true" className="absolute inset-0 bg-vitrine" />
                      </span>
                      <figcaption className="mt-3">
                        <p className="font-display text-lg leading-tight text-primary">
                          {product.name}
                        </p>
                        <p className="nums-tabular mt-1 font-accent text-[9px] uppercase tracking-luxe text-faint">
                          {product.collection.replace(/-/g, ' ')} ·{' '}
                          {product.formattedPrice ?? product.price}
                        </p>
                      </figcaption>
                    </figure>
                  ))}
              </ElasticRail>

              {/* And this collection's own plate, rebuilt out of triangles as it
                  arrives — the last image on the page, and the only one that is
                  assembled rather than loaded. */}
              <div className="mt-20 grid items-center gap-12 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
                <FacetMosaicReveal
                  src={collection.image}
                  alt={`${collection.name}, assembled facet by facet`}
                  columns={8}
                  order="radial"
                  ratio={4 / 5}
                  caption={`${collection.name} — assembled from the table outward`}
                />
                <p className="font-display text-2xl italic leading-snug text-primary md:text-3xl">
                  Every plate on this page came off one afternoon, one light and one card. The
                  collection is photographed together or not at all.
                </p>
              </div>
            </div>
          </div>

          {/* ---- How this one was shot ----
               The loupe above answers "is the piece as described". This answers "is
               the photograph", which is the other half of buying anything from a
               screen. Both halves belong on a collection page and only one of them
               was here. */}
          <div className="mb-32">
            <SectionHeading
              eyebrow="The Shoot"
              title="One afternoon, one light, no retouching"
              highlightWords={['no']}
              subtitle="A collection is photographed in a single session so its metals can be trusted against each other. Two sessions means two colour temperatures, and a rose gold that looks warmer than the piece it will be worn beside."
              align="center"
              className="mb-14"
            />

            <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:items-center">
              <MosaicShuffle
                src={collection.image}
                alt={`${collection.name}, assembled from the contact sheet`}
                columns={8}
                ratio={16 / 10}
                from="centre"
                className="rounded-3xl border border-hairline"
              />

              <div className="space-y-6">
                <SilkWave
                  src={hero?.images?.[0] ?? hero?.image ?? collection.image}
                  alt={`${collection.name} under the storage cloth`}
                  ratio={4 / 5}
                  panels={12}
                  className="rounded-2xl border border-hairline"
                />
                <p className="font-sans text-xs font-light leading-relaxed text-muted">
                  Every plate in the archive lives under tissue between shoots, and every frame in
                  this collection was taken at the same window on the same afternoon. Hover a tile
                  on the left to lift it out of the sheet.
                </p>
              </div>
            </div>
          </div>

          <GoldRibbonWeave className="mb-24" height={100} ribbons={4} />

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

      {/* ---- Under a light you can move ----
           Every image above this point was lit by us, and a collection page is
           the exact place a visitor is asked to judge a piece from one. So the
           last thing on the page hands the lamp over.

           A cast shadow is the only cue on a flat screen that an object has a
           position in space rather than a place on a page, and lowering the lamp
           lengthens it — which is the fact that makes the whole thing read as a
           room. It is also, quietly, the most useful control on the page: the
           raking position is the one that shows surface condition, and it is the
           position no jeweller photographs in. */}
      <section className="relative overflow-hidden border-y border-hairline bg-canvas-alt py-24 md:py-32">
        <div className="relative z-10 mx-auto max-w-5xl px-6 md:px-12">
          <SectionHeading
            eyebrow="Your Lamp"
            title="Move the light and see what a photograph hides"
            highlightWords={['hides']}
            subtitle="Drag the lamp anywhere above the floor. Lower it and the shadow lengthens and softens, which is what light actually does and what a catalogue photograph is specifically arranged to avoid."
            align="center"
            className="mb-16"
          />

          <div className="mx-auto max-w-3xl">
            <ShadowStage
              src="/images/products/ring.jpg"
              alt={`A piece from the ${collection.name} collection, lit from a movable source`}
              caption="The raking position — lamp low and to one side — is the one that shows surface condition, and the one nobody photographs in. It is also the light in the window of every room we have."
            />
          </div>
        </div>
      </section>

      <RecentlyViewed />

      <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />
    </>
  );
}
