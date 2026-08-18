'use client';

import React from 'react';
import Link from 'next/link';
import PageBanner from '@/components/ui/PageBanner';
import CTAButton from '@/components/ui/CTAButton';
import MotionCard from '@/components/motion/MotionCard';
import RevealImage from '@/components/motion/RevealImage';
import Badge from '@/components/ui/Badge';
import { StaggerContainer, StaggerItem } from '@/components/animations/Reveal';
import { collections } from '@/data/collections';
import { products } from '@/data/products';

export default function CollectionClient({ id }: { id: string }) {
  const collection = collections.find(c => c.id === id);
  const collectionProducts = products.filter(p => p.collection === collection?.name);
  const relatedCollections = collections.filter(c => c.id !== id).slice(0, 3);

  if (!collection) {
    return <div className="text-white text-center py-20 font-serif text-2xl">Collection not found</div>;
  }

  return (
    <>
      <PageBanner
        title={collection.name}
        subtitle={collection.tagline}
        breadcrumbs={[
          { label: 'Collections', href: '/collections' },
          { label: collection.name }
        ]}
        backgroundImage={collection.image || '/images/hero/hero-main.jpg'}
      />

      <div className="min-h-screen bg-ink-950 text-ink-50 py-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          {/* Description */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 items-center">
            <div>
              <h2 className="font-serif text-4xl text-gold-300 mb-6">The Essence of {collection.name}</h2>
              <p className="text-ink-300 leading-relaxed text-lg">
                {collection.description || 'Discover a collection that redefines elegance. Crafted with the finest materials and an unwavering attention to detail, these pieces are designed to be cherished for a lifetime.'}
              </p>
            </div>
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
              <RevealImage
                src={collection.image || '/images/collections/heritage.jpg'}
                alt={collection.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Products Grid */}
          <div className="mb-32">
            <h2 className="font-serif text-3xl text-gold-100 mb-12 text-center">Featured Pieces</h2>
            {collectionProducts.length > 0 ? (
              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {collectionProducts.map((product) => (
                  <StaggerItem key={product.id}>
                    <Link href="#">
                      <MotionCard className="group h-full cursor-pointer bg-ink-900 border border-ink-800 rounded-xl overflow-hidden hover:border-gold-500/30 transition-all">
                        <div className="relative aspect-square bg-ink-950 p-6">
                          <RevealImage
                            src={product.image || '/images/products/ring.jpg'}
                            alt={product.name}
                            className="w-full h-full object-contain mix-blend-screen group-hover:scale-105 transition-transform duration-700"
                          />
                          <Badge variant="default" className="absolute top-4 left-4 border-gold-700 text-gold-300 bg-black/50 backdrop-blur-md">
                            {product.category || 'Jewellery'}
                          </Badge>
                        </div>
                        <div className="p-6">
                          <h3 className="font-serif text-xl text-gold-100 mb-2 truncate">{product.name}</h3>
                          <p className="text-ink-400 text-sm mb-4">{product.metal}</p>
                          <p className="text-gold-300 text-lg">${product.price?.toLocaleString()}</p>
                        </div>
                      </MotionCard>
                    </Link>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            ) : (
              <div className="text-center py-20 border border-ink-800 rounded-2xl bg-ink-900/50">
                <h3 className="font-serif text-2xl text-gold-300 mb-4">Masterpieces in Progress</h3>
                <p className="text-ink-300">New creations for this collection are coming soon.</p>
              </div>
            )}
          </div>

          {/* Related Collections */}
          <div>
            <h2 className="font-serif text-3xl text-gold-100 mb-12 text-center">Explore More</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {relatedCollections.map((rel) => (
                <Link key={rel.id} href={`/collections/${rel.id}`}>
                  <MotionCard className="group relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer">
                    <RevealImage
                      src={rel.image || '/images/collections/everyday.jpg'}
                      alt={rel.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                      <h4 className="font-serif text-xl text-gold-300 mb-1">{rel.name}</h4>
                      <p className="text-xs uppercase tracking-widest text-ink-300 group-hover:text-gold-500 transition-colors">
                        Discover
                      </p>
                    </div>
                  </MotionCard>
                </Link>
              ))}
            </div>
            <div className="text-center">
              <CTAButton variant="secondary" href="/collections" showArrow>
                Explore All Collections
              </CTAButton>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
