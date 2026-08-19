'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, LayoutGrid, Move, Shuffle, Trash2 } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { useToast } from '@/components/providers/ToastProvider';
import { products } from '@/data/products';

interface MoodboardCanvasProps {
  className?: string;
  height?: number;
}

/** Where a piece sits on the board, in percentages of the board's own box. */
interface Placement {
  x: number;
  y: number;
  rotate: number;
  /** Stacking order, raised on pick-up so the dragged piece comes to the front. */
  z: number;
}

const KEY = 'aurum-moodboard';

/**
 * A board the visitor arranges themselves, built from whatever they have saved.
 *
 * Positions are stored as *percentages*, not pixels. That is the decision the whole
 * thing rests on: the board is fluid, and a layout saved at 1400px wide and reloaded
 * on a phone would pile every piece off the right edge if the coordinates were
 * absolute. Percentages survive the resize, and the drag maths converts once on
 * pick-up rather than storing two units.
 *
 * Pieces come from the wishlist rather than from a separate collection. A moodboard
 * with its own add-to flow is a second wishlist that immediately disagrees with the
 * first one; this way saving a piece anywhere on the site puts it on the board.
 */
export default function MoodboardCanvas({ className = '', height = 520 }: MoodboardCanvasProps) {
  const { ids, toggle, hydrated } = useWishlist();
  const { toast } = useToast();

  const boardRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<Record<string, Placement>>({});
  const [dragging, setDragging] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  // The next free stacking index. A ref, not state: it is only ever read inside an
  // event handler to compute the new top of the pile, and nothing renders from it
  // directly — the per-card `z` in the layout is what the DOM reads.
  const nextZ = useRef(10);

  const saved = useMemo(
    () => ids.map((id) => products.find((p) => p.id === id)).filter(Boolean) as typeof products,
    [ids]
  );

  /** A scattered starting arrangement, deterministic per id so it never reshuffles. */
  const scatter = useCallback((id: string, index: number): Placement => {
    // Hashed from the id rather than randomised, so a reload does not rearrange a
    // board the visitor has not touched.
    let h = 0;
    for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
    const jitterX = (h % 100) / 100;
    const jitterY = ((h >> 7) % 100) / 100;
    const cols = 3;
    return {
      x: 10 + (index % cols) * 28 + jitterX * 8,
      y: 12 + Math.floor(index / cols) * 30 + jitterY * 8,
      rotate: ((h >> 13) % 14) - 7,
      z: 10 + index,
    };
  }, []);

  // Restore, then fill in anything saved since. Done after mount because this is a
  // static export and localStorage does not exist at build time.
  useEffect(() => {
    if (!hydrated) return;
    let stored: Record<string, Placement> = {};
    try {
      const raw = localStorage.getItem(KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      if (parsed && typeof parsed === 'object') stored = parsed;
    } catch {
      /* unreadable — fall through to a fresh scatter */
    }

    setLayout(() => {
      const next: Record<string, Placement> = {};
      ids.forEach((id, i) => {
        const p = stored[id];
        next[id] =
          p && typeof p.x === 'number' && typeof p.y === 'number' ? p : scatter(id, i);
      });
      // Start the stacking counter above whatever the restored board already uses, or
      // the first card picked up would be assigned a z that is already taken and
      // would appear to go *under* its neighbours.
      nextZ.current = Math.max(
        10,
        ...Object.values(next).map((p) => (typeof p.z === 'number' ? p.z : 10))
      );
      return next;
    });
    setLoaded(true);
  }, [hydrated, ids, scatter]);

  // Persist, but only once there is something worth persisting — writing an empty
  // object on first paint would wipe a stored board before it had been restored.
  useEffect(() => {
    if (!loaded || Object.keys(layout).length === 0) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(layout));
    } catch {
      /* storage blocked — the arrangement still holds for this session */
    }
  }, [layout, loaded]);

  const place = (id: string, patch: Partial<Placement>) =>
    setLayout((cur) => ({ ...cur, [id]: { ...cur[id], ...patch } }));

  const pickUp = (id: string) => {
    setDragging(id);
    // Raised above everything currently on the board, so the card being moved is
    // never dragged underneath one it started behind.
    nextZ.current += 1;
    place(id, { z: nextZ.current });
  };

  const drop = (id: string, dx: number, dy: number) => {
    const box = boardRef.current?.getBoundingClientRect();
    setDragging(null);
    if (!box) return;
    const cur = layout[id];
    if (!cur) return;
    // Converted from the drag's pixel delta into percentages once, here — the
    // stored unit stays percentage-only.
    place(id, {
      // Clamped so a piece can always be grabbed again; a card dragged fully off
      // the board is a card the visitor has lost.
      x: Math.min(88, Math.max(2, cur.x + (dx / box.width) * 100)),
      y: Math.min(84, Math.max(2, cur.y + (dy / box.height) * 100)),
    });
  };

  const tidy = () => {
    setLayout(() => {
      const next: Record<string, Placement> = {};
      ids.forEach((id, i) => {
        const cols = 3;
        next[id] = {
          x: 8 + (i % cols) * 29,
          y: 10 + Math.floor(i / cols) * 30,
          rotate: 0,
          z: 10 + i,
        };
      });
      return next;
    });
    // Both re-layouts reset the stack to 10..10+n, so the counter has to come back
    // with them or it drifts upward for the life of the session.
    nextZ.current = 10 + ids.length;
    toast({ kind: 'info', title: 'Board squared up' });
  };

  const shuffle = () => {
    setLayout(() => {
      const next: Record<string, Placement> = {};
      ids.forEach((id, i) => {
        next[id] = {
          x: 4 + Math.random() * 80,
          y: 4 + Math.random() * 76,
          rotate: Math.random() * 18 - 9,
          z: 10 + i,
        };
      });
      return next;
    });
    nextZ.current = 10 + ids.length;
    toast({ kind: 'luxe', title: 'Scattered', message: 'Drag them back into an argument.' });
  };

  return (
    <div className={className}>
      {/* Controls */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Move size={14} strokeWidth={1.7} className="text-accent" />
          <span className="font-accent text-[10px] uppercase tracking-luxest text-accent">
            The Moodboard
          </span>
          {hydrated && saved.length > 0 && (
            <span className="nums-tabular font-sans text-[11px] font-light text-faint">
              {saved.length} saved
            </span>
          )}
        </div>

        {saved.length > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={tidy}
              className="flex items-center gap-2 rounded-full border border-hairline px-4 py-2 font-accent text-[9px] uppercase tracking-luxe text-muted transition-colors hover:border-gold-500/40 hover:text-accent"
            >
              <LayoutGrid size={11} strokeWidth={1.9} />
              Square up
            </button>
            <button
              onClick={shuffle}
              className="flex items-center gap-2 rounded-full border border-hairline px-4 py-2 font-accent text-[9px] uppercase tracking-luxe text-muted transition-colors hover:border-gold-500/40 hover:text-accent"
            >
              <Shuffle size={11} strokeWidth={1.9} />
              Scatter
            </button>
          </div>
        )}
      </div>

      {/* Board */}
      <div
        ref={boardRef}
        className="velvet-bed relative w-full overflow-hidden rounded-2xl border border-hairline"
        style={{ height }}
      >
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 blueprint-field opacity-30" />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-spotlight-soft opacity-[var(--bloom)]"
        />

        {!hydrated ? (
          <div className="flex h-full items-center justify-center">
            <span className="skeleton block h-40 w-64 rounded-xl" />
          </div>
        ) : saved.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 px-8 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gold-500/25 text-accent/60">
              <Heart size={20} strokeWidth={1.5} />
            </span>
            <p className="max-w-sm font-display text-lg font-light italic leading-snug text-secondary">
              An empty board. Save a piece anywhere on the site and it lands here, ready
              to be argued with.
            </p>
            <p className="font-accent text-[9px] uppercase tracking-luxe text-faint">
              Press W to open your saved pieces
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {saved.map((product) => {
              const p = layout[product.id];
              if (!p) return null;
              const isDragging = dragging === product.id;

              return (
                <motion.div
                  key={product.id}
                  drag
                  dragMomentum={false}
                  dragElastic={0}
                  onDragStart={() => pickUp(product.id)}
                  onDragEnd={(_, info) => drop(product.id, info.offset.x, info.offset.y)}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: isDragging ? 1.06 : 1,
                    rotate: isDragging ? 0 : p.rotate,
                  }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                  className={`group absolute w-[38%] max-w-[13rem] cursor-grab-x touch-none sm:w-[26%] ${
                    isDragging ? 'cursor-grabbing' : ''
                  }`}
                  style={{
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                    zIndex: p.z,
                    // Reset on every drag end, since the offset is folded into the
                    // stored percentage rather than kept as a transform.
                    x: 0,
                    y: 0,
                  }}
                >
                  {/* The plate, presented as a pinned print */}
                  <div className="relative overflow-hidden rounded-lg border border-hairline bg-surface-raised shadow-cinema">
                    <div className="relative aspect-[4/5]">
                      <Image
                        src={product.images?.[0] ?? product.image ?? '/images/products/ring.jpg'}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 40vw, 26vw"
                        className="object-cover"
                        draggable={false}
                      />
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface-raised/85 via-transparent to-transparent"
                      />
                    </div>

                    <div className="p-3">
                      <p className="truncate font-sans text-[11px] font-light text-primary">
                        {product.name}
                      </p>
                      <p className="nums-tabular mt-0.5 font-accent text-[9px] uppercase tracking-luxe text-accent">
                        {product.formattedPrice ?? product.price}
                      </p>
                    </div>

                    {/* Remove — also unsaves the piece, since the board *is* the wishlist */}
                    <button
                      onClick={() => {
                        toggle(product.id);
                        toast({
                          kind: 'info',
                          title: 'Removed',
                          message: `${product.name} is off the board and out of your saved pieces.`,
                        });
                      }}
                      aria-label={`Remove ${product.name}`}
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full border border-hairline bg-canvas/75 text-faint opacity-0 backdrop-blur transition-all duration-300 hover:border-burgundy-500/50 hover:text-burgundy-300 group-hover:opacity-100 focus-visible:opacity-100"
                    >
                      <Trash2 size={11} strokeWidth={1.9} />
                    </button>
                  </div>

                  {/* Pin */}
                  <span
                    aria-hidden="true"
                    className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-gradient-to-br from-gold-200 to-gold-700 shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {saved.length > 0 && (
        <p className="mt-4 font-sans text-[10px] font-light italic leading-relaxed text-faint">
          Drag the pieces into whatever arrangement makes the case. The layout is kept in
          this browser as proportions, so it survives a resize — bring it up on a tablet
          at the boutique and we will work from it.
        </p>
      )}
    </div>
  );
}
