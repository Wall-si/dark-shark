"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useMarket } from "@/lib/store";

export function Toaster() {
  const toasts = useMarket((state) => state.toasts);
  const dismissToast = useMarket((state) => state.dismissToast);

  useEffect(() => {
    if (!toasts.length) return;
    const id = window.setTimeout(() => dismissToast(toasts[0].id), 4400);
    return () => window.clearTimeout(id);
  }, [toasts, dismissToast]);

  return (
    <div className="pointer-events-none fixed top-16 right-3 z-[75] flex w-[min(100%-1.5rem,22rem)] flex-col gap-2" aria-live="polite">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.button
            key={toast.id}
            type="button"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            onClick={() => dismissToast(toast.id)}
            className="pointer-events-auto border border-paper/20 border-l-blood bg-void px-3 py-2 text-left"
          >
            <p className="font-ui text-sm tracking-[0.24em] text-blood uppercase">{toast.title}</p>
            <p className="text-xs text-paper">{toast.body}</p>
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}
