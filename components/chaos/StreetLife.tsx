"use client";

import { useEffect, useState, type ReactElement } from "react";
import { useI18n } from "@/lib/i18n";
import { tone } from "@/lib/audio";
import { useMarket } from "@/lib/store";

const script = {
  en: [
    { from: "NULL", tag: "RED CELL", text: "You're standing in an open camera. I painted a mask on the lens." },
    { from: "MOMO", tag: "ALLEY", text: "small cat crossed the mast. do not invoice the cat." },
    { from: "FREY", tag: "HOUSE", text: "The cat is not inventory. I checked twice. Bill them anyway." },
    { from: "WICK", tag: "CONTRACTS", text: "A fictional name just became expensive. The sheet is warm." },
    { from: "NULL", tag: "RED CELL", text: "They still think the feed is theirs. Cute." },
  ],
  ru: [
    { from: "НУЛЬ", tag: "ЯЧЕЙКА", text: "Ты стоишь в открытой камере. Я нарисовал маску на линзе." },
    { from: "МОМО", tag: "ПЕРЕУЛОК", text: "рыжий пересёк мачту. кота в счёт не ставь." },
    { from: "ФРЕЙ", tag: "ДОМ", text: "Кот — не товар. Я проверял дважды. Счёт всё равно выстави." },
    { from: "ВИК", tag: "КОНТРАКТ", text: "Вымышленное имя только что подорожало. Лист ещё тёплый." },
    { from: "НУЛЬ", tag: "ЯЧЕЙКА", text: "Они всё ещё думают, что лента их. Мило." },
  ],
} as const;

export function StreetLife({ active }: { active: boolean }) {
  const { locale, c } = useI18n();
  const pushToast = useMarket((state) => state.pushToast);
  const sound = useMarket((state) => state.sound);
  const [burst, setBurst] = useState(false);
  const [banner, setBanner] = useState(false);
  const [catRun, setCatRun] = useState(0);
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState(0);
  const [log, setLog] = useState<{ from: string; text: string }[]>([]);

  useEffect(() => {
    if (!active) return;
    const glitch = window.setInterval(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      setBurst(true);
      window.setTimeout(() => setBurst(false), 280);
    }, 16000);
    const hijack = window.setInterval(() => {
      setBanner(true);
      window.setTimeout(() => setBanner(false), 2400);
    }, 22000);
    const cat = window.setTimeout(() => setCatRun((n) => n + 1), 7000);
    const catLoop = window.setInterval(() => setCatRun((n) => n + 1), 32000);
    const ping = window.setTimeout(() => setSeen(1), 5000);
    const pingLoop = window.setInterval(() => {
      setSeen((count) => Math.min(script.en.length, count + 1));
    }, 14000);
    return () => {
      window.clearInterval(glitch);
      window.clearInterval(hijack);
      window.clearTimeout(cat);
      window.clearInterval(catLoop);
      window.clearTimeout(ping);
      window.clearInterval(pingLoop);
    };
  }, [active]);

  const feed = script[locale].slice(0, seen);
  const unread = Math.max(0, feed.length - log.length);

  const pet = () => {
    tone("ok", sound);
    pushToast(c.catTitle, c.catBody);
  };

  const reply = (text: string) => {
    const last = feed[feed.length - 1];
    setLog((prev) => [...prev, ...(last ? [{ from: last.from, text: last.text }] : []), { from: c.you, text }].slice(-8));
    tone("tick", sound);
  };

  return (
    <>
      <div className="pointer-events-none fixed top-16 left-48 z-30 hidden w-28 -rotate-6 border border-paper bg-void px-2 py-1 text-[10px] text-paper xl:block">
        <Mask />
        <p className="sticker mt-1">RED CELL</p>
      </div>
      <div className="pointer-events-none fixed top-24 right-6 z-30 hidden -rotate-3 border border-blood px-2 py-1 font-ui text-sm text-blood lg:block">
        {locale === "ru" ? "КАМЕРЫ ВРУТ" : "CAMERAS LIE"}
      </div>
      {burst && <div className="hijack-burst pointer-events-none fixed inset-0 z-[55] bg-blood/20" />}
      {banner && (
        <div className="pointer-events-none fixed top-14 right-0 left-0 z-[45] bg-blood py-1 text-center font-ui text-lg tracking-[0.22em] text-void uppercase">
          {c.hijack}
        </div>
      )}
      {catRun > 0 && (
        <button
          key={catRun}
          type="button"
          onClick={pet}
          className="stray-run fixed bottom-8 left-0 z-[66] bg-transparent p-0"
          aria-label={locale === "ru" ? "Переулочный кот" : "Alley cat"}
        >
          <span className="stray-bob block">
            <PixelCat />
          </span>
        </button>
      )}
      <div className={`fixed z-[68] ${open ? "inset-x-3 bottom-12 md:left-48 md:right-auto md:w-[22rem]" : "right-3 bottom-12"}`}>
        {open ? (
          <section className="border border-blood bg-void shadow-[6px_6px_0_#ff253a]" role="dialog" aria-label={c.pingTitle}>
            <header className="flex items-center justify-between border-b border-blood/50 px-3 py-2">
              <p className="font-ui tracking-[0.2em] uppercase">{c.pingTitle} / RED CELL</p>
              <button type="button" onClick={() => setOpen(false)} className="font-ui uppercase hover:text-blood">
                {locale === "ru" ? "Скрыть" : "Hide"}
              </button>
            </header>
            <div className="h-52 space-y-2 overflow-auto px-3 py-3 text-xs">
              {feed.map((line, index) => (
                <p key={`${line.from}-${index}`}>
                  <span className="text-blood">{line.from}</span> <span className="text-mute">[{line.tag}]</span>
                  <br />
                  {line.text}
                </p>
              ))}
              {log.map((line, index) => (
                <p key={`log-${index}`} className={line.from === c.you ? "text-right" : ""}>
                  <span className="text-blood">{line.from}</span> — {line.text}
                </p>
              ))}
              {feed.length === 0 && <p className="text-mute">{c.pingHint}</p>}
            </div>
            <div className="flex flex-wrap gap-2 border-t border-paper/15 px-3 py-2">
              {c.replies.map((text) => (
                <button key={text} type="button" onClick={() => reply(text)} className="border border-paper/30 px-2 py-1 font-ui tracking-[0.12em] uppercase hover:border-blood">
                  {text}
                </button>
              ))}
            </div>
          </section>
        ) : (
          <button type="button" onClick={() => setOpen(true)} className="border border-blood bg-void px-3 py-2 text-left font-ui tracking-[0.16em] uppercase hover:bg-blood hover:text-void">
            {c.pingTitle}
            {unread > 0 ? ` · ${unread}` : ""}
          </button>
        )}
      </div>
    </>
  );
}

function Mask() {
  return (
    <svg viewBox="0 0 64 36" className="h-8 w-full" aria-hidden>
      <path d="M4 18 C10 4, 26 2, 32 10 C38 2, 54 4, 60 18 C50 30, 40 32, 32 26 C24 32, 14 30, 4 18 Z" fill="none" stroke="#f4f1ea" />
      <path d="M20 16 L28 20 M44 16 L36 20" stroke="#ff253a" />
    </svg>
  );
}

const FUR = "#f4f1ea";
const INK = "#080808";

const WALK = [
  [
    ".....................##.##..........",
    "....................#@@#@@#.........",
    "...................#@@@@@@@#........",
    "..................#@@@@@@@@@#.......",
    "..........##.....#@@@@@@@@@@@#......",
    ".........#@@#...#@@@@@@#@#@@@@#.....",
    ".........#@@@###@@@@@@@@@@@@@#......",
    "..........#@@@@@@@@@@@@@@@@@@#......",
    "...........#@@@@@@@@@@@@@@@@#.......",
    "............#@@@@@@@@@@@@@@#........",
    ".............#@@@@@@@@@@@@#.........",
    "..............#@@@#....#@@#.........",
    "..............#@@@#....#@@#.........",
    "...............#@@#.....#@#.........",
    "................#@#......#..........",
  ],
  [
    ".....................##.##..........",
    "....................#@@#@@#.........",
    "...................#@@@@@@@#........",
    "..................#@@@@@@@@@#.......",
    "..........##.....#@@@@@@@@@@@#......",
    ".........#@@#...#@@@@@@#@#@@@@#.....",
    ".........#@@@###@@@@@@@@@@@@@#......",
    "..........#@@@@@@@@@@@@@@@@@@#......",
    "...........#@@@@@@@@@@@@@@@@#.......",
    "............#@@@@@@@@@@@@@@#........",
    ".............#@@@@@@@@@@@@#.........",
    "............#@@@#......#@@@#........",
    ".............#@@#......#@@#.........",
    "..............#@#.......#@#.........",
    "...............#.........#..........",
  ],
] as const;

function PixelCat() {
  const width = WALK[0][0].length;
  const height = WALK[0].length;
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width * 6}
      height={height * 6}
      shapeRendering="crispEdges"
      className="cat-step"
      aria-hidden
    >
      <Sprite rows={WALK[0]} />
      <g className="cat-frame-b">
        <Sprite rows={WALK[1]} />
      </g>
    </svg>
  );
}

function Sprite({ rows }: { rows: readonly string[] }) {
  const rects: ReactElement[] = [];
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x += 1) {
      const bit = row[x];
      if (bit === ".") continue;
      rects.push(
        <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={bit === "@" ? FUR : INK} />,
      );
    }
  });
  return <g>{rects}</g>;
}
