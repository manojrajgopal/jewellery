'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, type MotionValue } from 'framer-motion';

interface MagneticTextProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'div';
  className?: string;
  /** Radius in px within which a glyph responds to the pointer. */
  radius?: number;
  /** Peak displacement in px at the pointer's centre. */
  strength?: number;
  /** Glyphs also swell slightly as the pointer passes over them. */
  lift?: boolean;
  highlightWords?: string[];
}

/** What each glyph hands up to the parent so one loop can drive them all. */
interface GlyphHandle {
  el: HTMLSpanElement;
  x: MotionValue<number>;
  y: MotionValue<number>;
  scale: MotionValue<number>;
  /** Cached centre, refreshed on resize and scroll rather than per frame. */
  cx: number;
  cy: number;
}

/**
 * Display type whose glyphs are drawn toward the pointer, each on its own
 * spring. Purely a hover garnish: the text renders complete and in position on
 * the server, and touch or reduced-motion visitors get exactly that.
 *
 * Two deliberate performance decisions, both of which are what usually make an
 * effect like this drop frames:
 *   - Glyph centres are measured once per resize/scroll, never per pointer
 *     move. Forty bounding-box reads a frame is forty forced layouts.
 *   - One rAF loop drives every glyph, rather than one loop each. Glyphs
 *     register their own motion values upward so the parent can write to them
 *     without owning a fixed-size pool of hooks.
 */
export default function MagneticText({
  text,
  as = 'h2',
  className = '',
  radius = 160,
  strength = 22,
  lift = true,
  highlightWords = [],
}: MagneticTextProps) {
  const words = useMemo(() => text.split(' '), [text]);
  const handles = useRef(new Map<number, GlyphHandle>());
  const pointer = useRef({ x: -9999, y: -9999 });
  const [active, setActive] = useState(false);

  const register = useCallback((slot: number, handle: GlyphHandle | null) => {
    if (handle) handles.current.set(slot, handle);
    else handles.current.delete(slot);
  }, []);

  const measure = useCallback(() => {
    handles.current.forEach((h) => {
      const r = h.el.getBoundingClientRect();
      h.cx = r.left + r.width / 2;
      h.cy = r.top + r.height / 2;
    });
  }, []);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;
    setActive(true);
  }, []);

  useEffect(() => {
    if (!active) return;

    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, { passive: true });

    let raf = 0;
    const loop = () => {
      const px = pointer.current.x;
      const py = pointer.current.y;

      handles.current.forEach((h) => {
        const dx = px - h.cx;
        const dy = py - h.cy;
        const dist = Math.hypot(dx, dy);

        if (dist < radius && dist > 0.01) {
          // Squared falloff, so the pull stays concentrated under the pointer
          // rather than dragging the whole line along with it.
          const force = (1 - dist / radius) ** 2;
          h.x.set((dx / dist) * force * strength);
          h.y.set((dy / dist) * force * strength);
          if (lift) h.scale.set(1 + force * 0.24);
        } else if (h.x.get() !== 0 || h.y.get() !== 0 || h.scale.get() !== 1) {
          h.x.set(0);
          h.y.set(0);
          h.scale.set(1);
        }
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure);
    };
  }, [active, measure, radius, strength, lift]);

  const isHighlighted = (word: string) => {
    const clean = word.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    return highlightWords.some((h) => h.toLowerCase() === clean);
  };

  const Tag = motion[as];
  let slot = -1;

  return (
    <Tag
      className={className}
      aria-label={text}
      onPointerMove={(e: React.PointerEvent) => {
        pointer.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerLeave={() => {
        pointer.current = { x: -9999, y: -9999 };
      }}
    >
      {words.map((word, wi) => {
        const accent = isHighlighted(word) ? 'italic text-accent' : '';
        return (
          <span key={`${word}-${wi}`} className="inline-block whitespace-nowrap">
            {Array.from(word).map((char, ci) => {
              slot += 1;
              return (
                <Glyph
                  key={ci}
                  slot={slot}
                  char={char}
                  active={active}
                  accent={accent}
                  register={register}
                />
              );
            })}
            <span className="inline-block">&nbsp;</span>
          </span>
        );
      })}
    </Tag>
  );
}

function Glyph({
  slot,
  char,
  active,
  accent,
  register,
}: {
  slot: number;
  char: string;
  active: boolean;
  accent: string;
  register: (slot: number, handle: GlyphHandle | null) => void;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);

  const spring = { stiffness: 190, damping: 16, mass: 0.35 };
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);
  const sScale = useSpring(scale, { stiffness: 240, damping: 20 });

  const attach = useCallback(
    (el: HTMLSpanElement | null) => {
      if (!el) {
        register(slot, null);
        return;
      }
      const r = el.getBoundingClientRect();
      register(slot, {
        el,
        x,
        y,
        scale,
        cx: r.left + r.width / 2,
        cy: r.top + r.height / 2,
      });
    },
    [register, slot, x, y, scale]
  );

  return (
    <motion.span
      ref={active ? attach : undefined}
      aria-hidden="true"
      style={active ? { x: sx, y: sy, scale: sScale } : undefined}
      className={`inline-block ${accent}`}
    >
      {char}
    </motion.span>
  );
}
