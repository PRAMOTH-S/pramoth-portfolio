"use client";

import { useRef } from "react";
import { gsap, isSmall, reducedMotion, useGsap } from "@/lib/gsap";

/**
 * Section transition: as a section scrolls in, an accent line draws along its
 * top edge (then fades back to the plain border) while the content settles up a
 * few pixels. Dropped inside <Section>; it finds its own parent. Plays once.
 */
export function SectionEnter() {
  const ref = useRef<HTMLSpanElement>(null);

  useGsap(() => {
    const line = ref.current;
    const section = line?.closest("section");
    if (!line || !section || reducedMotion()) return;
    const container = section.querySelector<HTMLElement>(":scope > .container");

    gsap.set(line, { scaleX: 0, transformOrigin: "left center" });
    const tl = gsap.timeline({ scrollTrigger: { trigger: section, start: "top 85%", once: true } });
    tl.to(line, { scaleX: 1, duration: 1.1, ease: "power3.inOut" }).to(line, { opacity: 0, duration: 0.7, ease: "power2.out" }, "-=0.15");
    if (container) {
      tl.from(container, { y: isSmall() ? 18 : 36, duration: 1.1, ease: "power3.out", clearProps: "transform" }, 0);
    }
  });

  return (
    <span
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-[-1px] z-10 h-px bg-gradient-to-r from-accent via-neon to-accent/0 shadow-[0_0_10px_rgb(52_210_123/0.5)]"
    />
  );
}
