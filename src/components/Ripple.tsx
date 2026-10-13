"use client";

import { useEffect } from "react";

/* Global, decorative click ripple for buttons and chips.
   One delegated pointerdown listener on document; the ripple is a span animated
   with the Web Animations API (no CSS needed). The target only gets
   position:relative / overflow:hidden / isolation:isolate while a ripple is alive, and its original
   inline styles are restored afterwards. Disabled entirely on reduced motion. */

const SELECTOR = ".btn-primary, .btn-ghost, .chip, button";

type Saved = { position: string; overflow: string; isolation: string; count: number };
const active = new WeakMap<HTMLElement, Saved>();

export function ButtonRipple() {
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const onDown = (e: PointerEvent) => {
      if (mq.matches || e.button > 0) return;
      const start = e.target instanceof Element ? e.target : null;
      const el = start?.closest<HTMLElement>(SELECTOR);
      if (!el || el.matches(":disabled, [aria-disabled='true']")) return;
      if (typeof el.animate !== "function") return;

      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // Radius that reaches the farthest corner from the press point.
      const radius = Math.hypot(Math.max(x, rect.width - x), Math.max(y, rect.height - y));

      // Temporarily make the element a clipping containing block.
      let saved = active.get(el);
      if (!saved) {
        saved = { position: el.style.position, overflow: el.style.overflow, isolation: el.style.isolation, count: 0 };
        active.set(el, saved);
        const cs = getComputedStyle(el);
        if (cs.position === "static") el.style.position = "relative";
        if (cs.overflow === "visible") el.style.overflow = "hidden";
        // Own stacking context so the ripple (z-index -1) sits above the
        // element's background but beneath its text and icons.
        el.style.isolation = "isolate";
      }
      saved.count++;

      const primary = el.classList.contains("btn-primary");
      const span = document.createElement("span");
      span.setAttribute("aria-hidden", "true");
      Object.assign(span.style, {
        position: "absolute",
        left: `${x - radius}px`,
        top: `${y - radius}px`,
        width: `${radius * 2}px`,
        height: `${radius * 2}px`,
        borderRadius: "9999px",
        pointerEvents: "none",
        background: primary
          ? "radial-gradient(circle, rgba(134,255,184,0.7) 0%, rgba(134,255,184,0.35) 65%, rgba(134,255,184,0) 100%)"
          : "radial-gradient(circle, rgba(52,210,123,0.32) 0%, rgba(52,210,123,0.14) 65%, rgba(52,210,123,0) 100%)",
        zIndex: "-1",
      } satisfies Partial<CSSStyleDeclaration>);
      el.insertBefore(span, el.firstChild);

      const cleanup = () => {
        span.remove();
        const s = active.get(el);
        if (s && --s.count <= 0) {
          el.style.position = s.position;
          el.style.overflow = s.overflow;
          el.style.isolation = s.isolation;
          active.delete(el);
        }
      };
      const anim = span.animate(
        [
          { transform: "scale(0)", opacity: 1 },
          { transform: "scale(1)", opacity: 0.85, offset: 0.6 },
          { transform: "scale(1.05)", opacity: 0 },
        ],
        { duration: 650, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
      );
      anim.onfinish = cleanup;
      anim.oncancel = cleanup;
    };

    document.addEventListener("pointerdown", onDown, { passive: true });
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);

  return null;
}
