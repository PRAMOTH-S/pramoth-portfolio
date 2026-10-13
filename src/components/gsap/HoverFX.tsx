"use client";

import { useEffect } from "react";
import { finePointer, gsap, reducedMotion } from "@/lib/gsap";

/**
 * Global premium hover layer (one delegated listener pair, fine pointers only):
 *  - .btn-primary / .btn-ghost: a light sheen sweeps across (CSS var tweened by GSAP);
 *  - .chip: lifts slightly and its logo does a quick spin;
 *  - [data-magnet]: the element follows the cursor a little and springs back.
 * Nothing here sets `transform` on buttons, so their CSS hover lift still works.
 */
export function HoverFX() {
  useEffect(() => {
    if (!finePointer() || reducedMotion()) return;

    const over = (e: PointerEvent) => {
      const t = e.target as Element | null;
      if (!t?.closest) return;
      const btn = t.closest<HTMLElement>(".btn-primary, .btn-ghost");
      if (btn && !btn.contains(e.relatedTarget as Node | null)) {
        gsap.fromTo(btn, { "--sheen": "-180%" }, { "--sheen": "420%", duration: 0.8, ease: "power2.out", overwrite: true });
      }
      const chip = t.closest<HTMLElement>(".chip");
      if (chip && !chip.contains(e.relatedTarget as Node | null)) {
        gsap.to(chip, { y: -2, scale: 1.04, duration: 0.3, ease: "back.out(2.5)", overwrite: true });
        const img = chip.querySelector("img");
        if (img) gsap.fromTo(img, { rotate: 0 }, { rotate: 360, duration: 0.6, ease: "power2.inOut", overwrite: true });
      }
    };
    const out = (e: PointerEvent) => {
      const t = e.target as Element | null;
      const chip = t?.closest?.<HTMLElement>(".chip");
      if (chip && !chip.contains(e.relatedTarget as Node | null)) {
        gsap.to(chip, { y: 0, scale: 1, duration: 0.45, ease: "power3.out", overwrite: true, clearProps: "transform" });
      }
      const mag = t?.closest?.<HTMLElement>("[data-magnet]");
      if (mag && !mag.contains(e.relatedTarget as Node | null)) {
        gsap.to(mag, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.45)", overwrite: true });
      }
    };
    const move = (e: PointerEvent) => {
      const mag = (e.target as Element | null)?.closest?.<HTMLElement>("[data-magnet]");
      if (!mag) return;
      const r = mag.getBoundingClientRect();
      const k = parseFloat(mag.dataset.magnet || "") || 0.3;
      gsap.to(mag, {
        x: (e.clientX - (r.left + r.width / 2)) * k,
        y: (e.clientY - (r.top + r.height / 2)) * k,
        duration: 0.4,
        ease: "power3.out",
        overwrite: true,
      });
    };
    document.addEventListener("pointerover", over, { passive: true });
    document.addEventListener("pointerout", out, { passive: true });
    document.addEventListener("pointermove", move, { passive: true });
    return () => {
      document.removeEventListener("pointerover", over);
      document.removeEventListener("pointerout", out);
      document.removeEventListener("pointermove", move);
    };
  }, []);
  return null;
}
