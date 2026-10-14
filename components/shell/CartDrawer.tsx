"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ActionButton, FictionNote } from "@/components/ui";
import { tone } from "@/lib/audio";
import { cartTotal, getProduct } from "@/lib/data";
import { eddies } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { useMarket } from "@/lib/store";

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const cart = useMarket((state) => state.cart);
  const balance = useMarket((state) => state.balance);
  const sound = useMarket((state) => state.sound);
  const setQty = useMarket((state) => state.setQty);
  const removeFromCart = useMarket((state) => state.removeFromCart);
  const checkout = useMarket((state) => state.checkout);
  const pushToast = useMarket((state) => state.pushToast);
  const [receipt, setReceipt] = useState<string | null>(null);
  const total = cartTotal(cart);
  const { t, view } = useI18n();

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const change = (id: string, qty: number) => {
    const result = setQty(id, qty);
    if (!result.ok) {
      tone("deny", sound);
      pushToast("HELD", result.message);
    }
  };

  const authorize = () => {
    const result = checkout();
    tone(result.ok ? "ok" : "deny", sound);
    pushToast(result.ok ? "CLEARED" : "HELD", result.message);
    if (result.ok && result.orderId) setReceipt(result.orderId);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close bag"
            className="fixed inset-0 z-[70] bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-label={t("acquisitions")}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 right-0 z-[71] flex h-dvh w-full max-w-md flex-col border-l border-paper/20 bg-void"
          >
            <header className="flex items-center justify-between border-b border-paper/15 px-4 py-3">
              <div>
                <p className="font-ui text-sm tracking-[0.28em] text-blood uppercase">{t("bag")}</p>
                <h2 className="font-display text-4xl leading-none">{t("acquisitions")}</h2>
              </div>
              <button type="button" onClick={onClose} aria-label="Close" className="p-2 hover:text-blood">
                <X size={18} />
              </button>
            </header>
            <div className="flex-1 space-y-4 overflow-auto px-4 py-4">
              {cart.length === 0 && (
                <div className="border border-dashed border-paper/20 p-4">
                  <p className="font-display text-4xl leading-none">{t("emptyBag")}</p>
                  <p className="mt-2 text-sm text-mute">{t("emptyBagBody")}</p>
                  <Link href="/market" onClick={onClose} className="mt-4 inline-block font-ui text-xl tracking-[0.16em] uppercase hover:text-blood">
                    {t("enter")}
                  </Link>
                </div>
              )}
              {cart.map((line) => {
                const product = getProduct(line.id);
                if (!product) return null;
                return (
                  <article key={line.id} className="grid grid-cols-[1fr_auto] gap-3 border-t border-paper/15 pt-3">
                    <div>
                      <Link href={`/product/${product.id}`} onClick={onClose} className="font-ui text-2xl leading-none tracking-wide uppercase hover:text-blood">
                        {view(product).name}
                      </Link>
                      <p className="mt-1 text-xs text-mute">{product.sku}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <button type="button" className="border border-paper/30 px-2" onClick={() => change(product.id, line.qty - 1)} aria-label="Decrease quantity">
                          –
                        </button>
                        <span className="tabular-nums">{line.qty}</span>
                        <button type="button" className="border border-paper/30 px-2" onClick={() => change(product.id, line.qty + 1)} aria-label="Increase quantity">
                          +
                        </button>
                        <button type="button" className="text-xs text-mute uppercase hover:text-blood" onClick={() => removeFromCart(product.id)}>
                          {t("drop")}
                        </button>
                      </div>
                    </div>
                    <p className="font-ui text-2xl tabular-nums">{eddies(product.price * line.qty)}</p>
                  </article>
                );
              })}
              {receipt && (
                <div className="border border-blood p-3 text-sm">
                  <p className="font-ui tracking-[0.2em] text-blood uppercase">{t("receipt")} {receipt}</p>
                  <p className="mt-1">{t("receiptBody")}</p>
                </div>
              )}
            </div>
            <footer className="space-y-3 border-t border-paper/15 px-4 py-4">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-mute">{t("balance")} {eddies(balance)}</p>
                  <p className="font-display text-5xl leading-none tabular-nums">{eddies(total)}</p>
                </div>
              </div>
              <ActionButton className="w-full" onClick={authorize} disabled={!cart.length}>
                {t("stamp")}
              </ActionButton>
              <FictionNote />
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
