"use client";

import { Bookmark, Search } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Schematic } from "@/components/visual/Schematic";
import { tone } from "@/lib/audio";
import { categories, getVendor, isCategory, products } from "@/lib/data";
import { deltaLabel, eddies } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { vendorView } from "@/lib/localize";
import { useMarket } from "@/lib/store";
import type { Category, SortKey } from "@/lib/types";

const sorts: { id: SortKey; label: string }[] = [
  { id: "heat", label: "Heat" },
  { id: "price-asc", label: "Price up" },
  { id: "price-desc", label: "Price down" },
  { id: "name", label: "Name" },
  { id: "delta", label: "Move" },
];

export function Catalog() {
  const params = useSearchParams();
  const initial = params.get("cat");
  const [cat, setCat] = useState<Category | "ALL">(isCategory(initial) ? initial : "ALL");
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [sort, setSort] = useState<SortKey>("heat");
  const addToCart = useMarket((state) => state.addToCart);
  const toggleFavorite = useMarket((state) => state.toggleFavorite);
  const favorites = useMarket((state) => state.favorites);
  const sound = useMarket((state) => state.sound);
  const pushToast = useMarket((state) => state.pushToast);
  const { t, view, category, locale } = useI18n();

  const lots = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = products.filter((product) => {
      if (cat !== "ALL" && product.category !== cat) return false;
      if (!q) return true;
      const localized = view(product);
      const hay = `${product.name} ${localized.name} ${product.sku} ${product.tagline} ${localized.tagline} ${product.category}`.toLowerCase();
      return hay.includes(q);
    });
    return filtered.sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "delta") return b.delta - a.delta;
      return b.heat - a.heat;
    });
  }, [cat, query, sort, view]);

  const acquire = (id: string) => {
    const result = addToCart(id);
    tone(result.ok ? "ok" : "deny", sound);
    pushToast(result.ok ? "LOGGED" : "HELD", result.message);
  };

  const pin = (id: string) => {
    const result = toggleFavorite(id);
    tone("tick", sound);
    pushToast(result.on ? "PINNED" : "UNPINNED", result.on ? "Lot held on your glass." : "Pin released.");
  };

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-ui text-sm tracking-[0.32em] text-blood uppercase">{t("catalogKicker")}</p>
          <h1 className="font-display text-7xl leading-none md:text-8xl">{t("market")}</h1>
        </div>
        <p className="font-ui text-2xl tracking-[0.14em] text-mute uppercase">
          {lots.length} / {products.length} {t("lots")}
        </p>
      </header>

      <div className="mb-4 flex gap-2 overflow-auto pb-2">
        <FilterButton active={cat === "ALL"} onClick={() => setCat("ALL")}>
          {t("all")}
        </FilterButton>
        {categories.map((item) => (
          <FilterButton key={item} active={cat === item} onClick={() => setCat(item)}>
            {category(item)}
          </FilterButton>
        ))}
      </div>

      <div className="mb-8 grid gap-3 md:grid-cols-[1fr_auto]">
        <label className="flex items-center gap-2 border border-paper/20 px-3">
          <Search size={14} aria-hidden />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("query")}
            className="w-full bg-transparent py-2 font-mono text-xs uppercase outline-none placeholder:text-mute"
            aria-label={t("search")}
          />
        </label>
        <select
          value={sort}
          onChange={(event) => setSort(event.target.value as SortKey)}
          aria-label={t("sort")}
          className="border border-paper/20 bg-void px-3 py-2 font-ui text-lg tracking-[0.14em] uppercase"
        >
          {sorts.map((item) => (
            <option key={item.id} value={item.id}>
              {item.id === "heat" ? t("heat") : item.id === "price-asc" ? t("priceUp") : item.id === "price-desc" ? t("priceDown") : item.id === "name" ? t("name") : t("move")}
            </option>
          ))}
        </select>
      </div>

      {lots.length === 0 && (
        <div className="border border-dashed border-paper/25 p-8">
          <p className="font-display text-6xl leading-none">{t("noMatch")}</p>
          <p className="mt-2 text-mute">{t("noMatchBody")}</p>
          <button
            type="button"
            className="mt-4 font-ui text-xl tracking-[0.16em] uppercase hover:text-blood"
            onClick={() => {
              setQuery("");
              setCat("ALL");
            }}
          >
            {t("clearQuery")}
          </button>
        </div>
      )}

      <div>
        {lots.map((product, index) => {
          const vendor = getVendor(product.vendorId);
          const shown = view(product);
          const desk = vendor ? vendorView(vendor, locale) : undefined;
          const pinned = favorites.includes(product.id);
          return (
            <article key={product.id} className="group relative border-t border-paper/15 py-4 text-paper hover:bg-blood hover:text-void">
              <Link
                href={`/product/${product.id}`}
                aria-label={shown.name}
                className="absolute inset-0 z-0"
              />
              <div className="pointer-events-none relative z-10 grid items-center gap-4 md:grid-cols-12">
                <p className="font-display text-5xl leading-none text-paper/30 group-hover:text-void/50 md:col-span-1">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <div className="h-28 md:col-span-3">
                  <Schematic id={product.id} category={product.category} sku={product.sku} rarity={product.rarity} label={`${product.name} schematic`} />
                </div>
                <div className="md:col-span-5">
                  <p className="font-ui text-sm tracking-[0.22em] uppercase">
                    {category(product.category)} / {product.sku}
                  </p>
                  <h2 className="font-display text-4xl leading-none md:text-5xl">{shown.name}</h2>
                  <p className="mt-1 text-xs opacity-70">{shown.tagline}</p>
                  <p className="mt-2 text-[11px] tracking-[0.14em] uppercase opacity-70">{desk?.name}</p>
                </div>
                <div className="md:col-span-3 md:text-right">
                  <p className="font-display text-4xl leading-none tabular-nums">{eddies(product.price)}</p>
                  <p className={`mt-1 text-xs ${product.delta >= 0 ? "" : "opacity-70"}`}>{deltaLabel(product.delta)} · {t("heat").toLowerCase()} {product.heat}</p>
                  <div className="mt-2 ml-auto h-px w-24 bg-current/20">
                    <div className="h-full bg-blood group-hover:bg-void" style={{ width: `${product.heat}%` }} />
                  </div>
                </div>
              </div>
              <div className="relative z-10 mt-3 flex gap-2 md:absolute md:right-0 md:bottom-4">
                <button
                  type="button"
                  aria-pressed={pinned}
                  aria-label={pinned ? t("unpin") : t("pinLot")}
                  onClick={() => pin(product.id)}
                  className="border border-current px-2 py-1"
                >
                  <Bookmark size={14} className={pinned ? "fill-current" : ""} />
                </button>
                <button type="button" onClick={() => acquire(product.id)} className="border border-current px-3 py-1 font-ui text-lg tracking-[0.16em] uppercase">
                  {t("acquire")}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function FilterButton({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 border px-3 py-1 font-ui text-lg tracking-[0.14em] uppercase ${
        active ? "border-blood bg-blood text-void" : "border-paper/20 text-paper hover:border-blood"
      }`}
    >
      {children}
    </button>
  );
}
