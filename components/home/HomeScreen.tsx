"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useShell } from "@/components/shell/shell-context";
import { ActivityChart } from "@/components/visual/ActivityChart";
import { Marquee } from "@/components/visual/Marquee";
import { Schematic } from "@/components/visual/Schematic";
import { SharkMark } from "@/components/visual/SharkMark";
import { tone } from "@/lib/audio";
import { categories, getProduct, heatSeries, products, vendors, volumeSeries } from "@/lib/data";
import { eddies } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { useMarket } from "@/lib/store";

const stats = [
  { k: "Net", v: "99.2%", s: "Encrypted" },
  { k: "Vendors", v: "148", s: "Live desks" },
  { k: "Volume", v: "€$ 4.2B", s: "24h clearing" },
  { k: "Heat", v: "CRITICAL", s: "Citywide" },
];

function useScramble(text: string, play: boolean) {
  const [out, setOut] = useState(text);
  useEffect(() => {
    if (!play) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#";
    let frame = 0;
    const total = 24;
    const id = window.setInterval(() => {
      frame += 1;
      const progress = frame / total;
      setOut(
        text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index / text.length < progress) return text[index];
            return glyphs[Math.floor(Math.random() * glyphs.length)];
          })
          .join(""),
      );
      if (frame >= total) window.clearInterval(id);
    }, 36);
    return () => window.clearInterval(id);
  }, [play, text]);
  return out;
}

export function HomeScreen() {
  const { booted } = useShell();
  const dark = useScramble("DARK", booted);
  const shark = useScramble("SHARK", booted);
  const markRef = useRef<HTMLButtonElement>(null);
  const bites = useRef(0);
  const pushToast = useMarket((state) => state.pushToast);
  const sound = useMarket((state) => state.sound);
  const { locale, t, c, view, category: catLabel } = useI18n();
  const wire =
    locale === "ru"
      ? [
          { t: "04:11:02", m: "Стол Фрея провёл ограниченную оптику в Хромовый квартал." },
          { t: "04:11:19", m: "Жар по Пепельным каналам перешёл в КРИТИЧЕСКИЙ." },
          { t: "04:12:04", m: "Пак выставил пустой чип. Уже две ставки." },
          { t: "04:12:40", m: "Морроу выкатил купе «Покров» с витрины." },
          { t: "04:13:11", m: "Ада снова запечатала досье Верхнего стекла." },
        ]
      : [
          { t: "04:11:02", m: "Frey Desk cleared a restricted optic into Chrome Ward." },
          { t: "04:11:19", m: "Heat index crossed CRITICAL along the Ash Canals." },
          { t: "04:12:04", m: "Puck Nine listed a blank civic chip. Two bids already." },
          { t: "04:12:40", m: "Morrow Quay rolled the Pall Coupe off the show cage." },
          { t: "04:13:11", m: "Ada Veil sealed the Glass Ward file for another cycle." },
        ];
  const featured = ["abyss-deck", "leviathan-key", "pall-coupe", "rift-optic"]
    .map((id) => getProduct(id))
    .filter((item) => item !== undefined);

  useEffect(() => {
    if (!booted || !markRef.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    let revert = () => {};
    void import("gsap").then(({ default: gsap }) => {
      const tween = gsap.fromTo(markRef.current, { x: 70, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 1.15, ease: "power3.out" });
      revert = () => tween.kill();
    });
    return () => revert();
  }, [booted]);

  const bite = () => {
    bites.current += 1;
    tone("tick", sound);
    if (bites.current >= 7) {
      bites.current = 0;
      tone("ok", sound);
      pushToast("THE SHARK", "The shark is always hungry.");
    }
  };

  return (
    <div className="-mx-4 md:-mx-8">
      <section className="relative overflow-hidden border-b border-paper/15 px-4 pt-6 pb-10 md:px-8 md:pt-10">
        <p className="pointer-events-none absolute -top-6 -left-2 font-display text-[28vw] leading-none text-transparent [-webkit-text-stroke:1px_rgba(244,241,234,0.12)]">
          07
        </p>
        <div className="scan-bar pointer-events-none absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-blood/10 to-transparent" />
        <div className="relative grid items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="font-ui text-sm tracking-[0.32em] text-blood uppercase">{c.homeKicker}</p>
            <h1 className="mt-2 font-display text-[22vw] leading-[0.78] tracking-wide sm:text-[8.5rem] lg:text-[9.5rem]">
              <span className="block">{dark}</span>
              <span className="block">{shark}</span>
            </h1>
            <p className="mt-4 max-w-xl font-ui text-3xl tracking-[0.18em] uppercase md:text-4xl">{c.slogan}</p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link href="/market" className="glitch-hover bg-blood px-5 py-3 font-ui text-2xl tracking-[0.18em] text-void uppercase hover:bg-paper">
                {t("enter")}
              </Link>
              <Link href="/about" className="font-ui text-2xl tracking-[0.16em] text-paper uppercase hover:text-blood">
                {c.readDossier}
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5">
            <button ref={markRef} type="button" onClick={bite} aria-label="House emblem" className="relative block w-full text-left">
              <SharkMark wire className="w-full text-paper" />
              <SharkMark wire className="glitch-slice absolute inset-0 w-full text-blood" />
            </button>
            <dl className="mt-4 grid grid-cols-2 gap-px bg-paper/15">
              {stats.map((stat) => (
                <div key={stat.k} className="bg-void px-3 py-3">
                  <dt className="font-ui text-sm tracking-[0.2em] text-mute uppercase">{stat.k}</dt>
                  <dd className="font-display text-4xl leading-none">{stat.v}</dd>
                  <p className="text-[11px] text-mute">{stat.s}</p>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <Marquee items={categories.map((item) => catLabel(item))} />

      <section className="grid gap-8 px-4 py-10 md:px-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="font-ui text-sm tracking-[0.28em] text-blood uppercase">Tonight&apos;s ledger</p>
          <h2 className="font-display text-6xl leading-none">{c.watching}</h2>
          <p className="mt-3 text-sm text-mute">{c.demo}</p>
        </div>
        <div className="grid gap-px bg-paper/15 sm:grid-cols-2 lg:col-span-8">
          {featured.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`} className="group bg-void p-3 hover:bg-blood hover:text-void">
              <div className="h-28">
                <Schematic id={product.id} category={product.category} sku={product.sku} rarity={product.rarity} label={`${product.name} schematic`} />
              </div>
              <p className="mt-2 text-[11px] tracking-[0.16em] uppercase opacity-70">{product.sku}</p>
              <p className="font-display text-4xl leading-none">{view(product).name}</p>
              <p className="mt-2 font-ui text-2xl">{eddies(product.price)}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-blood px-4 py-8 text-void md:px-8">
        <div className="grid items-end gap-6 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="font-ui text-sm tracking-[0.28em] uppercase">{c.pulse}</p>
            <p className="font-display text-7xl leading-none">{c.liveWire}</p>
            <p className="mt-2 max-w-xs text-sm">{c.pulseBody}</p>
          </div>
          <div className="h-48 lg:col-span-8">
            <ActivityChart primary={volumeSeries} secondary={heatSeries} tone="void" />
          </div>
        </div>
      </section>

      <section className="grid gap-8 px-4 py-10 md:px-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="font-ui text-sm tracking-[0.28em] text-blood uppercase">{c.transmission}</p>
          <blockquote className="font-display text-5xl leading-[0.9] md:text-6xl">{c.frey[0]}</blockquote>
          <p className="mt-4 font-ui text-xl tracking-[0.16em] uppercase">{c.chairman}</p>
          <Link href="/about" className="mt-6 inline-block border border-paper/30 px-4 py-2 font-ui text-lg tracking-[0.18em] uppercase hover:border-blood hover:text-blood">
            {c.openDossier}
          </Link>
        </div>
        <div className="border border-paper/15 lg:col-span-7">
          <div className="flex items-center justify-between border-b border-paper/15 px-3 py-2">
            <p className="font-ui tracking-[0.2em] uppercase">{c.wireTitle}</p>
            <p className="text-xs text-mute">{products.length} lots · {vendors.length} desks</p>
          </div>
          <ul>
            {wire.map((entry) => (
              <li key={entry.t} className="grid grid-cols-[5.5rem_1fr] gap-3 border-b border-paper/10 px-3 py-3 text-sm last:border-b-0">
                <span className="text-blood tabular-nums">{entry.t}</span>
                <span>{entry.m}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid border-t border-paper/15 md:grid-cols-2">
        {categories.map((item, index) => {
          const count = products.filter((product) => product.category === item).length;
          return (
            <Link
              key={item}
              href={`/market?cat=${encodeURIComponent(item)}`}
              className="flex items-end justify-between border-b border-paper/15 px-4 py-5 hover:bg-paper hover:text-void md:px-8"
            >
              <span className="font-display text-5xl leading-none md:text-6xl">{catLabel(item)}</span>
              <span className="font-ui text-xl tracking-[0.16em] uppercase">
                {String(index + 1).padStart(2, "0")} / {count}
              </span>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
