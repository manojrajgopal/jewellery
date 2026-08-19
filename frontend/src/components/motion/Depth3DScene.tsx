'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface Layer {
  /** 0 is glued to the frame; 1 travels the full amount. Negatives go the other way. */
  depth: number;
  content: React.ReactNode;
  className?: string;
}

interface Depth3DSceneProps {
  layers: Layer[];
  className?: string;
  /** Pixels the deepest layer travels at the frame's edge. */
  travel?: number;
  /** Degrees of stage rotation under the pointer. */
  rotate?: number;
  children?: React.ReactNode;
}

/**
 * A diorama: several layers that displace by different amounts as the pointer
 * moves, producing motion parallax without any actual 3D.
 *
 * The stage also rotates very slightly, which matters more than it sounds —
 * pure translation reads as sliding cutouts, while a couple of degrees of
 * rotation makes the eye accept the layers as sitting at different distances.
 */
export default function Depth3DScene({
  layers,
  className = '',
  travel = 30,
  rotate = 5,
  children,
}: Depth3DSceneProps) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 90, damping: 26, mass: 0.7 });
  const sy = useSpring(py, { stiffness: 90, damping: 26, mass: 0.7 });

  const rotateY = useTransform(sx, [-0.5, 0.5], [-rotate, rotate]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [rotate, -rotate]);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
      style={{ perspective: '1200px' }}
      className={`relative ${className}`}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative h-full w-full"
      >
        {layers.map((layer, i) => (
          <PLayer key={i} sx={sx} sy={sy} travel={travel} {...layer} />
        ))}
        {children}
      </motion.div>
    </div>
  );
}

function PLayer({
  sx,
  sy,
  depth,
  travel,
  content,
  className = '',
}: Layer & {
  sx: ReturnType<typeof useSpring>;
  sy: ReturnType<typeof useSpring>;
  travel: number;
}) {
  const x = useTransform(sx, [-0.5, 0.5], [-travel * depth, travel * depth]);
  const y = useTransform(sy, [-0.5, 0.5], [-travel * depth, travel * depth]);

  return (
    <motion.div
      style={{ x, y, z: depth * 40 }}
      className={`absolute inset-0 ${className}`}
    >
      {content}
    </motion.div>
  );
}
