'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { Expand } from 'lucide-react';
import PageBanner from '@/components/ui/PageBanner';
import Lightbox from '@/components/ui/Lightbox';

const CATEGORIES = ['All', 'Necklaces', 'Rings', 'Earrings', 'Bracelets', 'Collections'];

const GALLERY = [
  { src: '/images/hero/hero-main.jpg', alt: 'The AURUM signature gold suite', category: 'Collections' },
  { src: '/images/products/ring.jpg', alt: 'Solitaire diamond ring', category: 'Rings' },
  { src: '/images/collections/bridal.jpg', alt: 'Bridal kundan set', category: 'Collections' },
  { src: '/images/products/necklace.jpg', alt: 'Handwoven gold necklace', category: 'Necklaces' },
  { src: '/images/products/earrings.jpg', alt: 'Pearl drop earrings', category: 'Earrings' },
  { src: '/images/collections/heritage.jpg', alt: 'Heritage collection centrepiece', category: 'Collections' },
  { src: '/images/products/bracelet.jpg', alt: 'Diamond tennis bracelet', category: 'Bracelets' },
  { src: '/images/collections/statement.jpg', alt: 'Statement emerald piece', category: 'Collections' },
  { src: '/images/hero/craftsmanship.jpg', alt: 'An artisan at the bench', category: 'Collections' },
  { src: '/images/collections/everyday.jpg', alt: 'Everyday luxe stack', category: 'Collections' },
  { src: '/images/collections/gemstone.jpg', alt: 'Gemstone cocktail ring', category: 'Rings' },
  { src: '/images/collections/mens.jpg', alt: "Men's signet collection", category: 'Collections' },
];

export default function GalleryClient() {
  const [activeTab, setActiveTab] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const filtered = useMemo(
    () => (activeTab === 'All' ? GALLERY : GALLERY.filter((g) => g.category === activeTab)),
    [activeTab]
  );

  return (
    <main className="min-h-screen bg-canvas">
      <PageBanner
        title="Gallery"
        subtitle="A visual journey through our finest creations"
        breadcrumbs={[{ label: 'Gallery' }]}
      />

      <section className="mx-auto max-w-[1600px] px-6 py-16 md:px-12 lg:px-24">
        {/* Filter rail */}
        <div className="mb-16 flex flex-wrap justify-center gap-3">
          {CATEGORIES.map((category) => {
            const isActive = activeTab === category;
            return (
              <button
                key={category}
                onClick={() => setActiveTab(category)}
                aria-pressed={isActive}
                className={`relative rounded-full px-6 py-2.5 font-accent text-[11px] uppercase tracking-luxe transition-colors duration-300 ${
                  isActive ? 'text-onaccent' : 'text-muted hover:text-accent'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="gallery-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-accent shadow-gold"
                    transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                  />
                )}
                {category}
              </button>
            );
          })}
        </div>

        {/* Masonry */}
        <div className="columns-1 gap-6 space-y-6 sm:columns-2 lg:columns-3 xl:columns-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((image, i) => (
              <motion.button
                layout
                key={image.src}
                initial={{ opacity: 0, scale: 0.92, filter: 'blur(8px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.55, delay: (i % 8) * 0.05, ease: [0.22, 1, 0.36, 1] }}
                onClick={() =>
                  setLightboxIndex(GALLERY.findIndex((g) => g.src === image.src))
                }
                data-cursor="View"
                aria-label={`Open ${image.alt}`}
                className="group relative mb-6 block w-full break-inside-avoid overflow-hidden rounded-xl border border-hairline"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={800}
                  height={1000}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="h-auto w-full object-cover transition-transform duration-[1100ms] ease-luxury group-hover:scale-110"
                />

                {/* Hover veil */}
                <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-canvas/0 transition-colors duration-500 group-hover:bg-canvas/55">
                  <span className="flex h-12 w-12 translate-y-4 items-center justify-center rounded-full border border-gold-400/60 text-accent opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <Expand size={17} />
                  </span>
                  <span className="translate-y-4 px-4 text-center font-accent text-[10px] uppercase tracking-luxe text-gold-100 opacity-0 transition-all duration-500 delay-75 group-hover:translate-y-0 group-hover:opacity-100">
                    {image.alt}
                  </span>
                </span>

                {/* Hairline frame that draws in */}
                <span className="pointer-events-none absolute inset-3 border border-gold-400/0 transition-colors duration-700 group-hover:border-gold-400/45" />
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </section>

      <Lightbox
        images={GALLERY}
        initialIndex={lightboxIndex === -1 ? 0 : lightboxIndex}
        isOpen={lightboxIndex !== -1}
        onClose={() => setLightboxIndex(-1)}
      />
    </main>
  );
}
