"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { cartTotal, getProduct } from "./data";
import type { CartLine, Order, Toast } from "./types";

const SEED_AT = Date.UTC(2084, 9, 2, 4, 11, 0);

type Result = { ok: boolean; message: string; orderId?: string };

type MarketState = {
  cart: CartLine[];
  favorites: string[];
  orders: Order[];
  balance: number;
  sound: boolean;
  alias: string;
  clearance: string;
  leviathan: boolean;
  locale: "en" | "ru";
  toasts: Toast[];
  addToCart: (id: string, qty?: number) => Result;
  setQty: (id: string, qty: number) => Result;
  removeFromCart: (id: string) => void;
  toggleFavorite: (id: string) => { on: boolean };
  checkout: () => Result;
  grantFloat: () => Result;
  setSound: (value: boolean) => void;
  setAlias: (value: string) => boolean;
  pushToast: (title: string, body: string) => void;
  dismissToast: (id: string) => void;
  unlockLeviathan: () => void;
  setLocale: (locale: "en" | "ru") => void;
};

export const useMarket = create<MarketState>()(
  persist(
    (set, get) => ({
      cart: [],
      favorites: ["rift-optic"],
      orders: [
        {
          id: "DS-7F3A",
          at: SEED_AT,
          total: 3150,
          status: "CLEARED",
          items: [{ id: "hush-lung", qty: 1, price: 3150, name: "Hush Lung Filter" }],
        },
      ],
      balance: 96400,
      sound: true,
      alias: "GUEST-441",
      clearance: "STREET",
      leviathan: false,
      locale: "en",
      toasts: [],
      addToCart: (id, qty = 1) => {
        const product = getProduct(id);
        if (!product) return { ok: false, message: "UNKNOWN LOT" };
        const existing = get().cart.find((line) => line.id === id);
        const next = (existing?.qty ?? 0) + qty;
        if (next > product.stock) return { ok: false, message: "STOCK LOCKED" };
        const cart = existing
          ? get().cart.map((line) => (line.id === id ? { ...line, qty: next } : line))
          : [...get().cart, { id, qty }];
        set({ cart });
        return { ok: true, message: `LOGGED // ${product.sku}` };
      },
      setQty: (id, qty) => {
        const product = getProduct(id);
        if (!product) return { ok: false, message: "UNKNOWN LOT" };
        if (qty <= 0) {
          set({ cart: get().cart.filter((line) => line.id !== id) });
          return { ok: true, message: "DROPPED" };
        }
        if (qty > product.stock) return { ok: false, message: "STOCK LOCKED" };
        set({
          cart: get().cart.map((line) => (line.id === id ? { ...line, qty } : line)),
        });
        return { ok: true, message: "QTY SET" };
      },
      removeFromCart: (id) => set({ cart: get().cart.filter((line) => line.id !== id) }),
      toggleFavorite: (id) => {
        const has = get().favorites.includes(id);
        set({
          favorites: has ? get().favorites.filter((item) => item !== id) : [...get().favorites, id],
        });
        return { on: !has };
      },
      checkout: () => {
        const { cart, balance } = get();
        if (!cart.length) return { ok: false, message: "BAG IS EMPTY" };
        const items = cart.flatMap((line) => {
          const product = getProduct(line.id);
          if (!product) return [];
          return [{ id: product.id, qty: line.qty, price: product.price, name: product.name }];
        });
        const total = cartTotal(cart);
        if (total <= 0) return { ok: false, message: "NOTHING TO CLEAR" };
        if (total > balance) return { ok: false, message: "INSUFFICIENT EDDIES" };
        const order: Order = {
          id: `DS-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
          at: Date.now(),
          total,
          status: "CLEARED",
          items,
        };
        set({ balance: balance - total, cart: [], orders: [order, ...get().orders] });
        return { ok: true, message: `CLEARED ${order.id}`, orderId: order.id };
      },
      grantFloat: () => {
        const next = get().balance + 50000;
        if (next > 1_000_000) return { ok: false, message: "THE HOUSE CLOSED THE WINDOW" };
        set({ balance: next });
        return { ok: true, message: "CREDIT EXTENDED. THE HOUSE ALWAYS WINS." };
      },
      setSound: (value) => set({ sound: value }),
      setAlias: (value) => {
        const clean = value.toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 16);
        if (clean.length < 3) return false;
        set({ alias: clean });
        return true;
      },
      pushToast: (title, body) => {
        const toast = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, title, body };
        set({ toasts: [...get().toasts, toast].slice(-4) });
      },
      dismissToast: (id) => set({ toasts: get().toasts.filter((toast) => toast.id !== id) }),
      unlockLeviathan: () => set({ leviathan: true, clearance: "LEVIATHAN" }),
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: "dark-shark-ledger",
      partialize: (state) => ({
        cart: state.cart,
        favorites: state.favorites,
        orders: state.orders,
        balance: state.balance,
        sound: state.sound,
        alias: state.alias,
        clearance: state.clearance,
        leviathan: state.leviathan,
        locale: state.locale,
      }),
    },
  ),
);
