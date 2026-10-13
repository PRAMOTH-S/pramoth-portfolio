"use client";

import { useEffect, type CSSProperties } from "react";

/**
 * Cinematic "robot boot" intro, shown once per browser session on the home page.
 *
 * How it works (no hydration mismatch, no flash for returning visitors):
 *  - The overlay markup is always server-rendered but is `display:none` by default.
 *  - A tiny inline script, which runs while the HTML is parsed (before the hero
 *    is painted and before React hydrates), sets `data-boot="run"` on #boot-veil
 *    only when: path is "/", no #hash, no reduced-motion, and the session flag is
 *    absent. All visuals (overlay, scan, typing, hero assembly) are CSS-timed
 *    in globals.css, so they finish even if JS dies mid-way.
 *  - Any key / pointer / wheel / touch (or the Skip button) switches to
 *    `data-boot="skip"`; the attribute is removed after ~2.3s, restoring
 *    everything to the static page (scroll lock lives only on the attribute).
 *  - The script only touches #boot-veil (marked suppressHydrationWarning),
 *    never <html>/<body>, so React hydration stays clean.
 */

const STORAGE_KEY = "pramoth-boot-v1";
const END_MS = 2300; // overlay gone at ~1.25s; hero stagger finished by ~2.0s
const SKIP_WINDOW_MS = 1250; // after the overlay is gone, input no longer "skips"

const BOOT_SCRIPT = `(function(){var v=document.getElementById("boot-veil");try{if(!v)return;if(location.pathname!=="/"||location.hash)return;if(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches)return;try{if(sessionStorage.getItem("${STORAGE_KEY}"))return;sessionStorage.setItem("${STORAGE_KEY}","1")}catch(e){}v.setAttribute("data-boot","run");v.setAttribute("data-boot-t0",String(performance.now()));var ev=["keydown","pointerdown","wheel","touchstart"],o={capture:true,passive:true},t1,t2;function off(){for(var i=0;i<ev.length;i++)removeEventListener(ev[i],skip,o)}function end(){off();clearTimeout(t1);clearTimeout(t2);v.removeAttribute("data-boot")}function skip(){if(v.getAttribute("data-boot")!=="run")return;off();clearTimeout(t1);clearTimeout(t2);v.setAttribute("data-boot","skip");t2=setTimeout(end,900)}for(var i=0;i<ev.length;i++)addEventListener(ev[i],skip,o);t1=setTimeout(off,${SKIP_WINDOW_MS});t2=setTimeout(end,${END_MS})}catch(e){if(v)v.removeAttribute("data-boot")}})();`;

const LINES = [
  { text: "INIT SENSORS", ok: "OK" },
  { text: "LIDAR /scan @ 10Hz", ok: "OK" },
  { text: "SLAM map_server", ok: "OK" },
  { text: "NAV2 lifecycle", ok: "READY" },
] as const;

export function BootIntro() {
  // Safety net: whatever happens to the inline timers, never leave the
  // intro attribute (and its scroll lock) behind once React is running.
  useEffect(() => {
    const veil = document.getElementById("boot-veil");
    if (!veil || !veil.hasAttribute("data-boot")) return;
    const t = window.setTimeout(() => veil.removeAttribute("data-boot"), END_MS + 700);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <>
      <div id="boot-veil" className="boot-veil" suppressHydrationWarning>
        <div className="boot-screen" role="presentation" aria-hidden="true">
          <div className="boot-grid" />
          <div className="boot-scan" />
          <div className="boot-panel">
            <p className="boot-head">
              <span className="boot-led" /> PRAMOTH-OS · cold boot
            </p>
            {LINES.map((l, i) => (
              <p key={l.text} className="boot-line" style={{ "--i": i, "--n": l.text.length } as CSSProperties}>
                <span className="boot-type">{l.text}</span>
                <span className="boot-dots"> … </span>
                <span className="boot-ok">{l.ok}</span>
              </p>
            ))}
            <div className="boot-bar">
              <span />
            </div>
            <p className="boot-online">
              SYSTEM ONLINE <span className="boot-sep">·</span> PRAMOTH S
            </p>
          </div>
        </div>
        <button type="button" className="boot-skip">
          Skip intro
        </button>
      </div>
      <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
    </>
  );
}
