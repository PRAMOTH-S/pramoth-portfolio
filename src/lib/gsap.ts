"use client";

/**
 * Single GSAP entry point: registers the plugins once, exposes a React hook that
 * scopes every tween/ScrollTrigger to a component (and reverts them on unmount),
 * and a few helpers shared by the animation components.
 *
 * Framer Motion stays for the pieces it already powers (Reveal, cursor, orbit,
 * mobile menu…); GSAP owns the new cinematic/scroll layer. The two never touch
 * the same element, so there is no fight over inline transforms.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Flip } from "gsap/Flip";
import { useLayoutEffect, useEffect, type DependencyList } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, Flip);
  ScrollTrigger.config({ ignoreMobileResize: true });
  gsap.defaults({ ease: "power3.out", duration: 0.7 });
}

export { gsap, ScrollTrigger, SplitText, Flip };

/** Cinematic settle shared with the Framer side: [0.22, 1, 0.36, 1]. */
export const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

export const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** True when the OS asks for less motion. Read at run time (client only). */
export const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Phones / small screens get lighter variants (no 3D, shorter travel). */
export const isSmall = () => typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;

/** Fine pointer = mouse / trackpad; hover effects are skipped on touch. */
export const finePointer = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/**
 * Run `fn` inside a gsap.context scoped to the component. Everything created in
 * it (tweens, ScrollTriggers, SplitTexts) is reverted on cleanup. `fn` may return
 * its own cleanup. Runs in a layout effect so initial states land before paint.
 */
export function useGsap(fn: (ctx: gsap.Context) => void | (() => void), deps: DependencyList = []) {
  useIsoLayoutEffect(() => {
    let cleanup: void | (() => void);
    const ctx = gsap.context((self) => {
      cleanup = fn(self);
    });
    return () => {
      cleanup?.();
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * Seconds to wait before the hero may animate, so it starts as the boot overlay
 * wipes away (see BootIntro). 0 when the intro is not running.
 */
export function bootDelay() {
  const veil = typeof document !== "undefined" ? document.getElementById("boot-veil") : null;
  const state = veil?.getAttribute("data-boot");
  if (state === "run") {
    const t0 = parseFloat(veil?.getAttribute("data-boot-t0") || "0");
    const elapsed = t0 ? (performance.now() - t0) / 1000 : 0;
    return Math.max(0, 1.0 - elapsed);
  }
  if (state === "skip") return 0.1;
  return 0;
}
