'use client';

import React, { useState } from 'react';
import PageBanner from '@/components/ui/PageBanner';
import Lightbox from '@/components/ui/Lightbox';
import { motion, AnimatePresence } from 'framer-motion';
import { StaggerContainer } from '@/components/animations/Reveal';
import Image from 'next/image';

const categories = ['All', 'Necklaces', 'Rings', 'Earrings', 'Bracelets', 'Collections'];

const galleryImages = [
  { src: '/images/hero/hero-main.jpg', alt: 'Aurum Hero', category: 'Collections' },
  { src: '/images/products/ring.jpg', alt: 'Diamond Ring', category: 'Rings' },
  { src: '/images/collections/bridal.jpg', alt: 'Bridal Collection', category: 'Collections' },
  { src: '/images/products/necklace.jpg', alt: 'Gold Necklace', category: 'Necklaces' },
  { src: '/images/products/earrings.jpg', alt: 'Pearl Earrings', category: 'Earrings' },
  { src: '/images/collections/heritage.jpg', alt: 'Heritage Collection', category: 'Collections' },
  { src: '/images/products/bracelet.jpg', alt: 'Tennis Bracelet', category: 'Bracelets' },
  { src: '/images/collections/statement.jpg', alt: 'Statement Piece', category: 'Collections' },
  { src: '/images/hero/craftsmanship.jpg', alt: 'Craftsmanship', category: 'Collections' },
  { src: '/images/collections/everyday.jpg', alt: 'Everyday Elegance', category: 'Collections' },
  { src: '/images/collections/gemstone.jpg', alt: 'Gemstone Ring', category: 'Rings' },
  { src: '/images/collections/mens.jpg', alt: 'Mens Collection', category: 'Collections' },
];

export default function GalleryClient() {
  const [activeTab, setActiveTab] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const filteredImages = activeTab === 'All' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeTab);

  return (
    <main className="min-h-screen bg-[#060504] text-gold-100">
      <PageBanner
        title="Gallery"
        subtitle="A visual journey through our finest creations"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Gallery' }]}
      />

      <section className="py-16 px-6 md:px-12 lg:px-24 max-w-[1600px] mx-auto">
        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveTab(category)}
              className={`relative px-6 py-2 rounded-full font-body text-sm tracking-widest uppercase transition-colors duration-300 ${
                activeTab === category ? 'text-ink-950' : 'text-gold-100 hover:text-gold-300'
              }`}
            >
              {activeTab === category && (
                <motion.div
                  layoutId="pill"
                  className="absolute inset-0 bg-gold-500 rounded-full -z-10"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              {category}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <StaggerContainer className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
          <AnimatePresence mode="popLayout">
            {filteredImages.map((image) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                key={image.src + activeTab} // forces re-render for clean exit animations
                className="relative group rounded-xl overflow-hidden cursor-pointer inline-block w-full break-inside-avoid"
                onClick={() => setLightboxIndex(galleryImages.findIndex(img => img.src === image.src))}
              >
                <div className="aspect-w-3 aspect-h-4 relative w-full h-[300px] sm:h-auto">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={600}
                    height={800}
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-ink-950/0 group-hover:bg-ink-950/40 transition-colors duration-500 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 font-display text-2xl text-gold-100 tracking-wider transform translate-y-4 group-hover:translate-y-0">
                      View
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </StaggerContainer>
      </section>

      <Lightbox
        images={galleryImages}
        initialIndex={lightboxIndex === -1 ? 0 : lightboxIndex}
        isOpen={lightboxIndex !== -1}
        onClose={() => setLightboxIndex(-1)}
      />
    </main>
  );
}
