import type { Metadata } from "next";
import { AboutScreen } from "@/components/about/AboutScreen";

export const metadata: Metadata = { title: "Dossier" };

export default function Page() {
  return <AboutScreen />;
}