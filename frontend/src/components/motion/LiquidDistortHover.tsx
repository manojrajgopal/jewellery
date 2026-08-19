'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Image from 'next/image';
import { useReducedMotion } from 'framer-motion';

interface LiquidDistortHoverProps {
  src: string;
  alt: string;
  className?: string;
  /** Peak displacement in px. Past ~28 the subject stops being readable. */
  strength?: number;
  /** Turbulence scale. Lower is broader, glassier; higher is finer, frostier. */
  frequency?: number;
  /** Overlay content — a caption, a price, a link. */
  children?: React.ReactNode;
  aspect?: string;
  sizes?: string;
  priority?: boolean;
}

/**
 * An image that ripples like poured glass when the pointer crosses it.
 *
 * The distortion is a real SVG displacement map, not a transform: feTurbulence
 * generates a noise field and feDisplacementMap pushes each pixel of the image
 * along it. That is what lets the surface *warp* rather than merely stretch, and
 * it is the difference between reading as glass and reading as a CSS scale.
 *
 * Two values are driven per frame — the displacement scale and the noise's own
 * offset — because a static noise field with a rising scale looks like a lens
 * being pressed onto the picture. Drifting the field is what makes it flow.
 *
 * The filter is written straight to the DOM node from the animation loop rather
 * than through React state. At 60fps a setState per frame is 60 renders a second
 * for an effect nothing else on the page depends on.
 *
 * Falls back to a plain plate with a scale-on-hover under reduced motion, and
 * degrades to the same if a browser ignores `filter: url()` on HTML content.
 */
export default function LiquidDistortHover({
  src,
  alt,
  className = '',
  strength = 22,
  frequency = 0.013,
  children,
  aspect = '4 / 5',
  sizes = '(max-width: 768px) 100vw, 33vw',
  priority = false,
}: LiquidDistortHoverProps) {
  // useId, not a counter: two instances rendered in the same tree must not share
  // a filter id, and a module-level counter diverges between server and client.
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const filterId = `liquid-${uid}`;

  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  const dispRef = useRef<SVGFEDisplacementMapElement>(null);
  const turbRef = useRef<SVGFETurbulenceElement>(null);
  const rafRef = useRef(0);
  // Current and target displacement, eased toward each other so entering and
  // leaving both have weight instead of snapping.
  const level = useRef(0);
  const target = useRef(0);

  useEffect(() => {
    target.current = hovered ? 1 : 0;
  }, [hovered]);

  useEffect(() => {
    if (reduced) return;
    const disp = dispRef.current;
    const turb = turbRef.current;
    if (!disp || !turb) return;

    let t = 0;
    let last = performance.now();
    // Tracks whether the loop still needs to run, so a settled plate stops
    // asking for frames entirely.
    let idle = false;

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      t += dt;

      const gap = target.current - level.current;
      // Rises faster than it falls: the ripple should answer the pointer at once
      // and then relax, the way a liquid surface actually does.
      level.current += gap * dt * (gap > 0 ? 9 : 4.5);

      const settled = Math.abs(gap) < 0.002 && level.current < 0.002;
      if (settled) {
        if (!idle) {
          level.current = 0;
          disp.setAttribute('scale', '0');
          idle = true;
        }
        rafRef.current = requestAnimationFrame(frame);
        return;
      }
      idle = false;

      // A slow breath on top of the pointer response, so a held hover keeps
      // moving instead of freezing at peak displacement.
      const breath = 1 + Math.sin(t * 1.9) * 0.16;
      disp.setAttribute('scale', String(level.current * strength * breath));

      // Drifting the noise field is what turns a dent into a flow.
      const fx = frequency * (1 + Math.sin(t * 0.7) * 0.22);
      const fy = frequency * (1 + Math.cos(t * 0.55) * 0.3);
      turb.setAttribute('baseFrequency', `${fx.toFixed(5)} ${fy.toFixed(5)}`);

      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [reduced, strength, frequency]);

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-hairline bg-surface-sunken ${className}`}
      style={{ aspectRatio: aspect }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* The filter definition. Zero-sized and absolutely positioned so it never
          affects layout — it exists only to be referenced by id. */}
      {!reduced && (
        <svg aria-hidden="true" className="pointer-events-none absolute h-0 w-0">
          <defs>
            <filter id={filterId} x="-12%" y="-12%" width="124%" height="124%">
              <feTurbulence
                ref={turbRef}
                type="fractalNoise"
                baseFrequency={`${frequency} ${frequency}`}
                numOctaves={2}
                seed={7}
                result="noise"
              />
              {/* R drives the horizontal push and G the vertical, which is the
                  conventional pairing and keeps the warp isotropic. */}
              <feDisplacementMap
                ref={dispRef}
                in="SourceGraphic"
                in2="noise"
                scale="0"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>
      )}

      <div
        className="absolute inset-0"
        style={reduced ? undefined : { filter: `url(#${filterId})` }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-[1200ms] ease-luxury group-hover:scale-[1.06]"
        />
      </div>

      {/* Specular band that crosses as the surface deforms — the highlight is
          what tells the eye the warp is a surface and not the image itself. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gold-sheen bg-size-200 opacity-0 mix-blend-overlay transition-opacity duration-700 group-hover:opacity-100"
      />

      {children && (
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-end">
          <div className="media-veil-soft absolute inset-0" />
          <div className="relative p-5 md:p-6">{children}</div>
        </div>
      )}

      {/* Hairline frame that closes in on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-4 border border-gold-400/0 transition-colors duration-700 group-hover:border-gold-400/40"
      />
    </div>
  );
}
