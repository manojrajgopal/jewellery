'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { StaggerContainer, StaggerItem } from '@/components/animations/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import MotionCard from '@/components/motion/MotionCard';
import ParticleField from '@/components/motion/ParticleField';
import GoldBorderTrace from '@/components/motion/GoldBorderTrace';
import CTAButton from '@/components/ui/CTAButton';
import { collections } from '@/data/collections';
import { products } from '@/data/products';

export default function CollectionsSection() {
  const display = collections.slice(0, 6);

  // Piece counts come from the catalogue rather than a hardcoded '12'.
  const countFor = (id: string) =>
    products.filter((p) => p.collection === id).length || undefined;

  return (
    <section id="collections" className="relative overflow-hidden bg-canvas py-24 md:py-32">
      <ParticleField count={30} rise link linkDistance={140} />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our World"
          title="Curated Collections"
          highlightWords={['Curated']}
          subtitle="Discover worlds of beauty, where every collection tells a unique story of inspiration, craftsmanship, and timeless elegance."
          align="center"
          className="mb-16"
        />

        <StaggerContainer
          staggerChildren={0.12}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8"
        >
          {display.map((collection, idx) => {
            const count = collection.itemCount ?? countFor(collection.id);

            return (
              <StaggerItem key={collection.id}>
                <Link
                  href={`/collections/${collection.id}`}
                  data-cursor="Explore"
                  className="block h-full"
                >
                  <GoldBorderTrace borderRadius="1rem" className="block h-full">
                    <MotionCard
                      className="group relative aspect-[3/4] h-full overflow-hidden rounded-2xl"
                      tiltAmount={7}
                    >
                      <Image
                        src={collection.image}
                        alt={collection.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-[1200ms] ease-luxury group-hover:scale-110"
                        priority={idx < 3}
                      />

                      {/* Legibility scrim, deepening on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/25 to-transparent transition-opacity duration-700 group-hover:from-black/95" />
                      {/* Warm wash */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-gold-800/40 to-transparent opacity-0 mix-blend-overlay transition-opacity duration-700 group-hover:opacity-100" />

                      {/* Corner affordance */}
                      <span className="absolute right-5 top-5 z-20 flex h-10 w-10 -translate-y-2 items-center justify-center rounded-full border border-white/25 bg-black/30 text-white opacity-0 backdrop-blur-md transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                        <ArrowUpRight size={16} />
                      </span>

                      <div className="absolute inset-x-0 bottom-0 z-20 flex translate-y-5 flex-col justify-end p-7 transition-transform duration-700 ease-luxury group-hover:translate-y-0">
                        <span className="mb-2 block h-px w-10 origin-left scale-x-0 bg-gold-400 transition-transform duration-700 delay-100 group-hover:scale-x-100" />

                        <div className="mb-2 flex items-end justify-between gap-3">
                          <h3 className="font-display text-2xl text-white">{collection.name}</h3>
                          {count && (
                            <span className="whitespace-nowrap font-accent text-[10px] uppercase tracking-luxe text-gold-300">
                              {count} {count === 1 ? 'Piece' : 'Pieces'}
                            </span>
                          )}
                        </div>

                        <p className="font-sans text-sm font-light leading-relaxed text-white/75 opacity-0 transition-opacity duration-500 delay-150 group-hover:opacity-100">
                          {collection.tagline ?? collection.description}
                        </p>

                        {/* Hairline that travels the base edge while hovered */}
                        <span
                          aria-hidden="true"
                          className="mt-4 block h-px w-full origin-left scale-x-0 bg-gradient-to-r from-gold-300 via-gold-500 to-transparent transition-transform duration-[900ms] ease-luxury group-hover:scale-x-100"
                        />
                      </div>
                    </MotionCard>
                  </GoldBorderTrace>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-16 flex justify-center"
        >
          <CTAButton variant="ghost" size="md" href="/collections" showArrow>
            Browse every collection
          </CTAButton>
        </motion.div>
      </div>
    </section>
  );
}
