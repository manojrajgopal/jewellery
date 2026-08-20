'use client';

import { useCallback, useEffect, useState } from 'react';

const KEY = 'aurum-owned';
const EVENT = 'aurum-owned-change';

export type WearRate = 'daily' | 'weekly' | 'occasional' | 'vault';

export interface OwnedPiece {
  id: string;
  /** What the owner calls it, not what the catalogue calls it. */
  label: string;
  /** ISO date, YYYY-MM-DD. When it came into their hands. */
  acquired: string;
  /** ISO date of the last professional check, if there has been one. */
  serviced?: string;
  kind: 'ring' | 'necklace' | 'earrings' | 'bracelet' | 'other';
  /** Whether it is set with stones, which halves the service interval. */
  stones: boolean;
  wear: WearRate;
  note?: string;
}

/**
 * Months between checks, by how hard the piece is worn.
 *
 * These are the bench's own intervals rather than a manufacturer's warranty
 * schedule. A daily-worn set ring needs looking at twice a year because claws
 * move and nobody notices until one has gone; a piece that lives in a safe needs
 * looking at once every few years, and mostly for the clasp.
 *
 * Set pieces halve the interval. That is the single most useful rule on this
 * page: it is never the metal that fails, it is the setting.
 */
const INTERVAL: Record<WearRate, number> = {
  daily: 12,
  weekly: 18,
  occasional: 30,
  vault: 48,
};

export const serviceInterval = (piece: OwnedPiece) =>
  Math.round(INTERVAL[piece.wear] * (piece.stones ? 0.5 : 1));

const isOwned = (v: unknown): v is OwnedPiece => {
  if (!v || typeof v !== 'object') return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.id === 'string' &&
    typeof o.label === 'string' &&
    typeof o.acquired === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(o.acquired) &&
    typeof o.stones === 'boolean' &&
    typeof o.wear === 'string'
  );
};

const read = (): OwnedPiece[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(isOwned) : [];
  } catch {
    return [];
  }
};

const write = (list: OwnedPiece[]) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* blocked storage — the session list still works from memory */
  }
  window.dispatchEvent(new CustomEvent(EVENT));
};

/** Months between two ISO dates, rounded down. */
const monthsSince = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  const then = new Date(y, m - 1, d);
  const now = new Date();
  const months =
    (now.getFullYear() - then.getFullYear()) * 12 + (now.getMonth() - then.getMonth());
  return now.getDate() < then.getDate() ? months - 1 : months;
};

/**
 * When a piece is next due to be looked at, in months. Negative means overdue.
 * Measured from the last service if there has been one and from acquisition if
 * there has not — which is the honest baseline, because a piece bought used has
 * an unknown history and should be checked early rather than on a schedule
 * counted from a purchase date.
 */
export const monthsUntilService = (piece: OwnedPiece) => {
  const from = piece.serviced ?? piece.acquired;
  return serviceInterval(piece) - monthsSince(from);
};

/**
 * The pieces a visitor actually owns, and when each is next due to be seen.
 *
 * Every other list this browser keeps is about deciding — saved pieces, the
 * comparison tray, the dates worth remembering. This one is about afterwards,
 * which is the half of ownership no jeweller's website addresses at all: three
 * pieces bought over eight years, no records, and the claw that is about to let
 * go of a stone gives no warning that anybody notices.
 *
 * The service interval is computed rather than asked for, from two facts the
 * owner definitely knows — how often they wear it, and whether it has stones in
 * it. That is deliberate: a form that asks somebody to nominate a service
 * interval is a form that gets a guess, and the guess is always too long.
 *
 * Local-only, like the rest. There is no account to attach it to and this is
 * exactly the sort of list that should not be sitting on somebody's server.
 */
export function useOwnedPieces() {
  const [items, setItems] = useState<OwnedPiece[]>([]);
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

  const add = useCallback((piece: Omit<OwnedPiece, 'id'>) => {
    const next = [
      ...read(),
      { ...piece, id: `pc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}` },
    ];
    write(next);
    setItems(next);
  }, []);

  const update = useCallback((id: string, patch: Partial<Omit<OwnedPiece, 'id'>>) => {
    const next = read().map((p) => (p.id === id ? { ...p, ...patch } : p));
    write(next);
    setItems(next);
  }, []);

  const remove = useCallback((id: string) => {
    const next = read().filter((p) => p.id !== id);
    write(next);
    setItems(next);
  }, []);

  const clear = useCallback(() => {
    write([]);
    setItems([]);
  }, []);

  /** Soonest due first, which is the only order worth showing. */
  const byDue = [...items].sort((a, b) => monthsUntilService(a) - monthsUntilService(b));
  const overdue = byDue.filter((p) => monthsUntilService(p) <= 0);

  return { items, byDue, overdue, add, update, remove, clear, count: items.length, hydrated };
}
