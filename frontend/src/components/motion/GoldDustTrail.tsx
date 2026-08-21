'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { onFrame } from '@/lib/frameLoop';
import { canvasDpr, getPerfBudget } from '@/lib/perf';
import { useTheme } from '@/components/providers/ThemeProvider';

interface GoldDustTrailProps {
  /** Particles emitted per pointer move, before speed scaling. */
  rate?: number;
  /** Particle lifetime in frames. */
  life?: number;
}

interface Mote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  age: number;
  life: number;
  /** Index into the pre-rendered sprite set. */
  hue: number;
  spin: number;
  rotation: number;
}

/** Near-white motes vanish on cream, so light gets the darker half of the ramp. */
const PALETTE = {
  dark: ['#FFFBF0', '#F7E2A8', '#EFCE78', '#D4A03A'],
  light: ['#96681F', '#B8842A', '#714D18', '#D4A03A'],
} as const;

/** Size of one sprite tile, in CSS pixels, before per-mote scaling. */
const SPRITE = 24;

/**
 * Gold dust falling from the pointer. Emission is proportional to speed, so a
 * slow drift leaves almost nothing and a fast sweep throws a visible arc —
 * a constant emission rate is what makes trails like this feel like a sticker
 * following the cursor rather than something the motion caused.
 *
 * The glow used to come from `ctx.shadowBlur`, set per mote. That is the most
 * expensive single call in the 2D canvas API: it forces a separate blur pass per
 * fill, so a full pool of 260 motes meant 260 blur passes every frame, and the
 * pointer trail alone could hold the main thread for longer than the frame it
 * was drawn in. The glow is now baked once into four small sprite tiles — one
 * per palette colour — and each mote is a single `drawImage`. Identical look,
 * roughly two orders of magnitude cheaper.
 *
 * The loop also retires itself the moment the pool empties, so a page nobody is
 * waving a pointer across costs nothing.
 */
export default function GoldDustTrail({ rate = 2, life = 46 }: GoldDustTrailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [enabled, setEnabled] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const wide = window.innerWidth >= 1024;
    if (!fine || reduced || !wide) return;
    setEnabled(true);
  }, []);

  /* --- state that outlives a re-render --------------------------------- */

  const motes = useRef<Mote[]>([]);
  const sprites = useRef<HTMLCanvasElement[]>([]);
  const dims = useRef({ width: 0, height: 0, dpr: 1 });
  const stopLoop = useRef<(() => void) | null>(null);

  const palette = useMemo(() => PALETTE[theme] ?? PALETTE.dark, [theme]);

  /**
   * One tile per colour: a faceted diamond with its halo painted in. Done once
   * per theme rather than per mote per frame, which is the whole point.
   */
  const buildSprites = useCallback(
    (dpr: number) => {
      sprites.current = palette.map((hue) => {
        const tile = document.createElement('canvas');
        const px = Math.round(SPRITE * dpr);
        tile.width = px;
        tile.height = px;
        const c = tile.getContext('2d');
        if (!c) return tile;
        c.scale(dpr, dpr);
        const mid = SPRITE / 2;

        // The halo, as a gradient rather than a blur pass.
        const glow = c.createRadialGradient(mid, mid, 0, mid, mid, mid);
        glow.addColorStop(0, hue);
        glow.addColorStop(0.35, `${hue}66`);
        glow.addColorStop(1, `${hue}00`);
        c.fillStyle = glow;
        c.fillRect(0, 0, SPRITE, SPRITE);

        // Diamond-shaped motes, not circles — a jeweller's dust is faceted.
        // Drawn at the tile's reference size; each mote scales the tile.
        const r = SPRITE * 0.17;
        c.fillStyle = hue;
        c.beginPath();
        c.moveTo(mid, mid - r * 1.6);
        c.lineTo(mid + r, mid);
        c.lineTo(mid, mid + r * 1.6);
        c.lineTo(mid - r, mid);
        c.closePath();
        c.fill();

        return tile;
      });
    },
    [palette]
  );

  /* --- the loop -------------------------------------------------------- */

  const draw = useCallback((step: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const { width, height } = dims.current;

    ctx.clearRect(0, 0, width, height);

    const pool = motes.current;
    let write = 0;
    for (let read = 0; read < pool.length; read += 1) {
      const m = pool[read];
      m.age += step;
      if (m.age >= m.life) continue;

      m.x += m.vx * step;
      m.y += m.vy * step;
      // Gravity and drag, so the arc curves and slows.
      m.vy += 0.022 * step;
      m.vx *= Math.pow(0.985, step);
      m.vy *= Math.pow(0.988, step);
      m.rotation += m.spin * step;

      const t = m.age / m.life;
      // Fades in over the first fifth, then out — a mote that appears at full
      // brightness reads as a hard-edged dot.
      const alpha = t < 0.2 ? t / 0.2 : 1 - (t - 0.2) / 0.8;

      const tile = sprites.current[m.hue];
      if (tile) {
        const size = m.size * 6;
        ctx.globalAlpha = Math.max(0, alpha) * 0.85;
        ctx.translate(m.x, m.y);
        ctx.rotate(m.rotation);
        ctx.drawImage(tile, -size / 2, -size / 2, size, size);
        // setTransform is cheaper than save/restore and there is nothing else
        // in the state to preserve.
        ctx.setTransform(dims.current.dpr, 0, 0, dims.current.dpr, 0, 0);
      }

      // Compact in place: filter() allocated a new array every frame.
      pool[write] = m;
      write += 1;
    }
    pool.length = write;

    ctx.globalAlpha = 1;

    // Nothing left to paint — leave the loop rather than clearing an empty
    // canvas sixty times a second until the visitor moves again.
    if (pool.length === 0) {
      stopLoop.current?.();
      stopLoop.current = null;
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const budget = getPerfBudget();
    const dpr = canvasDpr();
    // A hard ceiling matters: a visitor who scrubs the pointer for ten seconds
    // would otherwise accumulate thousands of motes and stall the tab. Scaled
    // by tier, so the trail is the same trail with fewer grains in it.
    const MAX = Math.max(60, Math.round(260 * budget.density));

    buildSprites(dpr);

    let last = { x: -9999, y: -9999 };

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      dims.current = { width, height, dpr };
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const ensureRunning = () => {
      if (stopLoop.current) return;
      stopLoop.current = onFrame(draw, { fps: budget.fps, order: 140 });
    };

    const emit = (x: number, y: number, speed: number) => {
      // Fast movement throws more, and throws it further.
      const count = Math.min(6, Math.round(rate * (0.4 + speed / 28)));
      const pool = motes.current;
      for (let i = 0; i < count; i += 1) {
        if (pool.length >= MAX) pool.shift();
        pool.push({
          x: x + (Math.random() - 0.5) * 10,
          y: y + (Math.random() - 0.5) * 10,
          vx: (Math.random() - 0.5) * 1.1,
          // Slight downward bias so it settles like dust rather than hanging.
          vy: (Math.random() - 0.35) * 1.1,
          size: Math.random() * 1.9 + 0.5,
          age: 0,
          life: life * (0.6 + Math.random() * 0.7),
          hue: Math.floor(Math.random() * palette.length),
          spin: (Math.random() - 0.5) * 0.14,
          rotation: Math.random() * Math.PI,
        });
      }
      ensureRunning();
    };

    const onMove = (e: PointerEvent) => {
      const speed =
        last.x < -1000 ? 0 : Math.hypot(e.clientX - last.x, e.clientY - last.y);
      last = { x: e.clientX, y: e.clientY };
      if (speed > 1.5) emit(e.clientX, e.clientY, speed);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove, { passive: true });

    return () => {
      stopLoop.current?.();
      stopLoop.current = null;
      motes.current = [];
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
    };
  }, [enabled, palette, rate, life, buildSprites, draw]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      // Under the cursor (150) so the bead always reads as the leading edge.
      className="pointer-events-none fixed inset-0 z-[145]"
    />
  );
}
