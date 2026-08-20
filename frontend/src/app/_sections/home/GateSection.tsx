'use client';

import AnamorphicTitle from '@/components/motion/AnamorphicTitle';
import TimeSliceScrub from '@/components/motion/TimeSliceScrub';
import CTAButton from '@/components/ui/CTAButton';

/**
 * The same object, recorded four ways.
 *
 * Placed immediately after the film sequence and before the stone turns, because
 * this is the one moment on the page where the subject is *photography* rather
 * than jewellery — and it is the honest answer to a question the whole page has
 * been quietly dodging. Every image above this point is a photograph, every
 * photograph was lit and chosen by us, and a visitor is entitled to know that
 * before they are asked to judge anything from one.
 *
 * The mechanism is a slit-scan: each vertical strip of the picture is treated as
 * though it were captured a fraction of a second after the one beside it, so the
 * frame is sheared at the top and bottom of its pass and correct only at the
 * centre of the viewport. That single property is why this belongs here rather
 * than anywhere else on the page — it makes the *act of photographing* visible,
 * and it resolves into a plain, true photograph exactly when the visitor stops
 * scrolling to look at it.
 *
 * Four plates rather than one, because the argument needs a comparison. The same
 * piece, four lighting setups, and only one of them is the one that would
 * normally be published.
 *
 * The heading arrives through anamorphic glass, which is the section's only other
 * effect and is doing the same job as the plates: it is a lens artefact, so the
 * type announces that what follows was shot rather than written.
 */
const PLATES = [
  {
    src: '/images/collections/bridal.jpg',
    alt: 'A bridal piece under a single hard key light',
    reading: 'One hard key, no fill',
    note: 'What the trade calls honest light. Every scratch is in it, the metal reads cold, and no showroom on earth uses it.',
  },
  {
    src: '/images/collections/gemstone.jpg',
    alt: 'A gemstone piece under a large diffused source',
    reading: 'Large source, close in',
    note: 'The published setup, almost universally. Soft, flattering, and it hides surface condition completely — which is why we also show you the frame above.',
  },
  {
    src: '/images/collections/heritage.jpg',
    alt: 'A heritage piece lit from behind',
    reading: 'Backlit, no front fill',
    note: 'For anything transparent. It measures a stone rather than selling it: colour zoning and included material have nowhere to hide.',
  },
  {
    src: '/images/collections/statement.jpg',
    alt: 'A statement piece under warm tungsten',
    reading: 'Tungsten, 2900K',
    note: 'The light of the room a piece is actually worn in. Warmer than a showroom, and it changes a yellow stone more than most people would believe.',
  },
];

export default function GateSection() {
  return (
    <section
      id="gate"
      className="relative overflow-hidden border-y border-hairline bg-canvas-alt py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-3xl">
          <p className="mb-5 font-accent text-[10px] uppercase tracking-luxest text-accent">
            Four exposures
          </p>

          <AnamorphicTitle
            text="Every photograph above this line was lit by us"
            as="h2"
            highlight={['lit', 'us']}
            double
            className="text-3xl md:text-5xl"
          />

          <p className="mt-6 font-sans text-base font-light leading-relaxed text-muted md:text-lg">
            Which is not a confession, it is a fact about photography. A piece of jewellery is a
            small, curved, highly specular object, and the single largest influence on how it looks in
            an image is the size and position of whatever was lighting it. So here is the same
            catalogue, four ways, and only the second one is the setup any jeweller would normally
            publish.
          </p>

          <p className="mt-4 font-sans text-base font-light leading-relaxed text-muted">
            Each frame is sheared as it travels and true at the centre of the screen. Stop scrolling
            on one and it resolves into the photograph it actually is.
          </p>
        </div>

        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:gap-14">
          {PLATES.map((p, i) => (
            <figure key={p.src} className={i % 2 ? 'sm:mt-16' : undefined}>
              <TimeSliceScrub
                src={p.src}
                alt={p.alt}
                columns={i % 2 ? 11 : 13}
                lean={i === 0 ? 0.7 : 0.45}
                reading={p.reading}
              />
              <figcaption className="mt-4 font-sans text-sm font-light leading-relaxed text-muted">
                {p.note}
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-20 grid gap-8 rounded-2xl border border-hairline bg-surface-raised/40 p-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:p-8">
          <p className="font-display text-xl italic leading-snug text-primary md:text-2xl">
            The mirror by the window in every one of our rooms is the first of these four setups. It
            is there so that nothing you buy here is a surprise in daylight.
          </p>
          <div className="flex flex-wrap gap-4">
            <CTAButton variant="secondary" href="/gallery" size="sm" showArrow>
              The contact sheet
            </CTAButton>
            <CTAButton variant="ghost" href="/experiences" size="sm">
              See it in the room
            </CTAButton>
          </div>
        </div>
      </div>
    </section>
  );
}
