'use client';

import { useEffect, useRef, useState } from 'react';

import { useTheme } from '@/components/providers/ThemeProvider';

interface DiamondSparklesProps {
  density?: number;
  className?: string;
  color?: string;
  /** Sparkles drift away from the pointer and brighten near it. */
  interactive?: boolean;
  /** Draw four-point stars instead of round motes. */
  shape?: 'star' | 'dot' | 'mixed';
}

interface Particle {
  x: number;
  y: number;
  size: number;
  baseOpacity: number;
  vx: number;
  vy: number;
  phase: number;
  twinkle: number;
  star: boolean;
  hue: string;
}

/**
 * Facets are drawn on canvas, so they cannot inherit the theme through CSS.
 * The near-white set catches the light beautifully on obsidian and is simply
 * invisible on cream, so the light theme gets the darker half of the gold ramp
 * and a warm glow instead of a white one.
 */
const PALETTE = {
  dark: ['#FDF2D3', '#EFCE78', '#FFFBF0', '#D6BA8F', '#ECF4FF'],
  light: ['#B8842A', '#96681F', '#D4A03A', '#714D18', '#A68960'],
} as const;

const GLOW = { dark: '#FFFFFF', light: 'rgba(150, 104, 31, 0.55)' } as const;

/**
 * Canvas field of drifting, twinkling facets. Four-point stars catch the light
 * the way a brilliant cut does; the pointer pushes them gently aside.
 */
export default function DiamondSparkles({
  density = 40,
  className = '',
  color,
  interactive = true,
  shape = 'mixed',
}: DiamondSparklesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [disabled, setDisabled] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisabled(true);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Scale the field down on small screens rather than dropping it entirely.
    const isSmall = window.innerWidth < 768;
    const count = Math.round(density * (isSmall ? 0.45 : 1));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const palette = PALETTE[theme] ?? PALETTE.dark;
    const glow = GLOW[theme] ?? GLOW.dark;

    let raf = 0;
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    const pointer = { x: -9999, y: -9999, active: false };

    const seed = (p: Partial<Particle> = {}): Particle => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 0.8,
      baseOpacity: Math.random() * 0.55 + 0.2,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      phase: Math.random() * Math.PI * 2,
      twinkle: 0.012 + Math.random() * 0.028,
      star: shape === 'star' ? true : shape === 'dot' ? false : Math.random() > 0.55,
      hue: color ?? palette[Math.floor(Math.random() * palette.length)],
      ...p,
    });

    const build = () => {
      particles = Array.from({ length: count }, () => seed());
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };

    const drawStar = (p: Particle, alpha: number) => {
      const r = p.size * 3.2;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.phase * 0.35);
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.quadraticCurveTo(0, 0, 0, r);
      ctx.quadraticCurveTo(0, 0, -r, 0);
      ctx.quadraticCurveTo(0, 0, 0, -r);
      ctx.closePath();
      ctx.fillStyle = p.hue;
      ctx.globalAlpha = alpha;
      ctx.shadowBlur = 8;
      ctx.shadowColor = p.hue;
      ctx.fill();
      ctx.restore();
    };

    const drawDot = (p: Particle, alpha: number) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.hue;
      ctx.globalAlpha = alpha;
      ctx.shadowBlur = 6;
      ctx.shadowColor = glow;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.phase += p.twinkle;

        if (interactive && pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 140 && dist > 0.01) {
            const push = (140 - dist) / 140;
            p.x += (dx / dist) * push * 1.6;
            p.y += (dy / dist) * push * 1.6;
          }
        }

        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        let alpha = p.baseOpacity + Math.sin(p.phase) * 0.35;

        if (interactive && pointer.active) {
          const near = Math.hypot(p.x - pointer.x, p.y - pointer.y);
          if (near < 180) alpha += (1 - near / 180) * 0.5;
        }

        alpha = Math.max(0, Math.min(1, alpha));
        if (p.star) drawStar(p, alpha);
        else drawDot(p, alpha);
      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(draw);
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    };
    const onPointerLeave = () => {
      pointer.active = false;
    };

    const observer = new ResizeObserver(resize);
    if (canvas.parentElement) observer.observe(canvas.parentElement);

    resize();
    draw();

    if (interactive) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      window.addEventListener('pointerleave', onPointerLeave);
    }

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [density, color, interactive, shape, theme]);

  if (disabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 ${className}`}
      aria-hidden="true"
    />
  );
}
