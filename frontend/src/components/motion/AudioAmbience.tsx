'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

const STORAGE_KEY = 'aurum-ambience';

/**
 * A vitrine hum with an occasional struck-crystal chime, synthesised in the
 * browser rather than shipped as an audio file — a few oscillators cost nothing
 * to download and never need a licence.
 *
 * Muted until the visitor asks for it, every time. An autoplaying soundtrack is
 * hostile, and browsers block it anyway; the stored preference deliberately only
 * remembers "off", never "resume playing on arrival".
 */
export default function AudioAmbience({ className = '' }: { className?: string }) {
  const [playing, setPlaying] = useState(false);
  const [available, setAvailable] = useState(false);
  const [hint, setHint] = useState(false);

  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const chimeTimer = useRef<number>(0);
  const nodesRef = useRef<OscillatorNode[]>([]);
  // Throttles for the interaction sounds below.
  const lastHover = useRef(0);
  const lastScroll = useRef(0);
  const lastScrollY = useRef(0);

  useEffect(() => {
    // Reduced motion is a proxy for "no incidental effects, please".
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (typeof window.AudioContext === 'undefined') return;
    setAvailable(true);

    // Offer the control once, briefly, on a first visit that has not opted out.
    try {
      if (localStorage.getItem(STORAGE_KEY) !== 'off') {
        const t = window.setTimeout(() => setHint(true), 6000);
        const h = window.setTimeout(() => setHint(false), 12000);
        return () => {
          window.clearTimeout(t);
          window.clearTimeout(h);
        };
      }
    } catch {
      /* storage blocked — no hint, no harm */
    }
  }, []);

  /** One struck chime: a fundamental plus its fifth, decaying over ~4s. */
  const strike = useCallback(() => {
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (!ctx || !master) return;

    // A pentatonic set, so any two chimes in succession are consonant.
    const notes = [523.25, 587.33, 698.46, 783.99, 1046.5];
    const root = notes[Math.floor(Math.random() * notes.length)];

    [root, root * 1.5].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;

      const now = ctx.currentTime;
      const peak = i === 0 ? 0.16 : 0.06;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(peak, now + 0.012);
      // Exponential decay, because a linear fade on a struck tone sounds
      // like someone turning a knob down.
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.6 + i);

      osc.connect(gain).connect(master);
      osc.start(now);
      osc.stop(now + 4.8);
    });
  }, []);

  /**
   * One short enveloped tone for interaction feedback — click, hover and scroll
   * all share this. Routed through the same master bus as the ambience, so the
   * one toggle governs everything and there is never a second audio graph.
   */
  const voice = useCallback(
    (
      freq: number,
      { type = 'triangle', attack = 0.005, release = 0.18, peak = 0.12 }: {
        type?: OscillatorType;
        attack?: number;
        release?: number;
        peak?: number;
      } = {}
    ) => {
      const ctx = ctxRef.current;
      const master = masterRef.current;
      if (!ctx || !master) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      osc.type = type;
      osc.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(peak, now + attack);
      g.gain.exponentialRampToValueAtTime(0.0001, now + attack + release);
      osc.connect(g).connect(master);
      osc.start(now);
      osc.stop(now + attack + release + 0.05);
    },
    []
  );

  const stop = useCallback(() => {
    window.clearTimeout(chimeTimer.current);
    const master = masterRef.current;
    const ctx = ctxRef.current;

    if (master && ctx) {
      // Fade the bus out before tearing anything down; stopping an oscillator
      // at full gain is an audible click.
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
    }

    window.setTimeout(() => {
      nodesRef.current.forEach((n) => {
        try {
          n.stop();
        } catch {
          /* already stopped */
        }
      });
      nodesRef.current = [];
      ctxRef.current?.close().catch(() => {});
      ctxRef.current = null;
      masterRef.current = null;
    }, 700);

    setPlaying(false);
  }, []);

  const start = useCallback(() => {
    const ctx = new AudioContext();
    ctxRef.current = ctx;

    const master = ctx.createGain();
    master.gain.setValueAtTime(0, ctx.currentTime);
    // Deliberately quiet. This is room tone, not music.
    master.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 1.8);
    master.connect(ctx.destination);
    masterRef.current = master;

    // Two detuned low sines through a lowpass: the hum of a lit display case.
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 320;
    filter.Q.value = 0.7;
    filter.connect(master);

    const drone = ctx.createGain();
    drone.gain.value = 0.05;
    drone.connect(filter);

    [110, 110.4, 164.8].forEach((freq) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;

      // A slow LFO on each partial, so the drone breathes rather than sitting
      // as a dead tone.
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.06 + Math.random() * 0.08;
      lfoGain.gain.value = 0.6;
      lfo.connect(lfoGain).connect(osc.frequency);

      osc.connect(drone);
      osc.start();
      lfo.start();
      nodesRef.current.push(osc, lfo);
    });

    // Chimes at irregular intervals — a fixed period turns into a metronome.
    const schedule = () => {
      chimeTimer.current = window.setTimeout(
        () => {
          strike();
          schedule();
        },
        7000 + Math.random() * 11000
      );
    };
    schedule();

    setPlaying(true);
  }, [strike]);

  const toggle = useCallback(() => {
    setHint(false);
    if (playing) {
      stop();
      try {
        localStorage.setItem(STORAGE_KEY, 'off');
      } catch {
        /* storage blocked */
      }
      return;
    }
    start();
  }, [playing, start, stop]);

  // A tab left in the background should not keep humming.
  useEffect(() => {
    if (!playing) return;
    const onVisibility = () => {
      if (document.hidden) stop();
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [playing, stop]);

  // Interaction sounds: a warm pluck on click, a faint tick on hover, and a
  // directional tone on scroll (brighter down the page, darker back up). Only
  // active while the sound layer is on, so they cost nothing when muted.
  useEffect(() => {
    if (!playing) return;

    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      const control = t?.closest('a,button,[role="button"],input,select,label,textarea');
      voice(control ? 587.33 : 440, {
        type: 'triangle',
        attack: 0.004,
        release: 0.16,
        peak: control ? 0.16 : 0.09,
      });
    };

    const onOver = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t?.closest('a,button,[role="button"]')) return;
      const now = performance.now();
      if (now - lastHover.current < 90) return;
      lastHover.current = now;
      voice(1174.66, { type: 'sine', attack: 0.003, release: 0.07, peak: 0.05 });
    };

    const onScroll = () => {
      const now = performance.now();
      if (now - lastScroll.current < 150) return;
      lastScroll.current = now;
      const y = window.scrollY;
      const down = y >= lastScrollY.current;
      lastScrollY.current = y;
      voice(down ? 329.63 : 246.94, {
        type: 'sine',
        attack: 0.008,
        release: 0.2,
        peak: 0.04,
      });
    };

    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerover', onOver);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerover', onOver);
      window.removeEventListener('scroll', onScroll);
    };
  }, [playing, voice]);

  // Tear the graph down on unmount, or the audio outlives the page.
  useEffect(() => () => stop(), [stop]);

  if (!available) return null;

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={toggle}
        aria-label={playing ? 'Mute ambient sound' : 'Play ambient sound'}
        aria-pressed={playing}
        className="group relative flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-muted transition-colors duration-300 hover:border-gold-500/40 hover:text-accent"
      >
        {playing ? (
          <Volume2 size={15} strokeWidth={1.7} className="text-accent" />
        ) : (
          <VolumeX size={15} strokeWidth={1.7} />
        )}

        {/* Level meter — three bars breathing while it plays */}
        {playing && (
          <span className="absolute -bottom-1 left-1/2 flex -translate-x-1/2 items-end gap-[2px]">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                animate={{ height: [2, 6, 3, 7, 2] }}
                transition={{
                  duration: 1.8 + i * 0.4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.2,
                }}
                className="w-[2px] rounded-full bg-accent"
              />
            ))}
          </span>
        )}
      </button>

      {/* One-time offer of the feature */}
      <AnimatePresence>
        {hint && !playing && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.94 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="glass-strong absolute right-0 top-11 z-50 w-52 rounded-xl p-3"
          >
            <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
              Sound
            </p>
            <p className="mt-1 font-sans text-[11px] font-light leading-relaxed text-muted">
              Turn on the atelier&apos;s room tone for the full experience.
            </p>
            <span className="absolute -top-1 right-3 h-2 w-2 rotate-45 border-l border-t border-hairline bg-[rgb(var(--glass-tint))]" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
