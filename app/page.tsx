import type { Metadata } from "next";
import { HomeScreen } from "@/components/home/HomeScreen";

export const metadata: Metadata = {
  title: { absolute: "DARK SHARK — Everything Has a Price" },
};

export default function Page() {
  return <HomeScreen />;
}
