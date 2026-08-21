'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useSceneFrame } from '@/hooks/useSceneFrame';
import { getPerfBudget } from '@/lib/perf';
import { useTheme } from '@/components/providers/ThemeProvider';

interface CausticsCanvasProps {
  className?: string;
  /** Number of overlapping light lobes. More is softer and more expensive. */
  lobes?: number;
  /** 0–1 overall strength. */
  intensity?: number;
  /** Seconds for one full drift cycle. */
  speed?: number;
}

/** Pixel size of one pre-rendered lobe tile. */
const LOBE_TILE = 128;

/**
 * The pooled, rippling light you get when a spot lamp passes through faceted
 * glass — the pattern on the velvet underneath a vitrine.
 *
 * Drawn as a handful of large radial lobes whose centres travel on
 * incommensurate sine paths, composited with `lighter`. Because the periods
 * never divide into each other the pattern never visibly repeats, which is the
 * whole trick: a tiling texture reads as a texture, but drifting lobes read as
 * light.
 *
 * Runs at reduced resolution and blurs on the way up, so it costs a fraction of
 * what the apparent smoothness suggests.
 *
 * Two costs were not obvious from reading it. The first is that this scene is
 * used nine times on the home page, and it painted all nine continuously from
 * the moment the page loaded — including the eight that were nowhere near the
 * viewport. It now paints only while its own section is in reach.
 *
 * The second is `createRadialGradient`. It allocates a gradient object and
 * rasterises a ramp on every call, and there was one call per lobe per frame:
 * nine scenes × seven lobes × 60fps is nearly four thousand gradient
 * rasterisations a second, for three distinct colours. The ramp is now baked
 * into one tile per tint and stamped with `drawImage`, with the per-frame
 * strength applied as alpha — the same image, without rebuilding the ramp to
 * draw it.
 */
export default function CausticsCanvas({
  className = '',
  lobes = 7,
  intensity = 0.55,
  speed = 26,
}: CausticsCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [enabled, setEnabled] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setEnabled(true);
  }, []);

  const budget = useMemo(() => (enabled ? getPerfBudget() : null), [enabled]);

  // Light on cream has to be warmer and weaker or it just washes the page out.
  const { tint, gain } = useMemo(() => {
    const t =
      theme === 'light'
        ? ['184, 132, 42', '212, 160, 58', '150, 104, 31']
        : ['253, 242, 211', '239, 206, 120', '247, 226, 168'];
    return { tint: t, gain: theme === 'light' ? intensity * 0.5 : intensity };
  }, [theme, intensity]);

  // Fewer lobes on a weaker device. The pattern is built from overlaps, so it
  // stays a drifting caustic at four lobes — just a simpler one.
  const lobeCount = budget
    ? Math.max(3, Math.round(lobes * (0.55 + budget.density * 0.45)))
    : lobes;

  /* --- per-frame state, held outside React ----------------------------- */

  const tiles = useRef<HTMLCanvasElement[]>([]);
  const dims = useRef({ w: 1, h: 1, base: 1 });
  const startedAt = useRef(0);

  const seeds = useMemo(
    () =>
      // Each lobe gets its own drift periods and phase, chosen so no two share
      // a common multiple within the visible timescale.
      Array.from({ length: lobeCount }, (_, i) => ({
        ax: 0.18 + i * 0.037,
        ay: 0.13 + i * 0.029,
        px: (i * 2.399) % (Math.PI * 2),
        py: (i * 1.618) % (Math.PI * 2),
        radius: 0.22 + ((i * 7) % 5) * 0.06,
        tintIndex: i % tint.length,
      })),
    [lobeCount, tint.length]
  );

  const frame = useCallback(
    (_step: number, now: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      if (!startedAt.current) startedAt.current = now;
      const t = ((now - startedAt.current) / 1000) * ((Math.PI * 2) / speed);

      const { w, h, base } = dims.current;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';

      for (const s of seeds) {
        // Lissajous drift — the lobe wanders the frame without ever settling.
        const x = w * (0.5 + 0.42 * Math.sin(t * s.ax * 6 + s.px));
        const y = h * (0.5 + 0.38 * Math.sin(t * s.ay * 6 + s.py));
        // Breathing radius keeps the overlaps from freezing into a fixed shape.
        const r = base * s.radius * (0.82 + 0.24 * Math.sin(t * 3.1 + s.px));
        const a = gain * (0.3 + 0.2 * Math.sin(t * 2.3 + s.py));
        if (a <= 0 || r <= 0) continue;

        const tile = tiles.current[s.tintIndex];
        if (!tile) continue;
        ctx.globalAlpha = Math.min(1, a);
        ctx.drawImage(tile, x - r, y - r, r * 2, r * 2);
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    },
    [seeds, gain, speed]
  );

  // Paints only while the section it decorates is within reach of the viewport.
  useSceneFrame(canvasRef, frame, {
    ready: enabled,
    fps: budget?.fps,
    order: 120,
  });

  /* --- sizing and the baked lobe tiles ---------------------------------- */

  useEffect(() => {
    if (!enabled || !budget) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Reduced-res buffer: the result is blurred anyway, so full resolution buys
    // nothing but fill cost. Weaker devices go coarser still — invisible
    // through a 40px blur.
    const scale = budget.tier === 'low' ? 0.3 : budget.tier === 'mid' ? 0.4 : 0.5;

    // One tile per tint, alpha profile baked in. The per-frame strength is
    // applied with globalAlpha, which reproduces the original ramp exactly.
    tiles.current = tint.map((rgb) => {
      const tile = document.createElement('canvas');
      tile.width = LOBE_TILE;
      tile.height = LOBE_TILE;
      const c = tile.getContext('2d');
      if (!c) return tile;
      const mid = LOBE_TILE / 2;
      const g = c.createRadialGradient(mid, mid, 0, mid, mid, mid);
      g.addColorStop(0, `rgba(${rgb}, 1)`);
      g.addColorStop(0.45, `rgba(${rgb}, 0.32)`);
      g.addColorStop(1, `rgba(${rgb}, 0)`);
      c.fillStyle = g;
      c.fillRect(0, 0, LOBE_TILE, LOBE_TILE);
      return tile;
    });

    const resize = () => {
      const parent = canvas.parentElement;
      const width = parent?.offsetWidth ?? window.innerWidth;
      const height = parent?.offsetHeight ?? window.innerHeight;
      const w = Math.max(1, Math.round(width * scale));
      const h = Math.max(1, Math.round(height * scale));
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      dims.current = { w, h, base: Math.min(w, h) };
    };

    resize();

    // The parent's height depends on its own content, which on this site is
    // frequently still settling when the canvas first mounts. A ResizeObserver
    // catches that; a window resize listener alone did not, which is why some
    // sections showed the pattern only across their top edge.
    const observer =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(() => resize());
    if (observer && canvas.parentElement) observer.observe(canvas.parentElement);
    window.addEventListener('resize', resize);

    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, [enabled, budget, tint]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      // The blur radius is a tier token: a 40px filter over a section-sized
      // element, nine times on one page, is one of the heaviest things the
      // compositor is asked to do here.
      className={`caustics-veil pointer-events-none absolute inset-0 h-full w-full mix-blend-screen ${className}`}
    />
  );
}
