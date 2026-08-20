'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

interface SmokeVeilProps {
  className?: string;
  /** Opacity multiplier, 0–1. */
  intensity?: number;
  /** Where the plume rises from, as a fraction of the width. */
  originX?: number;
  /** Rise speed multiplier. */
  speed?: number;
  /** Puffs alive at once. Each is a large soft sprite, so keep it modest. */
  count?: number;
}

/**
 * A rising veil of smoke — the incense in a showroom, the quench off a bench.
 *
 * Smoke is convincing or it is not, and what decides it is *shear*. A plume that
 * rises straight and fades is steam on a stage; real smoke is torn sideways by
 * air that moves faster higher up, it rotates as it is torn, and it expands
 * while it thins. All three are here: horizontal drift scales with height, each
 * puff carries its own slow spin, and radius grows as alpha falls.
 *
 * Rendered as soft radial sprites rather than as noise. A noise-field plume
 * needs a per-pixel pass to look like anything; sixty overlapping soft sprites
 * with per-sprite rotation reach the same place for a fraction of the cost,
 * because the GPU is drawing gradients rather than the CPU sampling a function.
 *
 * Uses `lighter` on the obsidian theme so smoke reads as lit vapour, and falls
 * back to normal compositing where `--bloom` is low — additive smoke on a cream
 * page turns the whole section milky.
 */
export default function SmokeVeil({
  className = '',
  intensity = 0.4,
  originX = 0.5,
  speed = 1,
  count = 26,
}: SmokeVeilProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    let raf = 0;
    let last = performance.now();
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * 0.8;

    let bloom = 1;
    let tint = '236, 216, 183';

    const readTokens = () => {
      const cs = getComputedStyle(document.documentElement);
      const b = parseFloat(cs.getPropertyValue('--bloom'));
      bloom = Number.isFinite(b) ? b : 1;
      const c = cs.getPropertyValue('--champagne-300').trim();
      if (c) tint = c.replace(/\s+/g, ', ');
    };

    interface Puff {
      x: number;
      y: number;
      r: number;
      /** 0 at birth, 1 at death. */
      life: number;
      span: number;
      spin: number;
      rot: number;
      /** Per-puff lateral bias, so the plume is not symmetric. */
      lean: number;
    }

    const puffs: Puff[] = [];

    const spawn = (initial = false): Puff => ({
      // Puffs are born in a narrow throat, which is what gives the plume a
      // source. Born across the full width, it reads as fog instead.
      x: w * originX + (Math.random() - 0.5) * w * 0.08,
      y: initial ? Math.random() * h : h * 1.04,
      r: Math.min(w, h) * (0.05 + Math.random() * 0.05),
      life: initial ? Math.random() : 0,
      span: 5.5 + Math.random() * 5,
      spin: (Math.random() - 0.5) * 0.5,
      rot: Math.random() * Math.PI * 2,
      lean: (Math.random() - 0.5) * 2,
    });

    const resize = () => {
      const r = parent.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      readTokens();
      puffs.length = 0;
      for (let i = 0; i < count; i++) puffs.push(spawn(true));
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const t = now / 1000;

      ctx.clearRect(0, 0, w, h);
      // Additive only where the theme can carry it.
      ctx.globalCompositeOperation = bloom > 0.6 ? 'lighter' : 'source-over';

      for (let i = 0; i < puffs.length; i++) {
        const p = puffs[i];
        p.life += dt / p.span;
        if (p.life >= 1) {
          puffs[i] = spawn();
          continue;
        }

        // Height above the throat, 0 at the bottom of the frame.
        const climbed = 1 - p.y / h;

        // Shear: the higher the puff, the faster the sideways air. Combined
        // with a slow global sway, this is what stops the plume being a column.
        const shear = climbed * climbed * 46 * p.lean;
        const sway = Math.sin(t * 0.4 + i * 0.9) * 18 * climbed;
        p.x += (shear + sway) * dt * speed;

        // Rise decelerates as the puff cools — smoke slows as it spreads.
        p.y -= (52 - climbed * 26) * dt * speed;
        p.rot += p.spin * dt;

        // Expand while thinning: constant mass over growing area.
        const r = p.r * (1 + p.life * 2.6);
        // Fade in fast, out slow, and cut the whole thing back near the top of
        // the frame so the plume dissolves instead of clipping.
        const env = Math.min(p.life / 0.18, 1) * (1 - p.life) ** 1.4;
        const alpha = env * intensity * bloom * (0.35 + climbed * 0.2) * 0.5;
        if (alpha <= 0.002) continue;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        // Puffs are drawn as ellipses, wider than tall — smoke spreads laterally
        // faster than it rises once it has left the throat.
        ctx.scale(1.35, 0.85);

        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
        g.addColorStop(0, `rgba(${tint}, ${alpha})`);
        g.addColorStop(0.45, `rgba(${tint}, ${alpha * 0.55})`);
        g.addColorStop(1, `rgba(${tint}, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.globalCompositeOperation = 'source-over';
      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);

    const themeObserver = new MutationObserver(readTokens);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'data-cinema'],
    });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      themeObserver.disconnect();
    };
  }, [reduced, intensity, originX, speed, count]);

  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
