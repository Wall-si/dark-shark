"use client";

import { Menu, TerminalSquare, Volume2, VolumeX, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { StreetLife } from "@/components/chaos/StreetLife";
import { SharkMark } from "@/components/visual/SharkMark";
import { tone } from "@/lib/audio";
import { cartTotal } from "@/lib/data";
import { eddies } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { useMarket } from "@/lib/store";
import { BootSequence } from "./BootSequence";
import { CartDrawer } from "./CartDrawer";
import { Crosshair } from "./Crosshair";
import { ShellContext } from "./shell-context";
import { Terminal } from "./Terminal";
import { Toaster } from "./Toaster";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [booted, setBooted] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [termOpen, setTermOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [clock, setClock] = useState("--:--:--");
  const pathname = usePathname();
  const cart = useMarket((state) => state.cart);
  const sound = useMarket((state) => state.sound);
  const setSound = useMarket((state) => state.setSound);
  const pushToast = useMarket((state) => state.pushToast);
  const unlockLeviathan = useMarket((state) => state.unlockLeviathan);
  const leviathan = useMarket((state) => state.leviathan);
  const total = cartTotal(cart);
  const { locale, setLocale, t, c } = useI18n();
  const links = [
    { href: "/", label: t("index") },
    { href: "/market", label: t("market") },
    { href: "/vendors", label: t("vendors") },
    { href: "/network", label: t("network") },
    { href: "/profile", label: t("profile") },
    { href: "/about", label: t("dossier") },
  ];

  const finishBoot = useCallback(() => setBooted(true), []);
  const openCart = useCallback(() => setCartOpen(true), []);
  const openTerm = useCallback(() => setTermOpen(true), []);

  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        if (sessionStorage.getItem("ds-booted") === "1") setBooted(true);
      } catch {
        setBooted(true);
      }
      setReady(true);
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dataset.locale = locale;
  }, [locale]);

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString("en-GB", { hour12: false }));
    const first = window.setTimeout(tick, 0);
    const id = window.setInterval(tick, 1000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setCartOpen(false);
        setTermOpen(false);
        setNavOpen(false);
      }
      if (event.key === "`" || event.code === "Backquote") {
        const tag = (event.target as HTMLElement | null)?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        event.preventDefault();
        setTermOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const sequence = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    let index = 0;
    const onKey = (event: KeyboardEvent) => {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      if (key === sequence[index]) {
        index += 1;
        if (index === sequence.length) {
          index = 0;
          unlockLeviathan();
          const ru = useMarket.getState().locale === "ru";
          pushToast("KONAMI", ru ? "Старые клавиши. Новый допуск." : "Old world keys. New world clearance.");
          tone("ok", useMarket.getState().sound);
        }
      } else {
        index = key === sequence[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pushToast, unlockLeviathan]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target?.closest("a, button")) return;
      tone("tick", useMarket.getState().sound);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (!booted) return;
    const arm = window.setTimeout(() => {
      const pack = c.whispers;
      const pair = pack[Math.floor(Math.random() * pack.length)];
      pushToast(pair[0], pair[1]);
    }, 9000);
    const id = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      const pack = c.whispers;
      const pair = pack[Math.floor(Math.random() * pack.length)];
      pushToast(pair[0], pair[1]);
    }, 28000);
    return () => {
      window.clearTimeout(arm);
      window.clearInterval(id);
    };
  }, [booted, c.whispers, pushToast]);

  const shell = useMemo(
    () => ({ booted, openCart, openTerm }),
    [booted, openCart, openTerm],
  );

  const nav = (
    <ul className="flex flex-col gap-1">
      {links.map((link) => {
        const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              onClick={() => setNavOpen(false)}
              aria-current={active ? "page" : undefined}
              className={`block border-l-2 py-1 pl-3 font-ui text-2xl leading-none tracking-[0.14em] uppercase ${
                active ? "border-blood text-paper" : "border-transparent text-mute hover:text-paper"
              }`}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
      {leviathan && (
        <li>
          <Link href="/about#leviathan" onClick={() => setNavOpen(false)} className="block border-l-2 border-transparent py-1 pl-3 font-ui text-2xl leading-none tracking-[0.14em] text-blood uppercase">
            {t("leviathan")}
          </Link>
        </li>
      )}
    </ul>
  );

  return (
    <ShellContext.Provider value={shell}>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-blood focus:px-3 focus:py-2 focus:text-void">
        {t("skip")}
      </a>
      <Crosshair />
      <div className="scanlines" />
      {booted && <StreetLife active={booted} />}
      {ready && !booted && <BootSequence onDone={finishBoot} />}
      <div className={booted ? "" : "invisible"} inert={!booted ? true : undefined}>
        <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-paper/15 bg-void px-3 md:px-5">
          <button type="button" className="md:hidden" aria-label={t("openNav")} onClick={() => setNavOpen(true)}>
            <Menu size={18} />
          </button>
          <Link href="/" className="flex items-center gap-2" aria-label="Dark Shark home">
            <SharkMark className="h-8 w-16 text-paper" />
            <span className="font-display text-3xl leading-none tracking-wide">DARK SHARK</span>
          </Link>
          <span className="hidden font-ui text-sm tracking-[0.22em] text-mute uppercase lg:block">{t("node")}</span>
          <p className="hidden flex-1 text-center font-ui text-sm tracking-[0.28em] text-mute uppercase xl:block">
            {t("motto")}
          </p>
          <div className="ml-auto flex items-center gap-2 md:gap-3">
            <div className="flex border border-paper/30 font-ui text-sm">
              <button type="button" onClick={() => setLocale("en")} className={locale === "en" ? "bg-blood px-1.5 text-void" : "px-1.5"} aria-pressed={locale === "en"}>
                EN
              </button>
              <button type="button" onClick={() => setLocale("ru")} className={locale === "ru" ? "bg-blood px-1.5 text-void" : "px-1.5"} aria-pressed={locale === "ru"}>
                RU
              </button>
            </div>
            <span className="hidden items-center gap-2 font-ui text-sm tracking-[0.18em] uppercase sm:flex">
              <i className="blink inline-block h-2 w-2 bg-blood" />
              {t("live")}
            </span>
            <button
              type="button"
              aria-label={sound ? t("mute") : t("unmute")}
              onClick={() => setSound(!sound)}
              className="p-1 hover:text-blood"
            >
              {sound ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
            <button type="button" onClick={() => setTermOpen(true)} className="hidden items-center gap-1 font-ui text-lg tracking-[0.16em] uppercase hover:text-blood sm:flex">
              <TerminalSquare size={15} />
              {t("term")}
            </button>
            <button type="button" onClick={() => setCartOpen(true)} className="font-ui text-lg tracking-[0.14em] uppercase hover:text-blood">
              {t("bag")} {cart.length}
              <span className="ml-2 hidden text-mute md:inline">{eddies(total)}</span>
            </button>
            <time className="hidden tabular-nums text-xs text-mute lg:block">{clock}</time>
          </div>
        </header>
        <div className="md:pl-44">
          <nav className="fixed top-14 bottom-8 left-0 z-30 hidden w-44 flex-col justify-between border-r border-paper/15 bg-void px-3 py-5 md:flex" aria-label="Primary">
            {nav}
            <p className="px-3 font-mono text-[10px] leading-4 text-mute">
              {t("hint")}
              <br />
              {t("hint2")}
            </p>
          </nav>
          <main id="main" className="min-h-[calc(100dvh-3.5rem)] px-4 py-6 pb-16 md:px-8">
            {children}
          </main>
        </div>
        <footer className="fixed inset-x-0 bottom-0 z-40 overflow-hidden border-t border-paper/15 bg-void">
          <div className="marquee-track flex whitespace-nowrap py-1.5 font-ui text-sm tracking-[0.22em] uppercase">
            <span className="px-4">{c.ticker.join("   //   ")}</span>
            <span className="px-4" aria-hidden>
              {c.ticker.join("   //   ")}
            </span>
          </div>
        </footer>
      </div>
      {navOpen && (
        <div className="fixed inset-0 z-[60] bg-void px-5 py-5 md:hidden">
          <div className="mb-6 flex items-center justify-between">
            <p className="font-ui tracking-[0.22em] uppercase">{t("navigate")}</p>
            <button type="button" aria-label={t("closeNav")} onClick={() => setNavOpen(false)}>
              <X />
            </button>
          </div>
          {nav}
          <button type="button" className="mt-6 font-ui text-2xl tracking-[0.14em] uppercase" onClick={() => { setNavOpen(false); setTermOpen(true); }}>
            {t("openTerm")}
          </button>
        </div>
      )}
      <CartDrawer open={cartOpen && booted} onClose={() => setCartOpen(false)} />
      <Terminal open={termOpen && booted} onClose={() => setTermOpen(false)} onOpenCart={() => setCartOpen(true)} />
      {booted && <Toaster />}
    </ShellContext.Provider>
  );
}
