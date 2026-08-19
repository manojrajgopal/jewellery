'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Command, X } from 'lucide-react';

interface Shortcut {
  keys: string[];
  label: string;
  group: string;
}

const SHORTCUTS: Shortcut[] = [
  { keys: ['⌘', 'K'], label: 'Open search', group: 'Navigate' },
  { keys: ['G', 'H'], label: 'Go home', group: 'Navigate' },
  { keys: ['G', 'C'], label: 'Go to collections', group: 'Navigate' },
  { keys: ['G', 'A'], label: 'Go to the atelier', group: 'Navigate' },
  { keys: ['G', 'V'], label: 'Go to contact', group: 'Navigate' },
  { keys: ['G', 'D'], label: 'Go to the bespoke studio', group: 'Navigate' },
  { keys: ['W'], label: 'Open saved pieces', group: 'View' },
  { keys: ['X'], label: 'Open the comparison table', group: 'View' },
  { keys: ['T'], label: 'Switch light / dark', group: 'View' },
  { keys: ['C'], label: 'Toggle cinema mode', group: 'View' },
  { keys: ['Home'], label: 'Back to top', group: 'View' },
  { keys: ['?'], label: 'Show this panel', group: 'Help' },
  { keys: ['Esc'], label: 'Close anything open', group: 'Help' },
];

/**
 * The shortcut sheet, opened with `?`.
 *
 * Worth having on a site that has grown a keyboard layer: shortcuts nobody can
 * discover are shortcuts nobody uses. The panel itself is the discovery
 * mechanism, and the footer says how to reach it.
 */
export default function ShortcutsOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [isMac, setIsMac] = useState(true);

  useEffect(() => {
    // navigator.platform is deprecated but still the most reliable signal here,
    // and the only cost of being wrong is showing the wrong modifier glyph.
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform));
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const groups = Array.from(new Set(SHORTCUTS.map((s) => s.group)));

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
          onClick={onClose}
          className="fixed inset-0 z-[170] flex items-center justify-center bg-ink-950/70 p-5 backdrop-blur-xl"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Keyboard shortcuts"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.94, y: 28, filter: 'blur(12px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.96, y: 16, filter: 'blur(8px)' }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            className="glass-strong relative w-full max-w-2xl overflow-hidden p-7 md:p-9"
          >
            {/* Ambient wash */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gold-mesh opacity-40"
            />

            <header className="relative mb-7 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-500/30 text-accent">
                  <Command size={17} strokeWidth={1.7} />
                </span>
                <div>
                  <h2 className="font-display text-2xl font-light text-primary">
                    Keyboard Shortcuts
                  </h2>
                  <p className="mt-0.5 font-sans text-xs font-light text-muted">
                    Move through the house without reaching for the pointer.
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                aria-label="Close shortcuts"
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-hairline text-muted transition-colors hover:border-gold-500/40 hover:text-accent"
              >
                <X size={16} strokeWidth={1.7} />
              </button>
            </header>

            <div className="relative grid gap-x-10 gap-y-7 sm:grid-cols-2">
              {groups.map((group, gi) => (
                <motion.div
                  key={group}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + gi * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <h3 className="mb-3 font-accent text-[10px] uppercase tracking-luxer text-accent">
                    {group}
                  </h3>
                  <dl className="space-y-2.5">
                    {SHORTCUTS.filter((s) => s.group === group).map((s, i) => (
                      <motion.div
                        key={s.label}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.14 + gi * 0.07 + i * 0.04, duration: 0.35 }}
                        className="flex items-center justify-between gap-4"
                      >
                        <dt className="font-sans text-sm font-light text-secondary">
                          {s.label}
                        </dt>
                        <dd className="flex flex-shrink-0 items-center gap-1">
                          {s.keys.map((key) => (
                            <kbd
                              key={key}
                              className="min-w-[1.75rem] rounded-md border border-hairline bg-surface-raised px-1.5 py-1 text-center font-sans text-[10px] uppercase tracking-wide text-primary"
                            >
                              {key === '⌘' && !isMac ? 'Ctrl' : key}
                            </kbd>
                          ))}
                        </dd>
                      </motion.div>
                    ))}
                  </dl>
                </motion.div>
              ))}
            </div>

            <footer className="relative mt-8 border-t border-hairline pt-5">
              <p className="font-sans text-[11px] font-light text-faint">
                Press{' '}
                <kbd className="rounded border border-hairline px-1.5 py-0.5 text-[10px] text-primary">
                  ?
                </kbd>{' '}
                any time to bring this back. Sequence shortcuts like{' '}
                <kbd className="rounded border border-hairline px-1.5 py-0.5 text-[10px] text-primary">
                  G
                </kbd>{' '}
                then{' '}
                <kbd className="rounded border border-hairline px-1.5 py-0.5 text-[10px] text-primary">
                  C
                </kbd>{' '}
                are pressed one after the other, not together.
              </p>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
