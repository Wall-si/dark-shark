"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { tone } from "@/lib/audio";
import { districts, getDistrict, productsByVendor, vendors } from "@/lib/data";
import { eddies, repLabel } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { districtView, lotView, vendorView } from "@/lib/localize";
import { useMarket } from "@/lib/store";

export function VendorScreen() {
  const params = useSearchParams();
  const initial = params.get("district");
  const [district, setDistrict] = useState(initial && districts.some((item) => item.id === initial) ? initial : "ALL");
  const sound = useMarket((state) => state.sound);
  const pushToast = useMarket((state) => state.pushToast);
  const { locale, c, t } = useI18n();

  const desks = useMemo(
    () => vendors.filter((vendor) => district === "ALL" || vendor.districtId === district),
    [district],
  );

  const ping = (name: string) => {
    tone("ok", sound);
    pushToast("HANDSHAKE", `${name} is on the mesh. 14ms. No small talk.`);
  };

  return (
    <div>
      <p className="font-ui text-sm tracking-[0.32em] text-blood uppercase">{c.vendorsKicker}</p>
      <h1 className="font-display text-7xl leading-none md:text-8xl">{c.vendorsTitle}</h1>
      <p className="mt-3 max-w-xl text-sm text-mute">{c.vendorsBlurb}</p>
      <div className="mt-6 flex gap-2 overflow-auto pb-2">
        <Filter active={district === "ALL"} onClick={() => setDistrict("ALL")}>
          {c.allNodes}
        </Filter>
        {districts.map((item) => (
          <Filter key={item.id} active={district === item.id} onClick={() => setDistrict(item.id)}>
            {districtView(item, locale).name}
          </Filter>
        ))}
      </div>
      <div className="mt-4">
        {desks.map((vendor) => {
          const node = getDistrict(vendor.districtId);
          const shown = vendorView(vendor, locale);
          const place = node ? districtView(node, locale) : undefined;
          const lots = productsByVendor(vendor.id);
          return (
            <article id={vendor.id} key={vendor.id} className="scroll-mt-20 grid gap-4 border-t border-paper/15 py-6 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <p className="font-ui text-sm tracking-[0.22em] text-blood uppercase">{vendor.status}</p>
                <h2 className="font-display text-5xl leading-none">{shown.name}</h2>
                <p className="mt-1 text-sm text-mute">{shown.role}</p>
              </div>
              <div className="lg:col-span-5">
                <p className="text-sm">{shown.bio}</p>
                <p className="mt-3 font-ui text-2xl leading-none tracking-wide uppercase">&ldquo;{shown.motto}&rdquo;</p>
                <p className="mt-3 text-xs text-mute">
                  {place?.name} · {c.since} {vendor.since} · {shown.specialty}
                </p>
                <div className="mt-3 flex gap-1" aria-label={`Reputation ${vendor.score}`}>
                  {Array.from({ length: 10 }).map((_, index) => (
                    <span key={index} className={`h-3 flex-1 ${index < Math.round(vendor.score / 10) ? "bg-blood" : "bg-paper/15"}`} />
                  ))}
                </div>
                <p className="mt-2 font-ui tracking-[0.16em] uppercase">
                  {repLabel(vendor.score)} · {vendor.score}
                </p>
              </div>
              <div className="lg:col-span-3">
                <button type="button" onClick={() => ping(vendor.name)} className="font-ui text-lg tracking-[0.16em] uppercase hover:text-blood">
                  {t("ping")}
                </button>
                <ul className="mt-3 space-y-2">
                  {lots.map((lot) => (
                    <li key={lot.id}>
                      <Link href={`/product/${lot.id}`} className="flex items-baseline justify-between gap-3 border-t border-paper/10 pt-2 hover:text-blood">
                        <span className="text-sm">{lotView(lot, locale).name}</span>
                        <span className="shrink-0 text-xs tabular-nums">{eddies(lot.price)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
        {desks.length === 0 && <p className="py-10 text-mute">No desk claims this node.</p>}
      </div>
    </div>
  );
}

function Filter({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 border px-3 py-1 font-ui text-lg tracking-[0.12em] uppercase ${
        active ? "border-blood bg-blood text-void" : "border-paper/20 hover:border-blood"
      }`}
    >
      {children}
    </button>
  );
}
