'use client';

import SectionHeading from '@/components/ui/SectionHeading';
import CTAButton from '@/components/ui/CTAButton';
import MoodboardCanvas from '@/components/ui/MoodboardCanvas';
import CareRitual from '@/components/ui/CareRitual';
import NecklaceLengthGuide from '@/components/ui/NecklaceLengthGuide';
import GoldDivider from '@/components/ui/GoldDivider';
import RippleGrid from '@/components/motion/RippleGrid';

/**
 * The visitor's own working space: the board they arrange, plus the two guides they
 * reach for while arranging it.
 *
 * The board is built from the wishlist rather than from its own collection, so anything
 * saved anywhere on the site is already on it. That is why this section can sit near the
 * end of the page and still have something in it — by this point in a visit, most people
 * have saved something.
 */
export default function MoodboardSection() {
  return (
    <section
      id="moodboard"
      className="relative overflow-hidden border-y border-hairline bg-surface-raised/30 py-24 md:py-32"
    >
      <RippleGrid spacing={50} reach={190} dot={1} />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
        <SectionHeading
          eyebrow="Your Board"
          title="Arrange them into an argument"
          highlightWords={['argument']}
          subtitle="Everything you have saved, on velvet, in whatever order makes the case. The layout is kept in this browser as proportions, so bring it up on a tablet at the boutique and we will work from it."
          align="center"
          className="mb-14"
        />

        <MoodboardCanvas height={540} />

        <GoldDivider variant="jewel" className="my-20" />

        <div className="mb-14 text-center">
          <p className="mb-4 font-accent text-[10px] uppercase tracking-luxest text-accent">
            While You Are Deciding
          </p>
          <h3 className="mx-auto max-w-2xl font-display text-2xl font-light leading-snug text-primary md:text-3xl">
            The two things people ask before they commit
          </h3>
          <p className="mx-auto mt-4 max-w-xl font-sans text-sm font-light leading-relaxed text-muted">
            Whether they can wear it every day, and where it will actually sit. Both answered
            here rather than at the counter.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <CareRitual />
          <NecklaceLengthGuide />
        </div>

        <div className="mt-14 flex flex-wrap justify-center gap-4">
          <CTAButton variant="primary" size="md" href="/care" showArrow>
            The full care guide
          </CTAButton>
          <CTAButton variant="secondary" size="md" href="/collections">
            Save a few more
          </CTAButton>
        </div>
      </div>
    </section>
  );
}
