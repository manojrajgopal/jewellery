'use client';

import { useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

import { dimensionFigure, dimensionRule, traceLine } from '@/lib/motion';

interface Dimension {
  id: string;
  /** Where the leader starts and ends, on the 320 × 260 drawing box. */
  from: [number, number];
  to: [number, number];
  /** Where the figure is written. */
  at: [number, number];
  value: string;
  label: string;
  /** What this number actually decides. Every one of them decides something. */
  note: string;
}

/**
 * A ring in section, with the six numbers that a bench works from.
 *
 * These are real figures off a plain court band in a size 12. The section
 * height and width are the two a customer never hears and the two that decide
 * everything about how the ring wears.
 */
const DIMENSIONS: Dimension[] = [
  {
    id: 'width',
    from: [104, 46],
    to: [216, 46],
    at: [160, 34],
    value: '4.00',
    label: 'Width',
    note: 'The only number a customer is usually given, and the least consequential of the six. A 4mm band and a 6mm band wear identically if their sections are the same.',
  },
  {
    id: 'section',
    from: [236, 62],
    to: [236, 92],
    at: [268, 78],
    value: '1.60',
    label: 'Section',
    note: 'The height of the metal. This is the number that decides whether the ring survives thirty years or wears through in eight, and it is the first thing cut when somebody is quoting to a price.',
  },
  {
    id: 'inner',
    from: [104, 150],
    to: [216, 150],
    at: [160, 168],
    value: '17.30',
    label: 'Inner diameter',
    note: 'Size 12 on the Indian scale. Not the finger — the finger is smaller, because a ring has to pass a knuckle that is wider than the joint it sits on.',
  },
  {
    id: 'radius',
    from: [104, 62],
    to: [118, 76],
    at: [78, 58],
    value: 'R0.8',
    label: 'Outer radius',
    note: 'The dome on the outside. A flat band and a domed band of identical section feel like different rings, and the entire difference is this radius.',
  },
  {
    id: 'comfort',
    from: [104, 136],
    to: [120, 122],
    at: [64, 132],
    value: 'R2.4',
    label: 'Inner radius',
    note: 'The comfort fit. The inside of the band is domed so it rides on a line rather than on two edges, and it costs about 12% more metal to do. It is the single upgrade most worth paying for and it is invisible.',
  },
  {
    id: 'chamfer',
    from: [216, 62],
    to: [206, 70],
    at: [286, 52],
    value: '0.15',
    label: 'Edge break',
    note: 'The tiny flat filed off the corner. Without it the edge is sharp enough to catch on fabric, and with too much of it the band looks worn before it is sold.',
  },
];

interface BlueprintDimensioningProps {
  className?: string;
  /** The part number written in the title block. */
  drawing?: string;
}

/**
 * A bench drawing that dimensions itself.
 *
 * Every craft section on this site shows metal being worked. None of them show
 * the thing that happens first, which is somebody at a drawing board deciding
 * six numbers — and those six numbers, not the polishing and not the setting,
 * are what decide whether a ring is still wearable in 2060.
 *
 * The drawing is a genuine section rather than a stylised outline, and it is
 * dimensioned the way a drawing office dimensions one: extension lines out from
 * the feature, a dimension line ruled between them, and the figure written
 * above that line once it exists. That order is not decoration. A figure that
 * appears before its line has nothing to point at, which is why the two
 * variants in the motion library are separate and why the second has a delay
 * baked into it.
 *
 * The tolerance block, the projection symbol and the "do not scale" note are
 * all real conventions. The last one is the one worth reading: a drawing is a
 * set of numbers, and if a number is missing you ask for it — you never measure
 * the picture. That is the difference between a drawing and a sketch, and it is
 * the difference between a commission and a hope.
 */
export default function BlueprintDimensioning({
  className = '',
  drawing = 'AU-BAND-04-C',
}: BlueprintDimensioningProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: '-14% 0px -14% 0px' });
  const state = reduced || inView ? 'visible' : 'hidden';
  const [active, setActive] = useState<string | null>(null);

  const shown = DIMENSIONS.find((d) => d.id === active);

  return (
    <div ref={ref} className={className}>
      <div className="blueprint-grid-fine relative overflow-hidden rounded-2xl border border-hairline bg-canvas-alt">
        {/* The sheet border and the title block, which is what makes a drawing a
            document rather than a picture. */}
        <div className="border-b border-hairline px-5 py-3">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
              Section through band · first angle
            </p>
            <p className="nums-instrument font-accent text-[10px] uppercase tracking-luxe text-faint">
              {drawing}
            </p>
          </div>
        </div>

        <div className="px-4 py-6">
          <svg viewBox="0 0 340 260" className="h-full w-full overflow-visible">
            {/* Centre line — long dash, short dash, long dash. The one line type
                everybody recognises and nobody can name. */}
            <line
              x1={160}
              y1={10}
              x2={160}
              y2={250}
              stroke="rgb(var(--accent))"
              strokeOpacity={0.4}
              strokeWidth={0.8}
              strokeDasharray="14 3 3 3"
            />

            {/* The section itself. Two walls of a band in cross-section, hatched
                — because hatching is what says "this is cut material" and an
                unhatched section is an outline. */}
            <g>
              <defs>
                <pattern
                  id="bp-hatch"
                  width="6"
                  height="6"
                  patternUnits="userSpaceOnUse"
                  patternTransform="rotate(45)"
                >
                  <line x1="0" y1="0" x2="0" y2="6" stroke="rgb(var(--accent))" strokeOpacity={0.5} strokeWidth={1} />
                </pattern>
              </defs>

              {/* The outline draws itself before it is filled, which is the
                  order a draughtsman works in — and the reason `traceLine` is
                  applied to the paths rather than to the group around them:
                  pathLength is a property of a path and a group does not have
                  one, so a group carrying it animates nothing at all. */}
              {[
                { x: 104, flip: 1 },
                { x: 216, flip: -1 },
              ].map(({ x, flip }) => (
                <motion.path
                  key={x}
                  d={
                    flip === 1
                      ? 'M 104 62 Q 96 106 104 150 L 120 150 Q 128 106 120 62 Z'
                      : 'M 216 62 Q 224 106 216 150 L 200 150 Q 192 106 200 62 Z'
                  }
                  fill="url(#bp-hatch)"
                  stroke="rgb(var(--accent))"
                  strokeWidth={1.6}
                  strokeOpacity={0.85}
                  initial="hidden"
                  animate={state}
                  variants={reduced ? undefined : traceLine(flip === 1 ? 0 : 0.12, 1.1)}
                />
              ))}
            </g>

            {/* The dimensions. Each one is a leader, a rule and a figure. */}
            {DIMENSIONS.map((d, i) => {
              const horizontal = d.from[1] === d.to[1];
              const isActive = active === d.id;
              return (
                <g
                  key={d.id}
                  onMouseEnter={() => setActive(d.id)}
                  onMouseLeave={() => setActive(null)}
                  className="cursor-crosshair-fine"
                >
                  <motion.line
                    x1={d.from[0]}
                    y1={d.from[1]}
                    x2={d.to[0]}
                    y2={d.to[1]}
                    stroke="rgb(var(--accent))"
                    strokeWidth={isActive ? 1.6 : 0.9}
                    strokeOpacity={isActive ? 1 : 0.6}
                    initial="hidden"
                    animate={state}
                    variants={reduced ? undefined : dimensionRule(0.5 + i * 0.09)}
                    style={{ transformOrigin: `${d.from[0]}px ${d.from[1]}px` }}
                  />

                  {/* End ticks, at 45° — the convention a drawing office uses
                      instead of arrowheads on tight dimensions. */}
                  {[d.from, d.to].map(([tx, ty]) => (
                    <line
                      key={`${tx}-${ty}`}
                      x1={tx - (horizontal ? 0 : 4)}
                      y1={ty - (horizontal ? 4 : 0)}
                      x2={tx + (horizontal ? 0 : 4)}
                      y2={ty + (horizontal ? 4 : 0)}
                      stroke="rgb(var(--accent))"
                      strokeOpacity={isActive ? 1 : 0.6}
                      strokeWidth={1}
                    />
                  ))}

                  <motion.text
                    x={d.at[0]}
                    y={d.at[1]}
                    textAnchor="middle"
                    className="nums-instrument font-accent"
                    fontSize={11}
                    fill="rgb(var(--accent))"
                    fillOpacity={isActive ? 1 : 0.78}
                    initial="hidden"
                    animate={state}
                    variants={reduced ? undefined : dimensionFigure(0.5 + i * 0.09)}
                  >
                    {d.value}
                  </motion.text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* The notes block. Every real drawing carries these three and the third
            is the one that matters. */}
        <div className="grid gap-x-8 gap-y-1 border-t border-hairline px-5 py-3 sm:grid-cols-3">
          <p className="font-accent text-[9px] uppercase tracking-luxe text-faint">
            All dimensions mm
          </p>
          <p className="font-accent text-[9px] uppercase tracking-luxe text-faint">
            Tolerance ±0.05 unless stated
          </p>
          <p className="font-accent text-[9px] uppercase tracking-luxe text-accent">
            Do not scale from drawing
          </p>
        </div>
      </div>

      {/* What the hovered number decides. Reserved height rather than a
          collapsing panel, so hovering across the drawing does not make the
          page jump under the pointer. */}
      <div className="mt-5 min-h-[5.5rem] border-t border-line-subtle pt-5">
        {shown ? (
          <motion.div
            key={shown.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
              {shown.label} — {shown.value}mm
            </p>
            <p className="mt-2 max-w-2xl font-sans text-sm font-light leading-relaxed text-muted">
              {shown.note}
            </p>
          </motion.div>
        ) : (
          <p className="font-sans text-sm font-light leading-relaxed text-faint">
            Hover a dimension. Six numbers, and only one of them is the one
            anybody is ever quoted.
          </p>
        )}
      </div>
    </div>
  );
}
