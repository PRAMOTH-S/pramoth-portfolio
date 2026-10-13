import { ArrowRight, ArrowDown } from "lucide-react";

/** Horizontal (wrapping) pipeline on wide screens, vertical list on phones. */
export function Pipeline({ steps, title }: { steps: readonly string[]; title?: string }) {
  return (
    <figure className="panel p-5 md:p-6">
      {title && <figcaption className="label mb-5">{title}</figcaption>}
      <ol className="flex flex-col gap-2 md:flex-row md:flex-wrap md:items-center md:gap-y-3">
        {steps.map((s, i) => (
          <li key={s} className="flex items-center gap-2 md:gap-2">
            <span className="inline-flex items-center gap-2 rounded-md border border-line-strong bg-surface2 px-3 py-2 text-sm text-ink">
              <span className="font-mono text-[10px] text-accent">{String(i + 1).padStart(2, "0")}</span>
              {s}
            </span>
            {i < steps.length - 1 && (
              <>
                <ArrowRight aria-hidden size={14} className="hidden shrink-0 text-dim md:block" />
                <ArrowDown aria-hidden size={14} className="ml-4 shrink-0 text-dim md:hidden" />
              </>
            )}
          </li>
        ))}
      </ol>
    </figure>
  );
}

/** TF tree for the flagship robot. */
export function TfTree() {
  const frames = [
    { f: "map", by: "SLAM Toolbox" },
    { f: "odom", by: "Wheel odometry (ESP32 /odom)" },
    { f: "base_footprint", by: "Robot description" },
    { f: "base_link", by: "Static transform" },
    { f: "lidar_link", by: "Static transform" },
  ];
  return (
    <figure className="panel p-5 md:p-6">
      <figcaption className="label mb-5">TF tree</figcaption>
      <ol className="space-y-0">
        {frames.map((x, i) => (
          <li key={x.f} className="relative flex items-start gap-4" style={{ paddingLeft: `${i * 18}px` }}>
            <div className="flex flex-col items-center pt-1.5">
              <span className="h-2.5 w-2.5 rounded-full border border-accent bg-accent-deep" />
              {i < frames.length - 1 && <span className="h-9 w-px bg-line-strong" />}
            </div>
            <div className="pb-3">
              <p className="font-mono text-sm text-ink">{x.f}</p>
              {i > 0 && <p className="text-xs text-dim">{frames[i - 1].f} → {x.f} · {x.by}</p>}
            </div>
          </li>
        ))}
      </ol>
    </figure>
  );
}

// ── Coverage (boustrophedon) visual ──────────────────────────
function lanes(x0: number, x1: number, y0: number, y1: number, step: number, startDown = true) {
  const pts: string[] = [];
  let down = startDown;
  for (let x = x0; x <= x1; x += step) {
    pts.push(`${x} ${down ? y0 : y1}`, `${x} ${down ? y1 : y0}`);
    down = !down;
  }
  return pts;
}

export function CoverageViz() {
  // Room 30..370 × 30..230, obstacle 160..230 × 90..170, inflation 10px
  const cellA = lanes(40, 140, 40, 220, 20);
  const cellBTop = lanes(160, 230, 40, 70, 14);
  const bottom: string[] = []; // swept right-to-left below the obstacle
  let down = true;
  for (let x = 230; x >= 160; x -= 14) {
    bottom.push(`${x} ${down ? 190 : 220}`, `${x} ${down ? 220 : 190}`);
    down = !down;
  }
  const cellC = lanes(250, 360, 40, 220, 22);
  const path = "M" + [...cellA, ...cellBTop, ...bottom, ...cellC].join(" L");

  return (
    <figure className="panel p-5 md:p-6">
      <figcaption className="label mb-5">Boustrophedon coverage · illustrative</figcaption>
      <svg viewBox="0 0 400 260" className="w-full" role="img" aria-label="Illustration of a zig-zag coverage path that sweeps a room in lanes and routes around an inflated obstacle">
        <rect x="30" y="30" width="340" height="200" fill="#0c100e" stroke="#93a097" strokeWidth="1.5" />
        <rect x="150" y="80" width="90" height="100" fill="#34d27b" fillOpacity="0.05" stroke="#e5b84a" strokeDasharray="4 4" />
        <rect x="160" y="90" width="70" height="80" fill="#28352e" />
        <text x="195" y="134" textAnchor="middle" fontSize="9" fontFamily="var(--font-mono)" fill="#93a097">obstacle</text>
        <text x="245" y="77" fontSize="8" fontFamily="var(--font-mono)" fill="#e5b84a">inflation</text>
        <path d={path} fill="none" stroke="#28352e" strokeWidth="1" />
        <path
          d={path}
          fill="none"
          stroke="#34d27b"
          strokeWidth="1.8"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset="1"
          className="animate-draw motion-reduce:[stroke-dashoffset:0]"
        />
        <circle cx="40" cy="40" r="4" fill="#86ffb8" />
      </svg>
      <p className="mt-3 text-xs text-dim">Cells are swept in parallel lanes; lane endpoints become Nav2 waypoints.</p>
    </figure>
  );
}
