"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useI18n } from "@/lib/i18n";

export function Kicker({ children }: { children: ReactNode }) {
  return <p className="font-ui text-sm tracking-[0.32em] text-blood uppercase">{children}</p>;
}

export function FictionNote() {
  const { t } = useI18n();
  return (
    <p className="font-ui text-sm tracking-[0.18em] text-mute uppercase">
      {t("fiction")}
    </p>
  );
}

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`relative border border-paper/15 bg-ink ${className}`}>
      <i className="pointer-events-none absolute top-0 left-0 h-2 w-2 border-t border-l border-blood" />
      <i className="pointer-events-none absolute top-0 right-0 h-2 w-2 border-t border-r border-blood" />
      <i className="pointer-events-none absolute bottom-0 left-0 h-2 w-2 border-b border-l border-blood" />
      <i className="pointer-events-none absolute right-0 bottom-0 h-2 w-2 border-r border-b border-blood" />
      {children}
    </section>
  );
}

type ActionProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: "solid" | "ghost" | "paper";
};

export function ActionButton({ tone = "solid", className = "", children, ...props }: ActionProps) {
  const toneClass =
    tone === "solid"
      ? "bg-blood text-void hover:bg-paper"
      : tone === "paper"
        ? "bg-paper text-void hover:bg-blood"
        : "border border-paper/30 text-paper hover:border-blood hover:text-blood";
  return (
    <button
      type="button"
      {...props}
      className={`glitch-hover inline-flex items-center justify-center gap-2 px-4 py-2 font-ui text-lg tracking-[0.18em] uppercase disabled:opacity-40 ${toneClass} ${className}`}
    >
      {children}
    </button>
  );
}

export function Barcode({ value }: { value: string }) {
  const widths = value.split("").map((char) => (char.charCodeAt(0) % 3) + 1);
  return (
    <div className="flex h-8 items-end gap-px" aria-hidden>
      {widths.map((width, index) => (
        <span key={`${value}-${index}`} className="flex items-end gap-px">
          <span className="bg-current" style={{ width, height: index % 4 === 0 ? "100%" : "70%" }} />
          <span style={{ width: 1 + (width % 2) }} />
        </span>
      ))}
    </div>
  );
}
