"use client";

import { useEffect, useRef, type HTMLAttributes, type PointerEvent, type ReactNode, type Ref } from "react";
import { useReducedMotionSafe } from "@/components/Effects";
import { finePointer, gsap } from "@/lib/gsap";

type Props = Omit<HTMLAttributes<HTMLElement>, "children"> & {
  children: ReactNode;
  as?: "article" | "div";
  /** Max tilt in degrees (mouse / fine pointers only). */
  max?: number;
  /** Image scale while lit. */
  zoom?: number;
  /** Max image parallax shift in px (opposite to the tilt). */
  shift?: number;
  /** Card lift in px while hovered. */
  lift?: number;
  /** Extra "lit" source controlled by the parent (e.g. touch preview open). */
  lit?: boolean;
};

type State = {
  tx: number; ty: number; ts: number; tl: number; // targets: rotX, rotY, image scale, lift
  cx: number; cy: number; cs: number; cl: number; // current (smoothed)
  px: number; py: number; // pointer 0..1
  rect: DOMRect | null;
  raf: number;
  hover: boolean;
  focus: boolean;
};

/**
 * "Living" card: spring-smoothed 3D tilt toward the cursor, a pointer-following
 * spotlight and image depth (zoom + counter-parallax), all via transforms/CSS vars
 * written inside a single rAF loop that stops once settled. Sets `data-lit` on the
 * root (`group/card`) for hover, keyboard focus-within and the `lit` prop, which
 * drives the staggered chip glow (see CardStyles.ts). Tilt is skipped on touch /
 * no-hover devices, for keyboard focus and under prefers-reduced-motion.
 */
export function CardLiving({
  children,
  as: Tag = "article",
  max = 7,
  zoom = 1.06,
  shift = 8,
  lift = 6,
  lit = false,
  className = "",
  onPointerEnter,
  onPointerMove,
  onPointerLeave,
  onFocus,
  onBlur,
  ...rest
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const glare = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotionSafe();
  const reduceRef = useRef(reduce);
  const litRef = useRef(lit);
  const s = useRef<State>({
    tx: 0, ty: 0, ts: 1, tl: 0, cx: 0, cy: 0, cs: 1, cl: 0, px: 0.5, py: 0.3, rect: null, raf: 0, hover: false, focus: false,
  });

  const canTilt = () =>
    !reduceRef.current && typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const tick = () => {
    const st = s.current;
    const el = ref.current;
    if (!el) {
      st.raf = 0;
      return;
    }
    const k = 0.16; // critically-damped-ish easing per frame
    st.cx += (st.tx - st.cx) * k;
    st.cy += (st.ty - st.cy) * k;
    st.cs += (st.ts - st.cs) * k;
    st.cl += (st.tl - st.cl) * k;
    const settled =
      Math.abs(st.tx - st.cx) < 0.01 && Math.abs(st.ty - st.cy) < 0.01 && Math.abs(st.ts - st.cs) < 0.0005 && Math.abs(st.tl - st.cl) < 0.02;
    if (settled) {
      st.cx = st.tx;
      st.cy = st.ty;
      st.cs = st.ts;
      st.cl = st.tl;
    }
    const still = st.cx === 0 && st.cy === 0 && st.cl === 0;
    el.style.transform = still
      ? ""
      : `perspective(1000px) translate3d(0, ${(-st.cl).toFixed(2)}px, 0) rotateX(${st.cx.toFixed(3)}deg) rotateY(${st.cy.toFixed(3)}deg)`;
    const n = max || 1;
    el.style.setProperty("--img-x", `${((-st.cy / n) * shift).toFixed(2)}px`);
    el.style.setProperty("--img-y", `${((st.cx / n) * shift).toFixed(2)}px`);
    el.style.setProperty("--img-s", st.cs.toFixed(4));
    if (!reduceRef.current) {
      el.style.setProperty("--mx", `${(st.px * 100).toFixed(1)}%`);
      el.style.setProperty("--my", `${(st.py * 100).toFixed(1)}%`);
    }
    if (settled) {
      st.raf = 0;
      if (!st.hover) el.style.willChange = "";
    } else {
      st.raf = requestAnimationFrame(tick);
    }
  };
  const kick = () => {
    if (!s.current.raf) s.current.raf = requestAnimationFrame(tick);
  };

  const sync = () => {
    const st = s.current;
    const el = ref.current;
    if (!el) return;
    const on = st.hover || st.focus || litRef.current;
    if (on) el.dataset.lit = "true";
    else delete el.dataset.lit;
    const depth = !reduceRef.current && (st.hover || litRef.current);
    st.ts = depth ? zoom : 1;
    st.tl = !reduceRef.current && st.hover && canTilt() ? lift : 0;
    if (!st.hover || !canTilt()) {
      st.tx = 0;
      st.ty = 0;
    }
    kick();
  };

  useEffect(() => {
    litRef.current = lit;
    reduceRef.current = !!reduce;
    sync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lit, reduce]);

  useEffect(() => {
    const st = s.current;
    const stale = () => (st.rect = null);
    window.addEventListener("scroll", stale, { passive: true });
    window.addEventListener("resize", stale, { passive: true });
    return () => {
      window.removeEventListener("scroll", stale);
      window.removeEventListener("resize", stale);
      cancelAnimationFrame(st.raf);
    };
  }, []);

  const isMouse = (e: PointerEvent) => e.pointerType === "mouse" || e.pointerType === "pen";

  return (
    <Tag
      ref={ref as Ref<HTMLElement & HTMLDivElement>}
      className={`group/card relative ${className}`}
      onPointerEnter={(e) => {
        onPointerEnter?.(e);
        if (!isMouse(e)) return;
        const st = s.current;
        st.hover = true;
        st.rect = e.currentTarget.getBoundingClientRect();
        if (!reduceRef.current) e.currentTarget.style.willChange = "transform";
        // premium hover: a light sheen sweeps across the card once per entry (GSAP)
        if (!reduceRef.current && glare.current && finePointer()) {
          gsap.fromTo(glare.current, { xPercent: -160 }, { xPercent: 420, duration: 0.95, ease: "power2.out", overwrite: true });
        }
        sync();
      }}
      onPointerMove={(e) => {
        onPointerMove?.(e);
        if (!isMouse(e)) return;
        const st = s.current;
        if (!st.hover) return;
        if (!st.rect) st.rect = e.currentTarget.getBoundingClientRect();
        const r = st.rect;
        st.px = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
        st.py = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
        if (canTilt()) {
          st.ty = (st.px - 0.5) * max * 2;
          st.tx = (0.5 - st.py) * max * 2;
        }
        kick();
      }}
      onPointerLeave={(e) => {
        onPointerLeave?.(e);
        const st = s.current;
        st.hover = false;
        st.rect = null;
        sync();
      }}
      onFocus={(e) => {
        onFocus?.(e);
        s.current.focus = true;
        sync();
      }}
      onBlur={(e) => {
        onBlur?.(e);
        if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
        s.current.focus = false;
        sync();
      }}
      {...rest}
    >
      {children}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[2] overflow-hidden rounded-[inherit]">
        <div
          ref={glare}
          className="absolute inset-y-[-30%] left-0 w-1/3 -translate-x-[160%] skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/[0.07] to-transparent"
        />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] rounded-[inherit] opacity-0 transition-opacity duration-500 group-data-[lit=true]/card:opacity-100"
        style={{
          background: "radial-gradient(420px circle at var(--mx, 50%) var(--my, 30%), rgb(52 210 123 / 0.09), transparent 60%)",
        }}
      />
    </Tag>
  );
}
