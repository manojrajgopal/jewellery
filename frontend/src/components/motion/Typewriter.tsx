'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

interface TypewriterProps {
  /** One string types once; several cycle, deleting between them. */
  phrases: string | string[];
  className?: string;
  /** Milliseconds per character. */
  speed?: number;
  /** Milliseconds per character while deleting — deletion should feel faster. */
  deleteSpeed?: number;
  /** How long a completed phrase holds before it is deleted. */
  hold?: number;
  /** Start only once scrolled into view. */
  onView?: boolean;
  prefix?: string;
}

/**
 * Types itself out, one character at a time, with a blinking caret.
 *
 * The full text of the longest phrase is rendered invisibly behind the animated
 * copy, which reserves the space it will eventually need — without that, a
 * cycling typewriter reflows every line beneath it on every keystroke. Screen
 * readers get the phrase list as static text; the animation is decorative.
 */
export default function Typewriter({
  phrases,
  className = '',
  speed = 55,
  deleteSpeed = 28,
  hold = 2000,
  onView = true,
  prefix = '',
}: TypewriterProps) {
  // Memoised because the typing effect depends on it: a fresh array identity
  // every render would restart the timer on every keystroke it schedules.
  const list = useMemo(
    () => (Array.isArray(phrases) ? phrases : [phrases]),
    [phrases]
  );
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: false, margin: '-10% 0px' });
  const reduced = useReducedMotion();

  const [shown, setShown] = useState('');
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const started = onView ? inView : true;
  const longest = list.reduce((a, b) => (b.length > a.length ? b : a), '');

  useEffect(() => {
    if (reduced || !started) return;

    const phrase = list[index % list.length];

    // Phrase complete: hold, then start deleting — unless it is the only one,
    // in which case the typewriter has finished its job and should stop.
    if (!deleting && shown === phrase) {
      if (list.length === 1) return;
      const t = window.setTimeout(() => setDeleting(true), hold);
      return () => window.clearTimeout(t);
    }

    if (deleting && shown === '') {
      setDeleting(false);
      setIndex((i) => (i + 1) % list.length);
      return;
    }

    const t = window.setTimeout(
      () => {
        setShown((s) =>
          deleting ? phrase.slice(0, s.length - 1) : phrase.slice(0, s.length + 1)
        );
      },
      deleting ? deleteSpeed : speed
    );
    return () => window.clearTimeout(t);
  }, [shown, deleting, index, started, reduced, list, speed, deleteSpeed, hold]);

  if (reduced) {
    return (
      <span ref={ref} className={className}>
        {prefix}
        {list[0]}
      </span>
    );
  }

  return (
    <span ref={ref} className={`relative inline-block ${className}`}>
      {/* Space reservation — invisible, unmeasured by assistive tech, and the
          reason the line below this never jumps. */}
      <span aria-hidden="true" className="invisible block h-0 overflow-hidden">
        {prefix}
        {longest}
      </span>

      <span aria-hidden="true">
        {prefix}
        {shown}
        <span className="animate-caret-blink ml-0.5 inline-block h-[1em] w-px translate-y-[0.12em] bg-accent align-middle" />
      </span>

      <span className="sr-only">
        {prefix}
        {list.join(', ')}
      </span>
    </span>
  );
}
