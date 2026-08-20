'use client';

import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Eraser, Undo2 } from 'lucide-react';

import { easeCine } from '@/lib/motion';

/**
 * The inclusion types a report actually plots, with the symbol and colour a
 * laboratory draws them in.
 *
 * The colour convention is not decorative and it is the first thing that makes a
 * plot diagram readable: red is internal, green is external, and that is the
 * whole legend. An internal feature affects clarity; an external one affects
 * finish and is usually polished away at the next service. Most people looking at
 * a certificate for the first time assume every mark on it is a flaw.
 *
 * `weight` is how much this feature moves the grade, per occurrence, on the
 * eleven-step scale below. `visibility` is how easily it is seen — at 10×, at
 * 30×, or with the unaided eye — which is the axis the grade is actually defined
 * against.
 */
interface Feature {
  id: string;
  name: string;
  /** What a customer would call it. */
  plain: string;
  internal: boolean;
  weight: number;
  visibility: '10x' | '30x' | 'eye';
  note: string;
}

const FEATURES: Feature[] = [
  {
    id: 'crystal',
    name: 'Crystal',
    plain: 'A tiny mineral grown inside the diamond',
    internal: true,
    weight: 1.3,
    visibility: '10x',
    note: 'Another mineral trapped as the diamond formed. Harmless unless it is near the surface or dark enough to see.',
  },
  {
    id: 'feather',
    name: 'Feather',
    plain: 'A small internal fracture',
    internal: true,
    weight: 1.5,
    visibility: '10x',
    note: 'The only inclusion type with a durability question attached. A feather reaching the girdle is worth asking a setter about before the stone is set.',
  },
  {
    id: 'cloud',
    name: 'Cloud',
    plain: 'A haze of pinpoints too small to see individually',
    internal: true,
    weight: 1.1,
    visibility: '30x',
    note: 'Usually invisible and occasionally the whole problem — a dense cloud across the table makes a stone look milky at every magnification including none.',
  },
  {
    id: 'pinpoint',
    name: 'Pinpoint',
    plain: 'A single speck',
    internal: true,
    weight: 0.5,
    visibility: '30x',
    note: 'The most common feature in any diamond and the least consequential. A stone with three pinpoints and nothing else can still be VVS.',
  },
  {
    id: 'needle',
    name: 'Needle',
    plain: 'A long thin crystal',
    internal: true,
    weight: 0.9,
    visibility: '10x',
    note: 'A crystal that grew as a line. Reflects along its own length, so it can appear in several pavilion facets at once and read as more inclusions than there are.',
  },
  {
    id: 'chip',
    name: 'Chip',
    plain: 'A small nick at the edge',
    internal: false,
    weight: 1.2,
    visibility: '10x',
    note: 'External, and usually damage rather than nature. Often hidden under a claw at setting, which is a legitimate and disclosed practice.',
  },
  {
    id: 'polish-line',
    name: 'Polish lines',
    plain: 'Fine parallel marks left by the wheel',
    internal: false,
    weight: 0.3,
    visibility: '30x',
    note: 'A finish characteristic, not a clarity one. It affects the polish grade on the report and nothing a wearer will ever see.',
  },
  {
    id: 'natural',
    name: 'Natural',
    plain: 'A piece of the original rough left on the girdle',
    internal: false,
    weight: 0.4,
    visibility: '10x',
    note: 'Deliberately left by the cutter to keep weight. Evidence of how the rough was used rather than a fault, and a cutter’s signature of sorts.',
  },
];

/**
 * The eleven clarity grades, coarsest last. `ceiling` is the total weighted
 * score a stone can carry and still hold this grade — which is a simplification
 * of a judgement a grader makes with a loupe, and is stated as such below.
 */
const GRADES = [
  { id: 'FL', label: 'FL', name: 'Flawless', ceiling: 0 },
  { id: 'IF', label: 'IF', name: 'Internally flawless', ceiling: 0.7 },
  { id: 'VVS1', label: 'VVS1', name: 'Very very slightly included 1', ceiling: 1.2 },
  { id: 'VVS2', label: 'VVS2', name: 'Very very slightly included 2', ceiling: 2 },
  { id: 'VS1', label: 'VS1', name: 'Very slightly included 1', ceiling: 3.2 },
  { id: 'VS2', label: 'VS2', name: 'Very slightly included 2', ceiling: 4.6 },
  { id: 'SI1', label: 'SI1', name: 'Slightly included 1', ceiling: 6.4 },
  { id: 'SI2', label: 'SI2', name: 'Slightly included 2', ceiling: 8.5 },
  { id: 'I1', label: 'I1', name: 'Included 1', ceiling: 11.5 },
  { id: 'I2', label: 'I2', name: 'Included 2', ceiling: 15 },
  { id: 'I3', label: 'I3', name: 'Included 3', ceiling: Infinity },
] as const;

interface Mark {
  id: number;
  feature: string;
  /** Position on the plot, in percent of the diagram box. */
  x: number;
  y: number;
  /** Which view it was plotted on. */
  view: 'crown' | 'pavilion';
}

let markId = 0;

/**
 * Where on the stone a feature sits changes how much it matters. Under the table
 * it is looked straight through and is the worst place for anything dark; near
 * the girdle it is hidden by the setting; in the pavilion it reflects and
 * multiplies. This is the multiplier for that, and it is the part of grading
 * that a table of grades cannot express at all.
 */
function positionFactor(mark: Mark) {
  const dx = mark.x - 50;
  const dy = mark.y - 50;
  const fromCentre = Math.hypot(dx, dy) / 50;

  if (mark.view === 'pavilion') {
    // Reflections: a pavilion inclusion appears in several facets at once.
    return 1.35;
  }
  // Under the table is worst; the girdle rim is largely hidden by a setting.
  if (fromCentre < 0.42) return 1.4;
  if (fromCentre > 0.82) return 0.55;
  return 1;
}

/**
 * Read a certificate's plot diagram by drawing one.
 *
 * The 4Cs section on this site teaches the grading vocabulary and the stone
 * library gives the figures. Neither of them touches the one page of a grading
 * report that everybody looks at and nobody can read: the plot — two little
 * outlines of the stone covered in red and green marks, with no legend that
 * explains what any of it means for the object in their hand.
 *
 * So this is the plot, run backwards. Place features on the diagram and the
 * grade is derived in front of you, which teaches three things a table of grades
 * cannot:
 *
 *  - Red and green are not the same thing. Green marks are external and mostly
 *    irrelevant to clarity, and a report covered in green is not a poor stone.
 *  - *Where* matters as much as what. The same crystal under the table and at
 *    the girdle are two different stones, because a setting hides one of them.
 *  - Two marks can beat five. Weighted severity, not a count.
 *
 * The grade produced here is a demonstration of the logic and not a grading. A
 * real grade is one person's judgement under a loupe with a master set beside
 * them, and the panel says so rather than implying a calculation exists.
 */
export default function InclusionPlotter({ className = '' }: { className?: string }) {
  const reduced = useReducedMotion();
  const [featureId, setFeatureId] = useState(FEATURES[0].id);
  const [view, setView] = useState<'crown' | 'pavilion'>('crown');
  const [marks, setMarks] = useState<Mark[]>([]);

  const feature = FEATURES.find((f) => f.id === featureId) ?? FEATURES[0];

  const score = useMemo(
    () =>
      marks.reduce((total, mark) => {
        const f = FEATURES.find((x) => x.id === mark.feature);
        if (!f) return total;
        // External features do not touch clarity, which is the single most
        // useful thing on this panel — so they contribute a fraction only, to
        // reflect the finish grade they actually affect.
        const clarityWeight = f.internal ? f.weight : f.weight * 0.15;
        return total + clarityWeight * positionFactor(mark);
      }, 0),
    [marks]
  );

  const grade = GRADES.find((g) => score <= g.ceiling) ?? GRADES[GRADES.length - 1];
  const internalCount = marks.filter(
    (m) => FEATURES.find((f) => f.id === m.feature)?.internal
  ).length;

  const plot = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    // Outside the stone's outline is off the plot, the same as on a real report.
    if (Math.hypot(x - 50, y - 50) > 48) return;
    setMarks((prev) => [...prev, { id: markId++, feature: featureId, x, y, view }]);
  };

  return (
    <div className={`space-y-8 ${className}`}>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
        {/* The plot. */}
        <div className="space-y-4">
          <div className="flex gap-2">
            {(['crown', 'pavilion'] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                aria-pressed={view === v}
                className={`flex-1 rounded-full border py-2 font-accent text-[10px] uppercase tracking-luxe transition-colors duration-300 ${
                  view === v
                    ? 'border-accent/60 bg-accent/12 text-accent'
                    : 'border-hairline text-muted hover:border-accent/40 hover:text-accent'
                }`}
              >
                {v === 'crown' ? 'Crown — from above' : 'Pavilion — from below'}
              </button>
            ))}
          </div>

          <div
            onClick={plot}
            role="application"
            aria-label={`Plot diagram, ${view} view. Click to place a ${feature.name}.`}
            className="loupe-grid cursor-crosshair-fine relative aspect-square overflow-hidden rounded-2xl border border-hairline bg-surface-sunken"
          >
            {/* The stone's outline and facet lines. Drawn per view, because a
                crown and a pavilion are genuinely different diagrams and a
                report prints both. */}
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
              <circle cx={50} cy={50} r={48} fill="none" stroke="rgb(var(--hairline))" strokeOpacity={0.5} strokeWidth={0.6} />
              <circle cx={50} cy={50} r={42} fill="none" stroke="rgb(var(--hairline))" strokeOpacity={0.3} strokeWidth={0.4} />

              {view === 'crown' ? (
                <>
                  {/* Table octagon and the eight bezel facets round it. */}
                  <polygon
                    points="50,26 67,33 74,50 67,67 50,74 33,67 26,50 33,33"
                    fill="none"
                    stroke="rgb(var(--hairline))"
                    strokeOpacity={0.42}
                    strokeWidth={0.5}
                  />
                  {Array.from({ length: 8 }).map((_, i) => {
                    const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
                    return (
                      <line
                        key={i}
                        x1={50 + Math.cos(a) * 24}
                        y1={50 + Math.sin(a) * 24}
                        x2={50 + Math.cos(a) * 42}
                        y2={50 + Math.sin(a) * 42}
                        stroke="rgb(var(--hairline))"
                        strokeOpacity={0.3}
                        strokeWidth={0.4}
                      />
                    );
                  })}
                </>
              ) : (
                <>
                  {/* Pavilion mains converging on the culet. */}
                  {Array.from({ length: 8 }).map((_, i) => {
                    const a = (i / 8) * Math.PI * 2;
                    return (
                      <line
                        key={i}
                        x1={50}
                        y1={50}
                        x2={50 + Math.cos(a) * 42}
                        y2={50 + Math.sin(a) * 42}
                        stroke="rgb(var(--hairline))"
                        strokeOpacity={0.34}
                        strokeWidth={0.4}
                      />
                    );
                  })}
                  <circle cx={50} cy={50} r={3} fill="none" stroke="rgb(var(--hairline))" strokeOpacity={0.5} strokeWidth={0.5} />
                </>
              )}
            </svg>

            {/* The marks on this view. */}
            {marks
              .filter((m) => m.view === view)
              .map((mark) => {
                const f = FEATURES.find((x) => x.id === mark.feature);
                if (!f) return null;
                return (
                  <motion.span
                    key={mark.id}
                    initial={reduced ? undefined : { scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, ease: easeCine.catch }}
                    aria-hidden="true"
                    className="pointer-events-none absolute block"
                    style={{ left: `${mark.x}%`, top: `${mark.y}%` }}
                  >
                    <FeatureGlyph feature={f} />
                  </motion.span>
                );
              })}

            {marks.length === 0 && (
              <p className="pointer-events-none absolute inset-x-6 bottom-6 text-center font-sans text-[11px] font-light leading-relaxed text-faint">
                Click inside the outline to plot a {feature.name.toLowerCase()}. Under the table
                counts for more than near the girdle — the setting hides one and not the other.
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMarks((prev) => prev.slice(0, -1))}
              disabled={marks.length === 0}
              className="flex flex-1 items-center justify-center gap-2 rounded-full border border-hairline py-2 font-accent text-[10px] uppercase tracking-luxe text-muted transition-colors duration-300 hover:border-accent/40 hover:text-accent disabled:opacity-30"
            >
              <Undo2 className="h-3.5 w-3.5" aria-hidden="true" />
              Undo
            </button>
            <button
              type="button"
              onClick={() => setMarks([])}
              disabled={marks.length === 0}
              className="flex flex-1 items-center justify-center gap-2 rounded-full border border-hairline py-2 font-accent text-[10px] uppercase tracking-luxe text-muted transition-colors duration-300 hover:border-accent/40 hover:text-accent disabled:opacity-30"
            >
              <Eraser className="h-3.5 w-3.5" aria-hidden="true" />
              Clear the plot
            </button>
          </div>
        </div>

        {/* The legend, the grade, and the reading. */}
        <div className="space-y-6">
          {/* The grade, derived. */}
          <div className="rounded-2xl border border-hairline bg-surface-raised/45 p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <div>
                <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
                  Where this plot lands
                </p>
                <p className="mt-1 font-display text-5xl leading-none text-accent">{grade.label}</p>
                <p className="mt-1 font-sans text-xs font-light text-secondary">{grade.name}</p>
              </div>
              <div className="text-right">
                <p className="nums-tabular font-accent text-[10px] uppercase tracking-luxe text-faint">
                  {marks.length} marks · {internalCount} internal
                </p>
                <p className="nums-tabular mt-1 font-display text-xl text-primary">
                  {score.toFixed(1)}
                  <span className="ml-1 font-accent text-[10px] uppercase tracking-luxe text-faint">
                    weighted
                  </span>
                </p>
              </div>
            </div>

            {/* The scale, with the current position on it. */}
            <div className="mt-6 flex gap-0.5" aria-hidden="true">
              {GRADES.map((g) => (
                <span key={g.id} className="flex-1">
                  <motion.span
                    initial={false}
                    animate={{
                      opacity: g.id === grade.id ? 1 : 0.18,
                      scaleY: g.id === grade.id ? 1 : 0.45,
                    }}
                    transition={{ duration: 0.35 }}
                    className="block h-2 w-full origin-bottom rounded-sm bg-accent"
                  />
                  <span
                    className={`mt-1.5 block text-center font-accent text-[8px] uppercase tracking-wide ${
                      g.id === grade.id ? 'text-accent' : 'text-faint'
                    }`}
                  >
                    {g.label}
                  </span>
                </span>
              ))}
            </div>

            <p className="mt-5 border-t border-hairline pt-4 font-sans text-[11px] font-light leading-relaxed text-faint">
              This is the logic of a grade, not a grade. A real one is a person’s judgement at 10×
              with a master set beside them, and two graders can and do differ by one step on the
              same stone. Nobody grades with arithmetic.
            </p>
          </div>

          {/* The legend, which is the actually useful half. */}
          <div className="grid gap-2.5 sm:grid-cols-2">
            {FEATURES.map((f) => {
              const on = f.id === featureId;
              const count = marks.filter((m) => m.feature === f.id).length;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFeatureId(f.id)}
                  aria-pressed={on}
                  className={`flex items-start gap-3 rounded-xl border p-3 text-left transition-colors duration-300 ${
                    on
                      ? 'border-accent/55 bg-surface-raised/70'
                      : 'border-hairline bg-surface-raised/20 hover:border-accent/35'
                  }`}
                >
                  <span className="mt-1 flex-shrink-0">
                    <FeatureGlyph feature={f} static />
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-baseline gap-2">
                      <span
                        className={`font-sans text-sm font-light ${on ? 'text-accent' : 'text-primary'}`}
                      >
                        {f.name}
                      </span>
                      {count > 0 && (
                        <span className="nums-tabular font-accent text-[9px] text-accent">
                          ×{count}
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block font-sans text-[11px] font-light leading-relaxed text-faint">
                      {f.plain}
                    </span>
                    <span className="mt-1 block font-accent text-[8px] uppercase tracking-luxe text-faint">
                      {f.internal ? 'internal · red' : 'external · green'} · seen at{' '}
                      {f.visibility === 'eye' ? 'a glance' : f.visibility}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <motion.p
            key={feature.id}
            initial={reduced ? undefined : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-xl border border-hairline bg-surface-raised/30 p-4 font-sans text-sm font-light leading-relaxed text-secondary"
          >
            <strong className="font-normal text-accent">{feature.name}.</strong> {feature.note}
          </motion.p>
        </div>
      </div>
    </div>
  );
}

/**
 * The symbol a laboratory draws for each feature. Red for internal, green for
 * external — the only two colours on a real plot, and the whole legend.
 */
function FeatureGlyph({ feature, static: isStatic = false }: { feature: Feature; static?: boolean }) {
  const stroke = feature.internal ? 'rgb(var(--burgundy-300))' : 'rgb(var(--jade-300))';
  const size = isStatic ? 14 : 16;

  const glyph = () => {
    switch (feature.id) {
      case 'crystal':
        return <polygon points="8,2 14,8 8,14 2,8" fill="none" stroke={stroke} strokeWidth={1.4} />;
      case 'feather':
        return (
          <path d="M 2 12 C 5 5, 11 4, 14 3 M 6 9 L 8 11 M 9 7 L 11 9" fill="none" stroke={stroke} strokeWidth={1.3} />
        );
      case 'cloud':
        return (
          <g fill={stroke}>
            {[[6, 7], [9, 6], [11, 9], [7, 10], [10, 11]].map(([cx, cy]) => (
              <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={0.9} />
            ))}
          </g>
        );
      case 'pinpoint':
        return <circle cx={8} cy={8} r={1.4} fill={stroke} />;
      case 'needle':
        return <line x1={3} y1={12} x2={13} y2={4} stroke={stroke} strokeWidth={1.4} />;
      case 'chip':
        return <path d="M 3 13 L 7 5 L 11 13 Z" fill="none" stroke={stroke} strokeWidth={1.4} />;
      case 'polish-line':
        return (
          <g stroke={stroke} strokeWidth={1}>
            <line x1={3} y1={11} x2={11} y2={4} />
            <line x1={6} y1={13} x2={14} y2={6} />
          </g>
        );
      default:
        return <rect x={3} y={5} width={10} height={6} fill="none" stroke={stroke} strokeWidth={1.3} />;
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      className={isStatic ? '' : '-translate-x-1/2 -translate-y-1/2'}
      aria-hidden="true"
    >
      {glyph()}
    </svg>
  );
}
