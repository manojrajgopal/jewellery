'use client';

import PerspectiveCorridor from '@/components/motion/PerspectiveCorridor';
import TypeOnPath from '@/components/motion/TypeOnPath';

/**
 * The threshold — a walk from the browsing half of the page into the atelier
 * half, with nothing in it to read.
 *
 * The page has two pinned tentpoles already: the film sequence and the vitrine
 * rail. This is a third pin and it is placed deliberately between the reference
 * material and the workshop, at the one point in the arc where the visitor
 * changes from looking at objects to looking at how objects are made. That
 * transition has always been a hard cut, and a hard cut is exactly what a
 * building does not do — you walk down a corridor.
 *
 * There are no controls, no figures and no call to action. Five arches carry one
 * line each, read as you pass under them, and the section's whole job is to slow
 * the visitor down before the atelier starts. A page this long needs a held
 * breath in the middle of it as much as it needs one before the commercial half,
 * and the manifesto section further down cannot be in two places at once.
 */
export default function ThresholdSection() {
  return (
    <section id="threshold" className="relative bg-canvas-alt">
      <PerspectiveCorridor
        arches={16}
        length={2.8}
        marks={[
          {
            at: 0.16,
            label: 'Sixty-four steps',
            line: 'from the front door to the first bench.',
          },
          {
            at: 0.34,
            label: 'One window',
            line: 'and every photograph on this site was taken at it.',
          },
          {
            at: 0.53,
            label: 'Forty feet',
            line: 'between the raising bench and the setters, because one makes noise.',
          },
          {
            at: 0.72,
            label: 'Six pairs of hands',
            line: 'and a piece passes through four of them.',
          },
          {
            at: 0.9,
            label: 'Then the room',
            line: 'the rest of this page is about.',
          },
        ]}
      >
        {/* Held at the vanishing point, so it is read on arrival rather than on
            the way in. */}
        <div className="mx-auto max-w-2xl">
          <TypeOnPath
            text="Come through"
            curve="arch"
            size={92}
            travel
            showRule
            start={6}
            className="mx-auto max-w-lg"
          />
          <p className="mt-2 font-accent text-[10px] uppercase tracking-luxe text-faint">
            The atelier, from here on
          </p>
        </div>
      </PerspectiveCorridor>
    </section>
  );
}
