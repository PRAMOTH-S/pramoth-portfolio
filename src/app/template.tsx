"use client";

import { useRef, type ReactNode } from "react";
import { gsap, reducedMotion, useGsap } from "@/lib/gsap";
import { isVeilCovering, uncover } from "@/components/gsap/PageTransition";

// Route transition (GSAP). Remounts on every navigation (Next.js template
// semantics): if the page veil is covering the screen (link intercepted by
// PageTransition) it wipes away upward while the content settles in; otherwise
// (first load, back/forward) the content simply fades up.
export default function Template({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGsap(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return;
    const covered = isVeilCovering();
    gsap.set(el, { opacity: 0, y: covered ? 24 : 12 });
    const show = () =>
      gsap.to(el, { opacity: 1, y: 0, duration: covered ? 0.6 : 0.4, ease: "power3.out", clearProps: "transform,opacity", delay: covered ? 0.15 : 0 });
    if (covered) {
      // let the new route paint under the veil, then wipe it off
      requestAnimationFrame(() => uncover());
      show();
    } else {
      show();
    }
  });

  return <div ref={ref}>{children}</div>;
}
