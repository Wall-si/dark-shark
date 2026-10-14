import { districtRu, legacyRu, vendorRu } from "./legacy-ru";
import type { District, Locale, Product, Vendor } from "./types";

export type { Locale };

export function lotView(product: Product, locale: Locale): Product {
  if (locale !== "ru") return product;
  const ru = product.ru ?? legacyRu[product.id];
  if (!ru) return product;
  return {
    ...product,
    name: ru.name,
    tagline: ru.tagline,
    description: ru.description,
    origin: ru.origin,
    clearance: ru.clearance,
    specs: ru.specs ?? product.specs,
  };
}

export function vendorView(vendor: Vendor, locale: Locale): Vendor {
  if (locale !== "ru") return vendor;
  const ru = vendorRu[vendor.id];
  if (!ru) return vendor;
  return { ...vendor, ...ru };
}

export function districtView(district: District, locale: Locale): District {
  if (locale !== "ru") return district;
  const ru = districtRu[district.id];
  if (!ru) return district;
  return { ...district, ...ru };
}
