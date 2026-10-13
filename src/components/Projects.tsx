"use client";

import { useEffect, useId, useMemo, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { ChevronDown, Github, Play } from "lucide-react";
import { Flip, ScrollTrigger, gsap, reducedMotion, useIsoLayoutEffect } from "@/lib/gsap";
import type { Category, ProjectCardData } from "@/data/projects";
import { Fill, TechChip } from "@/components/ui";
import { CardLiving } from "@/components/CardLiving";
import { CARD_CHIP_LIT, CARD_IMAGE_DEPTH } from "@/components/CardStyles";

const INITIAL_VISIBLE = 6;

export function ProjectCard({ p }: { p: ProjectCardData }) {
  // Touch quick-preview: reveals the full summary + lit chips (no-hover devices only).
  const [open, setOpen] = useState(false);
  const [fullH, setFullH] = useState(0);
  const summaryRef = useRef<HTMLParagraphElement>(null);
  const summaryId = `${useId()}-summary`;
  const toggle = () => {
    setFullH(summaryRef.current?.scrollHeight ?? 0);
    setOpen((v) => !v);
  };

  return (
    <CardLiving
      lit={open}
      onClick={(e) => {
        // Tapping the card body toggles the preview on touch; links/buttons keep their own behaviour.
        if (!window.matchMedia("(hover: none)").matches) return;
        if ((e.target as Element).closest("a, button")) return;
        toggle();
      }}
      className="panel flex h-full flex-col overflow-hidden transition-[border-color,box-shadow] duration-300 data-[lit=true]:border-accent/50 data-[lit=true]:shadow-[0_16px_40px_rgb(0_0_0/0.4),0_0_24px_rgb(52_210_123/0.08)]"
    >
      {p.image && (
        <div className="relative aspect-video overflow-hidden border-b border-line">
          <Image
            src={p.image}
            alt={p.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`object-cover ${CARD_IMAGE_DEPTH}`}
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-surface/70 via-transparent to-transparent" />
          <span className="label absolute bottom-2.5 left-4 text-accent [text-shadow:0_1px_6px_rgb(0_0_0/0.8)]">{p.category}</span>
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
      <h3 className="font-display text-lg font-semibold text-ink">{p.title}</h3>
      <p
        ref={summaryRef}
        id={summaryId}
        style={{ "--sum-h": open && fullH ? `${fullH}px` : "4.875em" } as CSSProperties}
        className="mt-2 text-sm leading-relaxed text-muted [@media(hover:none)]:max-h-[var(--sum-h)] [@media(hover:none)]:overflow-hidden [@media(hover:none)]:transition-[max-height] [@media(hover:none)]:duration-300 [@media(hover:none)]:ease-out motion-reduce:!transition-none"
      >
        <Fill>{p.summary}</Fill>
      </p>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={summaryId}
        onClick={toggle}
        className="-ml-1 mt-1 hidden min-h-10 items-center gap-1 self-start rounded-md px-1 font-mono text-xs text-accent [@media(hover:none)]:inline-flex"
      >
        Preview
        <ChevronDown aria-hidden size={14} className={`transition-transform duration-300 motion-reduce:transition-none ${open ? "rotate-180" : ""}`} />
      </button>
      <div className="mt-auto flex items-end justify-between gap-3 pt-4">
        <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
          {p.tech.filter((t) => !t.includes("[")).slice(0, 3).map((t, i) => (
            <li key={t} className={CARD_CHIP_LIT} style={{ "--i": i } as CSSProperties}><TechChip label={t} /></li>
          ))}
        </ul>
        <span className="flex shrink-0 items-center gap-4">
          {p.demo && (
            <a
              href={p.demo}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-7 items-center gap-1.5 text-sm text-accent transition-colors hover:text-neon"
              aria-label={`${p.title} video demo`}
            >
              <Play size={15} /> Demo
            </a>
          )}
          {p.repo && (
            <a
              href={p.repo}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-7 items-center gap-1.5 text-sm text-muted transition-colors hover:text-accent"
              aria-label={`${p.title} source code on GitHub`}
            >
              <Github size={15} /> Code
            </a>
          )}
        </span>
      </div>
      </div>
    </CardLiving>
  );
}

export function ProjectsExplorer({ projects, categories }: { projects: ProjectCardData[]; categories: Category[] }) {
  const used = categories.filter((c) => projects.some((p) => p.category === c));
  const [filter, setFilter] = useState<Category | "All">("All");
  const [expanded, setExpanded] = useState(false);
  const list = useMemo(() => (filter === "All" ? projects : projects.filter((p) => p.category === filter)), [filter, projects]);
  // Keep the page short: "All" is capped until expanded; a chosen category shows everything.
  const visible = filter === "All" && !expanded ? list.slice(0, INITIAL_VISIBLE) : list;

  // GSAP Flip: cards glide to their new grid slots when the filter / "view all"
  // changes; newcomers fade-scale in. First appearance is scroll-triggered.
  const listRef = useRef<HTMLUListElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const change = (apply: () => void) => {
    if (listRef.current && !reducedMotion()) flipState.current = Flip.getState(listRef.current.querySelectorAll("[data-flip-id]"));
    apply();
  };
  useIsoLayoutEffect(() => {
    const ul = listRef.current;
    if (!ul || reducedMotion()) return;
    const items = Array.from(ul.querySelectorAll<HTMLElement>("[data-flip-id]"));
    const mark = (els: Element[]) => els.forEach((el) => ((el as HTMLElement).dataset.shown = "1"));
    const state = flipState.current;
    flipState.current = null;
    if (state) {
      Flip.from(state, {
        targets: items,
        duration: 0.55,
        ease: "power3.inOut",
        onEnter: (els) => {
          mark(els);
          return gsap.fromTo(els, { opacity: 0, y: 18, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.05, ease: "power3.out", clearProps: "transform" });
        },
      });
    }
    // Cards not yet scrolled into view stay hidden until they are; their triggers
    // are rebuilt on every list change (the previous ones are killed below).
    const pending = items.filter((el) => !el.dataset.shown);
    if (!pending.length) return;
    const untouched = pending.filter((el) => !el.dataset.pending);
    untouched.forEach((el) => (el.dataset.pending = "1"));
    if (untouched.length) gsap.set(untouched, { opacity: 0, y: 26 });
    const triggers = ScrollTrigger.batch(pending, {
      start: "top 90%",
      once: true,
      onEnter: (batch) => {
        mark(batch);
        gsap.to(batch, { opacity: 1, y: 0, duration: 0.65, stagger: 0.08, ease: "power3.out", overwrite: true, clearProps: "transform" });
      },
    });
    return () => triggers.forEach((t) => t.kill());
  }, [visible]);

  // #project-<slug> (e.g. from the Skills console): reveal that card even if it's collapsed, then scroll to it
  useEffect(() => {
    const open = () => {
      const m = location.hash.match(/^#project-(.+)$/);
      if (!m || !projects.some((p) => p.slug === m[1])) return;
      setFilter("All");
      setExpanded(true);
      setTimeout(() => document.getElementById(`project-${m[1]}`)?.scrollIntoView({ block: "center" }), 80);
    };
    open();
    window.addEventListener("hashchange", open);
    return () => window.removeEventListener("hashchange", open);
  }, [projects]);

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter projects by category">
        {(["All", ...used] as const).map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={filter === c}
            data-magnet="0.25"
            onClick={() => change(() => setFilter(c))}
            className={`rounded-md border px-3 py-1.5 font-mono text-xs transition-colors ${
              filter === c ? "border-accent bg-accent-deep text-accent" : "border-line text-muted hover:text-ink"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <ul ref={listRef} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => (
          <li
            key={p.slug}
            id={`project-${p.slug}`}
            data-flip-id={p.slug}
            className="scroll-mt-24 [&:target>article]:border-accent/60"
          >
            <ProjectCard p={p} />
          </li>
        ))}
      </ul>
      {filter === "All" && list.length > INITIAL_VISIBLE && (
        <div className="mt-8 flex justify-center">
          <button type="button" onClick={() => change(() => setExpanded((v) => !v))} aria-expanded={expanded} className="btn-ghost">
            {expanded ? "Show fewer projects" : `View all ${list.length} projects`}
          </button>
        </div>
      )}
    </div>
  );
}
