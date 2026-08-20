'use client';

import SectionHeading from '@/components/ui/SectionHeading';
import CTAButton from '@/components/ui/CTAButton';
import ClawSetClose from '@/components/motion/ClawSetClose';
import PolishingLapWheel from '@/components/motion/PolishingLapWheel';

/**
 * The instant a stone stops being loose, and the three hours afterwards.
 *
 * Placed after the forge, because there is nothing to set a stone into until
 * the metal has been rolled, drawn and made into a head. Two halves, and the
 * order between them is the argument:
 *
 * The first is a single moment. A setter pushes the last claw over the girdle
 * and a stone in a cup becomes jewellery. Everything before it was preparation
 * and everything after it is tidying — and it takes about four seconds.
 *
 * The second is the tidying, which is a third of the bench hours on any piece
 * and the thing nobody pictures at all. Polishing is where the time actually
 * goes, it runs in a fixed order that cannot be shortened, and it is the one
 * operation on a bench that can destroy a finished piece in half a second.
 *
 * Putting the four-second moment next to the three-hour one is the whole
 * reason the section exists. Every film about jewellery is made of the first
 * and every invoice is made of the second.
 */
export default function CaptureSection() {
  return (
    <section id="capture" className="relative overflow-hidden bg-canvas-alt py-24 md:py-32">
      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
        <SectionHeading
          eyebrow="Four seconds, then three hours"
          title="A stone in a cup is not jewellery until the last claw goes over"
          highlightWords={['last']}
          subtitle="Setting is the shortest operation on the bench and the only irreversible one. What follows it is the longest, and it is the part of the invoice nobody can picture."
          align="center"
          className="mb-16"
        />

        <div className="grid gap-14 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
              The capture
            </p>
            <h3 className="mt-4 font-display text-3xl leading-[1.14] text-primary md:text-4xl">
              Opposite pairs, never round the circle.
            </h3>
            <p className="mt-5 font-sans text-sm font-light leading-relaxed text-muted">
              A setter closes claws the way a wheel is bolted: north, south,
              east, west. Working round the ring in order walks the stone off
              centre a fraction at a time, and by the fourth claw it is visibly
              crooked and cannot be corrected without opening all four again.
            </p>
            <p className="mt-4 font-sans text-sm font-light leading-relaxed text-muted">
              And the gold has to stay where it is put. If a claw sprang back
              even slightly the stone would rattle — and a rattling stone walks
              out of its setting eventually, without ever having been knocked.
            </p>
          </div>

          <ClawSetClose claws={4} />
        </div>

        {/* The other three hours. */}
        <div className="mt-24 border-t border-line-subtle pt-16">
          <div className="mb-12 grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] md:items-end">
            <h3 className="font-display text-3xl leading-[1.12] text-primary md:text-4xl">
              Then somebody spends a third of the making time on a surface you
              are not supposed to notice.
            </h3>
            <p className="font-sans text-sm font-light leading-relaxed text-muted">
              Four wheels, in an order that cannot be changed, because a wheel
              can only remove scratches coarser than its own particle. Run rouge
              before tripoli and you polish the tripoli marks to a mirror finish
              and leave them there for good.
            </p>
          </div>

          <PolishingLapWheel />

          <div className="mt-14 grid gap-8 rounded-2xl border border-hairline bg-surface-raised/40 p-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:p-8">
            <p className="font-display text-xl italic leading-snug text-primary md:text-2xl">
              We re-polish anything we made, free, for as long as there is metal
              to take — and we will tell you honestly when there is not.
            </p>
            <div className="flex flex-wrap gap-4">
              <CTAButton variant="secondary" href="/care" size="sm" showArrow>
                The care bench
              </CTAButton>
              <CTAButton variant="ghost" href="/services" size="sm">
                What it covers
              </CTAButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
