"use client";

import { useEffect, useRef, useState } from "react";
import { skillGroups } from "@/data/skills";
import { techIcon } from "@/lib/techIcons";
import { useReducedMotionSafe } from "@/components/Effects";

/* ──────────────────────────────────────────────────────────────────────────
   Skill sphere: every tool as a label on a slowly turning 3D globe.
   Cursor steers the spin, hover lights a tool, hovering a discipline on the
   side dims everything else. Canvas 2D, no dependencies.
   ────────────────────────────────────────────────────────────────────────── */

type Node = { label: string; group: string; groupIdx: number; x: number; y: number; z: number; icon: HTMLImageElement | null; w: number };

const ALL = skillGroups.flatMap((g, gi) => g.items.map((label) => ({ label, group: g.title, groupId: g.id, groupIdx: gi })));
const N = ALL.length;

export function SkillSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotionSafe();
  const [hover, setHover] = useState<{ label: string; group: string } | null>(null);
  const [filter, setFilter] = useState<number | null>(null);
  const filterRef = useRef<number | null>(null);
  filterRef.current = filter;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    let alive = true;
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;
    let R = 0;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      W = r.width;
      H = r.height;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      R = Math.min(W * 0.36, H * 0.43);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Fibonacci sphere: evenly spread points
    const nodes: Node[] = ALL.map((s, i) => {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / N);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const icon = techIcon(s.label);
      let img: HTMLImageElement | null = null;
      if (icon) {
        img = new Image();
        img.src = icon;
      }
      return { label: s.label, group: s.group, groupIdx: s.groupIdx, x: Math.cos(theta) * Math.sin(phi), y: Math.cos(phi), z: Math.sin(theta) * Math.sin(phi), icon: img, w: 0 };
    });

    // rotation state
    let ax = -0.35; // tilt
    let ay = 0;
    let vx = 0;
    let vy = reduce ? 0 : 0.0028;
    const mouse = { x: 0, y: 0, in: false, down: false, lx: 0, ly: 0 };
    let hovered: Node | null = null;
    let inView = true;

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (mouse.down) {
        vy = (x - mouse.lx) * 0.004;
        vx = (y - mouse.ly) * 0.004;
      }
      mouse.lx = x;
      mouse.ly = y;
      mouse.x = x;
      mouse.y = y;
      mouse.in = true;
    };
    const onLeave = () => {
      mouse.in = false;
      mouse.down = false;
      hovered = null;
      setHover(null);
    };
    const onDown = (e: PointerEvent) => {
      mouse.down = true;
      canvas.setPointerCapture(e.pointerId);
    };
    const onUp = () => {
      mouse.down = false;
    };
    canvas.addEventListener("pointermove", onMove, { passive: true });
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      if (inView && !raf) raf = requestAnimationFrame(tick);
    });
    io.observe(canvas);

    ctx.font = "500 11px var(--font-mono), ui-monospace, monospace";
    for (const n of nodes) n.w = ctx.measureText(n.label).width + (n.icon ? 28 : 14);

    const tick = () => {
      raf = 0;
      if (!alive || !inView || document.hidden) return;

      // steer: cursor position nudges the spin when not dragging (TagCanvas feel)
      if (!reduce && !mouse.down) {
        if (mouse.in) {
          const nx = (mouse.x - W / 2) / (W / 2);
          const ny = (mouse.y - (H / 2 - 18)) / (H / 2);
          vy += (nx * 0.012 - vy) * 0.04;
          vx += (-ny * 0.008 - vx) * 0.04;
        } else {
          vy += (0.0028 - vy) * 0.02;
          vx += (0 - vx) * 0.02;
        }
      }
      ay += vy;
      ax += vx;
      ax = Math.max(-1.2, Math.min(1.2, ax));
      if (mouse.down) {
        vx *= 0.6;
        vy *= 0.6;
      }

      const cy = Math.cos(ay), sy = Math.sin(ay), cx = Math.cos(ax), sx = Math.sin(ax);
      const f = 2.2; // perspective
      const projected = nodes.map((n) => {
        // rotate around Y then X
        const x1 = n.x * cy + n.z * sy;
        const z1 = -n.x * sy + n.z * cy;
        const y1 = n.y * cx - z1 * sx;
        const z2 = n.y * sx + z1 * cx;
        const s = f / (f + z2); // 0.69 … 1.83
        return { n, X: W / 2 + x1 * R * s, Y: H / 2 - 18 + y1 * R * s, s, depth: (z2 + 1) / 2 };
      });
      projected.sort((a, b) => a.s - b.s); // back to front

      // hover pick: closest front-facing label under the cursor
      let best: (typeof projected)[number] | null = null;
      if (mouse.in && !mouse.down) {
        let bd = 1e9;
        for (const p of projected) {
          if (p.depth < 0.5) continue;
          const hw = (p.n.w * p.s) / 2 + 6;
          const hh = 11 * p.s + 6;
          const dx = Math.abs(mouse.x - p.X), dy = Math.abs(mouse.y - p.Y);
          if (dx < hw && dy < hh) {
            const d = dx + dy - p.s * 10;
            if (d < bd) {
              bd = d;
              best = p;
            }
          }
        }
      }
      const newHover = best ? best.n : null;
      if (newHover !== hovered) {
        hovered = newHover;
        setHover(hovered ? { label: hovered.label, group: hovered.group } : null);
      }
      canvas.style.cursor = mouse.down ? "grabbing" : hovered ? "pointer" : "grab";

      ctx.clearRect(0, 0, W, H);
      // equator + meridian guides
      ctx.strokeStyle = "rgba(52,210,123,0.08)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(W / 2, H / 2 - 18, R * 0.98, R * 0.98 * Math.abs(Math.sin(ax)) + 1, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(W / 2, H / 2 - 18, R * 0.98, 0, Math.PI * 2);
      ctx.stroke();

      const fl = filterRef.current;
      for (const p of projected) {
        const { n, X, Y, s, depth } = p;
        const isHover = n === hovered;
        const dim = fl !== null && n.groupIdx !== fl;
        const a = dim ? 0.08 : 0.25 + depth * 0.75;
        const scale = s * (isHover ? 1.18 : 1);
        const w = n.w * scale;
        const h = 20 * scale;
        ctx.save();
        ctx.globalAlpha = a;
        // pill
        ctx.fillStyle = isHover ? "rgba(52,210,123,0.22)" : "rgba(12,16,14,0.9)";
        ctx.strokeStyle = isHover ? "#86ffb8" : depth > 0.55 ? "rgba(52,210,123,0.55)" : "rgba(40,53,46,0.9)";
        ctx.lineWidth = isHover ? 1.5 : 1;
        ctx.beginPath();
        ctx.roundRect(X - w / 2, Y - h / 2, w, h, 6 * scale);
        ctx.fill();
        ctx.stroke();
        if (isHover) {
          ctx.shadowColor = "rgba(134,255,184,0.8)";
          ctx.shadowBlur = 18;
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
        // icon + text
        let tx = X - w / 2 + 8 * scale;
        if (n.icon && n.icon.complete && n.icon.naturalWidth > 0) {
          const is = 14 * scale;
          ctx.drawImage(n.icon, tx, Y - is / 2, is, is);
          tx += is + 6 * scale;
        }
        ctx.font = `500 ${11 * scale}px var(--font-mono), ui-monospace, monospace`;
        ctx.textBaseline = "middle";
        ctx.fillStyle = isHover ? "#e7ece8" : depth > 0.55 ? "#e7ece8" : "#93a097";
        ctx.fillText(n.label, tx, Y + 0.5);
        ctx.restore();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const onVis = () => {
      if (!document.hidden && !raf) raf = requestAnimationFrame(tick);
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
    };
  }, [reduce]);

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_300px] lg:items-stretch">
      {/* ── globe ── */}
      <figure
        aria-label={`Interactive globe of ${N} tools across ${skillGroups.length} disciplines: ${skillGroups.map((g) => g.title).join(", ")}`}
        className="panel relative overflow-hidden"
      >
        <div aria-hidden className="bg-grid absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]" />
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[60%] w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-3xl" />
        <canvas ref={canvasRef} aria-hidden className="relative block h-[380px] w-full touch-none select-none sm:h-[480px] lg:h-[600px]" />
        {/* readout */}
        <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4">
          <div className="min-h-[40px]">
            <p className="label flex items-center gap-2">
              <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${hover ? "bg-neon shadow-[0_0_8px_#86ffb8]" : "bg-line-strong"}`} />
              {hover ? hover.group : `${N} tools`}
            </p>
            <p className="mt-1 font-display text-lg font-semibold leading-tight text-ink">{hover ? hover.label : "Drag to spin · hover to inspect"}</p>
          </div>
          <p className="shrink-0 text-right font-mono text-[10px] uppercase tracking-label text-dim">
            {skillGroups.length} disciplines
            <br />
            one engineer
          </p>
        </figcaption>
      </figure>

      {/* ── discipline index (filters the globe on hover) ── */}
      <ol className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1" aria-label="Disciplines">
        {skillGroups.map((g, i) => {
          const share = Math.round((g.items.length / N) * 100);
          const on = filter === i;
          return (
            <li key={g.id}>
              <button
                type="button"
                onPointerEnter={() => setFilter(i)}
                onPointerLeave={() => setFilter(null)}
                onFocus={() => setFilter(i)}
                onBlur={() => setFilter(null)}
                onClick={() => setFilter((v) => (v === i ? null : i))}
                aria-pressed={on}
                className={`panel group/d relative flex h-full w-full flex-col justify-between overflow-hidden p-4 text-left transition-colors duration-300 hover:border-accent/50 ${on ? "border-accent/50" : ""}`}
              >
                <span className="flex items-baseline justify-between gap-2">
                  <span className="font-mono text-[11px] uppercase tracking-label text-dim">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display text-2xl font-bold tabular-nums text-accent">{g.items.length}</span>
                </span>
                <span className="mt-2 block text-sm font-medium text-ink">{g.title}</span>
                <span aria-hidden className="mt-3 block h-1 w-full overflow-hidden rounded-full bg-line">
                  <span className="block h-full rounded-full bg-gradient-to-r from-accent to-neon transition-all duration-500" style={{ width: `${on ? 100 : share * 2.2}%` }} />
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
