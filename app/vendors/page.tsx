import type { Metadata } from "next";
import { Suspense } from "react";
import { VendorScreen } from "@/components/vendors/VendorScreen";

export const metadata: Metadata = { title: "Vendors" };

export default function Page() {
  return (
    <Suspense fallback={<p className="font-ui text-2xl tracking-[0.28em] text-blood uppercase">Calling desks…</p>}>
      <VendorScreen />
    </Suspense>
  );
}
