import { hashString, mulberry } from "@/lib/hash";
import type { Category, Rarity } from "@/lib/types";

export function Schematic({
  id,
  category,
  sku,
  rarity,
  label,
}: {
  id: string;
  category: Category;
  sku: string;
  rarity: Rarity;
  label: string;
}) {
  const rand = mulberry(hashString(id));
  const n = Array.from({ length: 14 }, () => rand());
  const marked = rarity === "BLACK" || rarity === "RESTRICTED";

  return (
    <svg viewBox="0 0 240 160" role="img" aria-label={label} className="h-full w-full">
      <rect x="3" y="3" width="234" height="154" fill="none" stroke="currentColor" strokeOpacity="0.35" />
      <path d="M3 16 H16 M3 3 V16 M224 3 H237 V16 M3 144 V157 H16 M224 157 H237 V144" fill="none" stroke="currentColor" />
      <text x="12" y="18" fill="currentColor" fontSize="8" fontFamily="ui-monospace, monospace">
        {sku}
      </text>
      <text x="170" y="18" fill="currentColor" fontSize="8" fontFamily="ui-monospace, monospace">
        {category.slice(0, 4).toUpperCase()}
      </text>
      {category === "Cyberware" && <Cyberware n={n} />}
      {category === "Weapons" && <Weapons n={n} />}
      {category === "Tech" && <Tech n={n} />}
      {category === "Vehicles" && <Vehicles n={n} />}
      {category === "Intelligence" && <Intel n={n} />}
      {category === "Black Market" && <Black n={n} />}
      {category === "Chems" && <Chems n={n} />}
      {category === "Contracts" && <Contracts n={n} />}
      {category === "Synthetics" && <Synthetics n={n} />}
      <g className="text-blood group-hover:text-void" stroke="currentColor" fill="currentColor">
        {marked && <rect x="208" y="132" width="16" height="16" />}
        <circle cx={20 + n[0] * 40} cy={140} r="2" />
      </g>
      <text x="12" y="150" fill="currentColor" fontSize="7" fontFamily="ui-monospace, monospace" opacity="0.7">
        {`FIG ${Math.floor(n[1] * 90 + 10)}-${Math.floor(n[2] * 900 + 100)}`}
      </text>
    </svg>
  );
}

function Cyberware({ n }: { n: number[] }) {
  return (
    <g fill="none" stroke="currentColor">
      <ellipse cx="120" cy="88" rx={68 + n[3] * 8} ry="34" />
      <path d={`M70 88 H${150 + n[4] * 20}`} />
      <path d="M120 54 V122" strokeDasharray="2 3" />
      {n.slice(5, 10).map((value, index) => (
        <circle key={index} cx={78 + index * 16 + value * 6} cy={78 + (index % 2) * 18} r="3" />
      ))}
    </g>
  );
}

function Weapons({ n }: { n: number[] }) {
  const length = 150 + n[3] * 40;
  return (
    <g fill="none" stroke="currentColor">
      <path d={`M24 84 H${length}`} strokeWidth="6" />
      <path d={`M${length} 76 V92`} strokeWidth="3" />
      <rect x="36" y="90" width={18 + n[4] * 10} height="28" />
      <path d={`M70 70 V84 M${90 + n[5] * 30} 68 V84`} />
      <circle cx={length - 4} cy="84" r="3" className="text-blood group-hover:text-void" fill="currentColor" stroke="none" />
    </g>
  );
}

function Tech({ n }: { n: number[] }) {
  return (
    <g fill="none" stroke="currentColor">
      <rect x="68" y="48" width="104" height="72" />
      {Array.from({ length: 7 }).map((_, index) => (
        <path key={index} d={`M${78 + index * 12} 48 V36 M${78 + index * 12} 120 V132`} />
      ))}
      <path d={`M80 64 H${150 + n[3] * 10} V${80 + n[4] * 16} H90`} />
      <rect x={100 + n[5] * 20} y="86" width="16" height="16" />
    </g>
  );
}

function Vehicles({ n }: { n: number[] }) {
  return (
    <g fill="none" stroke="currentColor">
      <path d={`M30 100 L70 78 H${150 + n[3] * 30} L200 100 Z`} />
      <path d="M78 78 L96 62 H140 L152 78" />
      <circle cx="78" cy="108" r={10 + n[4] * 3} />
      <circle cx="168" cy="108" r={10 + n[5] * 3} />
      <path d="M40 92 H190" strokeDasharray="3 4" />
    </g>
  );
}

function Intel({ n }: { n: number[] }) {
  return (
    <g fill="none" stroke="currentColor">
      <rect x="70" y="36" width="100" height="100" />
      {n.slice(0, 5).map((value, index) => (
        <path key={index} d={`M82 ${52 + index * 12} H${150 + value * 12}`} />
      ))}
      <rect x="82" y="108" width={40 + n[6] * 30} height="8" fill="currentColor" className="text-blood group-hover:text-void" stroke="none" />
      <circle cx="150" cy="116" r="10" />
    </g>
  );
}

function Chems({ n }: { n: number[] }) {
  return (
    <g fill="none" stroke="currentColor">
      <rect x="108" y="40" width="24" height="70" />
      <path d="M108 52 H132 M100 110 H140" />
      <circle cx="120" cy="78" r={6 + n[3] * 4} />
      <path d={`M120 40 V${28 + n[4] * 6}`} />
    </g>
  );
}

function Contracts({ n }: { n: number[] }) {
  return (
    <g fill="none" stroke="currentColor">
      <rect x="78" y="42" width="84" height="78" />
      <path d="M78 58 H162" />
      <circle cx="120" cy="96" r={10 + n[3] * 6} />
      <path d="M120 78 V114 M102 96 H138" />
    </g>
  );
}

function Synthetics({ n }: { n: number[] }) {
  return (
    <g fill="none" stroke="currentColor">
      <circle cx="120" cy="78" r={22 + n[3] * 6} />
      <path d={`M120 ${56 - n[4] * 8} V40`} />
      <circle cx="120" cy="36" r="3" className="text-blood group-hover:text-void" fill="currentColor" stroke="none" />
      <path d="M100 74 H112 M128 74 H140 M108 90 H132" />
    </g>
  );
}

function Black({ n }: { n: number[] }) {
  const wobble = n[3] * 8;
  return (
    <g fill="none" stroke="currentColor">
      <polygon points={`120,40 168,64 168,${112 + wobble} 120,136 72,112 72,64`} />
      <path d="M92 70 L148 118 M148 70 L96 122" />
      <rect x="104" y="84" width="32" height="18" />
    </g>
  );
}
