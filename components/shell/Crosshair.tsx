"use client";

import { useEffect, useRef } from "react";

export function Crosshair() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!node || !fine || reduce) return;
    node.hidden = false;
    document.body.classList.add("has-reticle");
    const move = (event: MouseEvent) => {
      node.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
      const target = event.target as HTMLElement | null;
      const hot = Boolean(target?.closest("a, button, input, select, textarea, [role='button']"));
      node.dataset.hot = hot ? "1" : "0";
    };
    window.addEventListener("mousemove", move);
    return () => {
      document.body.classList.remove("has-reticle");
      window.removeEventListener("mousemove", move);
    };
  }, []);

  return (
    <div ref={ref} hidden className="pointer-events-none fixed top-0 left-0 z-[90] [&[data-hot='1']_svg]:scale-125">
      <svg width="32" height="32" viewBox="0 0 32 32" className="-translate-x-1/2 -translate-y-1/2 transition-transform" aria-hidden>
        <path d="M16 1 V8 M16 24 V31 M1 16 H8 M24 16 H31" stroke="#f4f1ea" strokeWidth="1" />
        <rect x="12" y="12" width="8" height="8" fill="none" stroke="#ff253a" />
        <rect x="15" y="15" width="2" height="2" fill="#ff253a" />
      </svg>
    </div>
  );
}
