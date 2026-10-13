// Top-down view of an AMR with a LiDAR sweep over a point-cloud room.
// Pure SVG + CSS animation (server component, no JS shipped).

const jitter = (i: number) => Math.sin(i * 12.9898) * 1.6;

function wallPoints() {
  const pts: [number, number][] = [];
  const seg = (x1: number, y1: number, x2: number, y2: number, step = 7) => {
    const len = Math.hypot(x2 - x1, y2 - y1);
    const n = Math.floor(len / step);
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      pts.push([x1 + (x2 - x1) * t + jitter(pts.length), y1 + (y2 - y1) * t + jitter(pts.length + 7)]);
    }
  };
  // Room outline with a doorway on the right wall
  seg(60, 70, 460, 70);
  seg(460, 70, 460, 230);
  seg(460, 300, 460, 450);
  seg(460, 450, 60, 450);
  seg(60, 450, 60, 70);
  // Obstacles (table, cabinet)
  seg(110, 330, 190, 330, 6);
  seg(190, 330, 190, 400, 6);
  seg(330, 120, 400, 120, 6);
  seg(330, 120, 330, 170, 6);
  return pts;
}

const POINTS = wallPoints();

export function HeroVisual() {
  return (
    <div className="relative aspect-square w-full max-w-[520px]">
      <svg viewBox="0 0 520 520" className="h-full w-full" role="img" aria-label="Illustration: top-down view of an autonomous mobile robot scanning a room with LiDAR">
        <defs>
          <radialGradient id="sweepGrad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(260 260) scale(230)">
            <stop offset="0" stopColor="#34d27b" stopOpacity="0.35" />
            <stop offset="1" stopColor="#34d27b" stopOpacity="0" />
          </radialGradient>
          <pattern id="minor" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0H0V20" fill="none" stroke="#34d27b" strokeOpacity="0.06" />
          </pattern>
        </defs>

        <rect width="520" height="520" fill="url(#minor)" />

        {/* range rings */}
        {[60, 120, 180, 240].map((r) => (
          <circle key={r} cx="260" cy="260" r={r} fill="none" stroke="#28352e" strokeDasharray="2 6" />
        ))}
        <line x1="260" y1="20" x2="260" y2="500" stroke="#1b2420" />
        <line x1="20" y1="260" x2="500" y2="260" stroke="#1b2420" />

        {/* point cloud */}
        <g fill="#86ffb8">
          {POINTS.map(([x, y], i) => (
            <circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r="1.4" opacity={0.35 + ((i * 37) % 60) / 100} />
          ))}
        </g>

        {/* rotating sweep */}
        <g className="origin-[260px_260px] animate-sweep motion-reduce:animate-none">
          <path d="M260 260 L490 260 A230 230 0 0 0 459 145 Z" fill="url(#sweepGrad)" />
          <line x1="260" y1="260" x2="490" y2="260" stroke="#34d27b" strokeOpacity="0.7" />
        </g>

        {/* planned path */}
        <path
          d="M260 260 C 300 230, 360 230, 390 280 S 420 380, 300 400"
          fill="none"
          stroke="#34d27b"
          strokeWidth="1.5"
          strokeDasharray="4 5"
          opacity="0.8"
        />
        <circle cx="300" cy="400" r="5" fill="none" stroke="#34d27b" />
        <circle cx="300" cy="400" r="1.8" fill="#34d27b" />

        {/* robot (top-down) */}
        <g>
          <circle cx="260" cy="260" r="30" fill="#0c100e" stroke="#34d27b" strokeWidth="1.5" />
          <rect x="228" y="248" width="6" height="24" rx="2" fill="#28352e" />
          <rect x="286" y="248" width="6" height="24" rx="2" fill="#28352e" />
          <circle cx="260" cy="260" r="8" fill="#111714" stroke="#86ffb8" strokeWidth="1" />
          <circle cx="260" cy="260" r="2.5" fill="#86ffb8" />
          <path d="M260 232 l5 7 h-10z" fill="#34d27b" />
        </g>

        {/* TF axes */}
        <g fontFamily="var(--font-mono)" fontSize="9" fill="#707e76">
          <line x1="260" y1="260" x2="260" y2="214" stroke="#34d27b" strokeOpacity="0.5" />
          <text x="265" y="214">x</text>
          <text x="196" y="303">base_footprint</text>
          <text x="306" y="414">goal</text>
          <text x="66" y="62">/map</text>
        </g>
      </svg>

      {/* telemetry chips (illustrative labels, not live data) */}
      <div className="pointer-events-none absolute left-0 top-[14%] hidden flex-col gap-2 sm:flex">
        <span className="chip border-accent/30 text-accent">/scan</span>
        <span className="chip">/odom</span>
      </div>
      <div className="pointer-events-none absolute bottom-[10%] right-0 hidden flex-col items-end gap-2 sm:flex">
        <span className="chip">/cmd_vel</span>
        <span className="chip">nav2 · follow_path</span>
      </div>
    </div>
  );
}
