"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

/* ─────────────────────────── Scroll progress bar ─────────────────────────── */

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.3 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-accent via-neon to-accent"
    />
  );
}

/* ─────────────────────────── Cursor spotlight ─────────────────────────── */

export function CursorGlow() {
  const reduce = useReducedMotion();
  const x = useMotionValue(-600);
  const y = useMotionValue(-600);
  const sx = useSpring(x, { stiffness: 120, damping: 22, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 120, damping: 22, mass: 0.4 });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Pointer-driven effect only makes sense with a fine pointer (mouse/trackpad).
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX - 300);
      y.set(e.clientY - 300);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [x, y]);

  if (reduce || !enabled) return null;
  return (
    <motion.div
      aria-hidden
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed left-0 top-0 z-[1] h-[600px] w-[600px] rounded-full opacity-[0.07]"
    >
      <div className="h-full w-full rounded-full bg-[radial-gradient(circle,#34d27b_0%,transparent_60%)]" />
    </motion.div>
  );
}

/* ─────────────────────────── Magnetic hover ─────────────────────────── */

export function Magnetic({ children, strength = 0.25 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.3 });

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      className="inline-block"
      onPointerMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────── 3D tilt card with glare ─────────────────────────── */

export function TiltCard({
  children,
  className = "",
  max = 7,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 220, damping: 18 });
  const sry = useSpring(ry, { stiffness: 220, damping: 18 });
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glare = useTransform(
    [glareX, glareY],
    ([gx, gy]) => `radial-gradient(420px circle at ${gx}% ${gy}%, rgb(134 255 184 / 0.08), transparent 55%)`,
  );

  return (
    <motion.div
      ref={ref}
      style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d", perspective: 900 }}
      className={`group/tilt relative will-change-transform ${className}`}
      onPointerMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        ry.set((px - 0.5) * max * 2);
        rx.set((0.5 - py) * max * 2);
        glareX.set(px * 100);
        glareY.set(py * 100);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      {children}
      <motion.div
        aria-hidden
        style={{ background: glare }}
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100"
      />
    </motion.div>
  );
}

/* ─────────────────────────── Animated counter ─────────────────────────── */

export function Counter({ to, suffix = "", duration = 1.6 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setVal(to);
      return;
    }
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(eased * to));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration, reduce]);

  return (
    <span ref={ref} className="tabular-nums">
      {val}
      {suffix}
    </span>
  );
}

/* ─────────────────────────── Rotating role words ─────────────────────────── */

export function RoleRotator({ words, interval = 2600 }: { words: readonly string[]; interval?: number }) {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setI((v) => (v + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [words.length, interval, reduce]);

  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), "");
  return (
    <span className="relative inline-grid overflow-hidden text-left align-bottom">
      {/* invisible copy of the longest word keeps the cell wide enough for every word */}
      <span aria-hidden className="invisible col-start-1 row-start-1 whitespace-nowrap">{longest}</span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={words[i]}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="col-start-1 row-start-1 whitespace-nowrap text-neon"
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* ─────────────────────────── Staggered word reveal ─────────────────────────── */

export function WordReveal({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={className}>
      {/* real text for assistive tech; the animated copy below is decorative */}
      <span className="sr-only">{text}</span>
      <motion.span
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true }}
        transition={{ staggerChildren: 0.06 }}
        aria-hidden
      >
        {text.split(" ").map((w, i) => (
          <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
            <motion.span
              className="inline-block"
              variants={{
                hidden: { y: "110%" },
                shown: { y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
              }}
            >
              {w}
            </motion.span>
            {i < text.split(" ").length - 1 && <span>&nbsp;</span>}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

/* ─────────────────────────── Interactive hero network ───────────────────────────
   Canvas-2D constellation: drifting nodes linked into a glowing network. The cursor
   (or a finger while touching) bends nodes around it and lights nearby links from
   accent to neon; occasional signal pulses travel along links; a tap/click sends a
   soft shockwave. Decorative only (aria-hidden, pointer-events-none; listeners live
   on window). Perf: area-scaled count (cap 110 desktop / 45 phones), spatial grid
   for neighbour checks, DPR ≤ 2, one rAF, paused off-screen or in hidden tabs,
   ResizeObserver for sizing. Reduced motion: one static frame, no listeners. */

const NET_ACCENT = [52, 210, 123] as const; // #34d27b
const NET_NEON = [134, 255, 184] as const; // #86ffb8

export function ParticleField({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduceHook = useReducedMotionSafe();

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Read the media query directly too, so a reduced-motion device never starts
    // the loop during the hydration-safe "false" first pass of the hook.
    const still = !!reduceHook || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    const LINK = coarse ? 110 : 135; // max link distance (also the grid cell size)
    const LINK2 = LINK * LINK;
    const R = coarse ? 120 : 160; // cursor influence radius
    const R2 = R * R;
    const MAX_PULSES = coarse ? 2 : 5;

    type P = { x: number; y: number; vx: number; vy: number; bvx: number; bvy: number; r: number; tw: number };
    type Pulse = { a: number; b: number; t: number; speed: number };
    type Wave = { x: number; y: number; r: number; life: number };

    let w = 0;
    let h = 0;
    let dpr = 1;
    let pts: P[] = [];
    let pulses: Pulse[] = [];
    let waves: Wave[] = [];
    let raf = 0;
    let last = 0;
    let inView = true;
    let time = 0;

    // Pointer, in client coords; mapped into canvas space once per frame.
    let pClientX = 0;
    let pClientY = 0;
    let pActive = false;
    let px = -9999;
    let py = -9999;
    let pStrength = 0; // eased 0..1 so the effect fades in/out softly

    // Spatial grid (reused between frames).
    let cols = 0;
    let rows = 0;
    let grid: number[][] = [];
    const linkA: number[] = [];
    const linkB: number[] = [];

    const makeP = (): P => {
      const a = Math.random() * Math.PI * 2;
      const s = 0.12 + Math.random() * 0.22;
      const bvx = Math.cos(a) * s;
      const bvy = Math.sin(a) * s;
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: bvx,
        vy: bvy,
        bvx,
        bvy,
        r: Math.random() * 1.4 + 0.7,
        tw: Math.random() * Math.PI * 2,
      };
    };

    const targetCount = () => {
      const phone = w < 768 || coarse;
      const cap = phone ? 45 : 110;
      const per = phone ? 14000 : 16000;
      return Math.max(12, Math.min(cap, Math.floor((w * h) / per)));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const nw = rect.width;
      const nh = rect.height;
      if (nw <= 0 || nh <= 0) return;
      // Keep the network's layout when the box changes size.
      if (w > 0 && h > 0 && pts.length) {
        const sx = nw / w;
        const sy = nh / h;
        for (const p of pts) {
          p.x *= sx;
          p.y *= sy;
        }
      }
      w = nw;
      h = nh;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const n = targetCount();
      if (pts.length > n) pts.length = n;
      while (pts.length < n) pts.push(makeP());
      pulses = pulses.filter((q) => q.a < pts.length && q.b < pts.length);

      cols = Math.max(1, Math.ceil(w / LINK));
      rows = Math.max(1, Math.ceil(h / LINK));
      grid = Array.from({ length: cols * rows }, () => []);
      if (still || !raf) draw(0);
    };

    const mix = (k: number) =>
      `${Math.round(NET_ACCENT[0] + (NET_NEON[0] - NET_ACCENT[0]) * k)},${Math.round(
        NET_ACCENT[1] + (NET_NEON[1] - NET_ACCENT[1]) * k,
      )},${Math.round(NET_ACCENT[2] + (NET_NEON[2] - NET_ACCENT[2]) * k)}`;

    // Proximity of a point to the cursor, 0 (outside radius) .. 1 (at cursor).
    const near = (x: number, y: number) => {
      if (pStrength <= 0.001) return 0;
      const dx = x - px;
      const dy = y - py;
      const d2 = dx * dx + dy * dy;
      if (d2 >= R2) return 0;
      const k = 1 - Math.sqrt(d2) / R;
      return k * k * pStrength;
    };

    const step = (dt: number) => {
      // Ease the pointer influence in/out.
      pStrength += ((pActive ? 1 : 0) - pStrength) * Math.min(1, 0.08 * dt);
      if (pActive) {
        const rect = canvas.getBoundingClientRect();
        px = pClientX - rect.left;
        py = pClientY - rect.top;
      }

      for (const p of pts) {
        // Bend around the cursor: radial push plus a slight tangential swirl.
        if (pStrength > 0.001) {
          const dx = p.x - px;
          const dy = p.y - py;
          const d2 = dx * dx + dy * dy;
          if (d2 < R2 && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const f = (1 - d / R) * (1 - d / R) * 0.55 * pStrength;
            p.vx += ((dx / d) * f - (dy / d) * f * 0.25) * dt;
            p.vy += ((dy / d) * f + (dx / d) * f * 0.25) * dt;
          }
        }
        // Shockwaves: impulse on nodes the ring front is passing.
        for (const wv of waves) {
          const dx = p.x - wv.x;
          const dy = p.y - wv.y;
          const d = Math.sqrt(dx * dx + dy * dy) || 1;
          const band = Math.abs(d - wv.r);
          if (band < 26) {
            const f = (1 - band / 26) * 1.1 * wv.life;
            p.vx += (dx / d) * f * dt;
            p.vy += (dy / d) * f * dt;
          }
        }
        // Relax back to the gentle base drift.
        const relax = Math.min(1, 0.035 * dt);
        p.vx += (p.bvx - p.vx) * relax;
        p.vy += (p.bvy - p.vy) * relax;
        const sp = Math.hypot(p.vx, p.vy);
        if (sp > 6) {
          p.vx = (p.vx / sp) * 6;
          p.vy = (p.vy / sp) * 6;
        }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        // Soft wrap-around bounce at the edges.
        if (p.x < -10) { p.x = -10; p.vx = Math.abs(p.vx); p.bvx = Math.abs(p.bvx); }
        else if (p.x > w + 10) { p.x = w + 10; p.vx = -Math.abs(p.vx); p.bvx = -Math.abs(p.bvx); }
        if (p.y < -10) { p.y = -10; p.vy = Math.abs(p.vy); p.bvy = Math.abs(p.bvy); }
        else if (p.y > h + 10) { p.y = h + 10; p.vy = -Math.abs(p.vy); p.bvy = -Math.abs(p.bvy); }
        p.tw += 0.03 * dt;
      }

      for (const wv of waves) {
        wv.r += 7 * dt;
        wv.life -= 0.022 * dt;
      }
      waves = waves.filter((wv) => wv.life > 0);
    };

    const draw = (dt: number) => {
      ctx.clearRect(0, 0, w, h);
      if (!pts.length) return;

      // Bucket nodes into the grid.
      for (const cell of grid) cell.length = 0;
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const cx = Math.min(cols - 1, Math.max(0, Math.floor(p.x / LINK)));
        const cy = Math.min(rows - 1, Math.max(0, Math.floor(p.y / LINK)));
        grid[cy * cols + cx].push(i);
      }

      // Links: each cell checks itself plus 4 forward neighbours (no duplicates).
      linkA.length = 0;
      linkB.length = 0;
      ctx.lineCap = "round";
      const NB = [
        [1, 0],
        [-1, 1],
        [0, 1],
        [1, 1],
      ];
      const link = (i: number, j: number) => {
        const a = pts[i];
        const b = pts[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 >= LINK2) return;
        const fade = 1 - Math.sqrt(d2) / LINK;
        const glow = near((a.x + b.x) / 2, (a.y + b.y) / 2);
        ctx.strokeStyle = `rgba(${mix(glow)},${fade * (0.15 + glow * 0.65)})`;
        ctx.lineWidth = 1 + glow * 0.9;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
        if (fade > 0.35) {
          linkA.push(i);
          linkB.push(j);
        }
      };
      for (let cy = 0; cy < rows; cy++) {
        for (let cx = 0; cx < cols; cx++) {
          const cell = grid[cy * cols + cx];
          for (let m = 0; m < cell.length; m++) {
            for (let n = m + 1; n < cell.length; n++) link(cell[m], cell[n]);
          }
          for (const [ox, oy] of NB) {
            const nx = cx + ox;
            const ny = cy + oy;
            if (nx < 0 || nx >= cols || ny >= rows) continue;
            const other = grid[ny * cols + nx];
            for (const i of cell) for (const j of other) link(i, j);
          }
        }
      }

      // Nodes.
      for (const p of pts) {
        const g = near(p.x, p.y);
        const twinkle = still ? 0.5 : 0.5 + 0.5 * Math.sin(p.tw);
        if (g > 0.05) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r + 4 * g, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${NET_NEON.join(",")},${0.12 * g})`;
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r + g * 0.9, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${mix(g)},${0.38 + 0.14 * twinkle + g * 0.45})`;
        ctx.fill();
      }

      if (still) return;

      // Signal pulses travelling along links.
      if (pulses.length < MAX_PULSES && linkA.length && Math.random() < 0.025 * dt) {
        const k = (Math.random() * linkA.length) | 0;
        const flip = Math.random() < 0.5;
        pulses.push({
          a: flip ? linkA[k] : linkB[k],
          b: flip ? linkB[k] : linkA[k],
          t: 0,
          speed: 0.012 + Math.random() * 0.014,
        });
      }
      const alive: Pulse[] = [];
      for (const q of pulses) {
        const a = pts[q.a];
        const b = pts[q.b];
        if (!a || !b) continue;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        if (dx * dx + dy * dy > LINK2) continue; // link broke: drop the pulse
        q.t += q.speed * dt;
        if (q.t >= 1) {
          // Occasionally hop on to a further link from the arrival node.
          if (Math.random() < 0.55) {
            const from = q.b;
            const options: number[] = [];
            for (let k = 0; k < linkA.length; k++) {
              if (linkA[k] === from && linkB[k] !== q.a) options.push(linkB[k]);
              else if (linkB[k] === from && linkA[k] !== q.a) options.push(linkA[k]);
            }
            if (options.length) {
              alive.push({ a: from, b: options[(Math.random() * options.length) | 0], t: 0, speed: q.speed });
            }
          }
          continue;
        }
        const x = a.x + dx * q.t;
        const y = a.y + dy * q.t;
        const env = Math.sin(q.t * Math.PI); // fade in/out along the link
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${NET_NEON.join(",")},${0.14 * env})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y, 1.7, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${NET_NEON.join(",")},${0.9 * env})`;
        ctx.fill();
        alive.push(q);
      }
      pulses = alive;

      // Shockwave rings.
      for (const wv of waves) {
        ctx.beginPath();
        ctx.arc(wv.x, wv.y, wv.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${NET_NEON.join(",")},${0.28 * wv.life * wv.life})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Faint halo under the cursor.
      if (pStrength > 0.01) {
        const grad = ctx.createRadialGradient(px, py, 0, px, py, R);
        grad.addColorStop(0, `rgba(${NET_NEON.join(",")},${0.07 * pStrength})`);
        grad.addColorStop(1, `rgba(${NET_ACCENT.join(",")},0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(px - R, py - R, R * 2, R * 2);
      }
      void dt;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    // Reduced motion: a single static network frame, no loop, no listeners.
    if (still) {
      return () => ro.disconnect();
    }

    const frame = (now: number) => {
      const dt = last ? Math.min((now - last) / 16.667, 3) : 1;
      last = now;
      time += dt;
      step(dt);
      draw(dt);
      raf = requestAnimationFrame(frame);
    };
    const running = () => inView && !document.hidden;
    const restart = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      last = 0;
      if (running()) raf = requestAnimationFrame(frame);
    };

    const inside = (cx: number, cy: number, pad: number) => {
      const rect = canvas.getBoundingClientRect();
      return (
        cx >= rect.left - pad && cx <= rect.right + pad && cy >= rect.top - pad && cy <= rect.bottom + pad
      );
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch" && e.buttons === 0) return; // only while touching
      pClientX = e.clientX;
      pClientY = e.clientY;
      pActive = inView;
    };
    const onDown = (e: PointerEvent) => {
      pClientX = e.clientX;
      pClientY = e.clientY;
      if (!inView || !inside(e.clientX, e.clientY, 0)) return;
      pActive = true;
      const rect = canvas.getBoundingClientRect();
      px = e.clientX - rect.left;
      py = e.clientY - rect.top;
      if (waves.length < 4) waves.push({ x: px, y: py, r: 4, life: 1 });
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") pActive = false;
    };
    const onLeave = () => {
      pActive = false;
    };

    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      if (!inView) pActive = false;
      restart();
    });
    io.observe(canvas);
    document.addEventListener("visibilitychange", restart);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onUp, { passive: true });
    window.addEventListener("blur", onLeave);
    document.documentElement.addEventListener("pointerleave", onLeave);
    restart();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", restart);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("blur", onLeave);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [reduceHook]);

  return <canvas ref={ref} aria-hidden className={`pointer-events-none ${className}`} />;
}

/* ─────────── SSR-safe reduced-motion hook ───────────
   useReducedMotion() reads the media query immediately, so on a reduced-motion
   device the first client render differs from the server HTML (hydration
   mismatch). Returning false until mounted keeps SSR and first render identical;
   MotionConfig reducedMotion="user" still suppresses transform animations. */
export function useReducedMotionSafe() {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? reduce : false;
}

/* ─────────── Cinematic clip-path wipe (kinetic typography reveal) ─────────── */

export function ClipReveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotionSafe();
  return (
    <motion.div
      initial={reduce ? false : { clipPath: "inset(0 100% 0 0)", opacity: 0.4 }}
      animate={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────── Two-layer custom cursor (desktop, fine pointer only) ─────────────── */

const HOT_SELECTOR = "a, button, [role='button'], input, textarea, select, [data-cursor]";

export function CustomCursor() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hot, setHot] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 320, damping: 28, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 320, damping: 28, mass: 0.6 });

  useEffect(() => {
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setHot(!!(e.target as Element | null)?.closest?.(HOT_SELECTOR));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [reduce, x, y]);

  if (!enabled) return null;
  return (
    <>
      {/* inner dot tracks instantly */}
      <motion.span
        aria-hidden
        style={{ x, y }}
        className="pointer-events-none fixed left-0 top-0 z-[100] -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-accent"
      />
      {/* outer ring follows on a spring, reacts to interactive targets */}
      <motion.span
        aria-hidden
        style={{ x: ringX, y: ringY }}
        animate={{ scale: hot ? 1.6 : 1, opacity: hot ? 0.9 : 0.5 }}
        transition={{ duration: 0.2 }}
        className="pointer-events-none fixed left-0 top-0 z-[100] -ml-4 -mt-4 h-8 w-8 rounded-full border border-accent"
      />
    </>
  );
}

/* ─────────── Engineering-grid parallax: background drifts ±5px with cursor ─────────── */

export function GridParallax({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 40, damping: 18 });
  const sy = useSpring(y, { stiffness: 40, damping: 18 });

  useEffect(() => {
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      x.set((e.clientX / window.innerWidth - 0.5) * 10); // ±5px
      y.set((e.clientY / window.innerHeight - 0.5) * 10);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, x, y]);

  return (
    <motion.div aria-hidden style={{ x: sx, y: sy }} className={className}>
      {children}
    </motion.div>
  );
}

/* ─────────── Timeline that draws itself as the user scrolls (Experience) ─────────── */

export function TimelineDraw() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 55%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 26 });

  return (
    <div ref={ref} aria-hidden className="absolute bottom-6 left-0 top-1 w-px">
      <div className="absolute inset-0 bg-line-strong" />
      <motion.div style={{ scaleY }} className="absolute inset-0 origin-top bg-gradient-to-b from-accent to-neon" />
    </div>
  );
}

/* ─────────────────────────── Back to top ─────────────────────────── */

export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 900);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href="#home"
          aria-label="Back to top"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          className="fixed bottom-6 right-6 z-50 grid h-11 w-11 place-items-center rounded-full border border-accent/40 bg-surface/80 text-accent shadow-[0_0_24px_rgb(52_210_123/0.25)] backdrop-blur transition-colors hover:bg-accent hover:text-bg"
        >
          <ArrowUp size={18} />
        </motion.a>
      )}
    </AnimatePresence>
  );
}
