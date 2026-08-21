'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

import HorizontalScrollScene from '@/components/motion/HorizontalScrollScene';
import GodRays from '@/components/motion/GodRays';
import { collections } from '@/data/collections';

/**
 * The vitrine: collections passing sideways as the page scrolls down, the way a
 * display case slides past when you walk a showroom.
 *
 * Panels alternate in height so the rail has a rhythm rather than reading as a
 * row of identical tiles.
 */
export default function VitrineSection() {
  const panels = collections.slice(0, 6);

  return (
    <HorizontalScrollScene
      id="vitrine"
      travel={1}
      backdrop={<GodRays intensity="soft" originX={8} parallax={false} />}
      heading={
        <div className="max-w-md">
          <div className="mb-4 flex items-center gap-4">
            <span className="font-accent text-[10px] uppercase tracking-luxest text-accent">
              The Vitrine
            </span>
            <span className="h-px w-16 bg-gradient-to-r from-gold-400/70 to-transparent" />
          </div>
          <h2 className="font-display text-3xl font-light leading-tight text-primary md:text-5xl">
            Walk the <span className="italic text-accent">cabinet</span>
          </h2>
        </div>
      }
    >
      {panels.map((collection, i) => {
        // Alternating heights, offset vertically — a straight row of equal
        // plates reads as a table, not a display case.
        const tall = i % 2 === 0;

        return (
          <motion.article
            key={collection.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className={`group relative z-10 w-[72vw] flex-shrink-0 sm:w-[46vw] lg:w-[30vw] ${
              tall ? 'h-[62svh] self-start' : 'h-[52svh] self-end'
            }`}
          >
            <Link
              href={`/collections/${collection.id}`}
              data-cursor="View"
              className="relative block h-full w-full overflow-hidden rounded-2xl border border-hairline shadow-cinema"
            >
              <Image
                src={collection.image}
                alt={collection.name}
                fill
                sizes="(max-width: 640px) 72vw, (max-width: 1024px) 46vw, 30vw"
                className="object-cover transition-transform duration-[1400ms] ease-luxury group-hover:scale-[1.08]"
              />

              {/* Veil + a sheen that sweeps on hover */}
              <div className="media-veil-soft absolute inset-0" />
              <div className="sweep-hover absolute inset-0" />

              {/* Hairline frame that draws in */}
              <span className="pointer-events-none absolute inset-4 rounded-lg border border-on-media opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

              {/* Index */}
              <span className="absolute right-5 top-5 font-display text-4xl font-light text-on-media/25 tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>

              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                {collection.tagline && (
                  <span className="mb-2.5 inline-block font-accent text-[9px] uppercase tracking-luxer text-accent">
                    {collection.tagline}
                  </span>
                )}

                <h3 className="font-display text-2xl font-light leading-tight text-on-media md:text-3xl">
                  {collection.name}
                </h3>

                {/* Rule that unfurls under the title on hover */}
                <span className="mt-3 block h-px w-full origin-left scale-x-0 bg-gradient-to-r from-accent to-transparent transition-transform duration-700 ease-luxury group-hover:scale-x-100" />

                <span className="mt-4 inline-flex items-center gap-2 font-accent text-[10px] uppercase tracking-luxe text-on-media-soft opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  Explore
                  <ArrowUpRight size={13} strokeWidth={1.8} className="text-accent" />
                </span>
              </div>
            </Link>
          </motion.article>
        );
      })}

      {/* Closing card — the rail should end on an invitation, not a hard stop */}
      <div className="relative z-10 flex h-[52svh] w-[70vw] flex-shrink-0 flex-col items-start justify-center gap-5 self-center pr-6 sm:w-[40vw] lg:w-[26vw]">
        <span className="font-accent text-[10px] uppercase tracking-luxest text-accent">
          End of Cabinet
        </span>
        <h3 className="font-display text-3xl font-light leading-tight text-primary md:text-4xl">
          Every piece has a <span className="italic text-accent">certificate</span>, and a story
        </h3>
        <p className="max-w-xs font-sans text-sm font-light leading-relaxed text-muted">
          Book a private viewing and we will lay out whatever caught your eye, on velvet, under
          proper light.
        </p>
        <Link
          href="/book-appointment"
          className="link-underline mt-1 inline-flex items-center gap-2 font-accent text-[11px] uppercase tracking-luxe text-accent"
        >
          Book a viewing
          <ArrowUpRight size={14} strokeWidth={1.8} />
        </Link>
      </div>
    </HorizontalScrollScene>
  );
}
