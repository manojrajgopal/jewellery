'use client';

import { useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';

interface CorridorMark {
  /** Where along the corridor this mark sits, 0 at the mouth and 1 at the end. */
  at: number;
  /** Short label carved into the arch. */
  label: string;
  /** The line read as you pass under it. */
  line?: string;
}

interface PerspectiveCorridorProps {
  /** Arches drawn between the mouth and the vanishing point. */
  arches?: number;
  /** Labelled arches. Anything without a mark is drawn plain. */
  marks?: CorridorMark[];
  className?: string;
  /** Height of the pinned scene, in viewport heights. */
  length?: number;
  children?: React.ReactNode;
}

/**
 * A walk down a corridor of arches.
 *
 * The site already has two ways of moving through depth — `GemFacetTunnel`
 * recedes a stack of outlines, and `VertigoZoom` collapses the background behind
 * a fixed subject. Neither of them is *architecture*, and architecture behaves
 * differently: an arch you pass under leaves the frame at the edges rather than
 * shrinking to a point, because you go through it.
 *
 * That is the whole construction here. Each arch has a fixed position along the
 * corridor, and scroll moves the *camera* rather than the arches. An arch's
 * apparent scale is `1 / (1 - travel)` in its own local depth, so as the camera
 * reaches it the scale runs away to infinity and it exits past the frame edges.
 * Beyond the camera it is simply not drawn.
 *
 * The perspective divide is done in the transform rather than by handing the
 * browser a `translateZ` and letting CSS perspective do it, for one practical
 * reason: CSS perspective with 24 planes in one `preserve-3d` parent is a
 * composited-layer count that phones will not hold, and the divide is one line
 * of arithmetic.
 */
export default function PerspectiveCorridor({
  arches = 14,
  marks = [],
  className = '',
  length = 2.6,
  children,
}: PerspectiveCorridorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 400, damping: 38, mass: 0.3 });
  const progress = reduced ? scrollYProgress : smooth;

  // The camera travels a little past the last arch, so the corridor empties
  // before the section unpins rather than at the same moment.
  const camera = useTransform(progress, [0, 1], [-0.06, 1.12]);

  // The room at the end of the corridor brightens as it is approached and then
  // blows out as the camera arrives. Declared here rather than inline: it is
  // used inside the markup and a hook belongs at the top of the component.
  const glowOpacity = useTransform(progress, [0, 0.7, 1], [0.5, 0.9, 0.2]);

  const markFor = (index: number) => {
    const at = (index + 0.5) / arches;
    return marks.find((m) => Math.abs(m.at - at) < 0.5 / arches);
  };

  return (
    <div ref={ref} className="relative" style={{ height: `${length * 100}vh` }}>
      <div
        className={`sticky top-0 flex h-screen items-center justify-center overflow-hidden ${className}`}
      >
        {/* The vanishing point. Warm rather than white, because the corridor is
            lit by the room at the far end of it and not by a lamp in the frame. */}
        <motion.div
          aria-hidden="true"
          style={{ opacity: glowOpacity }}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[46vmin] w-[46vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(var(--gold-200)/0.3),transparent_66%)] blur-2xl"
        />

        {Array.from({ length: arches }).map((_, i) => (
          <Arch
            key={i}
            index={i}
            total={arches}
            camera={camera}
            mark={markFor(i)}
            reduced={!!reduced}
          />
        ))}

        {/* The floor: two converging hairlines, which is the cheapest honest
            perspective cue there is. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
            <path d="M 0 100 L 42 52" stroke="rgb(var(--accent))" strokeOpacity="0.18" className="stroke-hair" fill="none" />
            <path d="M 100 100 L 58 52" stroke="rgb(var(--accent))" strokeOpacity="0.18" className="stroke-hair" fill="none" />
            <path d="M 0 100 L 100 100" stroke="rgb(var(--accent))" strokeOpacity="0.1" className="stroke-hair" fill="none" />
          </svg>
        </div>

        {children && <div className="relative z-10 px-6 text-center">{children}</div>}
      </div>
    </div>
  );
}

/**
 * One arch. Its own component so the perspective transforms are per-arch hooks
 * rather than a hook inside a loop in the parent.
 */
function Arch({
  index,
  total,
  camera,
  mark,
  reduced,
}: {
  index: number;
  total: number;
  camera: MotionValue<number>;
  mark?: CorridorMark;
  reduced: boolean;
}) {
  // Depth of this arch along the corridor, and the distance from the camera to
  // it. `dist` is what everything else is derived from.
  const depth = (index + 0.5) / total;

  const dist = useTransform(camera, (c) => depth - c);

  // The perspective divide. Clamped at both ends: an arch further than 1.4
  // corridor-lengths away is not worth drawing, and one closer than 0.02 would
  // scale past any useful number.
  const scale = useTransform(dist, (d) => (d <= 0.02 ? 44 : Math.min(44, 0.9 / d)));

  // Atmospheric perspective: distant arches are dimmer and bluer, near ones
  // fade as they pass the camera. Both from the same distance value.
  const opacity = useTransform(dist, [-0.05, 0.02, 0.2, 0.9, 1.3], [0, 0.9, 1, 0.42, 0]);
  const blur = useTransform(dist, [0, 0.06, 0.9, 1.3], [3.5, 0, 0, 2.6]);
  const filter = useTransform(blur, (v) => `blur(${Math.max(0, v).toFixed(2)}px)`);

  // Labels only exist inside a narrow band, so they are read as you pass rather
  // than accumulating on screen.
  const labelOpacity = useTransform(dist, [0.02, 0.12, 0.34, 0.6], [0, 1, 1, 0]);

  if (reduced) {
    // Reduced motion gets the corridor as a still elevation: three arches, no
    // camera. The marks are still readable, which is the informative half.
    if (index > 2) return null;
    return (
      <div
        aria-hidden={!mark}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border border-hairline"
        style={{
          width: `${30 + index * 16}vmin`,
          height: `${44 + index * 20}vmin`,
          borderRadius: '999px 999px 4px 4px / 42% 42% 4px 4px',
          opacity: 0.8 - index * 0.22,
        }}
      >
        {mark && (
          <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap font-accent text-[10px] uppercase tracking-luxe text-accent">
            {mark.label}
          </span>
        )}
      </div>
    );
  }

  return (
    <motion.div
      aria-hidden="true"
      // The centring translate lives in the motion style rather than in a
      // Tailwind class: framer writes an inline `transform`, and an inline
      // transform beats the class that would otherwise centre this.
      style={{ scale, opacity, filter, x: '-50%', y: '-50%' }}
      className="pointer-events-none absolute left-1/2 top-1/2 h-[46vmin] w-[32vmin] will-transform"
    >
      {/* The arch itself: an arched border with a keystone, from globals. */}
      <div className="arch-frame h-full w-full" />

      {/* The hairline soffit — the underside of the arch, which is what actually
          sells passing *under* something rather than through a hole. */}
      <div
        className="absolute inset-x-[6%] top-0 h-[3%] rounded-full bg-[linear-gradient(90deg,transparent,rgb(var(--gold-400)/0.5),transparent)]"
      />

      {mark && (
        <motion.span
          style={{ opacity: labelOpacity }}
          className="absolute -top-[9%] left-1/2 -translate-x-1/2 whitespace-nowrap font-accent text-[3vmin] uppercase tracking-luxe text-accent"
        >
          {mark.label}
        </motion.span>
      )}

      {mark?.line && (
        <motion.span
          style={{ opacity: labelOpacity }}
          className="absolute bottom-[6%] left-1/2 w-[26vmin] -translate-x-1/2 text-center font-sans text-[1.6vmin] font-light leading-relaxed text-secondary"
        >
          {mark.line}
        </motion.span>
      )}
    </motion.div>
  );
}
