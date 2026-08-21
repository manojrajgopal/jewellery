'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';

export interface SpineNode {
  /** The marker on the spine — a year, a step number, a time. */
  marker: string;
  title: string;
  body: string;
  /** Optional aside, set smaller and in the accent face. */
  aside?: string;
}

interface ScrollSpineTimelineProps {
  nodes: SpineNode[];
  className?: string;
  /** Alternate entries either side of the spine on wide screens. */
  alternate?: boolean;
}

/**
 * A timeline whose spine is drawn by the scroll, node by node.
 *
 * The existing heritage timeline lays its entries out and reveals them; this
 * does the opposite — the *line* is the subject, and the entries are consequences
 * of it reaching them. The spine is a gradient bar whose scaleY is bound to the
 * section's scroll progress, and each node watches its own position against that
 * progress so it lights only once the line has actually arrived.
 *
 * That ordering is the whole effect and it is easy to get wrong. Reveal the
 * nodes on their own `whileInView` and they fire slightly before or after the
 * line passes them, which reads as a bug rather than as a sequence. Here every
 * node derives its state from one shared progress value, so the line and the
 * nodes cannot disagree.
 *
 * The travelling head — the bright dot at the end of the drawn line — is what
 * makes it legible as drawing rather than as a bar filling up. It is positioned
 * with `top: percentage` bound to the same value, so it is always exactly at the
 * frontier.
 */
export default function ScrollSpineTimeline({
  nodes,
  className = '',
  alternate = true,
}: ScrollSpineTimelineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    // Starts drawing when the top of the list reaches three-quarters up the
    // viewport and finishes when its bottom clears the middle — so the line is
    // complete while the last entry is still comfortably on screen.
    offset: ['start 75%', 'end 55%'],
  });

  const drawn = useSpring(scrollYProgress, { stiffness: 400, damping: 38, mass: 0.3 });
  const headTop = useTransform(drawn, (v) => `${Math.min(v, 1) * 100}%`);
  const headOpacity = useTransform(drawn, [0, 0.02, 0.96, 1], [0, 1, 1, 0]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* ---- The spine ---- */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-4 top-0 w-px bg-line-subtle md:left-1/2 md:-translate-x-1/2"
      >
        <motion.div
          style={reduced ? { scaleY: 1 } : { scaleY: drawn }}
          className="h-full w-full origin-top bg-gradient-to-b from-accent/20 via-accent to-accent/40"
        />

        {!reduced && (
          <motion.div
            style={{ top: headTop, opacity: headOpacity }}
            className="absolute left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_18px_5px_rgb(var(--gold-500)/0.55)]"
          />
        )}
      </div>

      <ol className="relative space-y-14 md:space-y-20">
        {nodes.map((node, i) => (
          <SpineEntry
            key={node.marker + node.title}
            node={node}
            index={i}
            total={nodes.length}
            progress={drawn}
            alternate={alternate}
            reduced={!!reduced}
          />
        ))}
      </ol>
    </div>
  );
}

function SpineEntry({
  node,
  index,
  total,
  progress,
  alternate,
  reduced,
}: {
  node: SpineNode;
  index: number;
  total: number;
  progress: ReturnType<typeof useSpring>;
  alternate: boolean;
  reduced: boolean;
}) {
  // Where this node sits along the spine, in the same 0–1 space as the drawing
  // progress. The half-step centres each node in its own slot rather than
  // putting the first one at zero, where it would already be lit on arrival.
  const at = (index + 0.5) / total;

  // A short ramp either side of the node's position, so it lights *as* the line
  // reaches it rather than snapping when it crosses.
  const span = 0.45 / total;
  const lit = useTransform(progress, [at - span, at + span * 0.4], [0, 1]);

  const left = alternate && index % 2 === 0;

  // Entries on the left of the spine slide in from the left and vice versa, so
  // both columns appear to be pushed outward by the line rather than dragged
  // the same way. Both signs are computed unconditionally — a hook inside a
  // ternary is a different hook count on the render where `left` flips.
  const travel = reduced ? 0 : left ? -26 : 26;
  const x = useTransform(lit, [0, 1], [travel, 0]);
  const opacity = useTransform(lit, [0, 1], [reduced ? 1 : 0.14, 1]);
  const dotScale = useTransform(lit, [0, 1], [0.5, 1]);

  return (
    <li className="relative">
      <div
        className={`grid gap-x-10 md:grid-cols-2 ${
          left ? '' : 'md:[&>*:first-child]:col-start-2'
        }`}
      >
        {/* The node marker on the spine itself. */}
        <motion.span
          aria-hidden="true"
          style={{ scale: reduced ? 1 : dotScale, opacity }}
          className="absolute left-4 top-2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 bg-accent shadow-[0_0_12px_2px_rgb(var(--gold-500)/0.5)] md:left-1/2"
        />

        <motion.div
          style={{ x, opacity }}
          className={`pl-12 md:pl-0 ${left ? 'md:pr-14 md:text-right' : 'md:pl-14'}`}
        >
          <span className="font-accent text-[11px] uppercase tracking-luxer text-accent nums-tabular">
            {node.marker}
          </span>
          <h3 className="mt-2 font-display text-2xl leading-tight text-primary md:text-3xl">
            {node.title}
          </h3>
          <p className="mt-3 max-w-md font-sans text-sm font-light leading-relaxed text-muted md:text-base">
            {node.body}
          </p>
          {node.aside && (
            <p
              className={`mt-4 max-w-md border-accent/30 pl-4 font-accent text-xs uppercase tracking-luxe text-faint ${
                left ? 'md:border-l-0 md:border-r md:pl-0 md:pr-4' : 'border-l'
              }`}
            >
              {node.aside}
            </p>
          )}
        </motion.div>
      </div>
    </li>
  );
}
