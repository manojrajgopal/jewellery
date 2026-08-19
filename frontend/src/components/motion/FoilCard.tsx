'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

interface FoilCardProps {
  children: React.ReactNode;
  className?: string;
  /** Maximum tilt in degrees on each axis. */
  tilt?: number;
  /** How far the holographic band travels across the sheet, as a percentage. */
  travel?: number;
  /** Respond to device tilt on phones, where there is no pointer to follow. */
  gyro?: boolean;
  /** Rendered above the foil — use for a seal, a hologram mark, a serial. */
  stamp?: React.ReactNode;
}

/**
 * A card finished in holographic foil.
 *
 * Real foil has two behaviours that a static gradient cannot fake. It shifts
 * *hue* as the viewing angle changes, not just position — which is why the band
 * here drives both `background-position` and a hue rotation. And the band's angle
 * tracks the light source rather than staying fixed to the sheet, so tipping the
 * card sweeps the colours across it instead of sliding a stripe along.
 *
 * Everything is written to CSS custom properties on the node, from a single
 * pointer handler, and the paint is done by the compositor from there. That
 * matters more here than usual: this component is meant to be used several times
 * in one grid, and a per-frame React render per card would make a six-card row
 * measurably worse to move a pointer across.
 *
 * On a phone there is no hover, so the same variables are driven from
 * `deviceorientation` when it is available — tilting the handset tips the foil,
 * which is exactly the gesture the effect is imitating.
 */
export default function FoilCard({
  children,
  className = '',
  tilt = 9,
  travel = 100,
  gyro = true,
  stamp,
}: FoilCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [engaged, setEngaged] = useState(false);

  /**
   * `x` and `y` are normalised to −1…1 from the centre of the card. Everything
   * the effect needs is derived from that one pair, which keeps the pointer path
   * and the gyroscope path from drifting out of agreement.
   */
  const apply = useCallback(
    (x: number, y: number) => {
      const el = ref.current;
      if (!el) return;

      // The bearing of the notional light source, in degrees. Offset by 108° so
      // a card at rest already shows a diagonal band rather than a flat wash.
      const angle = 108 + x * 34 - y * 18;

      el.style.setProperty('--foil-angle', `${angle.toFixed(1)}deg`);
      el.style.setProperty(
        '--foil-pos',
        `${(50 + x * travel * 0.5).toFixed(1)}% ${(50 + y * travel * 0.5).toFixed(1)}%`
      );
      el.style.setProperty('--foil-hue', `${(x * 26 - y * 14).toFixed(1)}deg`);
      el.style.setProperty('--tilt-x', `${(-y * tilt).toFixed(2)}deg`);
      el.style.setProperty('--tilt-y', `${(x * tilt).toFixed(2)}deg`);
      // The specular highlight follows the pointer directly, in percentages, so
      // the existing .spotlight-follow surface can read it unchanged.
      el.style.setProperty('--mx', `${(50 + x * 50).toFixed(1)}%`);
      el.style.setProperty('--my', `${(50 + y * 50).toFixed(1)}%`);
    },
    [tilt, travel]
  );

  const reset = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--foil-angle', '108deg');
    el.style.setProperty('--foil-pos', '50% 50%');
    el.style.setProperty('--foil-hue', '0deg');
    el.style.setProperty('--tilt-x', '0deg');
    el.style.setProperty('--tilt-y', '0deg');
    el.style.setProperty('--mx', '50%');
    el.style.setProperty('--my', '50%');
  }, []);

  const onPointerMove = (e: React.PointerEvent) => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    apply(
      ((e.clientX - r.left) / r.width - 0.5) * 2,
      ((e.clientY - r.top) / r.height - 0.5) * 2
    );
    if (!engaged) setEngaged(true);
  };

  // Device tilt, for touch. Only bound when the API actually exists, and only
  // while the card is on screen — a listener per card firing at 60Hz off screen
  // is pure battery cost.
  useEffect(() => {
    if (!gyro || reduced) return;
    if (typeof window === 'undefined' || !('DeviceOrientationEvent' in window)) return;
    const el = ref.current;
    if (!el) return;

    let bound = false;

    const onOrient = (e: DeviceOrientationEvent) => {
      // gamma is the left-right tilt (−90…90), beta the front-back (−180…180).
      // Both are clamped hard: a handset held at 40° should be at full travel,
      // not a third of the way through it.
      const gx = Math.max(-1, Math.min(1, (e.gamma ?? 0) / 32));
      const gy = Math.max(-1, Math.min(1, ((e.beta ?? 45) - 45) / 32));
      apply(gx, gy);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !bound) {
          window.addEventListener('deviceorientation', onOrient);
          bound = true;
        } else if (!entry.isIntersecting && bound) {
          window.removeEventListener('deviceorientation', onOrient);
          bound = false;
          reset();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      if (bound) window.removeEventListener('deviceorientation', onOrient);
    };
  }, [gyro, reduced, apply, reset]);

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={() => {
        setEngaged(false);
        reset();
      }}
      style={
        {
          '--foil-angle': '108deg',
          '--foil-pos': '50% 50%',
          '--foil-hue': '0deg',
          '--tilt-x': '0deg',
          '--tilt-y': '0deg',
          transform:
            'perspective(1100px) rotateX(var(--tilt-x)) rotateY(var(--tilt-y))',
          transition: engaged
            ? 'transform 90ms linear'
            : 'transform 900ms cubic-bezier(0.22, 1, 0.36, 1)',
        } as React.CSSProperties
      }
      className={`group relative overflow-hidden rounded-2xl border border-gold-500/20 bg-surface-raised shadow-lift ${className}`}
    >
      {/* Foil layer. Blend mode rather than opacity: foil is light added to the
          surface beneath it, and an opacity fade greys the card instead. */}
      <span
        aria-hidden="true"
        className="foil-holo pointer-events-none absolute inset-0 mix-blend-screen transition-opacity duration-500"
        style={{
          backgroundPosition: 'var(--foil-pos)',
          filter: 'hue-rotate(var(--foil-hue)) saturate(1.35)',
          opacity: engaged ? 0.95 : 0.55,
        }}
      />

      {/* Diffraction comb, finer than the band and moving the other way, which
          is what keeps the two from reading as one printed gradient. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40 mix-blend-overlay"
        style={{
          backgroundImage:
            'repeating-linear-gradient(calc(var(--foil-angle) * -1), transparent 0px, rgb(var(--hairline) / 0.07) 1.5px, transparent 3px)',
        }}
      />

      {/* Specular hotspot */}
      <span
        aria-hidden="true"
        className="spotlight-follow pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{ opacity: engaged ? 1 : 0 }}
      />

      {/* Content sits above the finish, and is pushed forward in Z so the tilt
          gives it a little parallax of its own. */}
      <div
        className="relative"
        style={{ transform: 'translateZ(40px)', transformStyle: 'preserve-3d' }}
      >
        {children}
      </div>

      {stamp && (
        <div className="pointer-events-none absolute right-4 top-4 z-10">{stamp}</div>
      )}

      {/* Rim light, brightest on the lit edge */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-gold-200/15"
      />
    </div>
  );
}
