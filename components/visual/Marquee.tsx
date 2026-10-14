export function Marquee({
  items,
  className = "",
}: {
  items: string[];
  className?: string;
}) {
  const line = items.join("   //   ");
  return (
    <div className={`overflow-hidden border-y border-paper/15 ${className}`}>
      <div className="marquee-track flex whitespace-nowrap py-2 font-ui text-xl tracking-[0.22em] uppercase">
        <span className="px-4">{line}</span>
        <span className="px-4" aria-hidden>
          {line}
        </span>
      </div>
    </div>
  );
}
