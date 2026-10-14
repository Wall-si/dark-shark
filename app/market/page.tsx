import type { Metadata } from "next";
import { Suspense } from "react";
import { Catalog } from "@/components/market/Catalog";

export const metadata: Metadata = { title: "Market" };

export default function Page() {
  return (
    <Suspense fallback={<p className="font-ui text-2xl tracking-[0.28em] text-blood uppercase">Opening ledger…</p>}>
      <Catalog />
    </Suspense>
  );
}
