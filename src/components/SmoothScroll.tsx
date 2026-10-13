"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotionSafe } from "@/components/Effects";
import { ScrollTrigger } from "@/lib/gsap";

/** Clearance below the fixed navbar when an in-page anchor is followed. */
const NAV_OFFSET = 96;

/* ─────────── Inertial wheel scrolling (desktop, fine pointer only) ───────────
   Lenis only smooths mouse-wheel / trackpad input; it never pins or hijacks
   scroll and leaves touch, keyboard, scrollbar and programmatic scrolling native.
   Native scrolls (scrollIntoView, window.scrollTo, hash jumps) are picked up by
   Lenis' own scroll listener and by the sync check in our single rAF loop. */
export function SmoothScroll() {
  const reduce = useReducedMotionSafe();

  useEffect(() => {
    if (reduce) return;
    if (!window.matchMedia("(pointer: fine)").matches) return; // touch keeps native scrolling
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    const prevBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto"; // Lenis animates; CSS smooth would double-ease

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: false,
      allowNestedScroll: true, // inner scrollers (overflow-x-auto strips, panels) scroll natively
      anchors: false, // handled below with the navbar offset
      autoResize: true,
    });

    // GSAP ScrollTrigger reads the same native scroll position; nudge it per Lenis frame.
    lenis.on("scroll", ScrollTrigger.update);

    // One rAF loop: drive Lenis and keep it in sync with native programmatic scrolls.
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      // A native scroll can land while Lenis ignores scroll events (the frame right
      // after it settles); re-align so the next wheel tick starts from the real spot.
      if (lenis.isScrolling === false && Math.abs(lenis.animatedScroll - lenis.actualScroll) > 1) {
        lenis.animatedScroll = lenis.targetScroll = lenis.actualScroll;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // Any click / key press stops leftover wheel inertia, so component code that calls
    // scrollIntoView / window.scrollTo in that handler is never overridden by Lenis.
    const halt = () => {
      if (lenis.isScrolling === "smooth" && !lenis.isStopped) {
        lenis.stop(); // stop() + start() = public reset: animation dropped, synced to native position
        lenis.start();
      }
    };

    // Same-page anchors (#projects, /#skills …) → smooth scroll with navbar offset.
    let pending = 0;
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (e.detail === 0) return; // keyboard activation: native jump keeps focus semantics
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (!(a instanceof HTMLAnchorElement) || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search) return;
      if (!url.hash || url.hash.includes("/")) return; // deep links (#skills/…) stay with their components
      const id = decodeURIComponent(url.hash.slice(1));
      const el = document.getElementById(id);
      // only page sections + skip target; #project-… uses :target styling and its own handler
      if (!el || !(el.tagName === "SECTION" || el.tagName === "MAIN")) return;

      e.preventDefault();
      if (location.hash !== url.hash) {
        const oldURL = location.href;
        history.pushState(null, "", url.hash);
        window.dispatchEvent(new HashChangeEvent("hashchange", { oldURL, newURL: location.href }));
      }

      const pad = parseFloat(getComputedStyle(root).scrollPaddingTop) || 0; // Lenis subtracts this itself
      const offset = -Math.max(0, NAV_OFFSET - pad);
      let corrections = 0;
      const go = () =>
        lenis.scrollTo(el, {
          offset,
          force: true,
          duration: corrections ? 0.45 : 1.1,
          easing: (t) => 1 - Math.pow(1 - t, 4),
          onComplete: () => {
            // content-visibility sections can change height mid-flight; settle on the real spot
            const delta = el.getBoundingClientRect().top - (pad - offset);
            if (Math.abs(delta) > 2 && corrections++ < 2 && lenis.actualScroll < lenis.limit - 1) go();
          },
        });

      // the mobile menu locks scrolling (Lenis stopped) until it closes; wait a few frames
      let tries = 0;
      cancelAnimationFrame(pending);
      const run = () => {
        if (lenis.isStopped && tries++ < 20) pending = requestAnimationFrame(run);
        else go();
      };
      run();
    };

    // Mirror the navbar's body scroll lock (mobile menu) so wheel input is ignored while open.
    const syncLock = () => {
      if (document.body.style.overflow === "hidden") lenis.stop();
      else lenis.start();
    };
    const mo = new MutationObserver(syncLock);
    mo.observe(document.body, { attributes: true, attributeFilter: ["style"] });
    syncLock();

    // Back/forward and in-page hash links jump natively; re-measure and adopt that position.
    const onHash = () => {
      if (lenis.isScrolling !== "smooth") lenis.resize();
    };

    window.addEventListener("pointerdown", halt, { capture: true, passive: true });
    window.addEventListener("keydown", halt, { capture: true });
    document.addEventListener("click", onClick);
    window.addEventListener("hashchange", onHash);

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(pending);
      mo.disconnect();
      window.removeEventListener("pointerdown", halt, { capture: true });
      window.removeEventListener("keydown", halt, { capture: true });
      document.removeEventListener("click", onClick);
      window.removeEventListener("hashchange", onHash);
      lenis.destroy();
      root.style.scrollBehavior = prevBehavior;
    };
  }, [reduce]);

  // Native anchor jumps (touch, or whenever Lenis is off): sections that haven't been
  // rendered yet (content-visibility: auto) change height mid-scroll, so the jump lands
  // short. Once the scroll settles, re-aim at the section (scroll-padding gives the offset).
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (!(a instanceof HTMLAnchorElement) || (a.target && a.target !== "_self")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash || url.hash.includes("/")) return;
      const el = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!el || !(el.tagName === "SECTION" || el.tagName === "MAIN")) return;
      setTimeout(() => {
        if (e.defaultPrevented) return; // Lenis took it and corrects itself
        let tries = 0;
        const settle = () => {
          const pad = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
          const delta = el.getBoundingClientRect().top - pad;
          const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
          if (Math.abs(delta) > 4 && !atBottom && tries++ < 3) {
            el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
            wait();
          }
        };
        const wait = () => {
          let done = false;
          const fire = () => {
            if (done) return;
            done = true;
            window.removeEventListener("scrollend", fire);
            settle();
          };
          window.addEventListener("scrollend", fire, { once: true });
          setTimeout(fire, 1200); // browsers without scrollend
        };
        wait();
      }, 0);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [reduce]);

  return null;
}

/* ─────────── Section depth layer: faint dot grid + glow drifting slower than content ─────────── */

export function SectionDepth() {
  const reduce = useReducedMotionSafe();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-32, 32]);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        style={reduce ? undefined : { y }}
        className="absolute inset-x-0 -inset-y-10 will-change-transform"
      >
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage: "radial-gradient(rgb(134 255 184 / 0.07) 1px, transparent 1.4px)",
            backgroundSize: "28px 28px",
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, #000 30%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, #000 30%, transparent 80%)",
          }}
        />
        <div className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-accent/[0.045] blur-3xl md:h-96 md:w-96" />
      </motion.div>
    </div>
  );
}

/* ─────────── Accent rule drawn under a section title as it enters view ─────────── */

export function HeaderRule() {
  const reduce = useReducedMotionSafe();
  return (
    <motion.span
      aria-hidden
      className="mt-4 block h-[2px] w-24 origin-left rounded-full bg-gradient-to-r from-accent via-neon to-accent/0 shadow-[0_0_12px_rgb(52_210_123/0.45)]"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={reduce ? { duration: 0 } : { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
    />
  );
}
