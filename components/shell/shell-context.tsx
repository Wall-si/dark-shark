"use client";

import { createContext, useContext } from "react";

type ShellApi = {
  booted: boolean;
  openCart: () => void;
  openTerm: () => void;
};

export const ShellContext = createContext<ShellApi>({
  booted: false,
  openCart: () => {},
  openTerm: () => {},
});

export function useShell() {
  return useContext(ShellContext);
}
