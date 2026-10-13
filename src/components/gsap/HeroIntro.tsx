"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import { SplitText, bootDelay, gsap, isSmall, reducedMotion, useGsap } from "@/lib/gsap";

/**
 * Cinematic hero entrance (one GSAP timeline):
 *   name letters rise through a mask with a 3D tip-in →
 *   role line slides up → tagline words un-blur word by word →
 *   location line → CTA buttons cascade.
 * Children are tagged with data-hero="name|role|tagline|meta|cta". The wrapper
 * is server-rendered hidden (so nothing flashes before the timeline sets the
 * initial states) and made visible in a layout effect, before first paint.
 * Starts when the boot overlay wipes (bootDelay). Reduced motion: shown as-is.
 */
export function HeroIntro({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGsap(() => {
    const root = ref.current;
    if (!root) return;
    const q = (k: string) => root.querySelector<HTMLElement>(`[data-hero="${k}"]`);
    const name = q("name");
    const role = q("role");
    const tagline = q("tagline");
    const meta = q("meta");
    const ctas = root.querySelectorAll<HTMLElement>('[data-hero="cta"] > *');

    if (reducedMotion()) {
      gsap.set(root, { visibility: "visible" });
      return;
    }
    const small = isSmall();

    // Split the name into masked characters. background-clip:text misrenders
    // while its children are transformed, so the gradient classes come off the
    // parent for the duration and go back on when the split is reverted.
    const GRADIENT = ["text-gradient", "animate-shimmer"];
    name?.classList.remove(...GRADIENT);
    const nameSplit = name ? new SplitText(name, { type: "chars", mask: "chars", charsClass: "text-ink" }) : null;
    const restoreName = () => {
      nameSplit?.revert();
      name?.classList.add(...GRADIENT);
    };
    const tagSplit = tagline ? new SplitText(tagline, { type: "words", wordsClass: "inline-block" }) : null;

    if (name) gsap.set(name, { perspective: 600 });
    if (nameSplit) gsap.set(nameSplit.chars, { yPercent: 110, rotateX: small ? 0 : -70, opacity: 0, transformOrigin: "50% 100%" });
    if (role) gsap.set(role, { opacity: 0, y: 14 });
    if (tagSplit) gsap.set(tagSplit.words, { opacity: 0, y: 10, filter: small ? "none" : "blur(6px)" });
    if (meta) gsap.set(meta, { opacity: 0, y: 8 });
    if (ctas.length) gsap.set(ctas, { opacity: 0, y: 16, scale: 0.96 });
    gsap.set(root, { visibility: "visible" });

    const tl = gsap.timeline({ delay: bootDelay(), defaults: { ease: "power4.out" } });
    if (nameSplit) {
      tl.to(nameSplit.chars, {
        yPercent: 0,
        rotateX: 0,
        opacity: 1,
        duration: small ? 0.8 : 1.05,
        stagger: { each: 0.045, from: "start" },
        onComplete: restoreName,
      });
    }
    if (role) tl.to(role, { opacity: 1, y: 0, duration: 0.7 }, "-=0.55");
    if (tagSplit) {
      tl.to(tagSplit.words, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6, stagger: 0.028, onComplete: () => tagSplit.revert() }, "-=0.45");
    }
    if (meta) tl.to(meta, { opacity: 1, y: 0, duration: 0.5 }, "-=0.4");
    if (ctas.length) tl.to(ctas, { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.06, clearProps: "transform" }, "-=0.45");
    return () => name?.classList.add(...GRADIENT);
  });

  return (
    <div ref={ref} className={`hero-pending ${className}`} style={{ visibility: "hidden" }}>
      {children}
    </div>
  );
}
