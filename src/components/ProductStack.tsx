"use client";

import { useEffect, useState } from "react";
import { useReducedMotionSafe } from "@/components/Effects";

/* Exploded isometric view of a product, one slab per discipline — the
   visual argument for "an engineer who builds the whole product". */

const LAYERS = [
  { id: "ui", code: "L06", label: "Interface", sub: "Web dashboard · UI/UX · telemetry" },
  { id: "ai", code: "L05", label: "Perception & AI", sub: "YOLO · OpenCV · PyTorch · edge inference" },
  { id: "ros", code: "L04", label: "Robot software", sub: "ROS 2 · Nav2 · SLAM Toolbox · behavior trees" },
  { id: "fw", code: "L03", label: "Firmware", sub: "micro-ROS · motor control · encoders · real-time loops" },
  { id: "hw", code: "L02", label: "Electronics & sensors", sub: "ESP32 · Raspberry Pi 5 · LiDAR · motor drivers" },
  { id: "cad", code: "L01", label: "Mechanical & enclosure", sub: "Fusion 360 · SolidWorks · 3D-printed prototypes" },
] as const;

const GAP = 30; // px between slabs at rest
const GAP_OPEN = 50; // when the stack is hovered (exploded)

export function ProductStack() {
  const reduce = useReducedMotionSafe();
  const [active, setActive] = useState(2);
  const [hover, setHover] = useState(false);

  // Auto-tour the layers until the visitor takes over.
  useEffect(() => {
    if (reduce || hover) return;
    const id = setInterval(() => setActive((a) => (a + 1) % LAYERS.length), 2400);
    return () => clearInterval(id);
  }, [reduce, hover]);

  const gap = hover ? GAP_OPEN : GAP;
  const current = LAYERS[active];

  return (
    <figure
      aria-label="Exploded view of a product: mechanical enclosure, electronics and sensors, firmware, robot software, perception and AI, and the user interface"
      className="panel relative w-full overflow-hidden p-5"
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <div aria-hidden className="bg-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

      {/* ── 3D stack ── */}
      <div aria-hidden className="relative mx-auto h-[270px] w-[300px] [perspective:1400px]">
        <div
          className={`absolute left-1/2 top-[58%] h-[150px] w-[220px] -translate-x-1/2 -translate-y-1/2 [transform-style:preserve-3d] ${
            reduce ? "" : "motion-safe:animate-[float_7s_ease-in-out_infinite]"
          }`}
          style={{ transform: "translate(-50%,-50%) rotateX(58deg) rotateZ(-42deg)" }}
        >
          {LAYERS.map((l, i) => {
            const z = (LAYERS.length - 1 - i) * gap;
            const on = i === active;
            return (
              <button
                type="button"
                tabIndex={-1}
                key={l.id}
                onPointerEnter={() => setActive(i)}
                className={`absolute inset-0 rounded-xl border transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${
                  on
                    ? "border-neon bg-accent/20 shadow-[0_0_40px_rgb(52_210_123/0.45)]"
                    : "border-accent/35 bg-surface/80 hover:border-accent/70"
                }`}
                style={{ transform: `translateZ(${z}px)`, transformStyle: "preserve-3d" }}
              >
                {/* slab texture + component footprints */}
                <span className="bg-dots absolute inset-0 rounded-xl opacity-40" />
                <span className={`absolute left-3 top-3 font-mono text-[10px] tracking-widest ${on ? "text-neon" : "text-dim"}`}>{l.code}</span>
                <span className={`absolute right-3 top-3 h-2 w-2 rounded-full ${on ? "bg-neon shadow-[0_0_10px_#86ffb8]" : "bg-accent/40"}`} />
                <span className="absolute bottom-4 left-4 h-6 w-10 rounded-sm border border-accent/30" />
                <span className="absolute bottom-4 left-16 h-6 w-6 rounded-sm border border-accent/30" />
                <span className="absolute bottom-4 right-4 h-6 w-14 rounded-sm border border-dashed border-accent/30" />
                {/* side face for thickness */}
                <span className="absolute inset-x-0 -bottom-[6px] h-[6px] origin-top rounded-b-xl bg-accent/20 [transform:rotateX(-90deg)]" />
              </button>
            );
          })}
          {/* vertical guide through the stack */}
          <span className="absolute left-1/2 top-1/2 h-px w-px">
            <span
              className="absolute left-0 top-0 w-px bg-gradient-to-t from-accent/60 to-transparent transition-all duration-500"
              style={{ height: (LAYERS.length - 1) * gap + 40, transform: "rotateX(-90deg)", transformOrigin: "bottom" }}
            />
          </span>
        </div>
      </div>

      {/* ── readout ── */}
      <div className="relative -mt-2 border-t border-line pt-4">
        <p className="label flex items-center gap-2">
          <span className="text-accent">{current.code}</span>
          <span className="h-px w-5 bg-line-strong" aria-hidden />
          {current.label}
        </p>
        <p className="mt-1.5 min-h-[20px] font-mono text-[11px] text-muted">{current.sub}</p>
        <ol className="mt-4 grid grid-cols-6 gap-1.5" aria-label="Layers">
          {LAYERS.map((l, i) => (
            <li key={l.id}>
              <button
                type="button"
                onPointerEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                aria-pressed={i === active}
                aria-label={`${l.label}: ${l.sub}`}
                className={`h-1.5 w-full rounded-full transition-all duration-300 ${i === active ? "bg-neon shadow-[0_0_10px_#86ffb8]" : "bg-line-strong hover:bg-accent/60"}`}
              />
            </li>
          ))}
        </ol>
        <figcaption className="mt-3 font-mono text-[10px] uppercase tracking-label text-dim">
          One product · six layers · hover to explode
        </figcaption>
      </div>
    </figure>
  );
}
