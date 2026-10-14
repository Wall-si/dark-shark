export function SharkMark({
  className = "",
  wire = false,
}: {
  className?: string;
  wire?: boolean;
}) {
  return (
    <svg viewBox="0 0 320 150" className={className} aria-hidden>
      <path
        d="M18 78 L74 52 L132 46 L156 12 L176 48 L236 52 L262 58 L310 16 L278 74 L318 128 L252 92 L196 106 L154 112 L118 138 L104 104 L46 100 L20 88 Z"
        fill={wire ? "none" : "currentColor"}
        stroke="currentColor"
        strokeWidth={wire ? 3 : 1}
        strokeLinejoin="miter"
      />
      <path
        d="M86 66 L80 96 M100 64 L94 98 M114 64 L108 98"
        fill="none"
        stroke={wire ? "currentColor" : "#080808"}
        strokeWidth="2"
      />
      <path
        d="M90 78 H150 L150 90 H190"
        fill="none"
        stroke={wire ? "#ff253a" : "#080808"}
        strokeWidth="1.5"
      />
      <circle cx="58" cy="70" r="5" fill="#ff253a" />
    </svg>
  );
}
