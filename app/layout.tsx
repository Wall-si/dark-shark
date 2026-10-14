import type { Metadata } from "next";
import { AppShell } from "@/components/shell/AppShell";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "DARK SHARK",
    template: "%s — DARK SHARK",
  },
  description:
    "Dark Shark is a fictional underground exchange in the city of Vesper. Everything has a price. Nothing here is real.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased" data-scroll-behavior="smooth">
      <body className="min-h-full bg-void font-mono text-paper">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
