'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

import { useOnScreen } from '@/hooks/useOnScreen';

type PatternId = 'rosette' | 'lattice' | 'crescent' | 'scatter';

interface GranulationSwarmProps {
  className?: string;
  /** How many beads. Around 220 is where a pattern stops looking sparse. */
  count?: number;
  /** Which arrangement they settle into. */
  pattern?: PatternId;
  /** Offer the pattern switcher under the canvas. */
  controls?: boolean;
  height?: number;
}

/**
 * Granulation: gold beads fused to a surface, arranging themselves.
 *
 * The technique is Etruscan, it was lost for the better part of two thousand
 * years, and the reason it was lost is the reason it is worth drawing. There is
 * no solder in granulation. A bead is held against the surface with a trace of
 * copper salt and glue, the whole piece is brought up to a temperature about
 * thirty degrees below the melting point of the gold, and at that temperature —
 * and only in a window of a few seconds — the copper forms an alloy skin that
 * fuses bead to ground without either of them losing their shape. Thirty
 * degrees too far and the entire pattern turns into a puddle.
 *
 * So the visual language is: hundreds of individual objects, each placed by
 * hand, each of which has to arrive exactly where it belongs and then stop
 * absolutely dead. That is what this simulates.
 *
 * The mechanism is a target-seeking swarm rather than a particle field. The
 * site already has drifting motes (`ParticleField`) and falling stones
 * (`CanvasGemRain`); both of those are ambient and neither has a destination.
 * Every bead here has one, and the interesting behaviour is entirely in the
 * approach: critically damped, so a bead slows into its place without
 * overshooting it, because a bead that bounced would have rolled off the work.
 *
 * The pointer is a hot torch tip. Beads near it are pushed off station and
 * settle back once it moves away, which is the honest version of what happens
 * when the flame lingers.
 */

interface Bead {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number;
  ty: number;
  r: number;
}

/** Deterministic pseudo-random, so the server and the client agree on placement. */
const rand = (i: number, salt: number) => {
  const v = Math.sin(i * 91.7 + salt * 47.13) * 43758.5453;
  return v - Math.floor(v);
};

/**
 * Target positions on a unit box, per pattern. All four are real granulation
 * layouts: a rosette is the commonest Etruscan filler, a lattice is what a
 * Karnataka temple piece uses, and a crescent is the standard border run.
 */
const targets = (pattern: PatternId, count: number): { x: number; y: number }[] => {
  const out: { x: number; y: number }[] = [];

  if (pattern === 'rosette') {
    // Concentric rings, each holding as many beads as fit at one bead diameter
    // — which is how a rosette is actually laid, from the centre outward.
    let placed = 0;
    let ring = 0;
    while (placed < count) {
      const radius = ring === 0 ? 0 : ring * 0.075;
      const seats = ring === 0 ? 1 : Math.max(1, Math.round(2 * Math.PI * ring));
      for (let i = 0; i < seats && placed < count; i++, placed++) {
        const theta = (i / seats) * Math.PI * 2 + ring * 0.4;
        out.push({ x: 0.5 + Math.cos(theta) * radius, y: 0.5 + Math.sin(theta) * radius * 0.9 });
      }
      ring++;
    }
    return out;
  }

  if (pattern === 'lattice') {
    const cols = Math.ceil(Math.sqrt(count * 1.6));
    const rows = Math.ceil(count / cols);
    for (let i = 0; i < count; i++) {
      const c = i % cols;
      const r = Math.floor(i / cols);
      // Every other row offset by half a cell — a square lattice leaves gaps a
      // hexagonal one does not, and granulation is always laid hexagonally.
      out.push({
        x: 0.12 + ((c + (r % 2 ? 0.5 : 0)) / cols) * 0.76,
        y: 0.16 + (r / Math.max(1, rows - 1)) * 0.68,
      });
    }
    return out;
  }

  if (pattern === 'crescent') {
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      // Three nested arcs, which is how a border run is built up to width.
      const band = i % 3;
      const theta = Math.PI * (0.12 + t * 0.76);
      const radius = 0.3 + band * 0.045;
      out.push({ x: 0.5 + Math.cos(theta) * radius * 1.3, y: 0.74 - Math.sin(theta) * radius });
    }
    return out;
  }

  for (let i = 0; i < count; i++) {
    out.push({ x: 0.1 + rand(i, 3) * 0.8, y: 0.12 + rand(i, 7) * 0.76 });
  }
  return out;
};

const PATTERNS: { id: PatternId; label: string; note: string }[] = [
  { id: 'rosette', label: 'Rosette', note: 'Laid from the centre out. The commonest Etruscan filler.' },
  { id: 'lattice', label: 'Lattice', note: 'Hexagonal, never square — a square lattice leaves gaps you can see.' },
  { id: 'crescent', label: 'Border run', note: 'Three nested arcs, built up to width rather than drawn at width.' },
  { id: 'scatter', label: 'Loose', note: 'Before anything is placed. This is what the bench starts with.' },
];

export default function GranulationSwarm({
  className = '',
  count = 220,
  pattern = 'rosette',
  controls = true,
  height = 380,
}: GranulationSwarmProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const onScreen = useOnScreen(wrapRef, '180px');

  const [active, setActive] = useState<PatternId>(pattern);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const beads = useRef<Bead[]>([]);

  const layout = useMemo(() => targets(active, count), [active, count]);

  // Beads exist independently of the pattern, so switching a pattern moves the
  // same beads rather than replacing them. That is the whole point of the
  // switcher: you watch a rosette *become* a lattice.
  useEffect(() => {
    if (beads.current.length === count) return;
    beads.current = Array.from({ length: count }, (_, i) => ({
      x: rand(i, 1),
      y: rand(i, 2),
      vx: 0,
      vy: 0,
      tx: 0.5,
      ty: 0.5,
      r: 1.6 + rand(i, 5) * 1.9,
    }));
  }, [count]);

  useEffect(() => {
    beads.current.forEach((b, i) => {
      const t = layout[i] ?? layout[layout.length - 1];
      b.tx = t.x;
      b.ty = t.y;
    });
  }, [layout]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    };
    resize();
    window.addEventListener('resize', resize);

    // Reduced motion: draw the finished pattern once and leave it. The work is
    // still shown — it simply is not performed.
    if (reduced) {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      beads.current.forEach((b) => {
        paint(ctx, b.tx * rect.width * dpr, b.ty * rect.height * dpr, b.r * dpr);
      });
      return () => window.removeEventListener('resize', resize);
    }

    // Off screen, the loop does not start at all rather than starting and
    // idling — the effect re-runs when `onScreen` flips, so the swarm picks up
    // from wherever its beads were left, which is the correct behaviour for
    // something that is meant to be settling into place.
    if (!onScreen) return () => window.removeEventListener('resize', resize);

    let raf = 0;
    const step = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const b of beads.current) {
        // Critically damped seek. A spring stiffness paired with a damping of
        // twice its square root arrives without overshoot, which is the one
        // behaviour a placed bead must have.
        const k = 0.045;
        const c = 2 * Math.sqrt(k);
        b.vx += (b.tx - b.x) * k - b.vx * c;
        b.vy += (b.ty - b.y) * k - b.vy * c;

        // The torch. Close beads are pushed off station; the falloff is squared
        // so the effect is local rather than a general breeze.
        const p = pointer.current;
        if (p) {
          const dx = b.x - p.x;
          const dy = b.y - p.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 0.02 && d2 > 0.000001) {
            const push = (0.02 - d2) * 1.6;
            const d = Math.sqrt(d2);
            b.vx += (dx / d) * push;
            b.vy += (dy / d) * push;
          }
        }

        b.x += b.vx;
        b.y += b.vy;

        paint(ctx, b.x * rect.width * dpr, b.y * rect.height * dpr, b.r * dpr);
      }

      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [reduced, onScreen]);

  const note = PATTERNS.find((p) => p.id === active)?.note ?? '';

  return (
    <div ref={wrapRef} className={className}>
      <div
        className="granule-bed relative overflow-hidden rounded-2xl border border-hairline"
        style={{ height }}
        onPointerMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          pointer.current = {
            x: (e.clientX - rect.left) / rect.width,
            y: (e.clientY - rect.top) / rect.height,
          };
        }}
        onPointerLeave={() => {
          pointer.current = null;
        }}
      >
        <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />

        {!reduced && (
          <p className="pointer-events-none absolute bottom-3 right-4 font-accent text-[9px] uppercase tracking-luxe text-faint">
            The pointer is the flame
          </p>
        )}
      </div>

      {controls && (
        <div className="mt-5">
          <div className="flex flex-wrap gap-2">
            {PATTERNS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setActive(p.id)}
                aria-pressed={active === p.id}
                className={`rounded-full border px-4 py-1.5 font-accent text-[10px] uppercase tracking-luxe transition-colors duration-300 ${
                  active === p.id
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-hairline text-muted hover:border-accent/50 hover:text-accent'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <p className="mt-3 font-sans text-sm font-light leading-relaxed text-muted">{note}</p>
        </div>
      )}
    </div>
  );
}

/**
 * One bead. Drawn as a lit sphere rather than a filled circle — a granule is
 * spherical by definition (it is made by melting a scrap of gold and letting
 * surface tension do the rest), and the highlight sitting up and left of centre
 * is what says so.
 */
function paint(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r);
  g.addColorStop(0, 'rgba(255, 246, 214, 0.95)');
  g.addColorStop(0.45, 'rgba(227, 181, 81, 0.92)');
  g.addColorStop(1, 'rgba(113, 77, 24, 0.85)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}
