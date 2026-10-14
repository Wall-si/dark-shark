"use client";

import { Bookmark } from "lucide-react";
import Link from "next/link";
import { ActionButton, Barcode, FictionNote, Panel } from "@/components/ui";
import { Schematic } from "@/components/visual/Schematic";
import { tone } from "@/lib/audio";
import { getVendor, products } from "@/lib/data";
import { deltaLabel, eddies, repLabel } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { vendorView } from "@/lib/localize";
import { useMarket } from "@/lib/store";
import type { Product } from "@/lib/types";

export function ProductScreen({ product }: { product: Product }) {
  const vendor = getVendor(product.vendorId);
  const related = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 3);
  const addToCart = useMarket((state) => state.addToCart);
  const toggleFavorite = useMarket((state) => state.toggleFavorite);
  const favorites = useMarket((state) => state.favorites);
  const sound = useMarket((state) => state.sound);
  const pushToast = useMarket((state) => state.pushToast);
  const pinned = favorites.includes(product.id);
  const { t, view, category, locale } = useI18n();
  const shown = view(product);

  const acquire = () => {
    const result = addToCart(product.id);
    tone(result.ok ? "ok" : "deny", sound);
    pushToast(result.ok ? "LOGGED" : "HELD", result.message);
  };

  const pin = () => {
    const result = toggleFavorite(product.id);
    tone("tick", sound);
    pushToast(result.on ? "PINNED" : "UNPINNED", product.name);
  };

  const ping = () => {
    tone("ok", sound);
    pushToast("HANDSHAKE", `${vendor?.name ?? "Desk"} replies in 14ms. They already knew.`);
  };

  return (
    <article>
      <p className="font-ui text-sm tracking-[0.28em] text-blood uppercase">
        {category(product.category)} / {product.sku} / {product.rarity}
      </p>
      <div className="mt-2 grid items-end gap-6 lg:grid-cols-12">
        <h1 className="font-display text-6xl leading-[0.85] glitch-hover md:text-8xl lg:col-span-8">{shown.name}</h1>
        <p className="text-sm text-mute lg:col-span-4 lg:text-right">{shown.tagline}</p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-12">
        <Panel className="min-h-72 p-3 lg:col-span-7">
          <Schematic id={product.id} category={product.category} sku={product.sku} rarity={product.rarity} label={`${product.name} technical plate`} />
        </Panel>
        <div className="flex flex-col gap-4 lg:col-span-5">
          <p className="font-display text-7xl leading-none tabular-nums">{eddies(product.price)}</p>
          <p className="text-sm">
            {deltaLabel(product.delta)} this cycle · heat {product.heat} · stock {product.stock}
          </p>
          <div className="h-px w-full bg-paper/15">
            <div className="h-full bg-blood" style={{ width: `${product.heat}%` }} />
          </div>
          <div className="flex flex-wrap gap-2">
            <ActionButton onClick={acquire}>{t("acquire")}</ActionButton>
            <ActionButton tone="ghost" onClick={pin} aria-pressed={pinned}>
              <Bookmark size={14} className={pinned ? "fill-current" : ""} />
              {pinned ? t("pinned") : t("pin")}
            </ActionButton>
            <ActionButton tone="ghost" onClick={ping}>
              {t("ping")}
            </ActionButton>
          </div>
          <FictionNote />
          {vendor && (
            <Link href={`/vendors#${vendor.id}`} className="border border-paper/15 p-3 hover:border-blood">
              <p className="font-ui text-sm tracking-[0.22em] text-mute uppercase">{t("desk")}</p>
              <p className="font-display text-4xl leading-none">{vendorView(vendor, locale).name}</p>
              <p className="mt-1 text-xs text-mute">
                {repLabel(vendor.score)} · {vendor.score} · {vendor.status}
              </p>
            </Link>
          )}
          <Barcode value={product.sku + product.name} />
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <p className="text-sm leading-6 text-paper/90 lg:col-span-6">{shown.description}</p>
        <dl className="lg:col-span-6">
          {[
            ...shown.specs,
            { k: locale === "ru" ? "Происхождение" : "Origin", v: shown.origin },
            { k: locale === "ru" ? "Допуск" : "Clearance", v: shown.clearance },
          ].map((spec) => (
            <div key={spec.k} className="grid grid-cols-[8rem_1fr] gap-3 border-t border-paper/15 py-2 text-sm">
              <dt className="font-ui tracking-[0.16em] text-mute uppercase">{spec.k}</dt>
              <dd>{spec.v}</dd>
            </div>
          ))}
        </dl>
      </div>

      <section className="mt-12">
        <h2 className="font-ui text-sm tracking-[0.28em] text-blood uppercase">{t("adjacent")}</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {related.map((item) => (
            <Link key={item.id} href={`/product/${item.id}`} className="border border-paper/15 p-3 hover:border-blood">
              <p className="text-xs text-mute">{item.sku}</p>
              <p className="font-display text-3xl leading-none">{view(item).name}</p>
              <p className="mt-2 font-ui text-xl">{eddies(item.price)}</p>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
