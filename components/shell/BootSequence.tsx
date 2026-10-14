"use client";

import { useEffect, useRef } from "react";
import { SharkMark } from "@/components/visual/SharkMark";
import { useI18n } from "@/lib/i18n";

const lines = [
  "DS-KERNEL 7.4.1",
  "VESPER NODE 07 // DOCK HANDSHAKE",
  "CIPHER: SHARK-RED / 256",
  "PING  REDLINE YARDS     12ms",
  "PING  UPPER GLASS       19ms",
  "AUTH  BROKER TOKEN      ACCEPTED",
];

export function BootSequence({ onDone }: { onDone: () => void }) {
  const { c } = useI18n();
  const rootRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLDivElement>(null);
  const connectRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const sharkRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      sessionStorage.setItem("ds-booted", "1");
      onDone();
      return;
    }

    let killed = false;
    let timeline: { kill: () => void } | null = null;

    const finish = () => {
      sessionStorage.setItem("ds-booted", "1");
      onDone();
    };

    void import("gsap").then(({ default: gsap }) => {
      if (killed || !rootRef.current) return;
      const lineEls = linesRef.current?.querySelectorAll("[data-line]") ?? [];
      const tl = gsap.timeline({ onComplete: finish });
      timeline = tl;
      tl
        .from(lineEls, { autoAlpha: 0, y: 8, stagger: 0.14, duration: 0.18 })
        .to(lineEls, { autoAlpha: 0, duration: 0.25, delay: 0.25 })
        .fromTo(connectRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 })
        .to(barRef.current, { scaleX: 1, duration: 0.85, ease: "steps(12)" }, "<")
        .to(connectRef.current, { autoAlpha: 0, duration: 0.2, delay: 0.15 })
        .fromTo(sharkRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.08 })
        .to(sharkRef.current, { x: 10, duration: 0.045, repeat: 7, yoyo: true })
        .to(sharkRef.current, { autoAlpha: 0, duration: 0.18 })
        .fromTo(
          logoRef.current,
          { autoAlpha: 0, scale: 1.08 },
          { autoAlpha: 1, scale: 1, duration: 0.45, ease: "power4.out" },
        )
        .to(rootRef.current, { autoAlpha: 0, duration: 0.4, delay: 0.35 });
    });

    return () => {
      killed = true;
      timeline?.kill();
    };
  }, [onDone]);

  const skip = () => {
    sessionStorage.setItem("ds-booted", "1");
    onDone();
  };

  return (
    <div ref={rootRef} className="fixed inset-0 z-[80] bg-void text-paper" role="dialog" aria-label="Establishing encrypted connection">
      <div ref={linesRef} className="absolute top-16 left-6 space-y-1 font-mono text-xs text-paper md:left-12 md:text-sm">
        {lines.map((line) => (
          <p key={line} data-line className="opacity-0">
            <span className="text-blood">› </span>
            {line}
          </p>
        ))}
      </div>
      <div ref={connectRef} className="absolute inset-0 flex flex-col items-center justify-center opacity-0">
        <p className="px-6 text-center font-ui text-3xl tracking-[0.22em] text-paper uppercase md:text-5xl">
          {c.connect}
        </p>
        <div className="mt-6 h-px w-64 bg-paper/20">
          <div ref={barRef} className="h-full origin-left scale-x-0 bg-blood" />
        </div>
      </div>
      <div ref={sharkRef} className="absolute inset-0 flex items-center justify-center opacity-0">
        <div className="relative w-[72vw] max-w-xl">
          <SharkMark wire className="w-full text-paper" />
          <SharkMark wire className="glitch-slice absolute inset-0 w-full text-blood" />
        </div>
      </div>
      <div ref={logoRef} className="absolute inset-0 flex items-center justify-center opacity-0">
        <p className="font-display text-[16vw] leading-none tracking-wide">DARK SHARK</p>
      </div>
      <button
        type="button"
        onClick={skip}
        className="absolute right-6 bottom-8 font-ui text-lg tracking-[0.22em] text-mute uppercase hover:text-blood"
      >
        {c.skipIntro}
      </button>
    </div>
  );
}
