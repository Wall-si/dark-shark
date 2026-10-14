"use client";

import { CityMap } from "@/components/network/CityMap";
import { districts, vendors } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { districtView } from "@/lib/localize";

export function NetworkScreen() {
  const { locale, c } = useI18n();
  return (
    <div>
      <p className="font-ui text-sm tracking-[0.32em] text-blood uppercase">{c.netKicker}</p>
      <h1 className="font-display text-7xl leading-none md:text-8xl">{c.netTitle}</h1>
      <p className="mt-3 max-w-2xl text-sm text-mute">{c.netBlurb}</p>
      <div className="mt-6">
        <CityMap />
      </div>
      <ul className="mt-8 grid gap-px bg-paper/15 sm:grid-cols-2 lg:grid-cols-4">
        {districts.map((district) => {
          const shown = districtView(district, locale);
          const count = vendors.filter((vendor) => vendor.districtId === district.id).length;
          return (
            <li key={district.id} className="bg-void p-3">
              <p className="font-ui text-2xl leading-none uppercase">{shown.name}</p>
              <p className="mt-2 text-xs text-mute">{shown.note}</p>
              <p className="mt-3 font-ui tracking-[0.16em] text-blood uppercase">
                {count} {count === 1 ? c.deskOne : c.deskMany}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
