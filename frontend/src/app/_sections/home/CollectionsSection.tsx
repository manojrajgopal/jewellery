'use client';

import Image from 'next/image';
import Link from 'next/link';
import { StaggerContainer, StaggerItem } from '@/components/animations/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import MotionCard from '@/components/motion/MotionCard';
import GoldBorderTrace from '@/components/motion/GoldBorderTrace';
import { collections } from '@/data/collections';

export default function CollectionsSection() {
  const displayCollections = collections.slice(0, 6);

  return (
    <section id="collections" className="py-24 bg-ink-950 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeading
          eyebrow="OUR WORLD"
          title="Curated Collections"
          highlightWords={['Curated']}
          subtitle="Discover worlds of beauty, where every collection tells a unique story of inspiration, craftsmanship, and timeless elegance."
          align="center"
          className="mb-16"
        />

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {displayCollections.map((collection, idx) => (
            <StaggerItem key={collection.id || idx}>
              <Link href={`/collections/${collection.id}`}>
                <GoldBorderTrace borderRadius="1rem" className="h-full block">
                  <MotionCard className="relative aspect-[3/4] rounded-2xl overflow-hidden group h-full">
                    <Image
                      src={collection.image}
                      alt={collection.name}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-500" />
                    
                    <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                      <div className="flex justify-between items-end mb-2">
                        <h3 className="font-display text-2xl text-white">{collection.name}</h3>
                        <span className="font-accent text-xs tracking-widest text-gold-500 uppercase">
                          {collection.itemCount || 12} Pieces
                        </span>
                      </div>
                      <p className="text-white/70 text-sm font-body opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        {collection.tagline || collection.description || 'Explore the exquisite craftsmanship of this collection.'}
                      </p>
                    </div>
                  </MotionCard>
                </GoldBorderTrace>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
