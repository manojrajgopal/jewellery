'use client';

import { collections } from '@/data/collections';
import SpiralGalleryScene, { type SpiralItem } from '@/components/motion/SpiralGalleryScene';
import CanvasGemRain from '@/components/motion/CanvasGemRain';
import CTAButton from '@/components/ui/CTAButton';

/**
 * The collections on a helix — approached one at a time rather than displayed
 * together.
 *
 * This is the fourth way the page shows the six collections, and it exists
 * because the other three all show them *simultaneously*: the collections grid
 * lays them out, the coverflow rail turns them past each other, and the vitrine
 * scene passes them sideways. Every one of those invites comparison, which is the
 * right thing to do while somebody is browsing and the wrong thing to do at the
 * end of the page, once they have read the whole argument and are choosing.
 *
 * A helix cannot be compared. Each plate is met, held for a moment at the front
 * of the turn, and then passed — so the visitor arrives at exactly one collection
 * at a time and reads its line without the other five in the frame. That is the
 * difference between a shop window and a room somebody walks you through.
 *
 * It sits late, after the styling and services run, as the last look at the
 * catalogue before the page turns to arranging a visit.
 */

/** The collection's own line, cut to the length a plate on a helix can carry. */
const items: SpiralItem[] = collections.map((collection) => ({
  id: collection.id,
  title: collection.name,
  note: collection.description.split('. ')[0].concat('.'),
  image: collection.image,
  href: `/collections/${collection.slug ?? collection.id}`,
}));

export default function HelixSection() {
  return (
    <section id="helix" className="relative overflow-hidden bg-canvas-alt">
      {/* A slow fall of cut stones behind the whole scene, at four depths. It
          runs across the pinned section rather than inside it, so the helix
          appears to travel through the field rather than in front of it. */}
      <CanvasGemRain count={26} speed={38} part={150} className="opacity-60" />

      <div className="relative mx-auto max-w-6xl px-6 pt-24 md:pt-32">
        <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
          One At A Time
        </p>
        <h2 className="mt-4 max-w-3xl font-display text-4xl leading-tight text-primary md:text-5xl">
          The last look, with the other five out of the frame
        </h2>
        <p className="mt-5 max-w-2xl font-sans text-sm font-light leading-relaxed text-secondary">
          Everything above this invited you to compare. This does the opposite — the six
          collections are threaded onto one axis and met singly, which is how they are actually
          shown to somebody standing in the room.
        </p>
      </div>

      <SpiralGalleryScene items={items} length={3.4} turns={1.7} radius={0.29} />

      <div className="relative mx-auto max-w-6xl px-6 pb-24 md:pb-32">
        <div className="flex flex-wrap gap-4">
          <CTAButton variant="primary" href="/collections" size="md" showArrow>
            All six, laid out
          </CTAButton>
          <CTAButton variant="ghost" href="/lookbook" size="md">
            Or bound as a lookbook
          </CTAButton>
        </div>
      </div>
    </section>
  );
}
