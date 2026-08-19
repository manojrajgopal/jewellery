'use client';

import { useCallback, useEffect, useState } from 'react';

const KEY = 'aurum-compare';
const EVENT = 'aurum-compare-change';

/**
 * Three is the cap, and it is a design decision rather than a technical one.
 * Four columns of specification on a phone is unreadable, and in practice nobody
 * genuinely compares more than three pieces at once — they compare two and keep
 * a third in reserve.
 */
export const COMPARE_LIMIT = 3;

const read = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.filter((v) => typeof v === 'string').slice(0, COMPARE_LIMIT)
      : [];
  } catch {
    return [];
  }
};

const write = (ids: string[]) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    /* blocked storage — the session list still works from memory */
  }
  window.dispatchEvent(new CustomEvent(EVENT));
};

/**
 * The comparison tray, persisted and shared across every mounted component the
 * same way the wishlist is — a custom event for this tab, `storage` for others.
 *
 * `ids` is empty on the server and fills after mount, so anything rendered from
 * it has to tolerate an empty first paint.
 */
export function useCompare() {
  const [ids, setIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setIds(read());
    setHydrated(true);

    const sync = () => setIds(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  /** Returns 'added' | 'removed' | 'full' so the caller can word its own toast. */
  const toggle = useCallback((id: string): 'added' | 'removed' | 'full' => {
    const current = read();
    if (current.includes(id)) {
      const next = current.filter((v) => v !== id);
      write(next);
      setIds(next);
      return 'removed';
    }
    if (current.length >= COMPARE_LIMIT) return 'full';
    const next = [...current, id];
    write(next);
    setIds(next);
    return 'added';
  }, []);

  const remove = useCallback((id: string) => {
    const next = read().filter((v) => v !== id);
    write(next);
    setIds(next);
  }, []);

  const clear = useCallback(() => {
    write([]);
    setIds([]);
  }, []);

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  return {
    ids,
    has,
    toggle,
    remove,
    clear,
    count: ids.length,
    full: ids.length >= COMPARE_LIMIT,
    hydrated,
  };
}

/** Fired by the tray so the layer above can open the comparison table. */
export const openCompare = () =>
  window.dispatchEvent(new CustomEvent('aurum-open-compare'));
