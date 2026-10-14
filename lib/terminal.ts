import { eddies } from "./format";
import { findLot, freyLines, products, vendors } from "./data";

export type TermContext = {
  alias: string;
  clearance: string;
  balance: number;
  cartCount: number;
  favCount: number;
  leviathan: boolean;
};

export type TermResult = {
  lines: string[];
  href?: string;
  openCart?: boolean;
  close?: boolean;
  clear?: boolean;
  unlock?: boolean;
  addId?: string;
  favId?: string;
  sound?: "ok" | "deny";
};

const help = [
  "DARK SHARK SHELL // AUTHORIZED FICTION",
  "help        index",
  "market      open the catalog",
  "vendors     list desks",
  "network     city mesh",
  "profile     operator file",
  "about       house dossier",
  "status      node health",
  "whoami      who the house thinks you are",
  "balance     eddies on the glass",
  "cart        open the bag",
  "buy SKU     acquire one unit",
  "fav SKU     pin or unpin a lot",
  "frey        chairman, on record",
  "shark       a small omen",
  "leviathan   request black clearance",
  "clear       wipe the glass",
  "exit        close the channel",
];

export function interpret(raw: string, ctx: TermContext): TermResult {
  const input = raw.trim();
  const [head, ...rest] = input.split(/\s+/);
  const arg = rest.join(" ").trim();
  const cmd = (head ?? "").toLowerCase();

  if (!cmd) return { lines: [] };

  switch (cmd) {
    case "help":
    case "?":
      return { lines: help, sound: "ok" };
    case "market":
      return { lines: ["ROUTING // CATALOG"], href: "/market", sound: "ok" };
    case "vendors":
      return {
        lines: vendors.map((vendor) => `${vendor.name.toUpperCase()} // ${vendor.specialty}`),
        href: "/vendors",
        sound: "ok",
      };
    case "network":
      return { lines: ["MESH // VESPER"], href: "/network", sound: "ok" };
    case "profile":
      return { lines: ["OPENING OPERATOR FILE"], href: "/profile", sound: "ok" };
    case "about":
    case "dossier":
      return { lines: ["HOUSE DOSSIER"], href: "/about", sound: "ok" };
    case "status":
      return {
        lines: [
          "NODE 07 // VESPER // LIVE",
          "CIPHER SHARK-RED // HANDSHAKE OK",
          `VENDORS ${vendors.length} DESKS // LOTS ${products.length}`,
          "HEAT CRITICAL // THIS IS THE PRODUCT",
        ],
        sound: "ok",
      };
    case "whoami":
      return {
        lines: [
          `ALIAS ${ctx.alias}`,
          `CLEARANCE ${ctx.clearance}`,
          `BALANCE ${eddies(ctx.balance)}`,
          `BAG ${ctx.cartCount} // PINS ${ctx.favCount}`,
          ctx.leviathan ? "LEVIATHAN CHANNEL OPEN" : "LEVIATHAN CHANNEL SEALED",
        ],
        sound: "ok",
      };
    case "balance":
      return { lines: [`EDDIES ${eddies(ctx.balance)}`], sound: "ok" };
    case "cart":
      return { lines: ["BAG OPEN"], openCart: true, sound: "ok" };
    case "buy": {
      if (!arg) return { lines: ["USAGE: buy DS-1001"], sound: "deny" };
      const lot = findLot(arg);
      if (!lot) return { lines: [`NO LOT // ${arg.toUpperCase()}`], sound: "deny" };
      return { lines: [`REQUEST ${lot.sku} ${lot.name}`], addId: lot.id };
    }
    case "fav":
    case "pin": {
      if (!arg) return { lines: ["USAGE: fav DS-1001"], sound: "deny" };
      const lot = findLot(arg);
      if (!lot) return { lines: [`NO LOT // ${arg.toUpperCase()}`], sound: "deny" };
      return { lines: [`PIN TOGGLE ${lot.sku}`], favId: lot.id };
    }
    case "frey":
    case "boryn":
      return {
        lines: [`FREY // ${freyLines[Math.floor(Math.random() * freyLines.length)]}`],
        sound: "ok",
      };
    case "shark":
      return {
        lines: ["      /\\", "  ___/  \\___", " /  (  •  )  \\", " \\___________/", "THE SHARK IS ALWAYS HUNGRY."],
        sound: "ok",
      };
    case "dedsec":
      return { lines: ["WRONG CITY. RIGHT MANNERS."], sound: "deny" };
    case "leviathan":
      return {
        lines: ctx.leviathan
          ? ["CHANNEL ALREADY OPEN"]
          : ["CLEARANCE REWRITTEN", "THE KEY WAS NEVER A KEY."],
        href: "/about#leviathan",
        unlock: true,
        sound: "ok",
      };
    case "clear":
    case "cls":
      return { lines: [], clear: true };
    case "exit":
    case "quit":
      return { lines: ["CHANNEL CLOSED"], close: true, sound: "ok" };
    default:
      return { lines: [`UNKNOWN // ${cmd}`, "TYPE help"], sound: "deny" };
  }
}
