"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import { SplitText, gsap, isSmall, reducedMotion, useGsap } from "@/lib/gsap";

/**
 * Scroll-triggered section header: label slides in, title words rise through a
 * mask, the accent rule draws, the intro settles. Children are tagged with
 * data-sh="label|title|rule|intro". Plays once, when the header reaches the
 * lower part of the viewport. Reduced motion: shown as-is.
 */
export function HeaderIntro({ children, className = "", as: Tag = "header" }: { children: ReactNode; className?: string; as?: "header" | "div" }) {
  const ref = useRef<HTMLElement>(null);

  useGsap(() => {
    const root = ref.current;
    if (!root) return;
    const label = root.querySelector<HTMLElement>('[data-sh="label"]');
    const title = root.querySelector<HTMLElement>('[data-sh="title"]');
    const rule = root.querySelector<HTMLElement>('[data-sh="rule"]');
    const intros = root.querySelectorAll<HTMLElement>('[data-sh="intro"]');

    if (reducedMotion()) {
      gsap.set(root, { visibility: "visible" });
      return;
    }
    const small = isSmall();
    const split = title ? new SplitText(title, { type: "words", mask: "words" }) : null;

    if (label) gsap.set(label, { opacity: 0, x: -14 });
    if (split) gsap.set(split.words, { yPercent: 110 });
    if (rule) gsap.set(rule, { scaleX: 0, transformOrigin: "left center" });
    if (intros.length) gsap.set(intros, { opacity: 0, y: 12 });
    gsap.set(root, { visibility: "visible" });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: root, start: "top 88%", once: true },
      defaults: { ease: "power4.out" },
    });
    if (label) tl.to(label, { opacity: 1, x: 0, duration: 0.6 });
    if (split) {
      tl.to(split.words, { yPercent: 0, duration: small ? 0.6 : 0.8, stagger: 0.05, onComplete: () => split.revert() }, "-=0.4");
    }
    if (rule) tl.to(rule, { scaleX: 1, duration: 0.7, ease: "power3.inOut" }, "-=0.5");
    if (intros.length) tl.to(intros, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 }, "-=0.5");
  });

  return (
    <Tag ref={ref as never} className={`hero-pending ${className}`} style={{ visibility: "hidden" }}>
      {children}
    </Tag>
  );
}
