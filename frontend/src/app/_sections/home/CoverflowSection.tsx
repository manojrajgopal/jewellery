'use client';

import { motion } from 'framer-motion';

import Coverflow3D, { type CoverflowItem } from '@/components/motion/Coverflow3D';
import OrbitShowcase, { type OrbitItem } from '@/components/motion/OrbitShowcase';
import SectionHeading from '@/components/ui/SectionHeading';
import DiamondSparkles from '@/components/motion/DiamondSparkles';
import { collections } from '@/data/collections';
import { products } from '@/data/products';

/**
 * Two ways of browsing the same catalogue, one after the other: a coverflow rail
 * for the collections, and an orbit of individual pieces around a still centre.
 *
 * Both are drag- and keyboard-driven rather than autoplay-only, because this is
 * where a visitor stops skimming and starts choosing.
 */
export default function CoverflowSection() {
  const items: CoverflowItem[] = collections.map((collection) => ({
    id: collection.id,
    title: collection.name,
    subtitle: collection.description.split('.')[0],
    meta: collection.tagline,
    image: collection.image,
    href: `/collections/${collection.id}`,
  }));

  // Pieces with their own photography, capped at eight so the ring does not
  // crowd — beyond that the nodes start to touch at tablet widths.
  const orbit: OrbitItem[] = products
    .filter((p) => p.images?.[0])
    .slice(0, 8)
    .map((p) => ({
      id: p.id,
      label: p.name,
      image: p.images![0],
      href: `/collections/${p.collection}`,
    }));

  return (
    <section
      id="coverflow"
      className="relative overflow-hidden bg-canvas-alt py-24 md:py-32"
    >
      <DiamondSparkles density={28} shape="dot" className="z-[1]" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gold-mesh opacity-50"
      />

      <div className="relative z-10">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <SectionHeading
            eyebrow="The Cabinet"
            title="Six houses under one roof"
            subtitle="Drag, click a neighbour, or use the arrow keys — each collection answers a different occasion."
            highlightWords={['Six']}
            className="mb-14"
          />
        </div>

        <Coverflow3D items={items} className="mx-auto max-w-6xl px-6" autoplay />

        {/* ---- Orbit of individual pieces ---- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-12%' }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-28 px-6"
        >
          <OrbitShowcase items={orbit} size={520} duration={54}>
            <div className="max-w-[9rem] text-center">
              <span className="font-accent text-[9px] uppercase tracking-luxer text-accent">
                In Rotation
              </span>
              <p className="mt-2 font-display text-xl font-light leading-tight text-primary">
                This season&apos;s most requested
              </p>
            </div>
          </OrbitShowcase>
        </motion.div>
      </div>
    </section>
  );
}
