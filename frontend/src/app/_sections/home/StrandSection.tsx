'use client';

import SectionHeading from '@/components/ui/SectionHeading';
import CTAButton from '@/components/ui/CTAButton';
import PearlKnotSequence from '@/components/motion/PearlKnotSequence';
import VelvetPileSweep from '@/components/motion/VelvetPileSweep';

/**
 * The knots, and the cloth underneath.
 *
 * Placed immediately after the fastenings, because these are the same subject
 * from the other end: a clasp is how a necklace is closed and a knot is how it
 * survives being open. Both are engineering rather than design, both are
 * decided by a bench rather than a designer, and both are the reason a piece is
 * either worn for fifty years or put in a drawer after two.
 *
 * The velvet at the foot is not decoration either, though it is the only thing
 * on the page that exists to be touched. Velvet is the surface every jeweller
 * in the world has displayed on for four hundred years, and the reason is
 * optical: a pile fabric absorbs nearly all the light that hits it, so there is
 * no competing highlight anywhere in the frame and a stone on it looks brighter
 * than the same stone on silk. It also takes a mark and gives it back over
 * several seconds, which is why a display tray in a good shop is brushed in one
 * direction before it goes out — and why yours arrives that way.
 */
export default function StrandSection() {
  return (
    <section id="strand" className="relative overflow-hidden bg-canvas-alt py-24 md:py-32">
      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
        <SectionHeading
          eyebrow="Between every pearl"
          title="The knots are not decoration and never were"
          highlightWords={['decoration']}
          subtitle="Two reasons, and nobody is ever given either of them. A broken knotted strand loses one pearl. And nacre is softer than the fingernail you test it with, so pearls resting against each other wear their own drill holes oval in about a decade."
          align="left"
          className="mb-14"
        />

        <PearlKnotSequence pearls={19} />

        {/* The cloth. */}
        <div className="mt-24 border-t border-line-subtle pt-16">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:items-center">
            <div>
              <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
                And the tray it is laid on
              </p>
              <h3 className="mt-4 font-display text-3xl leading-[1.14] text-primary md:text-4xl">
                Velvet is not a colour. It is an optical decision.
              </h3>
              <p className="mt-5 font-sans text-sm font-light leading-relaxed text-muted">
                A pile fabric is a forest of short upright fibres, and it
                swallows almost all the light that lands on it. That is the whole
                reason every jeweller in the world displays on it: with no
                competing highlight anywhere in the frame, a stone looks brighter
                on velvet than it does on anything else in the building.
              </p>
              <p className="mt-4 font-sans text-sm font-light leading-relaxed text-muted">
                It also remembers. Brush it one way and the pile lies down and
                goes pale; brush it back and it darkens again. Sweep the panel
                and it will hold your hand for a few seconds before it stands
                back up.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <CTAButton variant="secondary" href="/care" size="sm" showArrow>
                  Restringing and care
                </CTAButton>
                <CTAButton variant="ghost" href="/collections" size="sm">
                  The strands we keep
                </CTAButton>
              </div>
            </div>

            <VelvetPileSweep height={400}>
              <div className="flex h-full flex-col items-center justify-center gap-4 px-8 text-center">
                <p className="font-display text-2xl italic leading-snug text-on-media md:text-3xl">
                  Four hundred years of shopkeepers, all of whom worked out the
                  same thing about light.
                </p>
                <p className="max-w-sm font-sans text-sm font-light leading-relaxed text-on-media-muted">
                  And every one of them brushed the tray before they put it in
                  the window.
                </p>
              </div>
            </VelvetPileSweep>
          </div>
        </div>
      </div>
    </section>
  );
}
