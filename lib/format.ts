export function eddies(n: number) {
  return `€$ ${new Intl.NumberFormat("en-US").format(n)}`;
}

export function deltaLabel(n: number) {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(1)}%`;
}

const stampFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: "UTC",
  year: "numeric",
  month: "short",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export function stamp(at: number) {
  return `${stampFormat.format(new Date(at))} UTC`;
}

export function repLabel(score: number) {
  if (score >= 95) return "APEX";
  if (score >= 80) return "TRUSTED";
  if (score >= 65) return "KNOWN";
  return "STREET";
}
