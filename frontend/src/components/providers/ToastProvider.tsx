'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Info, X, AlertTriangle, Gem } from 'lucide-react';

type ToastKind = 'success' | 'info' | 'error' | 'luxe';

interface Toast {
  id: number;
  title: string;
  message?: string;
  kind: ToastKind;
}

interface ToastContextValue {
  toast: (t: { title: string; message?: string; kind?: ToastKind }) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export const useToast = () => useContext(ToastContext);

const ICONS: Record<ToastKind, typeof Info> = {
  success: CheckCircle2,
  info: Info,
  error: AlertTriangle,
  luxe: Gem,
};

const TINTS: Record<ToastKind, string> = {
  success: 'text-jade-300',
  info: 'text-platinum',
  error: 'text-burgundy-300',
  luxe: 'text-gold-400',
};

let counter = 0;

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ title, message, kind = 'luxe' }: { title: string; message?: string; kind?: ToastKind }) => {
      const id = ++counter;
      setToasts((prev) => [...prev.slice(-2), { id, title, message, kind }]);
      window.setTimeout(() => dismiss(id), 5000);
    },
    [dismiss]
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="pointer-events-none fixed bottom-6 right-6 z-[120] flex w-[min(92vw,22rem)] flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => {
            const Icon = ICONS[t.kind];
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, x: 48, scale: 0.94 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 48, scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                className="glass-strong pointer-events-auto relative flex items-start gap-3 overflow-hidden p-4 pr-10"
              >
                <Icon className={`mt-0.5 h-5 w-5 flex-shrink-0 ${TINTS[t.kind]}`} strokeWidth={1.6} />
                <div className="min-w-0">
                  <p className="font-accent text-sm uppercase tracking-luxe text-primary">{t.title}</p>
                  {t.message && (
                    <p className="mt-1 text-sm font-sans font-light text-muted">{t.message}</p>
                  )}
                </div>
                <button
                  onClick={() => dismiss(t.id)}
                  aria-label="Dismiss notification"
                  className="absolute right-3 top-3 text-faint transition-colors hover:text-accent"
                >
                  <X size={15} />
                </button>
                {/* Auto-dismiss countdown */}
                <motion.span
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: 0 }}
                  transition={{ duration: 5, ease: 'linear' }}
                  className="absolute bottom-0 left-0 h-px w-full origin-left bg-gradient-to-r from-gold-600 via-gold-300 to-transparent"
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
