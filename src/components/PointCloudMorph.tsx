"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotionSafe } from "@/components/Effects";

/* ──────────────────────────────────────────────────────────────────────────
   LiDAR point cloud that keeps re-forming: ~1,400 particles morph between
   the name, a robot, a microchip, a camera eye and the word PRODUCT, and
   scatter away from the cursor. Pure canvas 2D, no dependencies.
   ────────────────────────────────────────────────────────────────────────── */

type Frame = { id: string; caption: string; sub: string; draw: (ctx: CanvasRenderingContext2D, S: number) => void };

const N = 1400;
const HOLD = 2600; // ms a shape stays formed
const MORPH = 1300; // ms spent travelling to the next shape

const text = (t: string, px: number) => (ctx: CanvasRenderingContext2D, S: number) => {
  ctx.font = `700 ${px}px var(--font-display), "Space Grotesk", system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(t, S / 2, S / 2);
};

const robot = (ctx: CanvasRenderingContext2D, S: number) => {
  const c = S / 2;
  ctx.lineWidth = 14;
  ctx.lineCap = "round";
  // body
  ctx.beginPath();
  ctx.roundRect(c - 110, c - 50, 220, 130, 28);
  ctx.stroke();
  // lidar turret
  ctx.beginPath();
  ctx.roundRect(c - 34, c - 92, 68, 34, 10);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(c, c - 118, 16, 0, Math.PI * 2);
  ctx.fill();
  // eyes
  ctx.beginPath();
  ctx.arc(c - 48, c - 2, 18, 0, Math.PI * 2);
  ctx.arc(c + 48, c - 2, 18, 0, Math.PI * 2);
  ctx.fill();
  // mouth / sensor bar
  ctx.beginPath();
  ctx.moveTo(c - 50, c + 44);
  ctx.lineTo(c + 50, c + 44);
  ctx.stroke();
  // wheels
  ctx.beginPath();
  ctx.arc(c - 80, c + 100, 30, 0, Math.PI * 2);
  ctx.arc(c + 80, c + 100, 30, 0, Math.PI * 2);
  ctx.fill();
  // scan beams
  ctx.lineWidth = 8;
  for (const a of [-0.9, -0.5, 0, 0.5, 0.9]) {
    ctx.beginPath();
    ctx.moveTo(c + Math.sin(a) * 30, c - 118 - Math.cos(a) * 30);
    ctx.lineTo(c + Math.sin(a) * 70, c - 118 - Math.cos(a) * 70);
    ctx.stroke();
  }
};

const chip = (ctx: CanvasRenderingContext2D, S: number) => {
  const c = S / 2;
  ctx.lineWidth = 16;
  ctx.beginPath();
  ctx.roundRect(c - 95, c - 95, 190, 190, 22);
  ctx.stroke();
  ctx.beginPath();
  ctx.roundRect(c - 48, c - 48, 96, 96, 12);
  ctx.fill();
  // pins
  for (let i = 0; i < 6; i++) {
    const o = -75 + i * 30;
    ctx.fillRect(c + o - 7, c - 150, 14, 42);
    ctx.fillRect(c + o - 7, c + 108, 14, 42);
    ctx.fillRect(c - 150, c + o - 7, 42, 14);
    ctx.fillRect(c + 108, c + o - 7, 42, 14);
  }
};

const eye = (ctx: CanvasRenderingContext2D, S: number) => {
  const c = S / 2;
  ctx.lineWidth = 16;
  // almond
  ctx.beginPath();
  ctx.moveTo(c - 170, c);
  ctx.quadraticCurveTo(c, c - 150, c + 170, c);
  ctx.quadraticCurveTo(c, c + 150, c - 170, c);
  ctx.closePath();
  ctx.stroke();
  // iris ring + pupil
  ctx.beginPath();
  ctx.arc(c, c, 62, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(c, c, 26, 0, Math.PI * 2);
  ctx.fill();
  // detection box corners around the eye
  ctx.lineWidth = 10;
  const b = 200;
  for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]] as const) {
    ctx.beginPath();
    ctx.moveTo(c + sx * b, c + sy * (b - 50));
    ctx.lineTo(c + sx * b, c + sy * b);
    ctx.lineTo(c + sx * (b - 50), c + sy * b);
    ctx.stroke();
  }
};

const FRAMES: Frame[] = [
  { id: "name", caption: "Pramoth S", sub: "Product Development Engineer", draw: text("PRAMOTH", 118) },
  { id: "robot", caption: "Robotics", sub: "ROS 2 · Nav2 · SLAM · autonomous mobile robots", draw: robot },
  { id: "chip", caption: "Embedded", sub: "ESP32 · Raspberry Pi 5 · micro-ROS · firmware", draw: chip },
  { id: "eye", caption: "Perception", sub: "YOLO · OpenCV · PyTorch · edge inference", draw: eye },
  { id: "product", caption: "Product", sub: "Concept → CAD → prototype → shipped system", draw: text("PRODUCT", 118) },
];

/** Sample N points from a shape drawn into an offscreen canvas. */
function sample(frame: Frame, S: number): Float32Array {
  const off = document.createElement("canvas");
  off.width = S;
  off.height = S;
  const ctx = off.getContext("2d")!;
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#fff";
  frame.draw(ctx, S);
  const { data } = ctx.getImageData(0, 0, S, S);
  const pts: number[] = [];
  const step = 3;
  for (let y = 0; y < S; y += step)
    for (let x = 0; x < S; x += step) if (data[(y * S + x) * 4 + 3] > 128) pts.push(x + Math.random() * step, y + Math.random() * step);
  // shuffle, then fit to N (repeat if the shape is sparse)
  for (let i = pts.length / 2 - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pts[i * 2], pts[j * 2]] = [pts[j * 2], pts[i * 2]];
    [pts[i * 2 + 1], pts[j * 2 + 1]] = [pts[j * 2 + 1], pts[i * 2 + 1]];
  }
  const out = new Float32Array(N * 2);
  const m = pts.length / 2 || 1;
  for (let i = 0; i < N; i++) {
    const k = i % m;
    out[i * 2] = pts[k * 2] ?? S / 2;
    out[i * 2 + 1] = pts[k * 2 + 1] ?? S / 2;
  }
  return out;
}

const ease = (t: number) => 1 - Math.pow(1 - t, 3);

export function PointCloudMorph() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotionSafe();
  const [frame, setFrame] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    let raf = 0;
    let alive = true;
    const S = 440; // logical size; CSS scales it
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = S * dpr;
    canvas.height = S * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const pos = new Float32Array(N * 2);
    const vel = new Float32Array(N * 2);
    const seed = new Float32Array(N); // per-particle phase for twinkle
    for (let i = 0; i < N; i++) {
      pos[i * 2] = S / 2 + (Math.random() - 0.5) * S;
      pos[i * 2 + 1] = S / 2 + (Math.random() - 0.5) * S;
      seed[i] = Math.random() * Math.PI * 2;
    }
    let targets: Float32Array[] = [];
    let from = new Float32Array(N * 2);
    let cur = 0;
    let phaseStart = 0;
    let morphing = false;
    const mouse = { x: -1e4, y: -1e4 };
    let inView = true;

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) / r.width) * S;
      mouse.y = ((e.clientY - r.top) / r.height) * S;
    };
    const onLeave = () => {
      mouse.x = -1e4;
      mouse.y = -1e4;
    };
    canvas.addEventListener("pointermove", onMove, { passive: true });
    canvas.addEventListener("pointerleave", onLeave);

    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      if (inView && !raf) raf = requestAnimationFrame(tick);
    });
    io.observe(canvas);

    const tick = (now: number) => {
      raf = 0;
      if (!alive) return;
      if (!inView || document.hidden) return; // resumes via observer / next frame
      if (!phaseStart) phaseStart = now;
      const t = now - phaseStart;

      // state machine: hold → morph → hold …
      if (!reduce) {
        if (!morphing && t > HOLD) {
          morphing = true;
          phaseStart = now;
          from.set(pos);
          cur = (cur + 1) % targets.length;
          setFrame(cur);
        } else if (morphing && t > MORPH) {
          morphing = false;
          phaseStart = now;
        }
      }
      const tgt = targets[cur];
      const k = morphing ? ease(Math.min(t / MORPH, 1)) : 1;

      ctx.clearRect(0, 0, S, S);
      // faint range rings for the LiDAR feel
      ctx.strokeStyle = "rgba(52,210,123,0.08)";
      ctx.lineWidth = 1;
      for (const r of [70, 140, 210]) {
        ctx.beginPath();
        ctx.arc(S / 2, S / 2, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      for (let i = 0; i < N; i++) {
        const ix = i * 2;
        const iy = ix + 1;
        // target for this frame: interpolate from the snapshot taken at morph start
        let tx = tgt[ix];
        let ty = tgt[iy];
        if (morphing) {
          tx = from[ix] + (tgt[ix] - from[ix]) * k;
          ty = from[iy] + (tgt[iy] - from[iy]) * k;
        }
        // spring toward target
        vel[ix] += (tx - pos[ix]) * 0.12;
        vel[iy] += (ty - pos[iy]) * 0.12;
        // cursor repulsion
        const dx = pos[ix] - mouse.x;
        const dy = pos[iy] - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 80 * 80) {
          const d = Math.sqrt(d2) || 1;
          const f = (1 - d / 80) * 6;
          vel[ix] += (dx / d) * f;
          vel[iy] += (dy / d) * f;
        }
        vel[ix] *= 0.72;
        vel[iy] *= 0.72;
        pos[ix] += vel[ix];
        pos[iy] += vel[iy];

        const tw = 0.55 + 0.45 * Math.sin(now / 600 + seed[i]);
        const speed = Math.min(1, Math.hypot(vel[ix], vel[iy]) / 6);
        // calm = green, fast = neon white-green
        ctx.fillStyle = `rgba(${52 + speed * 120},${210 + speed * 45},${123 + speed * 90},${(0.35 + 0.65 * tw) * (reduce ? 1 : 1)})`;
        ctx.fillRect(pos[ix], pos[iy], 1.8 + speed * 1.2, 1.8 + speed * 1.2);
      }
      raf = requestAnimationFrame(tick);
    };

    // Sample shapes once the display font is available so the text frames use it.
    const start = async () => {
      try {
        await document.fonts.load('700 118px "Space Grotesk"');
      } catch {
        /* fall back to system font */
      }
      if (!alive) return;
      targets = FRAMES.map((f) => sample(f, S));
      from = new Float32Array(N * 2);
      setReady(true);
      raf = requestAnimationFrame(tick);
    };
    void start();

    const onVis = () => {
      if (!document.hidden && !raf) raf = requestAnimationFrame(tick);
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reduce]);

  const f = FRAMES[frame];
  return (
    <figure
      aria-label="Animated LiDAR point cloud that forms the name Pramoth, a robot, a microchip, a camera eye and the word product"
      className="panel relative w-full overflow-hidden p-4"
    >
      <div aria-hidden className="bg-grid absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
      <canvas
        ref={ref}
        aria-hidden
        className={`relative mx-auto block aspect-square w-full max-w-[440px] touch-none transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
      />
      <figcaption className="relative mt-1 flex items-end justify-between gap-4 border-t border-line pt-3">
        <div>
          <p className="label flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-neon shadow-[0_0_8px_#86ffb8] motion-safe:animate-blink" aria-hidden />
            {f.caption}
          </p>
          <p className="mt-1 font-mono text-[11px] text-muted">{f.sub}</p>
        </div>
        <p className="shrink-0 text-right font-mono text-[10px] uppercase tracking-label text-dim">
          {N.toLocaleString()} points
          <br />
          move the cursor
        </p>
      </figcaption>
    </figure>
  );
}
