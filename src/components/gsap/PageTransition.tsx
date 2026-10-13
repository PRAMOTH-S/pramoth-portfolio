"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { gsap, reducedMotion } from "@/lib/gsap";

/**
 * Route transitions (GSAP). Internal links to another page are intercepted: a
 * dark veil rises from the bottom (with a thin accent edge), the new route is
 * pushed behind it, and the remounted template (template.tsx) wipes the veil
 * away while the new content settles in. Hash-only links, external links,
 * downloads, new-tab and modified clicks are left alone. A safety timer clears
 * the veil if the navigation never lands. Reduced motion: plain navigation.
 */
let covering = false;
let safety = 0;

export function isVeilCovering() {
  return covering;
}

export function uncover(onDone?: () => void) {
  const veil = document.getElementById("page-veil");
  window.clearTimeout(safety);
  covering = false;
  if (!veil) return onDone?.();
  gsap.to(veil, { scaleY: 0, transformOrigin: "top center", duration: 0.55, ease: "power3.inOut", onComplete: onDone });
}

export function PageTransition() {
  const router = useRouter();

  useEffect(() => {
    if (reducedMotion()) return;
    const veil = document.getElementById("page-veil");
    if (!veil) return;

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (!(a instanceof HTMLAnchorElement)) return;
      if ((a.target && a.target !== "_self") || a.hasAttribute("download") || a.hasAttribute("data-no-transition")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.search === location.search) return; // same page (hash / Lenis)
      if (covering) { e.preventDefault(); return; }

      e.preventDefault();
      covering = true;
      const href = url.pathname + url.search + url.hash;
      router.prefetch(href);
      gsap.fromTo(
        veil,
        { scaleY: 0, transformOrigin: "bottom center" },
        {
          scaleY: 1,
          duration: 0.42,
          ease: "power3.in",
          onComplete: () => {
            router.push(href);
            // if the new template never mounts (e.g. navigation failed), reveal the page again
            safety = window.setTimeout(() => uncover(), 2500);
          },
        },
      );
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [router]);

  return (
    <div id="page-veil" aria-hidden className="pointer-events-none fixed inset-0 z-[95] origin-bottom scale-y-0 bg-bg">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-accent via-neon to-accent shadow-[0_0_16px_rgb(52_210_123/0.7)]" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-accent via-neon to-accent shadow-[0_0_16px_rgb(52_210_123/0.7)]" />
    </div>
  );
}
