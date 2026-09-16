import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X } from 'lucide-react';

export interface ToastItem {
  id: string;
  message: string;
  undoAction?: () => void;
  duration?: number;
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
  bottomOffsetClass?: string;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onDismiss,
  bottomOffsetClass = 'bottom-6',
}) => {
  return (
    <div
      className={`fixed ${bottomOffsetClass} right-4 sm:right-6 z-[999999999] pointer-events-none select-none max-w-[calc(100vw-2rem)] sm:max-w-[420px] transition-[bottom] duration-300 ease-out flex flex-col items-end gap-2`}
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            layout
            key={toast.id}
            initial={{ opacity: 0, y: 28, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.92, transition: { duration: 0.2 } }}
            transition={{
              layout: { type: 'spring', stiffness: 380, damping: 28, mass: 0.8 },
              opacity: { duration: 0.2 },
              y: { type: 'spring', stiffness: 380, damping: 28 },
              scale: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={(_, info) => {
              if (Math.abs(info.offset.x) > 50 || Math.abs(info.velocity.x) > 200) {
                onDismiss(toast.id);
              }
            }}
            whileDrag={{ scale: 0.98, opacity: 0.8, cursor: 'grabbing' }}
            className="pointer-events-auto cursor-grab active:cursor-grabbing touch-pan-y w-full flex justify-end"
          >
            <div className="flex items-center gap-3 px-4 py-3 bg-[#0F172A]/95 dark:bg-[#0B0F19]/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-slate-700/70 dark:border-slate-800/80 text-xs font-semibold tracking-tight min-w-[280px] max-w-full">
              <div className="w-6 h-6 rounded-full bg-[#2563EB] flex items-center justify-center shrink-0 text-white shadow-xs">
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="flex-1 text-slate-100 leading-snug">{toast.message}</span>
              {toast.undoAction && (
                <button
                  type="button"
                  onClick={() => {
                    toast.undoAction?.();
                    onDismiss(toast.id);
                  }}
                  className="px-3 py-1 text-xs font-bold text-white bg-[#176BFF] hover:bg-blue-600 active:scale-95 rounded-lg shadow-sm shadow-blue-500/25 transition-all cursor-pointer shrink-0"
                >
                  Undo
                </button>
              )}
              <button
                type="button"
                onClick={() => onDismiss(toast.id)}
                className="p-1 hover:bg-slate-700/60 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
                aria-label="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
