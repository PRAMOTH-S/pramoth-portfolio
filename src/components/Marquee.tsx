"use client";

// Infinite tech strip driven by GSAP: constant drift that speeds up (and
// reverses) with scroll velocity, slows to a halt on hover, and pops each logo
// when the pointer passes over it. Pure CSS fallback under reduced motion.
import Image from "next/image";
import { useRef } from "react";
import { techIcon } from "@/lib/techIcons";
import { ScrollTrigger, finePointer, gsap, reducedMotion, useGsap } from "@/lib/gsap";

const ITEMS = [
  "ROS 2 Jazzy", "Nav2", "SLAM Toolbox", "URDF", "micro-ROS", "ESP32", "Raspberry Pi 5",
  "PyTorch", "YOLO", "OpenCV", "ONNX", "C++", "Python", "Gazebo", "RViz",
  "Fusion 360", "SolidWorks", "Docker", "Linux", "Behavior Trees", "LiDAR",
] as const;

function Strip() {
  return (
    <ul className="flex shrink-0 items-center" aria-hidden>
      {ITEMS.map((t) => {
        const icon = techIcon(t);
        return (
          <li key={t} className="flex items-center">
            <span data-logo className="flex items-center gap-2.5 whitespace-nowrap px-6 font-mono text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:text-accent md:px-8 md:text-sm">
              {icon && <Image src={icon} alt="" width={16} height={16} className="opacity-80" />}
              {t}
            </span>
            <span className="h-1 w-1 rounded-full bg-accent/50" />
          </li>
        );
      })}
    </ul>
  );
}

export function TechMarquee() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGsap(() => {
    const el = track.current;
    const box = root.current;
    if (!el || !box || reducedMotion()) return;

    // Base drift: one strip width per 36s (two copies → -50% is seamless).
    const drift = gsap.to(el, { xPercent: -50, duration: 36, ease: "none", repeat: -1 });
    let target = 1; // desired timeScale (1 = base, >1 faster, <0 reversed)
    let hover = false;
    let current = 1;

    // Scroll velocity bends the speed: fast scroll → up to 4×, scrolling up reverses.
    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        const v = self.getVelocity(); // px/s
        const mag = Math.min(3, Math.abs(v) / 900);
        target = (v < 0 ? -1 : 1) * (1 + mag);
      },
    });
    const tick = () => {
      const goal = hover ? 0 : target;
      current += (goal - current) * 0.08;
      if (!hover && Math.abs(target) > 1) target += (Math.sign(target) - target) * 0.05; // decay back to base speed
      drift.timeScale(current);
    };
    gsap.ticker.add(tick);

    const enter = () => { hover = true; };
    const leave = () => { hover = false; };
    box.addEventListener("pointerenter", enter);
    box.addEventListener("pointerleave", leave);

    // Logo pop on hover (fine pointers only).
    const over = (e: PointerEvent) => {
      if (!finePointer()) return;
      const item = (e.target as Element).closest("[data-logo]");
      const img = item?.querySelector("img");
      if (!img) return;
      gsap.to(img, { scale: 1.45, rotate: -12, duration: 0.35, ease: "back.out(3)", overwrite: true });
    };
    const out = (e: PointerEvent) => {
      const item = (e.target as Element).closest("[data-logo]");
      const img = item?.querySelector("img");
      if (!img || item?.contains(e.relatedTarget as Node | null)) return;
      gsap.to(img, { scale: 1, rotate: 0, duration: 0.5, ease: "power3.out", overwrite: true });
    };
    box.addEventListener("pointerover", over);
    box.addEventListener("pointerout", out);

    return () => {
      gsap.ticker.remove(tick);
      st.kill();
      box.removeEventListener("pointerenter", enter);
      box.removeEventListener("pointerleave", leave);
      box.removeEventListener("pointerover", over);
      box.removeEventListener("pointerout", out);
    };
  });

  return (
    <div
      ref={root}
      className="group relative overflow-hidden border-y border-line bg-surface/50 py-4"
      role="marquee"
      aria-label="Technologies: ROS 2, Nav2, SLAM Toolbox, URDF, micro-ROS, ESP32, Raspberry Pi 5, PyTorch, YOLO, OpenCV, ONNX, C++, Python, Gazebo, RViz, Fusion 360, SolidWorks, Docker, Linux, Behavior Trees, LiDAR"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-bg to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-bg to-transparent"
      />
      {/* reduced motion: the CSS keyframe keeps it drifting gently (GSAP skipped) */}
      <div ref={track} className="flex w-max will-change-transform motion-reduce:animate-marquee">
        <Strip />
        <Strip />
      </div>
    </div>
  );
}
