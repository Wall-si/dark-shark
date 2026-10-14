"use client";

import Link from "next/link";
import { useState } from "react";
import { districts, getDistrict, relays, vendors } from "@/lib/data";
import { repLabel } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { districtView, vendorView } from "@/lib/localize";

export function CityMap() {
  const { locale, c } = useI18n();
  const [active, setActive] = useState("glass");
  const raw = getDistrict(active) ?? districts[0];
  const district = districtView(raw, locale);
  const desks = vendors.filter((vendor) => vendor.districtId === active);
  const byId = Object.fromEntries(districts.map((item) => [item.id, item]));

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <div className="border border-paper/15 bg-ink lg:col-span-8">
        <svg viewBox="0 0 1000 620" className="h-auto w-full" role="img" aria-label="Map of Vesper">
          <rect width="1000" height="620" fill="#101010" />
          <path d="M40 180 C 180 120, 260 240, 420 200 S 700 80, 960 160" fill="none" stroke="rgba(244,241,234,0.18)" />
          <path d="M20 420 C 200 360, 340 520, 560 450 S 820 520, 980 400" fill="none" stroke="rgba(255,37,58,0.35)" />
          {relays.map(([from, to]) => {
            const a = byId[from];
            const b = byId[to];
            return (
              <line
                key={`${from}-${to}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="#ff253a"
                strokeWidth="1.4"
                strokeDasharray="5 9"
                className="march"
              />
            );
          })}
          {districts.map((node) => {
            const on = node.id === active;
            const anchorEnd = node.x > 760;
            return (
              <g
                key={node.id}
                transform={`translate(${node.x} ${node.y})`}
                role="button"
                tabIndex={0}
                aria-label={node.name}
                aria-pressed={on}
                className="cursor-pointer"
                onClick={() => setActive(node.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setActive(node.id);
                  }
                }}
              >
                <rect x={anchorEnd ? -150 : -12} y="-16" width="168" height="34" fill="transparent" />
                <rect
                  x="-9"
                  y="-9"
                  width="18"
                  height="18"
                  fill={on ? "#ff253a" : "#080808"}
                  stroke={on ? "#ff253a" : "#f4f1ea"}
                />
                <text
                  x={anchorEnd ? -16 : 16}
                  y="5"
                  textAnchor={anchorEnd ? "end" : "start"}
                  fill="#f4f1ea"
                  fontSize="18"
                  className="pointer-events-none font-ui"
                >
                  {districtView(node, locale).name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <aside className="border border-paper/15 p-4 lg:col-span-4">
        <p className="font-ui text-sm tracking-[0.24em] text-blood uppercase">{c.selected}</p>
        <h2 className="font-display text-5xl leading-none">{district.name}</h2>
        <p className="mt-3 text-sm text-mute">{district.note}</p>
        <ul className="mt-5 space-y-3">
          {desks.length === 0 && <li className="text-sm text-mute">{c.noDesk}</li>}
          {desks.map((vendor) => {
            const desk = vendorView(vendor, locale);
            return (
            <li key={vendor.id} className="border-t border-paper/15 pt-3">
              <Link href={`/vendors#${vendor.id}`} className="font-ui text-2xl leading-none uppercase hover:text-blood">
                {desk.name}
              </Link>
              <p className="mt-1 text-xs text-mute">
                {repLabel(vendor.score)} · {desk.specialty} · {vendor.status}
              </p>
            </li>
            );
          })}
        </ul>
        <Link href={`/vendors?district=${district.id}`} className="mt-6 inline-block font-ui text-xl tracking-[0.16em] uppercase hover:text-blood">
          {c.openDesks}
        </Link>
      </aside>
    </div>
  );
}
