'use client';

import { useEffect, useRef, useState } from 'react';

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
  hue: string;
  spin: number;
  rotation: number;
}

/** Near-white motes vanish on cream, so light gets the darker half of the ramp. */
const PALETTE = {
  dark: ['#FFFBF0', '#F7E2A8', '#EFCE78', '#D4A03A'],
  light: ['#96681F', '#B8842A', '#714D18', '#D4A03A'],
} as const;

/**
 * Gold dust falling from the pointer. Emission is proportional to speed, so a
 * slow drift leaves almost nothing and a fast sweep throws a visible arc —
 * a constant emission rate is what makes trails like this feel like a sticker
 * following the cursor rather than something the motion caused.
 *
 * One canvas, one rAF loop, capped particle pool, and it retires itself
 * entirely on touch or reduced motion.
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

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const palette = PALETTE[theme] ?? PALETTE.dark;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    // A hard ceiling matters: a visitor who scrubs the pointer for ten seconds
    // would otherwise accumulate thousands of motes and stall the tab.
    const MAX = 260;

    let motes: Mote[] = [];
    let raf = 0;
    let last = { x: -9999, y: -9999 };
    let width = 0;
    let height = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const emit = (x: number, y: number, speed: number) => {
      // Fast movement throws more, and throws it further.
      const count = Math.min(6, Math.round(rate * (0.4 + speed / 28)));
      for (let i = 0; i < count; i += 1) {
        if (motes.length >= MAX) motes.shift();
        motes.push({
          x: x + (Math.random() - 0.5) * 10,
          y: y + (Math.random() - 0.5) * 10,
          vx: (Math.random() - 0.5) * 1.1,
          // Slight downward bias so it settles like dust rather than hanging.
          vy: (Math.random() - 0.35) * 1.1,
          size: Math.random() * 1.9 + 0.5,
          age: 0,
          life: life * (0.6 + Math.random() * 0.7),
          hue: palette[Math.floor(Math.random() * palette.length)],
          spin: (Math.random() - 0.5) * 0.14,
          rotation: Math.random() * Math.PI,
        });
      }
    };

    const onMove = (e: PointerEvent) => {
      const speed =
        last.x < -1000 ? 0 : Math.hypot(e.clientX - last.x, e.clientY - last.y);
      last = { x: e.clientX, y: e.clientY };
      if (speed > 1.5) emit(e.clientX, e.clientY, speed);
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      motes = motes.filter((m) => m.age < m.life);
      for (const m of motes) {
        m.age += 1;
        m.x += m.vx;
        m.y += m.vy;
        // Gravity and drag, so the arc curves and slows.
        m.vy += 0.022;
        m.vx *= 0.985;
        m.vy *= 0.988;
        m.rotation += m.spin;

        const t = m.age / m.life;
        // Fades in over the first fifth, then out — a mote that appears at full
        // brightness reads as a hard-edged dot.
        const alpha = t < 0.2 ? t / 0.2 : 1 - (t - 0.2) / 0.8;

        ctx.save();
        ctx.translate(m.x, m.y);
        ctx.rotate(m.rotation);
        ctx.globalAlpha = Math.max(0, alpha) * 0.85;
        ctx.fillStyle = m.hue;
        ctx.shadowBlur = 6;
        ctx.shadowColor = m.hue;
        // Diamond-shaped motes, not circles — a jeweller's dust is faceted.
        ctx.beginPath();
        ctx.moveTo(0, -m.size * 1.6);
        ctx.lineTo(m.size, 0);
        ctx.lineTo(0, m.size * 1.6);
        ctx.lineTo(-m.size, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
    };
  }, [enabled, theme, rate, life]);

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
