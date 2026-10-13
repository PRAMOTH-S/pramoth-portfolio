"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotionSafe } from "@/components/Effects";

// Tech badges orbiting the outer ring. Angles spread them evenly.
const ORBIT_NODES = [
  { label: "ROS2", angle: 0 },
  { label: "PY", angle: 72 },
  { label: "C++", angle: 144 },
  { label: "JS", angle: 216 },
  { label: "AI", angle: 288 },
] as const;

const ORBIT = "[animation-duration:32s]";

// Frameless floating code glyphs around the photo.
const GLYPHS = [
  { g: "</>", cls: "-left-14 top-[12%] text-lg text-accent", dur: 5.2, delay: 0 },
  { g: "{ }", cls: "-right-16 top-[20%] text-base text-neon/80", dur: 6, delay: 0.8 },
  { g: "λ", cls: "-left-20 top-[48%] text-xl text-accent/70", dur: 5.6, delay: 1.4 },
  { g: "⌁", cls: "-right-12 top-[56%] text-lg text-accent", dur: 4.8, delay: 0.4 },
  { g: "01", cls: "-left-10 bottom-[18%] text-[11px] tracking-[0.3em] text-dim", dur: 6.4, delay: 2 },
  { g: "Σ", cls: "-right-20 bottom-[26%] text-base text-neon/60", dur: 5.4, delay: 1 },
] as const;

/** PCB-style circuit traces fanning out behind the portrait, with light
 *  pulses travelling along them (SMIL animateMotion — no JS cost). */
function CircuitTraces() {
  const traces = [
    // left side
    "M240 150 H150 L120 120 H40",
    "M240 230 H130 L95 265 H30",
    "M240 310 H160 L130 340 H55",
    // right side
    "M240 170 H330 L365 135 H445",
    "M240 250 H350 L385 285 H455",
    "M240 330 H320 L350 360 H430",
  ];
  return (
    <svg
      viewBox="0 0 480 480"
      aria-hidden
      className="absolute left-1/2 top-[52%] h-[440px] w-[440px] -translate-x-1/2 -translate-y-1/2 md:h-[500px] md:w-[500px]"
    >
      <g fill="none" stroke="#34d27b" strokeOpacity="0.22" strokeWidth="1.2">
        {traces.map((d) => <path key={d} d={d} />)}
      </g>
      {/* terminal pads */}
      <g fill="none" stroke="#34d27b" strokeOpacity="0.5">
        {[[40, 120], [30, 265], [55, 340], [445, 135], [455, 285], [430, 360]].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="3.5" />
        ))}
      </g>
      {/* travelling pulses */}
      <g className="motion-reduce:hidden">
        {traces.map((d, i) => (
          <circle key={d} r="2.2" fill="#86ffb8" opacity="0.9">
            <animateMotion dur={`${3.2 + (i % 3) * 0.9}s`} begin={`${i * 0.7}s`} repeatCount="indefinite" path={d} />
          </circle>
        ))}
      </g>
    </svg>
  );
}

/**
 * Hero portrait — background-free cutout over a layered robotics backdrop:
 * radar sweep, dashed orbit rings carrying tech badges, PCB circuit traces
 * with travelling pulses, and frameless floating code glyphs.
 */
export function Portrait() {
  const reduce = useReducedMotionSafe();
  // Depth: the technical backdrop scrolls slightly faster than the cutout,
  // separating the layers as the hero leaves the viewport.
  const { scrollY } = useScroll();
  const backY = useTransform(scrollY, [0, 700], [0, reduce ? 0 : -46]);

  return (
    <div className="relative mx-auto mt-10 w-full max-w-[300px] md:mt-12 md:max-w-[340px]">
      {/* liquid glow behind the cutout: morphing organic blob */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 top-8 animate-blob bg-[radial-gradient(ellipse_at_center,rgb(52_210_123/0.22),transparent_70%)] blur-2xl motion-reduce:animate-none"
      />

      <motion.div aria-hidden style={{ y: backY }} className="absolute inset-0">
      {/* radar sweep (desktop/tablet only) */}
      <div
        aria-hidden
        className="absolute left-1/2 top-[56%] hidden h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full md:block md:h-[420px] md:w-[420px]"
      >
        <div className="absolute inset-0 animate-sweep bg-[conic-gradient(from_0deg,rgb(52_210_123/0.16),transparent_18%)] motion-reduce:animate-none" />
        <div className="absolute inset-0 rounded-full border border-accent/10" />
      </div>

      {/* circuit traces with travelling pulses */}
      <div aria-hidden className="hidden md:block">
        <CircuitTraces />
      </div>

      {/* dashed orbit rings (desktop/tablet only) */}
      <div aria-hidden className="absolute left-1/2 top-[56%] hidden h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 md:block md:h-[480px] md:w-[480px]">
        <svg viewBox="0 0 480 480" className="h-full w-full animate-spin-slower motion-reduce:animate-none">
          <circle cx="240" cy="240" r="228" fill="none" stroke="#34d27b" strokeOpacity="0.25" strokeDasharray="3 14" />
          <circle cx="240" cy="12" r="3.5" fill="#34d27b" />
        </svg>
        <svg viewBox="0 0 480 480" className="absolute inset-0 h-full w-full animate-sweep [animation-duration:18s] [animation-direction:reverse] motion-reduce:animate-none">
          <circle cx="240" cy="240" r="190" fill="none" stroke="#86ffb8" strokeOpacity="0.14" strokeDasharray="2 10" />
          <circle cx="240" cy="50" r="2.5" fill="#86ffb8" opacity="0.7" />
        </svg>

        {/* orbiting tech badges: parent spins, badge counter-spins to stay upright */}
        <div className={`absolute inset-0 hidden animate-sweep motion-reduce:animate-none md:block ${ORBIT}`}>
          {ORBIT_NODES.map(({ label, angle }) => (
            <div key={label} className="absolute inset-0" style={{ transform: `rotate(${angle}deg)` }}>
              <div className="absolute left-1/2 top-[6px] -translate-x-1/2 -translate-y-1/2">
                <div className={`animate-sweep [animation-direction:reverse] motion-reduce:animate-none ${ORBIT}`}>
                  <span
                    style={{ transform: `rotate(${-angle}deg)` }}
                    className="grid h-9 w-9 place-items-center rounded-full border border-accent/30 bg-surface/90 font-mono text-[9px] font-semibold text-accent shadow-[0_0_14px_rgb(52_210_123/0.25)] backdrop-blur"
                  >
                    {label}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </motion.div>

      {/* frameless floating code glyphs */}
      {GLYPHS.map(({ g, cls, dur, delay }) => (
        <motion.span
          key={g}
          aria-hidden
          animate={reduce ? undefined : { y: [0, -10, 0], opacity: [0.55, 1, 0.55] }}
          transition={{ duration: dur, repeat: Infinity, ease: "easeInOut", delay }}
          className={`absolute z-10 hidden select-none font-mono font-semibold [text-shadow:0_0_14px_rgb(52_210_123/0.65)] md:inline ${cls}`}
        >
          {g}
        </motion.span>
      ))}

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 28, scale: 1.05, clipPath: "inset(72% 0 0 0)" }}
        animate={{ opacity: 1, y: 0, scale: 1, clipPath: "inset(0% 0 0 0)" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="relative z-[1]"
      >
        <Image
          src="/profile-cutout.png"
          alt="Pramoth S"
          width={720}
          height={880}
          priority
          sizes="(max-width: 768px) 300px, 340px"
          className="h-auto w-full select-none [filter:drop-shadow(0_24px_48px_rgb(0_0_0/0.5))]"
        />
        {/* fade the bottom edge into the page background */}
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-bg to-transparent" />
      </motion.div>
    </div>
  );
}
