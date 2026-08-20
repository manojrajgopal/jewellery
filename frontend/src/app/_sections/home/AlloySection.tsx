'use client';

import SectionHeading from '@/components/ui/SectionHeading';
import CTAButton from '@/components/ui/CTAButton';
import AlloyMixer from '@/components/ui/AlloyMixer';
import GranulationSwarm from '@/components/motion/GranulationSwarm';

/**
 * What gold is actually made of.
 *
 * Second in the atelier run, after the drawing and before the forge, which is
 * the true order: you decide the numbers, then you decide the metal, then you
 * make it. It is also the point on the page where a customer's single most
 * confidently held belief turns out to be wrong — that a higher karat is a
 * better ring. Karat is a mixing ratio and nothing else, every step up it costs
 * hardness, and the quarter of an 18K ring that is *not* gold decides its
 * colour, its durability and whether the person wearing it reacts to it.
 *
 * The granulation field underneath is here rather than in the forge section for
 * a reason that is not decorative. Granulation is the one process in the whole
 * craft that depends entirely on the alloy: it works because a trace of copper
 * forms a eutectic skin at a temperature about thirty degrees below the melting
 * point of the gold, and it will not work at all in a metal that has no copper
 * in it. It is the argument of the section above, performed.
 */
export default function AlloySection() {
  return (
    <section id="alloy" className="relative overflow-hidden bg-canvas-alt py-24 md:py-32">
      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
        <SectionHeading
          eyebrow="The other quarter"
          title="Nobody has ever owned a pure gold ring"
          highlightWords={['pure']}
          subtitle="Fine gold is soft enough to mark with a fingernail. Everything anybody wears is a mixture, and the metals that are not gold decide the colour, the hardness and whether your skin agrees with it. Karat is a ratio, not a grade."
          align="center"
          className="mb-16"
        />

        <AlloyMixer />

        <div className="mt-24 border-t border-line-subtle pt-16">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:items-center">
            <div>
              <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
                Why the mixture matters
              </p>
              <h3 className="mt-4 font-display text-3xl leading-[1.12] text-primary md:text-4xl">
                Granulation only works because of the copper.
              </h3>
              <p className="mt-5 font-sans text-sm font-light leading-relaxed text-muted">
                Beads of gold fused to a surface with no solder at all. The trick
                is a trace of copper, which forms an alloy skin at around thirty
                degrees below the melting point of the metal — so the bead welds
                itself to the ground in a window a few seconds wide, and thirty
                degrees further on the whole pattern is a puddle.
              </p>
              <p className="mt-4 font-sans text-sm font-light leading-relaxed text-muted">
                The Etruscans had it three thousand years ago. It was then lost
                for most of two millennia, because the recipe is in the alloy
                rather than in the hand, and a technique nobody can write down
                does not survive a bad generation.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <CTAButton variant="secondary" href="/craftsmanship" size="sm" showArrow>
                  Inside the workshop
                </CTAButton>
                <CTAButton variant="ghost" href="/care" size="sm">
                  What your skin reacts to
                </CTAButton>
              </div>
            </div>

            <GranulationSwarm count={240} pattern="rosette" height={420} />
          </div>
        </div>
      </div>
    </section>
  );
}
