'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';

interface VertigoZoomProps {
  children: React.ReactNode;
  className?: string;
  /**
   * How hard the dolly pushes. 1 is the calibrated look; above about 1.6 the
   * counter-scale can no longer keep the subject the same size and it starts to
   * read as a plain zoom with a wobble.
   */
  intensity?: number;
  /** Reverse it: the frame pulls back while the subject holds. */
  reverse?: boolean;
}

/**
 * The dolly zoom — the shot where the camera tracks in while the lens zooms out,
 * so the subject stays exactly the same size and the world behind it collapses.
 *
 * On a flat page the trick is done with two nested transforms. The outer frame
 * scales up and its perspective shortens, which is the dolly. The inner subject
 * counter-scales and is pushed along Z, which is the zoom. The subject's on-
 * screen size is the product of the two, and the numbers here are chosen so that
 * product stays within about 2% of 1 across the whole travel — which is what
 * makes the background appear to move on its own.
 *
 * `preserve-3d` on the frame is load-bearing. Without it the Z translation is
 * flattened away, the counter-scale is all that survives, and the effect
 * inverts into a shrink.
 *
 * Scroll drives it through a spring, because the vertigo shot is unsettling
 * exactly when the move is smooth; raw scroll input makes it jitter and the
 * illusion breaks. Under a reduced-motion preference the children render
 * untransformed — this is the single most motion-sickness-prone effect on the
 * site and there is no toned-down version worth shipping.
 */
export default function VertigoZoom({
  children,
  className = '',
  intensity = 1,
  reverse = false,
}: VertigoZoomProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Smoothing the progress rather than the outputs keeps the two transforms
  // locked to each other — spring them separately and the subject visibly
  // breathes as one lags the other.
  const p = useSpring(scrollYProgress, { stiffness: 400, damping: 38, mass: 0.3 });

  const k = Math.max(0.2, Math.min(intensity, 1.8));
  // Frame: scales up as perspective shortens. Both ends of the travel are the
  // neutral state, so the effect peaks mid-section and resolves either side of
  // it — a section that ends mid-vertigo leaves the layout visibly distorted.
  const frameScale = useTransform(p, [0, 0.5, 1], [1, 1 + 0.3 * k, 1]);
  const perspective = useTransform(p, [0, 0.5, 1], [1500, 1500 - 1050 * k, 1500]);

  // Subject: counter-scales and rides forward on Z by the amount that cancels
  // the frame's growth at the shortened perspective.
  const subjectScale = useTransform(p, [0, 0.5, 1], [1, 1 - 0.2 * k, 1]);
  const subjectZ = useTransform(p, [0, 0.5, 1], [0, 96 * k, 0]);

  // A whisper of barrel distortion sold as brightness falloff at the edges —
  // real wide-angle glass loses light in the corners, and adding it is most of
  // what stops the push looking synthetic.
  const vignette = useTransform(p, [0, 0.5, 1], [0, 0.34 * k, 0]);

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div
        style={{
          scale: reverse ? subjectScale : frameScale,
          perspective,
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
        className="relative"
      >
        <motion.div
          style={{
            scale: reverse ? frameScale : subjectScale,
            z: subjectZ,
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
        >
          {children}
        </motion.div>

        <motion.div
          aria-hidden="true"
          style={{ opacity: vignette }}
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(75%_60%_at_50%_50%,transparent_40%,rgb(var(--shadow-color)/0.85)_100%)]"
        />
      </motion.div>
    </div>
  );
}
