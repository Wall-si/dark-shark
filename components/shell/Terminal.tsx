"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { tone } from "@/lib/audio";
import { useMarket } from "@/lib/store";
import { interpret } from "@/lib/terminal";

const seed = ["DARK SHARK SECURE SHELL", "TYPE help — OR PRESS ESC TO LEAVE"];

export function Terminal({ open, onClose, onOpenCart }: { open: boolean; onClose: () => void; onOpenCart: () => void }) {
  const router = useRouter();
  const [lines, setLines] = useState<string[]>(seed);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const alias = useMarket((state) => state.alias);
  const clearance = useMarket((state) => state.clearance);
  const balance = useMarket((state) => state.balance);
  const cart = useMarket((state) => state.cart);
  const favorites = useMarket((state) => state.favorites);
  const leviathan = useMarket((state) => state.leviathan);
  const sound = useMarket((state) => state.sound);
  const addToCart = useMarket((state) => state.addToCart);
  const toggleFavorite = useMarket((state) => state.toggleFavorite);
  const unlockLeviathan = useMarket((state) => state.unlockLeviathan);
  const pushToast = useMarket((state) => state.pushToast);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [lines, open]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const field = inputRef.current?.value ?? value;
    const command = field.trim();
    if (!command) return;
    const result = interpret(command, {
      alias,
      clearance,
      balance,
      cartCount: cart.length,
      favCount: favorites.length,
      leviathan,
    });
    let next = [...lines, `DS> ${command}`, ...result.lines];
    if (result.clear) next = ["GLASS WIPED", "TYPE help"];
    if (result.addId) {
      const added = addToCart(result.addId);
      next = [...next, added.message];
      tone(added.ok ? "ok" : "deny", sound);
      pushToast(added.ok ? "LOGGED" : "HELD", added.message);
    } else if (result.favId) {
      const pin = toggleFavorite(result.favId);
      next = [...next, pin.on ? "PINNED" : "UNPINNED"];
      tone("ok", sound);
    } else if (result.sound) {
      tone(result.sound, sound);
    }
    if (result.unlock) {
      unlockLeviathan();
      pushToast("LEVIATHAN", "Black clearance written to this browser.");
    }
    setLines(next.slice(-80));
    setValue("");
    if (result.openCart) onOpenCart();
    if (result.href) router.push(result.href);
    if (result.close) onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-x-3 bottom-12 z-[72] border border-blood bg-void/95 md:inset-x-auto md:right-6 md:w-[min(40rem,calc(100%-3rem))]" role="dialog" aria-label="Terminal">
      <header className="flex items-center justify-between border-b border-blood/40 px-3 py-2">
        <p className="font-ui text-sm tracking-[0.24em] uppercase">Terminal // channel 7</p>
        <button type="button" onClick={onClose} className="font-ui tracking-[0.16em] uppercase hover:text-blood">
          Close
        </button>
      </header>
      <div ref={logRef} className="h-56 space-y-1 overflow-auto px-3 py-3 text-xs md:h-64">
        {lines.map((line, index) => (
          <p key={`${line}-${index}`} className={line.startsWith("DS>") ? "text-blood" : "text-paper"}>
            {line}
          </p>
        ))}
      </div>
      <form onSubmit={submit} className="flex items-center gap-2 border-t border-paper/15 px-3 py-2">
        <span className="text-blood">DS&gt;</span>
        <input
          ref={inputRef}
          name="command"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          aria-label="Terminal command"
          className="w-full bg-transparent font-mono text-sm uppercase outline-none"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
        />
        <button type="submit" className="font-ui tracking-[0.16em] text-blood uppercase">
          Run
        </button>
      </form>
    </div>
  );
}
