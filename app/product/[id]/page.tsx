import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductScreen } from "@/components/market/ProductScreen";
import { getProduct, products } from "@/lib/data";

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) return { title: "Lost signal" };
  return { title: product.name, description: product.tagline };
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<p className="font-ui text-2xl tracking-[0.28em] text-blood uppercase">Opening lot…</p>}>
      <Lot params={params} />
    </Suspense>
  );
}

async function Lot({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();
  return <ProductScreen product={product} />;
}
