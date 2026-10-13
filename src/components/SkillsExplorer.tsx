"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight, Bot, CodeXml, Cpu, Globe, PenTool, ScanEye, Search, X } from "lucide-react";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { skillGroups, type SkillGroup } from "@/data/skills";
import { skillInfo } from "@/data/skillInfo";
import { projects } from "@/data/projects";
import { techIcon } from "@/lib/techIcons";

/* ──────────────────────────────────────────────────────────────────────────
   Skills explorer — a reference, not a wall of chips. Pick a discipline,
   pick a tool, and read what it is, where it fits and which projects used it.
   ────────────────────────────────────────────────────────────────────────── */

const GROUP_ICON = { robotics: Bot, embedded: Cpu, ai: ScanEye, design: PenTool, software: CodeXml, web: Globe } as const;
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* evidence: which projects list this skill in their tech stack */
const norm = (s: string) => s.toLowerCase().replace(/\(.*?\)/g, "").replace(/[^a-z0-9+#. ]/g, " ").replace(/\s+/g, " ").trim();
function matches(skill: string, tech: string) {
  const a = norm(skill);
  const b = norm(tech);
  if (!a || !b) return false;
  if (a === b) return true;
  if (a.length <= 2 || b.length <= 2) return false;
  return a.includes(b) || b.includes(a);
}
const usedIn = (skill: string) => {
  const aliases = skill.split("/").map((s) => s.trim());
  return projects.filter((p) => p.tech.some((t) => aliases.some((a) => matches(a, t))));
};
const EVIDENCE = new Map<string, { title: string; slug: string }[]>();
for (const g of skillGroups) for (const s of g.items) EVIDENCE.set(s, usedIn(s).map((p) => ({ title: p.title, slug: p.slug })));

const ALL: { skill: string; group: SkillGroup }[] = skillGroups.flatMap((g) => g.items.map((skill) => ({ skill, group: g })));

/* ───────────────────────────── detail panel ───────────────────────────── */

function Detail({ skill, group, onClose }: { skill: string; group: SkillGroup; onClose?: () => void }) {
  const info = skillInfo[skill];
  const icon = techIcon(skill);
  const Icon = GROUP_ICON[group.id as keyof typeof GROUP_ICON] ?? CodeXml;
  const used = EVIDENCE.get(skill) ?? [];
  const related = group.items.filter((s) => s !== skill).slice(0, 5);

  return (
    <motion.div
      key={skill}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="relative"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-accent/30 bg-accent/10">
            {icon ? <Image src={icon} alt="" width={26} height={26} /> : <Icon size={22} className="text-accent" aria-hidden />}
          </span>
          <div>
            <p className="label">{group.title}</p>
            <h4 className="mt-0.5 font-display text-lg font-semibold leading-tight text-ink">{skill}</h4>
          </div>
        </div>
        {onClose && (
          <button type="button" onClick={onClose} aria-label="Close details" className="grid h-8 w-8 place-items-center rounded-md text-muted hover:bg-surface2 hover:text-ink">
            <X size={15} aria-hidden />
          </button>
        )}
      </div>

      <dl className="mt-5 space-y-4 text-sm leading-relaxed">
        <div>
          <dt className="label mb-1">What it is</dt>
          <dd className="text-ink">{info?.what ?? `${skill} — part of my ${group.title.toLowerCase()} toolkit.`}</dd>
        </div>
        <div>
          <dt className="label mb-1">Where it fits in my work</dt>
          <dd className="text-muted">{info?.use ?? group.summary}</dd>
        </div>
        <div>
          <dt className="label mb-1.5">Used in</dt>
          <dd>
            {used.length ? (
              <ul className="flex flex-wrap gap-1.5">
                {used.map((p) => (
                  <li key={p.slug}>
                    <a href="#projects" className="chip gap-1 text-ink transition-colors hover:border-accent/60 hover:text-accent">
                      {p.title} <ArrowUpRight size={11} aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <span className="font-mono text-[11px] text-dim">Coursework, internships and prototypes</span>
            )}
          </dd>
        </div>
        {related.length > 0 && (
          <div>
            <dt className="label mb-1.5">Works alongside</dt>
            <dd className="font-mono text-[11px] text-muted">{related.join(" · ")}</dd>
          </div>
        )}
      </dl>
    </motion.div>
  );
}

/* ───────────────────────────── explorer ───────────────────────────── */

export function SkillsExplorer() {
  const [groupId, setGroupId] = useState(skillGroups[0].id);
  const [query, setQuery] = useState("");
  const q = useDeferredValue(query.trim().toLowerCase());
  const [active, setActive] = useState<string>(skillGroups[0].items[0]);
  const [openMobile, setOpenMobile] = useState<string | null>(null);

  const group = skillGroups.find((g) => g.id === groupId) ?? skillGroups[0];
  const searching = q.length > 0;
  const tiles = useMemo(() => {
    if (!searching) return group.items.map((skill) => ({ skill, group }));
    return ALL.filter(({ skill }) => {
      const info = skillInfo[skill];
      return skill.toLowerCase().includes(q) || info?.what.toLowerCase().includes(q) || info?.use.toLowerCase().includes(q);
    });
  }, [group, q, searching]);

  // keep the detail panel pointing at something visible
  useEffect(() => {
    if (!tiles.some((t) => t.skill === active) && tiles[0]) setActive(tiles[0].skill);
  }, [tiles, active]);

  const activeGroup = ALL.find((t) => t.skill === active)?.group ?? group;

  return (
    <div className="grid min-w-0 gap-5 lg:grid-cols-[230px_1fr_320px] lg:items-start">
      {/* ── discipline rail ── */}
      <nav aria-label="Skill categories" className="min-w-0 lg:sticky lg:top-24">
        <label className="relative mb-3 block">
          <Search size={14} aria-hidden className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-dim" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a tool, e.g. SLAM"
            aria-label="Search skills"
            className="w-full rounded-md border border-line bg-surface py-2 pl-9 pr-3 text-sm text-ink placeholder:text-dim focus:border-accent"
          />
        </label>
        <ul className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
          {skillGroups.map((g) => {
            const Icon = GROUP_ICON[g.id as keyof typeof GROUP_ICON] ?? CodeXml;
            const on = !searching && g.id === groupId;
            return (
              <li key={g.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setGroupId(g.id);
                    setQuery("");
                    setActive(g.items[0]);
                    setOpenMobile(null);
                  }}
                  aria-pressed={on}
                  className={`group/cat flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors ${
                    on ? "border-accent/50 bg-accent/10" : "border-line bg-surface hover:border-line-strong"
                  }`}
                >
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-md border ${on ? "border-accent/40 text-accent" : "border-line text-muted"}`}>
                    <Icon size={16} aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className={`block whitespace-nowrap text-sm font-medium ${on ? "text-ink" : "text-muted group-hover/cat:text-ink"}`}>{g.title}</span>
                    <span className="hidden font-mono text-[10px] text-dim lg:block">{g.items.length} tools</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── tiles ── */}
      <div className="min-w-0">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <p className="text-sm text-muted">{searching ? `${tiles.length} result${tiles.length === 1 ? "" : "s"} for “${query.trim()}”` : group.summary}</p>
          <p className="hidden font-mono text-[10px] uppercase tracking-label text-dim sm:block">Hover or tap a tool</p>
        </div>
        <motion.ul layout className="grid min-w-0 gap-2 sm:grid-cols-2" aria-label="Skills">
          <AnimatePresence initial={false}>
            {tiles.map(({ skill, group: g }) => {
              const icon = techIcon(skill);
              const info = skillInfo[skill];
              const on = active === skill;
              const open = openMobile === skill;
              const used = EVIDENCE.get(skill)?.length ?? 0;
              return (
                <motion.li
                  key={skill}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="min-w-0"
                >
                  <button
                    type="button"
                    onPointerEnter={() => setActive(skill)}
                    onFocus={() => setActive(skill)}
                    onClick={() => {
                      setActive(skill);
                      setOpenMobile((v) => (v === skill ? null : skill));
                    }}
                    aria-expanded={open}
                    className={`panel group/tile relative w-full rounded-xl p-3.5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/50 ${
                      on ? "lg:border-accent/60 lg:shadow-[0_0_0_1px_rgb(52_210_123/0.25),0_12px_32px_-16px_rgb(52_210_123/0.45)]" : ""
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line bg-surface2">
                        {icon ? <Image src={icon} alt="" width={18} height={18} /> : <span className="font-mono text-[10px] text-accent">{skill.slice(0, 2).toUpperCase()}</span>}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm font-medium text-ink">{skill}</span>
                          {used > 0 && (
                            <span className="shrink-0 rounded border border-accent/30 px-1.5 py-px font-mono text-[10px] text-accent" title={`Used in ${used} project${used > 1 ? "s" : ""}`}>
                              {used} {used === 1 ? "project" : "projects"}
                            </span>
                          )}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-muted">{info?.what ?? g.summary}</span>
                      </span>
                    </span>
                  </button>
                  {/* phones / tablets: inline detail */}
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: EASE }}
                        className="overflow-hidden lg:hidden"
                      >
                        <div className="panel mt-2 p-4">
                          <Detail skill={skill} group={g} onClose={() => setOpenMobile(null)} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </motion.ul>
        {tiles.length === 0 && <p className="panel p-6 text-center text-sm text-muted">No tool matches that search.</p>}
      </div>

      {/* ── desktop detail panel ── */}
      <aside className="panel relative hidden overflow-hidden p-5 lg:sticky lg:top-24 lg:block" aria-live="polite">
        <div aria-hidden className="beam opacity-60 motion-reduce:hidden" />
        <div aria-hidden className="bg-dots absolute inset-0 opacity-20" />
        <div className="relative min-h-[360px]">
          <AnimatePresence mode="wait">
            <Detail key={active} skill={active} group={activeGroup} />
          </AnimatePresence>
        </div>
      </aside>
    </div>
  );
}
