'use client';

import { useCallback, useEffect, useState } from 'react';

const KEY = 'aurum-occasions';
const EVENT = 'aurum-occasions-change';

export interface Occasion {
  id: string;
  label: string;
  /** ISO date, YYYY-MM-DD. Stored without a time, because the day is the point. */
  date: string;
  /** Whether it recurs every year — an anniversary does, a wedding date does not. */
  annual: boolean;
  kind: 'anniversary' | 'birthday' | 'wedding' | 'other';
}

const isOccasion = (v: unknown): v is Occasion => {
  if (!v || typeof v !== 'object') return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.id === 'string' &&
    typeof o.label === 'string' &&
    typeof o.date === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(o.date) &&
    typeof o.annual === 'boolean'
  );
};

const read = (): Occasion[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    // Validated rather than cast. This list drives a date calculation, and one
    // malformed entry from an older version of the app would throw inside a render.
    return Array.isArray(parsed) ? parsed.filter(isOccasion) : [];
  } catch {
    return [];
  }
};

const write = (list: Occasion[]) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* blocked storage — the session list still works from memory */
  }
  window.dispatchEvent(new CustomEvent(EVENT));
};

/**
 * Days until the next occurrence of a date.
 *
 * Compared at local midnight on both sides, which is the only way to get "today"
 * to return 0 rather than a fraction that floors to −1 depending on the hour. An
 * annual occasion rolls to next year once this year's has passed; a one-off goes
 * negative and is reported as such so the caller can retire it.
 */
export const daysUntil = (iso: string, annual: boolean): number => {
  const [y, m, d] = iso.split('-').map(Number);
  const today = new Date();
  const midnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  let next = new Date(annual ? midnight.getFullYear() : y, m - 1, d);
  if (annual && next < midnight) next = new Date(midnight.getFullYear() + 1, m - 1, d);

  return Math.round((next.getTime() - midnight.getTime()) / 86400000);
};

/** The next occurrence as a real date, for formatting. */
export const nextDate = (iso: string, annual: boolean): Date => {
  const [y, m, d] = iso.split('-').map(Number);
  const today = new Date();
  const midnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  let next = new Date(annual ? midnight.getFullYear() : y, m - 1, d);
  if (annual && next < midnight) next = new Date(midnight.getFullYear() + 1, m - 1, d);
  return next;
};

/**
 * Dates the visitor has asked us to remind them about, persisted locally and
 * shared across every mounted component the same way the wishlist is — a custom
 * event for this tab, `storage` for others.
 *
 * Deliberately local-only. An occasion list is the most personal thing on the site
 * and there is no account to attach it to, so it never leaves the browser. That is
 * also why the component that uses it says so.
 */
export function useOccasions() {
  const [items, setItems] = useState<Occasion[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(read());
    setHydrated(true);

    const sync = () => setItems(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const add = useCallback((occasion: Omit<Occasion, 'id'>) => {
    const next = [
      ...read(),
      // Date-based id plus a random tail: two occasions added in the same
      // millisecond is unlikely but a duplicate key is a real bug when it happens.
      { ...occasion, id: `oc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}` },
    ];
    write(next);
    setItems(next);
  }, []);

  const remove = useCallback((id: string) => {
    const next = read().filter((o) => o.id !== id);
    write(next);
    setItems(next);
  }, []);

  const clear = useCallback(() => {
    write([]);
    setItems([]);
  }, []);

  /** Sorted by how soon they fall, which is the only order that is ever useful. */
  const upcoming = [...items].sort(
    (a, b) => daysUntil(a.date, a.annual) - daysUntil(b.date, b.annual)
  );

  return { items, upcoming, add, remove, clear, count: items.length, hydrated };
}
