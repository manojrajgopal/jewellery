'use client';

import { ReactNode, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';

import { parallaxAt } from '@/lib/motion';

export interface RigLayer {
  /** How far away this layer is. 1 is the subject; higher is further back. */
  depth: number;
  content: ReactNode;
  className?: string;
}

interface ScrollCameraRigProps {
  layers: RigLayer[];
  className?: string;
  /** Travel toward the subject, in px of translateZ. */
  dolly?: number;
  /** Sideways travel across the scene, in px. */
  pan?: number;
  /** Tilt in degrees across the move. */
  tilt?: number;
  /** Roll in degrees. Small numbers only — this is the one that reads as drone. */
  roll?: number;
  /** Height of the scene. */
  height?: number | string;
}

/**
 * One camera, moved by the scroll, with the scene built in layers in front of
 * it.
 *
 * The site has three existing ways of moving through depth and none of them is
 * this. `Depth3DScene` displaces layers under the *pointer*, which is a hover
 * effect. `PerspectiveCorridor` and `GemFacetTunnel` both move the viewer down
 * a tube of repeating geometry, which is a tunnel rather than a room. This is a
 * camera in a space: it travels, it pans, it tilts, and the things in the room
 * respond according to how far away they are.
 *
 * The rule that makes it read as depth rather than as sliding planes is a
 * division, not a multiplication. A layer twice as far away moves *half* as
 * much — that is what parallax is — and most web parallax assigns speeds by
 * hand in the opposite direction, which is why so much of it looks like a
 * stack of cards being dragged past each other. `parallaxAt` in the motion
 * library is a one-line function and it is the only thing separating this from
 * that.
 *
 * The roll is deliberately tiny by default. Roll is what tells a viewer the
 * camera is being *carried*, and a degree of it is atmosphere while five is a
 * drone shot in an advertisement for a different kind of company.
 */
export default function ScrollCameraRig({
  layers,
  className = '',
  dolly = 140,
  pan = 40,
  tilt = 5,
  roll = 1.2,
  height = '100vh',
}: ScrollCameraRigProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Smoothed, because a camera is carried by a person and a raw scroll value is
  // carried by a mouse wheel. The spring is stiff enough not to lag visibly and
  // soft enough to round off the notches of a wheel.
  const eased = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.6 });

  const z = useTransform(eased, [0, 1], [0, dolly]);
  const x = useTransform(eased, [0, 1], [-pan, pan]);
  const rotateX = useTransform(eased, [0, 1], [tilt, -tilt]);
  const rotateZ = useTransform(eased, [0, 1], [-roll, roll]);

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={{ height, perspective: 1200 }}
    >
      <motion.div
        className="preserve-3d absolute inset-0"
        style={
          reduced
            ? undefined
            : {
                // The camera is the thing that moves. Everything in the scene is
                // static inside it, which is the correct mental model and also
                // the cheap one — one transformed element rather than N.
                z,
                x,
                rotateX,
                rotateZ,
              }
        }
      >
        {layers.map((layer, i) => (
          <LayerPlate key={i} layer={layer} progress={eased} reduced={!!reduced} pan={pan} />
        ))}
      </motion.div>
    </div>
  );
}

/**
 * One plate in the scene.
 *
 * Split into its own component so each layer can own its own `useTransform`
 * without the parent calling hooks inside a loop — which React forbids and
 * which is the single most common way a rig like this gets written wrongly.
 */
function LayerPlate({
  layer,
  progress,
  reduced,
  pan,
}: {
  layer: RigLayer;
  progress: ReturnType<typeof useSpring>;
  reduced: boolean;
  pan: number;
}) {
  const travel = parallaxAt(layer.depth, pan);
  const x = useTransform(progress, [0, 1], [travel, -travel]);

  return (
    <motion.div
      className={`absolute inset-0 ${layer.className ?? ''}`}
      style={
        reduced
          ? undefined
          : {
              x,
              // Pushed back in real Z as well as moved in X. Without this the
              // layers are all on the same plane and the dolly does nothing to
              // the relationship between them, which is the whole point of it.
              translateZ: -layer.depth * 90,
              scale: 1 + layer.depth * 0.075,
            }
      }
    >
      {layer.content}
    </motion.div>
  );
}
