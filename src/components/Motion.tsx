"use client";

import { MotionConfig, motion } from "framer-motion";
import type { ReactNode } from "react";

/** Wraps the app so Framer Motion honours the OS "reduce motion" setting. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const variants = {
  hidden: { opacity: 0, y: 16 },
  shown: { opacity: 1, y: 0 },
};

// Cards/sections settle from 0.97 → 1 — "cinematic precision", not bounce.
const zoomVariants = {
  hidden: { opacity: 0, y: 14, scale: 0.97 },
  shown: { opacity: 1, y: 0, scale: 1 },
};

/** Fades content up once when it scrolls into view. Use as="li" inside lists.
 *  `zoom` adds a subtle 0.97 → 1 scale settle for cards. */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
  zoom = false,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li";
  zoom?: boolean;
}) {
  const props = {
    initial: "hidden" as const,
    whileInView: "shown" as const,
    viewport: { once: true, margin: "-60px" as const },
    variants: zoom ? zoomVariants : variants,
    transition: { duration: 0.55, delay, ease: EASE },
    className,
  };
  return as === "li" ? <motion.li {...props}>{children}</motion.li> : <motion.div {...props}>{children}</motion.div>;
}
