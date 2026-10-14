"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useMarket } from "@/lib/store";

export function AboutScreen() {
  const leviathan = useMarket((state) => state.leviathan);
  const { c, locale } = useI18n();
  const [line, setLine] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = window.setInterval(() => setLine((index) => (index + 1) % c.frey.length), 4200);
    return () => window.clearInterval(id);
  }, [c.frey.length]);

  return (
    <div>
      <p className="font-ui text-sm tracking-[0.32em] text-blood uppercase">{c.aboutKicker}</p>
      <h1 className="max-w-5xl font-display text-6xl leading-[0.85] md:text-8xl">{c.aboutQuote}</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <div className="border border-paper/15 p-4 lg:col-span-4">
          <p className="font-display text-[8rem] leading-none">BF</p>
          <dl className="mt-2 space-y-2 text-sm">
            <div className="grid grid-cols-[7rem_1fr] border-t border-paper/15 pt-2">
              <dt className="text-mute">{c.fieldName}</dt>
              <dd>Boryn Frey</dd>
            </div>
            <div className="grid grid-cols-[7rem_1fr] border-t border-paper/15 pt-2">
              <dt className="text-mute">{c.fieldSeat}</dt>
              <dd>{c.seatValue}</dd>
            </div>
            <div className="grid grid-cols-[7rem_1fr] border-t border-paper/15 pt-2">
              <dt className="text-mute">{c.fieldNode}</dt>
              <dd>{locale === "ru" ? "Северная мачта" : "North Mast"}</dd>
            </div>
            <div className="grid grid-cols-[7rem_1fr] border-t border-paper/15 pt-2">
              <dt className="text-mute">{c.fieldStatus}</dt>
              <dd>{c.statusValue}</dd>
            </div>
          </dl>
        </div>
        <div className="lg:col-span-8">
          <p className="text-sm leading-7">{c.aboutP1}</p>
          <p className="mt-4 text-sm leading-7 text-mute">{c.aboutP2}</p>
          <blockquote className="mt-8 border-l-2 border-blood pl-4 font-display text-4xl leading-none md:text-5xl">
            {c.frey[line]}
          </blockquote>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="font-ui text-sm tracking-[0.28em] text-blood uppercase">{c.timeline}</h2>
        <ol className="mt-4">
          {c.chapters.map((chapter) => (
            <li key={chapter[0]} className="grid gap-3 border-t border-paper/15 py-4 md:grid-cols-[6rem_1fr]">
              <span className="font-display text-4xl leading-none text-blood">{chapter[0]}</span>
              <p className="text-sm leading-6">{chapter[1]}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10 grid gap-px bg-paper/15 sm:grid-cols-2 lg:grid-cols-5">
        {c.slogans.map((slogan) => (
          <p key={slogan} className="bg-void px-3 py-6 font-ui text-2xl leading-none tracking-wide uppercase">
            {slogan}
          </p>
        ))}
      </section>

      <section id="leviathan" className="mt-12 scroll-mt-20 border border-blood p-4 md:p-6">
        <p className="font-ui text-sm tracking-[0.28em] text-blood uppercase">{c.sealed}</p>
        <h2 className="font-display text-6xl leading-none">{locale === "ru" ? "ЛЕВИАФАН" : "LEVIATHAN"}</h2>
        {leviathan ? (
          <div className="mt-4 max-w-3xl space-y-3 text-sm leading-6">
            <p>{c.leviOpen1}</p>
            <p>{c.leviOpen2}</p>
          </div>
        ) : (
          <div className="mt-4">
            <p className="max-w-xl text-sm text-mute">{c.leviClosed}</p>
            <div className="mt-4 space-y-2" aria-hidden>
              <div className="h-3 w-4/5 bg-paper" />
              <div className="h-3 w-3/5 bg-paper/80" />
              <div className="h-3 w-2/3 bg-blood" />
              <div className="h-3 w-1/2 bg-paper/60" />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
