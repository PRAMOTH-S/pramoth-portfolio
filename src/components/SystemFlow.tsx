"use client";

// Signature scroll animation: "From Code to Robot".
// One scroll-linked progress value drives everything — the stage rail on the
// left, and on the right a map that builds itself: LiDAR points appear,
// obstacles register, a coverage path draws, and the robot follows it.

import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useReducedMotionSafe } from "@/components/Effects";

const STAGES = [
  { label: "Code", note: "C++ / Python nodes" },
  { label: "AI Model", note: "YOLO · OpenCV perception" },
  { label: "Sensors", note: "LiDAR · encoders" },
  { label: "ROS 2", note: "topics · TF · micro-ROS" },
  { label: "Navigation", note: "SLAM · Nav2 · coverage" },
  { label: "Autonomous Robot", note: "NEXVA on real floors" },
] as const;

const STATUS: { name: string; stage: number; active?: boolean }[] = [
  { name: "ROS 2", stage: 3 },
  { name: "LiDAR", stage: 2 },
  { name: "CAMERA", stage: 1 },
  { name: "ESP32", stage: 3 },
  { name: "NAVIGATION", stage: 4, active: true },
];

// Boustrophedon-style sweep the robot follows (drawn into the room).
const ROBOT_PATH = "M70 90 H330 M330 90 L330 150 H70 M70 150 L70 210 H210 M250 210 H330 M330 210 L330 270 H70";
const SWEEP_PATH = "M70 90 H330 V150 H70 V210 H210 M250 210 H330 V270 H70";

// Deterministic pseudo-random jitter so server and client render identically.
const jitter = (i: number) => Math.sin(i * 12.9898) * 1.5;

function wallPoints() {
  const pts: [number, number][] = [];
  const seg = (x1: number, y1: number, x2: number, y2: number, step = 9) => {
    const n = Math.max(1, Math.floor(Math.hypot(x2 - x1, y2 - y1) / step));
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      pts.push([x1 + (x2 - x1) * t + jitter(pts.length), y1 + (y2 - y1) * t + jitter(pts.length + 7)]);
    }
  };
  seg(50, 60, 350, 60);
  seg(350, 60, 350, 300);
  seg(350, 300, 50, 300);
  seg(50, 300, 50, 60);
  // obstacle outlines (cabinet + table)
  seg(220, 180, 245, 180, 6);
  seg(220, 180, 220, 235, 6);
  seg(245, 180, 245, 235, 6);
  return pts;
}
const POINTS = wallPoints();

export function SystemFlow() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const reduce = useReducedMotionSafe();
  const [stage, setStage] = useState(0);
  const [robot, setRobot] = useState({ x: 70, y: 90 });

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start 70%", "end 90%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 26 });

  // discrete stage index for the rail + status panel
  useMotionValueEvent(progress, "change", (v) => {
    setStage(Math.min(STAGES.length - 1, Math.floor(v * STAGES.length)));
  });

  // continuous values for the map
  const railFill = useTransform(progress, [0, 0.92], [0, 1]);
  const pointsIn = useTransform(progress, [0.18, 0.5], [0, 1]); // LiDAR cloud fades in
  const obstacleIn = useTransform(progress, [0.45, 0.6], [0, 1]);
  const pathDraw = useTransform(progress, [0.5, 0.95], [0, 1]); // coverage path draws
  const gridIn = useTransform(progress, [0.05, 0.25], [0, 0.5]);

  // robot follows the drawn path via getPointAtLength — transform-only updates
  useMotionValueEvent(pathDraw, "change", (v) => {
    const el = pathRef.current;
    if (!el) return;
    const p = el.getPointAtLength(el.getTotalLength() * Math.max(0, Math.min(1, v)));
    setRobot({ x: p.x, y: p.y });
  });

  const shown = reduce ? STAGES.length - 1 : stage;

  return (
    <div ref={sectionRef} className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-14">
      {/* stage rail */}
      <ol className="relative space-y-6 pl-7" aria-label="From code to autonomous robot pipeline">
        <div aria-hidden className="absolute bottom-3 left-[5px] top-3 w-px bg-line-strong" />
        <motion.div
          aria-hidden
          style={{ scaleY: reduce ? 1 : railFill }}
          className="absolute bottom-3 left-[5px] top-3 w-px origin-top bg-gradient-to-b from-accent to-neon"
        />
        {STAGES.map((s, i) => {
          const on = i <= shown;
          return (
            <li key={s.label} className="relative">
              <span
                aria-hidden
                className={`absolute -left-[27px] top-1 h-2.5 w-2.5 rounded-full border-2 transition-colors duration-300 ${
                  on ? "border-accent bg-accent/30 shadow-[0_0_10px_rgb(52_210_123/0.5)]" : "border-line-strong bg-bg"
                }`}
              />
              <p className={`font-display text-base font-semibold transition-colors duration-300 md:text-lg ${on ? "text-ink" : "text-dim"}`}>
                {s.label}
              </p>
              <p className={`font-mono text-[11px] transition-colors duration-300 ${on ? "text-accent" : "text-dim"}`}>{s.note}</p>
            </li>
          );
        })}
      </ol>

      {/* live-building map + status panel */}
      <div>
        <figure
          className="panel relative overflow-hidden"
          aria-label="Illustration: a robot map assembling itself — LiDAR points, obstacles, then a coverage path the robot follows"
        >
          {/* HUD frame: corner brackets + live pose readout */}
          {(["left-2 top-2 border-l border-t", "right-2 top-2 border-r border-t", "bottom-11 left-2 border-b border-l", "bottom-11 right-2 border-b border-r"] as const).map(
            (pos) => (
              <span key={pos} aria-hidden className={`pointer-events-none absolute z-10 h-4 w-4 border-accent/50 ${pos}`} />
            ),
          )}
          <p aria-hidden className="pointer-events-none absolute right-5 top-4 z-10 font-mono text-[10px] tracking-[0.14em] text-accent/80">
            POSE&nbsp;&nbsp;x {String(Math.round(robot.x)).padStart(3, "0")} · y {String(Math.round(robot.y)).padStart(3, "0")}
          </p>
          <svg viewBox="0 0 400 340" className="h-auto w-full">
            {/* engineering grid, fades in with the first stages */}
            <motion.g style={{ opacity: reduce ? 0.5 : gridIn }} stroke="#34d27b" strokeOpacity="0.12">
              {Array.from({ length: 9 }, (_, i) => (
                <line key={`v${i}`} x1={40 + i * 40} y1="20" x2={40 + i * 40} y2="320" />
              ))}
              {Array.from({ length: 8 }, (_, i) => (
                <line key={`h${i}`} x1="20" y1={30 + i * 40} x2="380" y2={30 + i * 40} />
              ))}
            </motion.g>

            {/* LiDAR point cloud */}
            <motion.g style={{ opacity: reduce ? 1 : pointsIn }} fill="#86ffb8">
              {POINTS.map(([x, y], i) => (
                <circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r="1.3" opacity={0.35 + ((i * 37) % 55) / 100} />
              ))}
            </motion.g>

            {/* obstacle the planner routes around */}
            <motion.rect
              style={{ opacity: reduce ? 1 : obstacleIn }}
              x="220" y="180" width="25" height="55" rx="2"
              fill="#111714" stroke="#e5b84a" strokeOpacity="0.55" strokeDasharray="3 3"
            />

            {/* coverage path draws itself (hidden measuring path + visible one) */}
            <path ref={pathRef} d={SWEEP_PATH} fill="none" stroke="none" />
            {/* note: framer's pathLength drives strokeDasharray, so the line stays solid */}
            <motion.path
              d={ROBOT_PATH}
              fill="none"
              stroke="#34d27b"
              strokeWidth="1.5"
              strokeOpacity="0.85"
              style={{ pathLength: reduce ? 1 : pathDraw }}
            />

            {/* robot follows the path */}
            <g style={{ transform: `translate(${robot.x}px, ${robot.y}px)` }} className="transition-transform duration-75 ease-linear">
              <circle r="11" fill="#0c100e" stroke="#34d27b" strokeWidth="1.5" />
              <circle r="3.5" fill="#111714" stroke="#86ffb8" strokeWidth="1" />
              <circle r="1.2" fill="#86ffb8" />
            </g>

            {/* frame labels */}
            <g fontFamily="var(--font-mono)" fontSize="9" fill="#707e76">
              <text x="52" y="52">/map</text>
              <text x="252" y="174">obstacle</text>
            </g>
          </svg>
          <figcaption className="border-t border-line px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-dim">
            Illustrative visualization — not live telemetry
          </figcaption>
        </figure>

        {/* system status telemetry */}
        <div className="panel mt-4 p-4" role="status" aria-label="Illustrative system status">
          <p className="label mb-3">System status</p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
            {STATUS.map((s) => {
              const on = shown >= s.stage;
              return (
                <li key={s.name} className="flex items-center justify-between gap-2 font-mono text-[11px]">
                  <span className={on ? "text-muted" : "text-dim"}>{s.name}</span>
                  <span className={`flex items-center gap-1.5 ${on ? "text-accent" : "text-dim"}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${on ? "animate-blink bg-accent motion-reduce:animate-none" : "bg-line-strong"}`} />
                    {on ? (s.active ? "ACTIVE" : "ONLINE") : "STANDBY"}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
