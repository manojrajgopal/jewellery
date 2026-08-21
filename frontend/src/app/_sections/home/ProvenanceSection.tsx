'use client';

import SectionHeading from '@/components/ui/SectionHeading';
import CTAButton from '@/components/ui/CTAButton';
import PressWall from '@/components/ui/PressWall';
import RippleGrid from '@/components/motion/RippleGrid';

/**
 * The press, as the outside verification of the house's claims.
 *
 * This section once paired a provenance custody map with the third-party press wall.
 * The custody map is owned by /gemstones (the stone library, where the provenance chain
 * belongs alongside the stones it certifies), so it was removed here to avoid running the
 * same tool on two pages. What is unique to this section — the third-party audits and
 * awards, the evidence that a claim is worth what someone outside the house will put their
 * name to — was kept, and the section now lives on /about beside the rest of the history.
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
          eyebrow="Verified From Outside"
          title="A claim is worth what someone will put their name to"
          highlightWords={['name']}
          subtitle="Custody and craft are only as good as the willingness of people outside the house to audit them. These are the third parties that have — the certifications, the memberships and the awards that stand behind everything above."
          align="center"
          className="mb-16"
        />

        <PressWall />

        <div className="mt-14 flex flex-wrap justify-center gap-4">
          <CTAButton variant="primary" size="md" href="/gemstones" showArrow>
            The provenance chain
          </CTAButton>
          <CTAButton variant="secondary" size="md" href="/craftsmanship">
            Inside the atelier
          </CTAButton>
        </div>
      </div>
    </section>
  );
}
