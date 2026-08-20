'use client';

import { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Twenty-four months of metal, indexed.
 *
 * The site already carries a live ticker (`LiveGoldRate`), which answers "what
 * is it now". This answers the different and more useful question a vault
 * holder actually has, which is "what has it done", and it is built around one
 * decision that is worth spelling out because it is the commonest mistake in
 * charts of this kind.
 *
 * Gold trades around ₹6,000 a gram, platinum around ₹3,400 and silver around
 * ₹95. Drawn on one axis at their real values, silver is a flat line along the
 * bottom of the frame and has no visible history at all. The usual fix is a
 * second y-axis on the right — and a second axis is a way of making any two
 * lines cross wherever the author would like them to, because the crossing
 * point is set by the scaling and not by the data. It is the single most
 * misleading thing a chart can do.
 *
 * So everything here is indexed to 100 at the start of the window. One axis,
 * one meaning: a line at 118 has risen 18% since month zero, whichever metal it
 * is. The real rupee figures are still available — they are in the tooltip and
 * in the table — but they are never what sets the geometry.
 *
 * The figures are indicative and generated for illustration rather than taken
 * from a feed, and the panel says so in the same size type as everything else.
 */

interface Series {
  id: string;
  name: string;
  /** Rupees per gram at the start of the window. */
  base: number;
  /** Index values, month by month. 24 points. */
  index: number[];
  tone: string;
}

/**
 * Twenty-four months. Held as literal arrays rather than generated, because a
 * chart that renders different numbers on the server and the client is a chart
 * that flickers on hydration.
 */
const SERIES: Series[] = [
  {
    id: 'gold',
    name: 'Gold 22K',
    base: 5820,
    tone: 'var(--series-1)',
    index: [
      100, 101.4, 103.8, 102.9, 105.6, 108.2, 107.4, 110.9, 113.6, 112.8, 116.4,
      119.7, 121.2, 119.8, 123.5, 126.9, 125.4, 128.8, 132.4, 130.9, 134.6, 137.2,
      135.8, 139.4,
    ],
  },
  {
    id: 'platinum',
    name: 'Platinum 950',
    base: 3410,
    tone: 'var(--series-2)',
    index: [
      100, 98.6, 99.4, 97.2, 98.8, 101.3, 99.7, 98.2, 100.6, 103.4, 101.9, 100.4,
      102.8, 106.2, 104.1, 102.6, 105.8, 109.4, 107.2, 105.6, 108.9, 112.4, 110.1,
      113.8,
    ],
  },
  {
    id: 'silver',
    name: 'Sterling silver',
    base: 92,
    tone: 'var(--series-3)',
    index: [
      100, 103.2, 99.4, 105.8, 110.2, 104.6, 108.9, 115.4, 111.2, 106.8, 114.6,
      121.3, 116.4, 110.9, 119.8, 127.4, 121.6, 115.2, 124.8, 132.6, 126.4, 119.8,
      129.4, 136.2,
    ],
  },
];

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const label = (i: number) => `${MONTHS[(i + 8) % 12]} ${24 + Math.floor((i + 8) / 12)}`;

const rupees = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;

/** Plot box, in the SVG's own units. */
const W = 640;
const H = 260;
const PAD = { top: 16, right: 84, bottom: 28, left: 40 };

export default function MetalRateHistory({ className = '' }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [showTable, setShowTable] = useState(false);
  const [months, setMonths] = useState<12 | 24>(24);

  const points = months;
  const offset = 24 - points;

  const { min, max } = useMemo(() => {
    const all = SERIES.flatMap((s) => s.index.slice(offset));
    return { min: Math.min(...all, 96), max: Math.max(...all, 104) };
  }, [offset]);

  const x = (i: number) =>
    PAD.left + (i / (points - 1)) * (W - PAD.left - PAD.right);
  const y = (v: number) =>
    PAD.top + (1 - (v - min) / (max - min)) * (H - PAD.top - PAD.bottom);

  const path = (values: number[]) =>
    values.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const i = Math.round(
      ((px - PAD.left) / (W - PAD.left - PAD.right)) * (points - 1)
    );
    setHover(i >= 0 && i < points ? i : null);
  };

  // Four horizontal reference lines. Recessive, and labelled — a grid with no
  // numbers on it is decoration.
  const ticks = useMemo(() => {
    const step = (max - min) / 3;
    return [0, 1, 2, 3].map((n) => Math.round(min + step * n));
  }, [min, max]);

  return (
    <div className={className}>
      {/* Controls in one row above the plot. */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          {([12, 24] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMonths(m);
                setHover(null);
              }}
              aria-pressed={months === m}
              className={`rounded-full border px-3.5 py-1.5 font-accent text-[10px] uppercase tracking-luxe transition-colors duration-300 ${
                months === m
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-hairline text-muted hover:border-accent/50 hover:text-accent'
              }`}
            >
              {m} months
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setShowTable((v) => !v)}
          className="font-accent text-[10px] uppercase tracking-luxe text-muted transition-colors hover:text-accent"
        >
          {showTable ? 'Show the chart' : 'Show the figures'}
        </button>
      </div>

      {showTable ? (
        <div className="chart-surface overflow-x-auto rounded-2xl">
          <table className="w-full min-w-[34rem] border-collapse text-left">
            <caption className="sr-only">
              Indicative metal rates per gram, indexed to 100 at the start of the
              window
            </caption>
            <thead>
              <tr className="border-b border-hairline">
                <th
                  scope="col"
                  className="px-4 py-3 font-accent text-[10px] uppercase tracking-luxe text-muted"
                >
                  Month
                </th>
                {SERIES.map((s) => (
                  <th
                    key={s.id}
                    scope="col"
                    className="px-4 py-3 font-accent text-[10px] uppercase tracking-luxe text-muted"
                  >
                    {s.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: points }, (_, i) => (
                <tr key={i} className="border-b border-line-subtle last:border-0">
                  <th
                    scope="row"
                    className="whitespace-nowrap px-4 py-2 font-accent text-[10px] uppercase tracking-luxe text-faint"
                  >
                    {label(i + offset)}
                  </th>
                  {SERIES.map((s) => (
                    <td
                      key={s.id}
                      className="nums-instrument px-4 py-2 font-sans text-sm text-secondary"
                    >
                      {rupees((s.base * s.index[i + offset]) / 100)}
                      <span className="ml-2 text-faint">
                        {s.index[i + offset].toFixed(1)}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="chart-surface relative rounded-2xl p-4">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            className="w-full"
            onPointerMove={onMove}
            onPointerLeave={() => setHover(null)}
            role="img"
            aria-label="Indexed metal rates over the selected window. The same figures are available as a table."
          >
            {/* Grid and its labels. */}
            {ticks.map((t) => (
              <g key={t}>
                <line
                  x1={PAD.left}
                  y1={y(t)}
                  x2={W - PAD.right}
                  y2={y(t)}
                  stroke="rgb(var(--hairline))"
                  strokeOpacity={0.12}
                />
                <text
                  x={PAD.left - 8}
                  y={y(t) + 3}
                  textAnchor="end"
                  fontSize={9}
                  className="nums-instrument font-accent"
                  fill="rgb(var(--text-faint))"
                >
                  {t}
                </text>
              </g>
            ))}

            {/* The 100 baseline, which is where every series started. Slightly
                stronger than the rest of the grid, because it is the only line
                on the chart that means something. */}
            <line
              x1={PAD.left}
              y1={y(100)}
              x2={W - PAD.right}
              y2={y(100)}
              stroke="rgb(var(--hairline))"
              strokeOpacity={0.28}
              strokeDasharray="4 4"
            />

            {/* x labels, every third month so they never collide. */}
            {Array.from({ length: points }, (_, i) => i)
              .filter((i) => i % 3 === 0)
              .map((i) => (
                <text
                  key={i}
                  x={x(i)}
                  y={H - 8}
                  textAnchor="middle"
                  fontSize={9}
                  className="font-accent"
                  fill="rgb(var(--text-faint))"
                >
                  {label(i + offset)}
                </text>
              ))}

            {/* The crosshair, snapped to the nearest month. */}
            {hover !== null && (
              <motion.line
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                x1={x(hover)}
                y1={PAD.top}
                x2={x(hover)}
                y2={H - PAD.bottom}
                stroke="rgb(var(--accent))"
                strokeOpacity={0.5}
              />
            )}

            {/* The series. 2px, no fill, no markers except on hover — a marker
                on every point on a 24-point line is 72 dots and no information. */}
            {SERIES.map((s) => {
              const values = s.index.slice(offset);
              return (
                <g key={s.id}>
                  <motion.path
                    d={path(values)}
                    fill="none"
                    stroke={`rgb(${s.tone})`}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.1, ease: [0.42, 0.02, 0.32, 1] }}
                  />

                  {/* Direct label at the line end. Three series, so every one
                      gets named on the plot as well as in the legend — colour
                      is never the only thing carrying identity. */}
                  <text
                    x={x(points - 1) + 8}
                    y={y(values[points - 1]) + 3}
                    fontSize={9}
                    className="font-accent"
                    fill="rgb(var(--text-secondary))"
                  >
                    {s.name}
                  </text>

                  {hover !== null && (
                    <circle
                      cx={x(hover)}
                      cy={y(values[hover])}
                      r={4.5}
                      fill={`rgb(${s.tone})`}
                      stroke="rgb(var(--surface-raised))"
                      strokeWidth={2}
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Tooltip. Positioned in DOM rather than in SVG so the type inherits
              the site's own faces and sizes. */}
          {hover !== null && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.12 }}
              className="tooltip-plate pointer-events-none absolute rounded-lg p-3"
              style={{
                left: `${(x(hover) / W) * 100}%`,
                top: 12,
                transform:
                  hover > points * 0.6 ? 'translateX(-108%)' : 'translateX(8%)',
              }}
            >
              <p className="font-accent text-[9px] uppercase tracking-luxe text-faint">
                {label(hover + offset)}
              </p>
              <div className="mt-2 space-y-1">
                {SERIES.map((s) => (
                  <p
                    key={s.id}
                    className="flex items-center gap-2 whitespace-nowrap font-sans text-xs text-secondary"
                  >
                    <span
                      className="series-swatch"
                      style={{ background: `rgb(${s.tone})` }}
                      aria-hidden="true"
                    />
                    <span className="nums-instrument">
                      {rupees((s.base * s.index[hover + offset]) / 100)}
                    </span>
                    <span className="nums-instrument text-faint">
                      {s.index[hover + offset] >= 100 ? '+' : ''}
                      {(s.index[hover + offset] - 100).toFixed(1)}%
                    </span>
                  </p>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Legend, always present for more than one series. */}
      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
        {SERIES.map((s) => (
          <span
            key={s.id}
            className="flex items-center gap-2 font-accent text-[10px] uppercase tracking-luxe text-muted"
          >
            <span
              className="series-swatch"
              style={{ background: `rgb(${s.tone})` }}
              aria-hidden="true"
            />
            {s.name}
            <span className="nums-instrument text-faint">
              {rupees(s.base)}/g at the start
            </span>
          </span>
        ))}
      </div>

      <p className="mt-5 max-w-3xl border-t border-line-subtle pt-5 font-sans text-sm font-light leading-relaxed text-muted">
        Indexed to 100 at the start of the window, which is the only honest way
        to put gold at six thousand rupees a gram on the same axis as silver at
        ninety. A second axis would let these three lines be made to cross
        wherever the person drawing them wanted. Figures are indicative and
        generated for illustration — for a valuation of your own pieces, the
        appraisal bench uses the fixing on the day.
      </p>
    </div>
  );
}
