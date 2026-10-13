"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode, type RefObject } from "react";
import { useReducedMotionSafe } from "@/components/Effects";

/* ──────────────────────────────────────────────────────────────────────────
   Shared drill-down shell for Skills, Certifications and Internships:
   show a compact overview, open one item at a time inside a fixed panel
   (height animates, page never grows into a wall), Back / Esc go up a level,
   focus follows the visitor, and every view has a shareable #hash.
   ────────────────────────────────────────────────────────────────────────── */

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export { slug } from "@/lib/slug";

export type Drill<V> = {
  view: V;
  go: (next: V) => void;
  rootRef: RefObject<HTMLDivElement | null>;
  userNav: RefObject<boolean>;
};

/** View state mirrored to the URL hash (replaceState, so Back leaves the page as normal). */
export function useDrill<V>(initial: V, toHash: (v: V) => string, fromHash: (hash: string) => V | undefined): Drill<V> {
  const reduce = useReducedMotionSafe();
  const [view, setView] = useState<V>(initial);
  const rootRef = useRef<HTMLDivElement>(null);
  const userNav = useRef(false);
  const fromHashRef = useRef(fromHash);
  fromHashRef.current = fromHash;

  const go = useCallback(
    (next: V) => {
      userNav.current = true;
      setView(next);
      const hash = toHash(next);
      if (location.hash !== hash) history.replaceState(null, "", hash);
      // keep the panel's top in view when the visitor drilled in from further down
      const top = rootRef.current?.getBoundingClientRect().top ?? 0;
      if (top < 0) rootRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    },
    [reduce, toHash],
  );

  // open a deep link on load and on back/forward or in-page links
  useEffect(() => {
    const read = () => {
      const v = fromHashRef.current(location.hash);
      if (v === undefined) return;
      setView(v);
      requestAnimationFrame(() => rootRef.current?.scrollIntoView({ block: "start" }));
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  return { view, go, rootRef, userNav };
}

/** One animated view; moves focus to its [data-view-title] once mounted after a visitor action. */
function Pane({ userNav, children }: { userNav: RefObject<boolean>; children: ReactNode }) {
  const reduce = useReducedMotionSafe();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (userNav.current) ref.current?.querySelector<HTMLElement>("[data-view-title]")?.focus({ preventScroll: true });
  }, [userNav]);
  const m = reduce
    ? { initial: false as const, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0 } }
    : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -6 }, transition: { duration: 0.24, ease: EASE } };
  return (
    <motion.div ref={ref} {...m}>
      {children}
    </motion.div>
  );
}

export function DrillFrame<V>({
  drill,
  viewKey,
  onEscape,
  top,
  footer,
  children,
}: {
  drill: Drill<V>;
  viewKey: string;
  /** go up one level; omit at the top level */
  onEscape?: () => void;
  /** above the panel (filter pills) */
  top?: ReactNode;
  /** inside the panel, under every view */
  footer?: ReactNode;
  children: ReactNode;
}) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);

  // animate the panel height between views instead of letting the page jump
  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setHeight(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape" && onEscape) {
      e.preventDefault();
      onEscape();
    }
  };

  return (
    <div ref={drill.rootRef} className="scroll-mt-24" onKeyDown={onKey}>
      {top}
      <div className="panel relative overflow-hidden transition-[height] duration-300 ease-out motion-reduce:transition-none" style={{ height }}>
        <div ref={innerRef} className="p-4 sm:p-6">
          <AnimatePresence mode="wait" initial={false}>
            <Pane key={viewKey} userNav={drill.userNav}>
              {children}
            </Pane>
          </AnimatePresence>
          {footer}
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────── small parts ───────────────────────────── */

export const TITLE_FOCUS = "outline-none focus-visible:ring-0 focus-visible:ring-offset-0";

export function BackButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-line px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:border-accent/50 hover:text-accent"
    >
      <ArrowLeft size={13} aria-hidden /> {label}
    </button>
  );
}

export function FilterPills({
  label,
  items,
  active,
  onPick,
}: {
  label: string;
  items: { id: string; label: string; count?: number }[];
  active: string;
  onPick: (id: string) => void;
}) {
  return (
    <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label={label}>
      {items.map((c) => {
        const on = active === c.id;
        return (
          <button
            key={c.id || "all"}
            type="button"
            aria-pressed={on}
            onClick={() => onPick(c.id)}
            className={`min-h-9 rounded-md border px-3 py-1.5 font-mono text-xs transition-colors ${
              on ? "border-accent bg-accent-deep text-accent" : "border-line text-muted hover:border-line-strong hover:text-ink"
            }`}
          >
            {c.label}
            {c.count !== undefined && <span className={on ? "text-neon" : "text-dim"}> {c.count}</span>}
          </button>
        );
      })}
    </div>
  );
}

export function PrevNext({ index, total, onPrev, onNext, prevLabel, nextLabel }: { index: number; total: number; onPrev: () => void; onNext: () => void; prevLabel: string; nextLabel: string }) {
  const btn = "grid h-9 w-9 place-items-center rounded-md border border-line text-muted transition-colors hover:border-accent/50 hover:text-accent";
  return (
    <div className="flex items-center gap-1" role="group" aria-label="Browse">
      <button type="button" onClick={onPrev} aria-label={`Previous: ${prevLabel}`} className={btn}>
        <ChevronLeft size={16} aria-hidden />
      </button>
      <span className="px-1.5 font-mono text-[11px] text-dim">
        {index + 1} / {total}
      </span>
      <button type="button" onClick={onNext} aria-label={`Next: ${nextLabel}`} className={btn}>
        <ChevronRight size={16} aria-hidden />
      </button>
    </div>
  );
}
