'use client';

import SectionHeading from '@/components/ui/SectionHeading';
import CTAButton from '@/components/ui/CTAButton';
import DeckShuffle, { type DeckCard } from '@/components/motion/DeckShuffle';
import RackFocusPlates, { type FocusPlate } from '@/components/motion/RackFocusPlates';
import GoldDivider from '@/components/ui/GoldDivider';
import LightLeakOverlay from '@/components/motion/LightLeakOverlay';
import BokehDrift from '@/components/motion/BokehDrift';
import { collections } from '@/data/collections';

/**
 * The house's own hand: six collections dealt as cards, then one shot that pulls
 * focus between the three rooms they are made in.
 *
 * Placed in the atelier run rather than in the browsing run, and deliberately so.
 * By this point a visitor has already been shown the collections as a grid, as a
 * coverflow rail and as a passing vitrine — three ways of looking *at* them. This
 * is the first that hands them over as objects to be picked up and put down, and
 * that gesture only means something once the looking is done.
 *
 * The rack focus underneath is the counterpart: three plates, one sharp at a
 * time, pulled by the scroll. It is the only focus pull on the home page.
 */

/** Enough of the catalogue to be a hand rather than a pair. */
const CARDS: DeckCard[] = collections.slice(0, 6).map((c) => ({
  id: c.id,
  title: c.name,
  meta: c.tagline ?? 'The house',
  image: c.image,
  note: c.description,
}));

const PLATES: FocusPlate[] = [
  {
    src: '/images/hero/craftsmanship.jpg',
    alt: 'A jeweller working at the bench',
    caption: 'The bench, where a piece spends most of its life before it is a piece.',
    mark: 'Bench',
  },
  {
    src: '/images/collections/heritage.jpg',
    alt: 'Heritage pieces laid out on velvet',
    caption: 'The archive, which is the only reason we can still repair something from 1940.',
    mark: 'Archive',
  },
  {
    src: '/images/hero/hero-main.jpg',
    alt: 'The showroom floor under evening light',
    caption: 'The floor, which is the last room a piece sees and the first one you do.',
    mark: 'Floor',
  },
];

export default function CabinetSection() {
  return (
    <section
      id="cabinet"
      className="relative overflow-hidden border-y border-hairline bg-canvas-alt/40 py-24 md:py-32"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <BokehDrift count={16} intensity={0.35} speed={0.6} blades={5} />
        <LightLeakOverlay intensity={0.3} interval={11} onClick />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
        <SectionHeading
          eyebrow="The Hand"
          title="Six, dealt rather than displayed"
          highlightWords={['dealt']}
          subtitle="You have seen these arranged, rolling past, and stacked. Here they are as a hand of cards — cut the deck, or throw the top one aside. It is the same six collections and an entirely different relationship to them."
          align="center"
          className="mb-14"
        />

        <DeckShuffle cards={CARDS} />

        <GoldDivider variant="jewel" className="my-20" />

        <div className="mb-12 text-center">
          <p className="mb-4 font-accent text-[10px] uppercase tracking-luxest text-accent">
            Three rooms, one lens
          </p>
          <h3 className="mx-auto max-w-2xl font-display text-2xl font-light leading-snug text-primary md:text-3xl">
            Pull focus through the house
          </h3>
          <p className="mx-auto mt-4 max-w-xl font-sans text-sm font-light leading-relaxed text-muted">
            Scroll and the focus travels from the bench to the archive to the floor. Or take the
            ring yourself and hold it wherever you like.
          </p>
        </div>

        <RackFocusPlates plates={PLATES} frameClassName="aspect-[16/9]" />

        <div className="mt-14 flex flex-wrap justify-center gap-4">
          <CTAButton variant="primary" size="md" href="/collections" showArrow>
            All six, properly
          </CTAButton>
          <CTAButton variant="secondary" size="md" href="/craftsmanship">
            Inside the atelier
          </CTAButton>
        </div>
      </div>
    </section>
  );
}
