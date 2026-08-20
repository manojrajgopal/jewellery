'use client';

import CTAButton from '@/components/ui/CTAButton';
import ScrollCameraRig from '@/components/motion/ScrollCameraRig';
import TypeSlamHeading from '@/components/motion/TypeSlamHeading';

/**
 * The walk to the door.
 *
 * The page's fifth and shortest pinned-feeling scene, and the quietest thing on
 * it after the corridor. It sits between the last of the catalogue and the
 * first of the arrangements, where the subject changes from *what we have* to
 * *coming here* — and a change of subject that large deserves a shot rather
 * than a heading.
 *
 * Mechanically it is the one place on the site where the camera itself moves.
 * Everything else that reads as depth is either the pointer pushing layers
 * about or the viewer being carried down a tunnel of repeating geometry. This
 * is a room, held still, with a camera travelling through it — which is why the
 * parallax is a division rather than a set of hand-picked speeds. A layer twice
 * as far away moves half as much, the near awning is fast and the far wall is
 * slow, and the whole illusion rests on getting that one relationship the right
 * way round.
 *
 * The roll is a degree and a fifth. That number is the difference between a
 * camera being carried by a person and a camera on a drone, and the second one
 * belongs to a different kind of company.
 */
export default function ApproachSection() {
  return (
    <section id="approach" className="relative bg-canvas">
      <ScrollCameraRig
        height="100vh"
        dolly={170}
        pan={54}
        tilt={5}
        roll={1.2}
        className="border-y border-hairline bg-ink-950"
        layers={[
          // Furthest back: the street the building stands on. Slowest, and
          // deliberately almost featureless — a far plane with detail in it
          // fights the near plane for attention and destroys the depth.
          {
            depth: 4,
            content: (
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(var(--ink-900)),rgb(var(--ink-950))_62%)]">
                <div className="absolute inset-x-0 top-1/4 h-px bg-hairline/10" />
                <div className="absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_28%,rgb(var(--gold-900)/0.35),transparent_72%)]" />
              </div>
            ),
          },
          // The facade, with light behind the glass.
          {
            depth: 2.4,
            content: (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative h-[62%] w-[74%] rounded-t-[3rem] border border-gold-700/40 bg-[linear-gradient(180deg,rgb(var(--ink-900)),rgb(var(--ink-950)))]">
                  {/* The window, lit. The only warm thing in the frame, which is
                      the entire composition. */}
                  <div className="absolute inset-x-[12%] bottom-[14%] top-[26%] rounded-t-2xl bg-[radial-gradient(60%_60%_at_50%_40%,rgb(var(--gold-300)/0.5),rgb(var(--gold-800)/0.22)_58%,transparent_78%)]" />
                  <div className="absolute inset-x-[12%] bottom-[14%] top-[26%] rounded-t-2xl border border-gold-500/30" />
                </div>
              </div>
            ),
          },
          // The name over the door.
          {
            depth: 1.6,
            content: (
              <div className="absolute inset-x-0 top-[24%] flex justify-center">
                <p className="font-display text-[clamp(2rem,7vw,5rem)] leading-none tracking-[0.2em] text-gold-200/85">
                  AURUM
                </p>
              </div>
            ),
          },
          // The awning, nearest and therefore fastest.
          {
            depth: 0.8,
            content: (
              <div className="absolute inset-x-[6%] top-[54%] h-24 rounded-b-[2rem] bg-[linear-gradient(180deg,rgb(var(--burgundy-900)),rgb(var(--ink-950)))] shadow-cinema" />
            ),
          },
          // The type, on the glass — the closest plane of all.
          {
            depth: 0.5,
            content: (
              <div className="absolute inset-0 flex items-end justify-center pb-16 md:pb-24">
                <div className="mx-auto max-w-3xl px-6 text-center">
                  <TypeSlamHeading
                    lines={['Everything above', 'happens behind', 'one door.']}
                    highlightWords={['one']}
                    as="h2"
                    className="font-display text-3xl leading-[1.1] text-on-media md:text-5xl"
                  />
                  <p className="mx-auto mt-6 max-w-xl font-sans text-sm font-light leading-relaxed text-on-media-muted md:text-base">
                    Fifteen Luxury Boulevard, Bandra West. The bench is on the
                    first floor and the door at the back of the showroom is not
                    locked — ask, and somebody will take you through it.
                  </p>
                  <div className="mt-8 flex flex-wrap justify-center gap-4">
                    <CTAButton variant="primary" href="/contact" size="md" showArrow>
                      Arrange a visit
                    </CTAButton>
                    <CTAButton variant="outline-light" href="/experiences" size="md">
                      What happens in the room
                    </CTAButton>
                  </div>
                </div>
              </div>
            ),
          },
        ]}
      />
    </section>
  );
}
