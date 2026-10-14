"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ActionButton, FictionNote, Panel } from "@/components/ui";
import { tone } from "@/lib/audio";
import { getProduct } from "@/lib/data";
import { eddies, stamp } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { hashString } from "@/lib/hash";
import { useMarket } from "@/lib/store";

export function ProfileScreen() {
  const alias = useMarket((state) => state.alias);
  const setAlias = useMarket((state) => state.setAlias);
  const balance = useMarket((state) => state.balance);
  const clearance = useMarket((state) => state.clearance);
  const favorites = useMarket((state) => state.favorites);
  const orders = useMarket((state) => state.orders);
  const cart = useMarket((state) => state.cart);
  const toggleFavorite = useMarket((state) => state.toggleFavorite);
  const addToCart = useMarket((state) => state.addToCart);
  const grantFloat = useMarket((state) => state.grantFloat);
  const sound = useMarket((state) => state.sound);
  const pushToast = useMarket((state) => state.pushToast);
  const { t, c, view } = useI18n();
  const [draft, setDraft] = useState<string | null>(null);
  const shown = draft ?? alias;

  const save = (event: FormEvent) => {
    event.preventDefault();
    const ok = setAlias(shown);
    tone(ok ? "ok" : "deny", sound);
    pushToast(ok ? "ALIAS SET" : "REJECTED", ok ? `The house will call you ${shown.toUpperCase()}.` : "Three characters. Letters, numbers, a hyphen.");
    if (ok) setDraft(null);
  };

  const credit = () => {
    const result = grantFloat();
    tone(result.ok ? "ok" : "deny", sound);
    pushToast(result.ok ? "CREDIT" : "CLOSED", result.message);
  };

  const again = (id: string, qty: number) => {
    const result = addToCart(id, qty);
    tone(result.ok ? "ok" : "deny", sound);
    pushToast(result.ok ? "LOGGED" : "HELD", result.message);
  };

  const neural = `NS-${hashString(alias).toString(16).toUpperCase().padStart(8, "0")}`;

  return (
    <div>
      <p className="font-ui text-sm tracking-[0.32em] text-blood uppercase">{c.profileKicker}</p>
      <h1 className="font-display text-7xl leading-none md:text-8xl">{alias}</h1>
      <p className="mt-2 text-sm text-mute">{c.profileBlurb}</p>

      <div className="mt-8 grid gap-4 lg:grid-cols-12">
        <Panel className="p-4 lg:col-span-5">
          <p className="font-ui text-sm tracking-[0.22em] text-mute uppercase">{c.callsign}</p>
          <form onSubmit={save} className="mt-3 flex flex-wrap gap-2">
            <input
              value={shown}
              onChange={(event) => setDraft(event.target.value)}
              aria-label="Alias"
              maxLength={16}
              className="min-w-40 flex-1 border border-paper/20 bg-transparent px-3 py-2 font-ui text-2xl tracking-[0.12em] uppercase outline-none"
            />
            <ActionButton type="submit">{c.rewrite}</ActionButton>
          </form>
          <dl className="mt-5 space-y-2 text-sm">
            <Row k={c.neural} v={neural} />
            <Row k={c.clearance} v={clearance} />
            <Row k={t("bag")} v={`${cart.length} ${t("lots")}`} />
          </dl>
        </Panel>
        <Panel className="flex flex-col justify-between p-4 lg:col-span-7">
          <div>
            <p className="font-ui text-sm tracking-[0.22em] text-mute uppercase">{c.houseBalance}</p>
            <p className="font-display text-7xl leading-none tabular-nums">{eddies(balance)}</p>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <ActionButton onClick={credit}>{c.credit}</ActionButton>
            <FictionNote />
          </div>
        </Panel>
      </div>

      <section className="mt-10">
        <h2 className="font-display text-5xl leading-none">{c.pins}</h2>
        {favorites.length === 0 && (
          <p className="mt-3 text-sm text-mute">
            {c.nothingPinned}{" "}
            <Link href="/market" className="text-paper hover:text-blood">
              {c.openMarket}
            </Link>
          </p>
        )}
        <ul className="mt-3">
          {favorites.map((id) => {
            const product = getProduct(id);
            if (!product) return null;
            return (
              <li key={id} className="flex flex-wrap items-center justify-between gap-3 border-t border-paper/15 py-3">
                <Link href={`/product/${product.id}`} className="font-ui text-3xl leading-none uppercase hover:text-blood">
                  {view(product).name}
                </Link>
                <div className="flex items-center gap-3">
                  <span className="tabular-nums">{eddies(product.price)}</span>
                  <button type="button" className="font-ui tracking-[0.14em] uppercase hover:text-blood" onClick={() => toggleFavorite(id)}>
                  {c.release}
                </button>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-5xl leading-none">{c.clearances}</h2>
        <p className="mt-2 text-sm text-mute">{c.ordersHint}</p>
        <div className="mt-4 space-y-4">
          {orders.map((order) => (
            <article key={order.id} className="border border-paper/15 p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-ui text-2xl tracking-[0.14em] uppercase">{order.id}</h3>
                <p className="text-xs text-mute">{stamp(order.at)}</p>
              </div>
              <p className="mt-1 text-xs text-blood">{order.status}</p>
              <ul className="mt-3">
                {order.items.map((item) => (
                  <li key={`${order.id}-${item.id}`} className="flex items-center justify-between gap-3 border-t border-paper/10 py-2 text-sm">
                    <Link href={`/product/${item.id}`} className="hover:text-blood">
                      {(getProduct(item.id) ? view(getProduct(item.id)!).name : item.name)} × {item.qty}
                    </Link>
                    <button type="button" className="font-ui tracking-[0.12em] uppercase hover:text-blood" onClick={() => again(item.id, item.qty)}>
                      Again
                    </button>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-right font-display text-4xl leading-none tabular-nums">{eddies(order.total)}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid grid-cols-[7rem_1fr] border-t border-paper/10 pt-2">
      <dt className="text-mute">{k}</dt>
      <dd className="tabular-nums">{v}</dd>
    </div>
  );
}
