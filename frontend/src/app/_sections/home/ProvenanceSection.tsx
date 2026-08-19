'use client';

import SectionHeading from '@/components/ui/SectionHeading';
import CTAButton from '@/components/ui/CTAButton';
import ProvenanceMap from '@/components/ui/ProvenanceMap';
import PressWall from '@/components/ui/PressWall';
import GoldDivider from '@/components/ui/GoldDivider';
import RippleGrid from '@/components/motion/RippleGrid';

/**
 * Provenance and the press, in one section.
 *
 * Paired on purpose. A claim about custody is worth exactly as much as the willingness
 * of someone outside the house to verify it, so the chain and the third-party audits sit
 * on the same screen — the awards are the evidence for the diagram above them, not a
 * separate boast.
 */
export default function ProvenanceSection() {
  return (
    <section
      id="provenance"
      className="relative overflow-hidden border-y border-hairline bg-surface-raised/30 py-24 md:py-32"
    >
      <RippleGrid spacing={48} reach={200} dot={1} />

      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
        <SectionHeading
          eyebrow="Where It Came From"
          title="Five stops, and a check at every one"
          highlightWords={['check']}
          subtitle="Custody rather than geography. Each stop names what is verified there, and the passport shipped with the piece reproduces the whole chain."
          align="center"
          className="mb-16"
        />

        <ProvenanceMap />

        <GoldDivider variant="jewel" className="my-20" />

        <div className="mb-14 text-center">
          <p className="mb-4 font-accent text-[10px] uppercase tracking-luxest text-accent">
            Verified From Outside
          </p>
          <h3 className="mx-auto max-w-2xl font-display text-2xl font-light leading-snug text-primary md:text-3xl">
            A claim is worth what someone outside the house will put their name to
          </h3>
        </div>

        <PressWall />

        <div className="mt-14 flex flex-wrap justify-center gap-4">
          <CTAButton variant="primary" size="md" href="/about" showArrow>
            The whole history
          </CTAButton>
          <CTAButton variant="secondary" size="md" href="/gemstones">
            The stone library
          </CTAButton>
        </div>
      </div>
    </section>
  );
}
