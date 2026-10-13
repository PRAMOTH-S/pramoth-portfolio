"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";

/**
 * Keeps ScrollTrigger measurements honest on this page:
 *  - sections use `content-visibility: auto`, so their height can change the
 *    first time they are rendered → re-measure on any body resize (debounced);
 *  - web fonts swapping in shift text heights → refresh once fonts are ready.
 * Mounted once in the root layout; owns no visuals.
 */
export function GsapSetup() {
  useEffect(() => {
    let t = 0;
    const refresh = () => {
      window.clearTimeout(t);
      t = window.setTimeout(() => ScrollTrigger.refresh(), 160);
    };
    const ro = new ResizeObserver(refresh);
    ro.observe(document.body);
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);
    return () => {
      window.clearTimeout(t);
      ro.disconnect();
      window.removeEventListener("load", refresh);
    };
  }, []);
  return null;
}
