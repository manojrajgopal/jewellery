'use client';

import { useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

import { clawClose } from '@/lib/motion';

interface ClawSetCloseProps {
  className?: string;
  /** Number of claws. Four and six are the two that exist; three is a choice. */
  claws?: 4 | 6 | 3;
  /** Let the visitor change the count. */
  controls?: boolean;
}

/**
 * The moment a stone stops being loose.
 *
 * There is a specific instant in making a ring that everything before it is
 * preparation for and everything after it is tidying: the setter pushes the
 * last claw over the girdle and the stone is captured. Before that push it is a
 * stone sitting in a cup. After it, it is jewellery.
 *
 * Two details are worth the drawing, and neither is obvious:
 *
 * **The order.** A setter never closes claws in a circle. They close opposite
 * pairs — north, then south, then east, then west — for the same reason a wheel
 * is bolted that way: closing them in sequence around the ring walks the stone
 * off centre a fraction at a time, and by the fourth claw it is visibly crooked
 * and cannot be corrected without opening all four again. `clawClose` in the
 * motion library encodes that order, which is why the delay there is 0, 2, 1, 3
 * and not 0, 1, 2, 3.
 *
 * **The lack of spring-back.** Gold bent over a girdle stays bent. If it
 * relaxed even slightly the stone would rattle, and a rattling stone will
 * eventually walk out of its setting entirely. So the arrival is stiff and
 * almost dead — which is why `springsBench.claw` has a damping ratio a spring
 * animation would normally consider broken.
 *
 * The claw count is offered because it is a genuine trade-off rather than a
 * style: four claws show more stone and hold less of it, six hold better and
 * eat the outline, and three is a decision somebody made for the look and will
 * be defending to a customer in eight years.
 */

const NOTES: Record<number, { title: string; body: string }> = {
  3: {
    title: 'Three',
    body: 'Chosen for the look, and it is a real look — the stone appears to float, because a third of the girdle is bare. It is also the only count where losing one claw means losing the stone the same day. We will set it, and we will tell you to have it checked annually rather than every two years.',
  },
  4: {
    title: 'Four',
    body: 'The default, and the right default. Two opposing pairs mean the stone cannot walk while it is being set, the claws sit at the corners where they are least in the way of the light, and one failed claw still leaves a stone that is held rather than lost.',
  },
  6: {
    title: 'Six',
    body: 'What a large stone should have, and what almost nobody asks for. Six claws take more of the outline and give back a stone that will survive being caught on something. Above about two carats we will argue for it, because at that weight the momentum of a knock is what breaks a four-claw head.',
  },
};

export default function ClawSetClose({
  className = '',
  claws = 4,
  controls = true,
}: ClawSetCloseProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  // Replays rather than firing once — the whole component is a single gesture,
  // and a gesture you can only see once is a gesture most visitors miss.
  const inView = useInView(ref, { margin: '-24% 0px -24% 0px' });
  const [count, setCount] = useState<number>(claws);
  const note = NOTES[count];

  return (
    <div ref={ref} className={className}>
      <div className="relative overflow-hidden rounded-2xl border border-hairline bg-canvas-alt px-6 py-12">
        {/* The bench light, straight down. A setter works under a single lamp
            almost on top of the work, which is why the shadows here are short. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(46%_38%_at_50%_18%,rgb(var(--gold-200)/0.16),transparent_72%)]"
        />

        <div className="relative mx-auto aspect-square w-full max-w-[19rem]">
          <svg viewBox="0 0 200 200" className="h-full w-full overflow-visible">
            {/* The seat the stone sits in, cut into the head. */}
            <circle
              cx={100}
              cy={100}
              r={62}
              fill="none"
              stroke="rgb(var(--gold-700))"
              strokeWidth={10}
              strokeOpacity={0.5}
            />

            {/* The stone. Drawn as a table and a crown outline rather than a
                circle, so it reads as cut rather than as a bead. */}
            <g>
              <circle cx={100} cy={100} r={54} fill="rgb(var(--diamond))" fillOpacity={0.14} />
              <circle
                cx={100}
                cy={100}
                r={54}
                fill="none"
                stroke="rgb(var(--diamond))"
                strokeOpacity={0.5}
                strokeWidth={1.2}
              />
              <circle cx={100} cy={100} r={31} fill="rgb(var(--cream-50))" fillOpacity={0.16} />
              {/* Crown facet junctions — eight, because a round brilliant has
                  eight bezel facets and that is what makes the outline read. */}
              {Array.from({ length: 8 }, (_, i) => {
                const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
                return (
                  <line
                    key={i}
                    x1={100 + Math.cos(a) * 31}
                    y1={100 + Math.sin(a) * 31}
                    x2={100 + Math.cos(a) * 54}
                    y2={100 + Math.sin(a) * 54}
                    stroke="rgb(var(--diamond))"
                    strokeOpacity={0.34}
                    strokeWidth={1}
                  />
                );
              })}
            </g>

            {/* The claws. Each is a tapered finger hinged at its base on the
                seat, and each rotates about that base rather than about the
                centre of the stone — which is the difference between a claw
                being pushed over and a claw sliding round. */}
            {Array.from({ length: count }, (_, i) => {
              const angle = (i / count) * 360 - 90;
              return (
                // Two groups rather than one. The outer carries the SVG
                // `transform` attribute that puts the claw at its station; the
                // inner carries the CSS transform framer animates. Put both on
                // one element and the CSS transform silently replaces the
                // attribute, and every claw stacks at twelve o'clock.
                <g key={`${count}-${i}`} transform={`rotate(${angle} 100 100)`}>
                  <motion.g
                    initial="hidden"
                    animate={reduced || inView ? 'visible' : 'hidden'}
                    variants={clawClose(i, count)}
                    // The hinge is the base of the claw where it meets the
                    // seat, not the centre of the stone — a claw is pushed
                    // over, it does not swing round.
                    style={{ transformOrigin: '100px 78px' }}
                  >
                    <path
                      d="M 92 46 Q 100 30 108 46 L 106 78 Q 100 84 94 78 Z"
                      fill="rgb(var(--gold-400))"
                      stroke="rgb(var(--gold-700))"
                      strokeWidth={1.4}
                    />
                    {/* The tip highlight — the one bright spot on a claw, and
                        what a setter is actually looking at while filing. */}
                    <ellipse
                      cx={100}
                      cy={44}
                      rx={3.4}
                      ry={5}
                      fill="rgb(var(--gold-100))"
                      fillOpacity={0.7}
                    />
                  </motion.g>
                </g>
              );
            })}
          </svg>

          {/* The capture, said once. Appears with the last claw. */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: inView || reduced ? 1 : 0 }}
            transition={{ duration: 0.5, delay: reduced ? 0 : 0.7 }}
            className="pointer-events-none absolute inset-x-0 -bottom-2 text-center font-accent text-[10px] uppercase tracking-luxe text-accent"
          >
            Set
          </motion.p>
        </div>
      </div>

      {controls && (
        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-2 font-accent text-[10px] uppercase tracking-luxe text-faint">
              Claws
            </span>
            {[3, 4, 6].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setCount(n)}
                aria-pressed={count === n}
                className={`h-9 w-9 rounded-full border font-accent text-xs transition-colors duration-300 ${
                  count === n
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-hairline text-muted hover:border-accent/50 hover:text-accent'
                }`}
              >
                {n}
              </button>
            ))}
          </div>

          <motion.div
            key={count}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 border-t border-line-subtle pt-5"
          >
            <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
              {note.title}
            </p>
            <p className="mt-2 max-w-2xl font-sans text-sm font-light leading-relaxed text-muted">
              {note.body}
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
}
