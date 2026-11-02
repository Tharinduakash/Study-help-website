import type { CoverVariant } from "@/lib/content/portfolio";

// Illustrated stand-ins for sample projects. Real work will use uploaded images.
export function ProjectCover({ variant, title }: { variant: CoverVariant; title: string }) {
  return (
    <svg viewBox="0 0 400 260" role="img" aria-label={`${title} illustration`} className="h-auto w-full bg-gradient-to-br from-deep to-abyss">
      <g fill="none" stroke="#72E5F2" strokeOpacity="0.5" strokeWidth="1.500">
        {variant === "dashboard" && (
          <>
            {[0, 1, 2].map((i) => <rect key={i} x={40 + i * 110} y="36" width="98" height="46" rx="6" fill="#27C5F5" fillOpacity={0.1 + i * 0.06} />)}
            {[60, 90, 74, 118, 100, 136].map((h, i) => <rect key={i} x={46 + i * 30} y={226 - h} width="20" height={h} rx="3" fill="#27C5F5" fillOpacity="0.55" stroke="none" />)}
            <circle cx="310" cy="160" r="46" strokeWidth="13" stroke="#27C5F5" strokeOpacity="0.6" strokeDasharray="190 300" />
          </>
        )}
        {variant === "report" && (
          <>
            <rect x="120" y="24" width="160" height="212" rx="6" fill="#F2F8FC" fillOpacity="0.07" />
            <rect x="140" y="48" width="84" height="9" rx="3" fill="#72E5F2" stroke="none" />
            {[76, 94, 112, 130, 148, 166, 184, 202].map((y, i) => <line key={y} x1="140" y1={y} x2={i % 3 === 2 ? 220 : 260} y2={y} />)}
          </>
        )}
        {variant === "slides" && (
          <>
            <rect x="96" y="30" width="226" height="134" rx="6" strokeOpacity="0.25" />
            <rect x="60" y="66" width="280" height="164" rx="8" fill="#092B4C" />
            <rect x="82" y="88" width="120" height="11" rx="3" fill="#72E5F2" stroke="none" />
            <line x1="82" y1="116" x2="180" y2="116" /><line x1="82" y1="134" x2="164" y2="134" />
            <polyline points="212,202 244,160 272,178 316,114" stroke="#27C5F5" strokeOpacity="1" strokeWidth="3" />
          </>
        )}
        {variant === "code" && (
          <>
            <rect x="48" y="32" width="304" height="196" rx="10" fill="#061426" />
            <line x1="48" y1="60" x2="352" y2="60" />
            {[[70, 120], [90, 170], [90, 112], [110, 150], [90, 96], [70, 70]].map(([x, width], i) => (
              <line key={i} x1={x} y1={84 + i * 23} x2={x + width} y2={84 + i * 23} stroke={i % 2 ? "#27C5F5" : "#72E5F2"} strokeOpacity="0.85" strokeWidth="5" strokeLinecap="round" />
            ))}
          </>
        )}
        {variant === "poster" && (
          <>
            <rect x="118" y="16" width="164" height="228" rx="4" fill="#F2F8FC" fillOpacity="0.07" />
            <rect x="134" y="32" width="132" height="24" rx="3" fill="#27C5F5" fillOpacity="0.7" stroke="none" />
            <rect x="134" y="68" width="60" height="74" rx="3" /><rect x="206" y="68" width="60" height="74" rx="3" />
            <rect x="134" y="154" width="132" height="74" rx="3" fill="#72E5F2" fillOpacity="0.14" />
          </>
        )}
        {variant === "video" && (
          <>
            <rect x="52" y="40" width="296" height="142" rx="8" fill="#061426" />
            <path d="M184 86v50l42-25z" fill="#72E5F2" stroke="none" />
            {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={52 + i * 61} y="198" width="52" height="28" rx="3" fill="#27C5F5" fillOpacity={0.15 + i * 0.1} />)}
          </>
        )}
      </g>
    </svg>
  );
}
