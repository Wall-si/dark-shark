export const categories = [
  "Cyberware",
  "Weapons",
  "Chems",
  "Contracts",
  "Synthetics",
  "Tech",
  "Vehicles",
  "Intelligence",
  "Black Market",
] as const;

export type Category = (typeof categories)[number];

export type Locale = "en" | "ru";

export type Rarity = "STREET" | "RARE" | "RESTRICTED" | "BLACK";

export type Product = {
  id: string;
  sku: string;
  name: string;
  category: Category;
  price: number;
  vendorId: string;
  rarity: Rarity;
  stock: number;
  heat: number;
  delta: number;
  tagline: string;
  description: string;
  specs: { k: string; v: string }[];
  origin: string;
  clearance: string;
  ru?: LotCopy;
};

export type LotCopy = {
  name: string;
  tagline: string;
  description: string;
  origin: string;
  clearance: string;
  specs?: { k: string; v: string }[];
};

export type Vendor = {
  id: string;
  name: string;
  role: string;
  districtId: string;
  score: number;
  specialty: string;
  since: string;
  motto: string;
  bio: string;
  status: "LIVE" | "QUIET" | "WATCHED";
};

export type District = {
  id: string;
  name: string;
  x: number;
  y: number;
  note: string;
};

export type CartLine = { id: string; qty: number };

export type OrderItem = {
  id: string;
  qty: number;
  price: number;
  name: string;
};

export type Order = {
  id: string;
  at: number;
  total: number;
  status: "CLEARED";
  items: OrderItem[];
};

export type Toast = { id: string; title: string; body: string };

export type SortKey = "heat" | "price-asc" | "price-desc" | "name" | "delta";
