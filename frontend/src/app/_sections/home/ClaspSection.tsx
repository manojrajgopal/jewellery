'use client';

import SectionHeading from '@/components/ui/SectionHeading';
import CTAButton from '@/components/ui/CTAButton';
import ClaspLibrary from '@/components/ui/ClaspLibrary';
import GravityChainRail from '@/components/motion/GravityChainRail';

/**
 * The fastening.
 *
 * Placed in the atelier run, immediately after the bench is introduced by name,
 * because this is the most bench-side subject on the whole page: a clasp is not a
 * design decision, it is an engineering one, and the person who decides it is a
 * goldsmith rather than a designer.
 *
 * It is also the honest answer to a question the site has not asked anywhere
 * else. Every other section here is about what a piece looks like. This one is
 * about whether it gets worn — and the reason a necklace ends up in a drawer is
 * almost never the necklace. It is a spring ring that somebody cannot fasten
 * behind their own neck.
 *
 * The chain across the top swings with the page's own scroll velocity, which is
 * the only decoration in the section and is doing real work: it establishes that
 * the subject is a physical object under load before a single word is read.
 */
export default function ClaspSection() {
  return (
    <section id="clasps" className="relative overflow-hidden bg-canvas-alt py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        {/* The chain, hung between two posts, with the four things a clasp is
            judged on hanging off it. */}
        <GravityChainRail
          className="mb-14"
          links={48}
          sag={0.19}
          height={240}
          charms={[
            { at: 0.2, label: 'Holds' },
            { at: 0.42, label: 'Alone' },
            { at: 0.62, label: 'Hides' },
            { at: 0.84, label: 'Mends' },
          ]}
        />

        <SectionHeading
          eyebrow="The Part Nobody Asks About"
          title="A necklace is not put away because of the necklace"
          highlightWords={['necklace.']}
          subtitle="Six fastenings, drawn open and closed, with the four things that actually differ between them. One of them is the answer for arthritic hands and it is almost never offered unless a customer knows to ask — which is a failure of this trade rather than of the customer."
        />

        <div className="mt-16">
          <ClaspLibrary />
        </div>

        <div className="mt-14 grid gap-8 rounded-2xl border border-hairline bg-surface-raised/40 p-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:p-8">
          <p className="font-display text-xl italic leading-snug text-primary md:text-2xl">
            Every clasp we fit can be changed for any other on this list, on any piece, at any
            time — including one we did not make.
          </p>
          <div className="flex flex-wrap gap-4">
            <CTAButton variant="secondary" href="/care" size="sm" showArrow>
              The care bench
            </CTAButton>
            <CTAButton variant="ghost" href="/contact" size="sm">
              Ask for a change
            </CTAButton>
          </div>
        </div>
      </div>
    </section>
  );
}
