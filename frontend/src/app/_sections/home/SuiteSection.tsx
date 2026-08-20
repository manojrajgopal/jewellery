'use client';

import SectionHeading from '@/components/ui/SectionHeading';
import CTAButton from '@/components/ui/CTAButton';
import WeddingSuiteBuilder from '@/components/ui/WeddingSuiteBuilder';
import SolderWeldPath from '@/components/motion/SolderWeldPath';

/**
 * The band that has to live beside the ring for the next fifty years.
 *
 * Placed straight after the commission section, because that is where somebody
 * has just drawn a ring and chosen a head height — and the head height they
 * chose has already decided which bands are available to them, which nobody
 * mentions until a year later when the second ring is being bought, often
 * somewhere else.
 *
 * The three joins beside it are the reason this is not simply a compatibility
 * table. A band shaped to fit a ring is a bench operation with a seam in it, and
 * showing the seam being made is the difference between "we can shape it" and
 * knowing what shaping it means.
 */
export default function SuiteSection() {
  return (
    <section id="suite" className="relative overflow-hidden bg-canvas py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="The Second Ring"
          title="The head height you choose today decides next year's band"
          highlightWords={["year's"]}
          subtitle="An engagement ring is bought alone. The band arrives a year later, often from somewhere else, and the pair either sit flush or they do not — a fact settled entirely by a millimetre figure nobody was ever told. Here it is, in cross-section, before it matters."
        />

        <div className="mt-16">
          <WeddingSuiteBuilder />
        </div>

        {/* What shaping actually involves. Three joins, each welded as it is
            scrolled to, because the answer to a gap is a seam. */}
        <div className="mt-20">
          <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
            And what closing a gap actually is
          </p>
          <p className="mt-3 max-w-2xl font-sans text-sm font-light leading-relaxed text-secondary">
            Shaping a band to a ring is not a setting on a machine. It is metal cut, bent to a
            contour taken off the ring itself, and closed with a seam that then has to be filed
            flush and polished until it cannot be found. Three of the joins that go into it:
          </p>

          <div className="mt-10 grid gap-10 sm:grid-cols-3">
            <SolderWeldPath join="ring" duration={2.6} />
            <SolderWeldPath join="bezel" duration={2.2} />
            <SolderWeldPath join="claw" duration={2.9} />
          </div>
        </div>

        <div className="mt-16 flex flex-wrap gap-4">
          <CTAButton variant="secondary" href="/bespoke" size="sm" showArrow>
            Draw the pair together
          </CTAButton>
          <CTAButton variant="ghost" href="/craftsmanship" size="sm">
            Watch the bench
          </CTAButton>
        </div>
      </div>
    </section>
  );
}
