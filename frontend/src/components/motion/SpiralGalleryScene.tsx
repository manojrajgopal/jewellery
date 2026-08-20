'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';

export interface SpiralItem {
  id: string;
  title: string;
  note?: string;
  image: string;
  href?: string;
}

interface SpiralGallerySceneProps {
  items: SpiralItem[];
  className?: string;
  /** Height of the pinned scene, in viewport heights. */
  length?: number;
  /** Turns of the helix across the whole run. */
  turns?: number;
  /** Radius of the helix as a fraction of the shorter viewport edge. */
  radius?: number;
}

/**
 * Pieces arranged on a helix, travelled by scroll.
 *
 * The three existing rails all move items across a *plane*: coverflow turns
 * cards on one axis, the orbit ring rotates a circle in place, and the cylinder
 * marquee revolves a drum. A helix is the one arrangement where an item's
 * position and its depth are the same parameter — go round the spiral and you
 * also come toward the viewer, which means an item can be approached, met and
 * passed rather than merely rotated into and out of view.
 *
 * Each item sits at angle `t · turns · 2π` and depth `t`, and the scroll moves a
 * camera along that axis. From there everything is one derivation:
 *
 *   x  = sin(angle) · radius       — the horizontal swing round the axis
 *   y  = (depth − camera) · pitch  — the vertical travel toward the viewer
 *   z  = cos(angle) · radius       — how far behind the axis it currently is
 *
 * and z drives scale, blur and dim together, so an item on the far side of the
 * helix is genuinely behind the axis rather than just smaller. Doing this with
 * CSS `preserve-3d` was the first attempt and it fails on the same thing every
 * time: 3D-transformed children cannot be reliably z-ordered against non-3D
 * siblings, so the captions kept punching through the plates. Sorting by a
 * computed z-index solves it outright.
 */
export default function SpiralGalleryScene({
  items,
  className = '',
  length = 3.2,
  turns = 1.6,
  radius = 0.3,
}: SpiralGallerySceneProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 62, damping: 22, mass: 0.9 });
  const camera = reduced ? scrollYProgress : smooth;

  if (reduced) {
    // No helix, no pin: the same pieces as a plain grid, in the same order.
    return (
      <div className={`mx-auto grid max-w-6xl gap-8 px-6 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
        {items.map((item) => (
          <PlateFrame key={item.id} href={item.href} title={item.title}>
            <figure className="overflow-hidden rounded-2xl border border-hairline">
              <div className="relative aspect-plate">
                <Image src={item.image} alt={item.title} fill className="object-cover" sizes="33vw" />
              </div>
              <figcaption className="p-4">
                <p className="font-display text-xl text-primary">{item.title}</p>
                {item.note && (
                  <p className="mt-1 font-sans text-xs font-light text-secondary">{item.note}</p>
                )}
              </figcaption>
            </figure>
          </PlateFrame>
        ))}
      </div>
    );
  }

  return (
    <div ref={ref} className="relative" style={{ height: `${length * 100}vh` }}>
      <div className={`sticky top-0 h-screen overflow-hidden ${className}`}>
        {/* The axis of the helix, drawn. Without it the plates look scattered;
            with it they read as threaded onto something. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[linear-gradient(180deg,transparent,rgb(var(--accent)/0.3)_22%,rgb(var(--accent)/0.3)_78%,transparent)]"
        />

        {items.map((item, i) => (
          <SpiralPlate
            key={item.id}
            item={item}
            depth={items.length > 1 ? i / (items.length - 1) : 0.5}
            index={i}
            total={items.length}
            camera={camera}
            turns={turns}
            radius={radius}
          />
        ))}

        {/* Progress, as a count rather than a bar: on a helix a percentage is
            meaningless and "fourth of nine" is not. */}
        <ScenePosition camera={camera} total={items.length} />
      </div>
    </div>
  );
}

function SpiralPlate({
  item,
  depth,
  index,
  total,
  camera,
  turns,
  radius,
}: {
  item: SpiralItem;
  depth: number;
  index: number;
  total: number;
  camera: MotionValue<number>;
  turns: number;
  radius: number;
}) {
  // Where this plate is on the helix. Fixed for its lifetime; only the camera
  // moves.
  const angle = depth * turns * Math.PI * 2;
  const sin = Math.sin(angle);
  const cos = Math.cos(angle);

  // Signed distance from the camera, in helix units.
  const dist = useTransform(camera, (c) => depth - c * 1.04 + 0.04);

  // Horizontal swing is fixed by the angle; the depth term only scales it, so a
  // plate on the far side of the axis swings less as it recedes.
  const x = useTransform(dist, (d) => {
    const near = Math.max(0.08, Math.abs(d) + 0.35);
    return `${(sin * radius * 100) / near}vmin`;
  });

  const y = useTransform(dist, (d) => `${d * 120}vh`);

  // Depth in the ring, combined with distance along it. Both matter: the far
  // side of a turn is behind the axis even when it is the nearest plate.
  const scale = useTransform(dist, (d) => {
    const behind = (1 - cos) / 2; // 0 at the front of the turn, 1 at the back
    return Math.max(0.34, 1.06 - Math.abs(d) * 0.55 - behind * 0.3);
  });

  const opacity = useTransform(dist, [-0.55, -0.2, 0, 0.34, 0.85], [0, 0.9, 1, 0.72, 0]);
  const blurValue = useTransform(dist, (d) => Math.min(7, Math.abs(d) * 9 + (1 - cos) * 1.4));
  const filter = useTransform(blurValue, (v) => `blur(${v.toFixed(2)}px)`);
  const rotate = useTransform(dist, (d) => sin * -14 - d * 5);

  // Painter's order: nearest to the viewer on top. Derived from the same cos as
  // the scale, so ordering can never disagree with size.
  const z = Math.round(50 + cos * 20 - index * 0.01);

  return (
    <motion.div
      style={{ x, y, scale, opacity, filter, rotate, zIndex: z }}
      className="absolute left-1/2 top-1/2 w-[42vmin] max-w-sm will-transform"
    >
      {/* The centring translate is on this inner element rather than in the
          motion style: the parent already has an inline transform from the
          helix maths, and an inline transform beats the class that would
          otherwise centre it. */}
      <div className="-translate-x-1/2 -translate-y-1/2">
        <PlateFrame href={item.href} title={item.title}>
        <figure className="overflow-hidden rounded-2xl border border-hairline bg-surface-raised shadow-lift">
          <div className="relative aspect-plate">
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="42vmin"
              className="object-cover"
              // Only the first few are likely to be seen before the visitor has
              // scrolled at all; the rest can wait.
              priority={index < 2}
            />
            <div aria-hidden="true" className="absolute inset-0 bg-vitrine" />
          </div>

          <figcaption className="flex items-baseline justify-between gap-4 border-t border-hairline px-4 py-3">
            <span className="font-display text-lg leading-tight text-primary">{item.title}</span>
            <span className="nums-tabular font-accent text-[10px] uppercase tracking-luxe text-faint">
              {String(index + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}
            </span>
          </figcaption>

          {item.note && (
            <p className="px-4 pb-4 font-sans text-xs font-light leading-relaxed text-secondary">
              {item.note}
            </p>
          )}
        </figure>
        </PlateFrame>
      </div>
    </motion.div>
  );
}

/**
 * A plate is a link when it has somewhere to go and a plain frame when it does
 * not. Split out so the figure inside it is written once — the alternative is
 * two copies of the same markup that drift apart the first time one is edited.
 *
 * The whole scene is scroll-driven and the plates are moving, so a link here has
 * to be genuinely reachable: it keeps its own focus ring, and because the plates
 * are in DOM order rather than visual order, tabbing through them follows the
 * order of the helix.
 */
function PlateFrame({
  href,
  title,
  children,
}: {
  href?: string;
  title: string;
  children: React.ReactNode;
}) {
  if (!href) return <>{children}</>;
  return (
    <Link
      href={href}
      aria-label={`Open the ${title} collection`}
      className="block rounded-2xl outline-none transition-transform duration-500 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-4 focus-visible:ring-offset-[rgb(var(--canvas))]"
    >
      {children}
    </Link>
  );
}

/** The count, driven off the same camera the plates read. */
function ScenePosition({ camera, total }: { camera: MotionValue<number>; total: number }) {
  const label = useTransform(camera, (c) => {
    const at = Math.min(total, Math.max(1, Math.round(c * (total - 1)) + 1));
    return `${String(at).padStart(2, '0')} — ${String(total).padStart(2, '0')}`;
  });

  return (
    <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2">
      <motion.span className="nums-tabular font-accent text-[11px] uppercase tracking-luxest text-accent">
        {label}
      </motion.span>
    </div>
  );
}
