import type { Metadata } from "next";
import { NetworkScreen } from "@/components/network/NetworkScreen";

export const metadata: Metadata = { title: "Network" };

export default function Page() {
  return <NetworkScreen />;
}
