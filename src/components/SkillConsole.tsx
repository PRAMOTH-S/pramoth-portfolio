"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Bot, CodeXml, Cpu, Globe, PenTool, ScanEye } from "lucide-react";
import { useCallback } from "react";
import type { SkillGroup } from "@/data/skills";
import type { SkillInfo } from "@/data/skillInfo";
import type { SkillEvidence } from "@/lib/skillEvidence";
import { techIcon } from "@/lib/techIcons";
import { BackButton, DrillFrame, EASE, FilterPills, PrevNext, TITLE_FOCUS, slug, useDrill } from "@/components/Drill";

/* ──────────────────────────────────────────────────────────────────────────
   Skills console — show less, reveal on demand.
   Overview (6 disciplines) → discipline (its tools) → tool (what / where / projects).
   Deep-linkable: #skills/<discipline>/<tool>.
   ────────────────────────────────────────────────────────────────────────── */

const GROUP_ICON = { robotics: Bot, embedded: Cpu, ai: ScanEye, design: PenTool, software: CodeXml, web: Globe } as const;
const SHORT: Record<string, string> = {
  robotics: "Robotics",
  embedded: "Embedded",
  ai: "AI & Vision",
  design: "Design",
  software: "Software",
  web: "Web & UI",
};

type View = { group?: string; skill?: string };

function GroupIcon({ id, size = 16, className = "" }: { id: string; size?: number; className?: string }) {
  const Icon = GROUP_ICON[id as keyof typeof GROUP_ICON] ?? CodeXml;
  return <Icon size={size} className={className} aria-hidden />;
}

function Logo({ name, group, size }: { name: string; group: string; size: number }) {
  const icon = techIcon(name);
  return icon ? (
    <Image src={icon} alt="" width={size} height={size} className="opacity-90" />
  ) : (
    <GroupIcon id={group} size={size - 2} className="text-accent/80" />
  );
}

const toHash = (v: View) => (v.group ? `#skills/${v.group}${v.skill ? `/${v.skill}` : ""}` : "#skills");

export function SkillConsole({
  groups,
  info,
  evidence,
}: {
  groups: SkillGroup[];
  info: Record<string, SkillInfo>;
  evidence: Record<string, SkillEvidence>;
}) {
  const fromHash = useCallback(
    (hash: string): View | undefined => {
      const m = hash.match(/^#skills\/([^/]+)(?:\/([^/]+))?$/);
      const g = m && groups.find((x) => x.id === m[1]);
      if (!m || !g) return undefined;
      return { group: g.id, skill: m[2] && g.items.some((i) => slug(i) === m[2]) ? m[2] : undefined };
    },
    [groups],
  );
  const drill = useDrill<View>({}, toHash, fromHash);
  const { view, go } = drill;

  const group = groups.find((g) => g.id === view.group);
  const skill = group && view.skill ? group.items.find((s) => slug(s) === view.skill) : undefined;

  return (
    <DrillFrame
      drill={drill}
      viewKey={skill ? `s-${group!.id}-${skill}` : group ? `g-${group.id}` : "overview"}
      onEscape={view.skill ? () => go({ group: view.group }) : view.group ? () => go({}) : undefined}
      top={
        <FilterPills
          label="Skill disciplines"
          items={[{ id: "", label: "All" }, ...groups.map((g) => ({ id: g.id, label: SHORT[g.id] ?? g.title }))]}
          active={view.group ?? ""}
          onPick={(id) => go(id ? { group: id } : {})}
        />
      }
    >
      {!group && <Overview groups={groups} onOpen={(id) => go({ group: id })} />}
      {group && !skill && (
        <GroupView group={group} info={info} evidence={evidence} onBack={() => go({})} onOpen={(s) => go({ group: group.id, skill: slug(s) })} />
      )}
      {group && skill && (
        <SkillView
          group={group}
          skill={skill}
          info={info[skill]}
          ev={evidence[skill]}
          evidence={evidence}
          onBack={() => go({ group: group.id })}
          onOpen={(s) => go({ group: group.id, skill: slug(s) })}
        />
      )}
    </DrillFrame>
  );
}

/* ───────────────────────────── overview ───────────────────────────── */

function Overview({ groups, onOpen }: { groups: SkillGroup[]; onOpen: (id: string) => void }) {
  return (
    <div>
      <h3 data-view-title tabIndex={-1} className="sr-only">
        All skill disciplines
      </h3>
      <ul className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3">
        {groups.map((g, i) => (
          <li key={g.id}>
            <button
              type="button"
              onClick={() => onOpen(g.id)}
              className="group/card flex h-full w-full flex-col rounded-lg border border-line bg-surface2/60 p-3 text-left sm:p-4 transition-[border-color,background-color,transform] duration-200 hover:-translate-y-0.5 hover:border-accent/50 hover:bg-surface2 active:scale-[0.99]"
            >
              <span className="flex w-full flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-line text-accent transition-colors group-hover/card:border-accent/40">
                  <GroupIcon id={g.id} size={17} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="label block text-[10px]">{String(i + 1).padStart(2, "0")}</span>
                  <span className="block font-display text-[14px] font-semibold leading-tight text-ink sm:text-[15px]">{g.title}</span>
                </span>
                <ArrowRight size={15} aria-hidden className="hidden shrink-0 text-dim sm:block transition-[color,transform] duration-200 group-hover/card:translate-x-0.5 group-hover/card:text-accent" />
              </span>
              <span className="mt-2.5 hidden text-[13px] leading-snug text-muted sm:block">{g.summary}</span>
              <span className="mt-auto flex w-full items-center justify-between gap-3 pt-2 sm:mt-3 sm:border-t sm:border-line sm:pt-3">
                <span className="hidden min-w-0 items-center gap-2 overflow-hidden sm:flex">
                  {g.featured.map((s) => (
                    <span key={s} className="inline-flex shrink-0 items-center gap-1 font-mono text-[11px] text-ink/85">
                      {techIcon(s) && <Image src={techIcon(s)!} alt="" width={12} height={12} className="opacity-80" />}
                      <span className="hidden sm:inline">{s.replace(/ \(.*\)/, "")}</span>
                    </span>
                  ))}
                </span>
                <span className="shrink-0 font-mono text-[10px] uppercase tracking-label text-dim">{g.items.length} tools</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ───────────────────────────── discipline ───────────────────────────── */

function GroupView({
  group,
  info,
  evidence,
  onBack,
  onOpen,
}: {
  group: SkillGroup;
  info: Record<string, SkillInfo>;
  evidence: Record<string, SkillEvidence>;
  onBack: () => void;
  onOpen: (s: string) => void;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-accent/30 bg-accent/10 text-accent">
            <GroupIcon id={group.id} size={19} />
          </span>
          <div className="min-w-0">
            <h3 data-view-title tabIndex={-1} className={`font-display text-lg font-semibold leading-tight text-ink ${TITLE_FOCUS}`}>
              {group.title}
            </h3>
            <p className="mt-0.5 text-[13px] text-muted">{group.summary}</p>
          </div>
        </div>
        <BackButton label="All skills" onClick={onBack} />
      </div>

      <ul className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4" aria-label={`${group.title} tools`}>
        {group.items.map((s, i) => {
          const n = evidence[s]?.projects.length ?? 0;
          const star = group.featured.includes(s);
          return (
            <motion.li
              key={s}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, delay: Math.min(i, 12) * 0.018, ease: EASE }}
            >
              <button
                type="button"
                onClick={() => onOpen(s)}
                title={info[s]?.what}
                className={`group/tile flex h-full min-h-[52px] w-full items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left transition-[border-color,background-color] duration-200 hover:border-accent/50 hover:bg-surface2 active:scale-[0.98] ${
                  star ? "border-line-strong bg-surface2/70" : "border-line"
                }`}
              >
                <span className="grid h-7 w-7 shrink-0 place-items-center transition-transform duration-200 group-hover/tile:scale-110">
                  <Logo name={s} group={group.id} size={17} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-medium leading-tight text-ink">{s}</span>
                  {n > 0 && (
                    <span className="mt-0.5 block font-mono text-[10px] text-dim">
                      {n} project{n === 1 ? "" : "s"}
                    </span>
                  )}
                </span>
              </button>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}

/* ───────────────────────────── tool ───────────────────────────── */

function SkillView({
  group,
  skill,
  info,
  ev,
  evidence,
  onBack,
  onOpen,
}: {
  group: SkillGroup;
  skill: string;
  info?: SkillInfo;
  ev?: SkillEvidence;
  evidence: Record<string, SkillEvidence>;
  onBack: () => void;
  onOpen: (s: string) => void;
}) {
  const idx = group.items.indexOf(skill);
  const prev = group.items[(idx - 1 + group.items.length) % group.items.length];
  const next = group.items[(idx + 1) % group.items.length];
  const used = ev?.projects ?? [];
  // related = tools from the same discipline that share a project, then the discipline's key tools
  const shared = group.items.filter((s) => s !== skill && evidence[s]?.projects.some((p) => used.some((u) => u.slug === p.slug)));
  const related = [...new Set([...shared, ...group.featured.filter((s) => s !== skill)])].slice(0, 6);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <BackButton label={SHORT[group.id] ?? group.title} onClick={onBack} />
        <PrevNext
          index={idx}
          total={group.items.length}
          onPrev={() => onOpen(prev)}
          onNext={() => onOpen(next)}
          prevLabel={prev}
          nextLabel={next}
        />
            </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:gap-8">
        {/* what + where */}
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <motion.span
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-accent/30 bg-accent/10"
            >
              <Logo name={skill} group={group.id} size={24} />
            </motion.span>
            <div className="min-w-0">
              <p className="label">{group.title}</p>
              <h3 data-view-title tabIndex={-1} className={`mt-0.5 font-display text-xl font-semibold leading-tight text-ink ${TITLE_FOCUS}`}>
                {skill}
              </h3>
            </div>
          </div>

          <dl className="mt-5 space-y-4 text-sm leading-relaxed">
            <div>
              <dt className="label mb-1">What it is</dt>
              <dd className="text-ink">{info?.what ?? group.summary}</dd>
            </div>
            {info?.use && (
              <div>
                <dt className="label mb-1">How I use it</dt>
                <dd className="text-muted">{info.use}</dd>
              </div>
            )}
            {ev && ev.variants.length > 0 && (
              <div>
                <dt className="label mb-1.5">Versions used</dt>
                <dd className="flex flex-wrap gap-1.5">
                  {ev.variants.map((v) => (
                    <span key={v} className="chip">{v}</span>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </div>

        {/* evidence */}
        <div className="min-w-0 space-y-5">
          <div>
            <h4 className="label mb-2">Used in {used.length ? `· ${used.length}` : ""}</h4>
            {used.length ? (
              <ul className="space-y-2">
                {used.map((p) => (
                  <li key={p.slug}>
                    <a
                      href={`#project-${p.slug}`}
                      className="group/proj flex items-center gap-3 rounded-lg border border-line bg-surface2/60 p-2 pr-3 transition-colors hover:border-accent/50"
                    >
                      <span className="relative aspect-video w-20 shrink-0 overflow-hidden rounded-md border border-line bg-bg">
                        {p.image && <Image src={p.image} alt="" fill sizes="80px" className="object-cover" />}
                      </span>
                      <span className="min-w-0 flex-1 text-[13px] font-medium leading-snug text-ink">{p.title}</span>
                      <ArrowUpRight size={14} aria-hidden className="shrink-0 text-dim transition-colors group-hover/proj:text-accent" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-lg border border-dashed border-line px-3 py-2.5 font-mono text-[11px] text-dim">
                Applied in coursework, internships and prototypes.
              </p>
            )}
          </div>

          {related.length > 0 && (
            <div>
              <h4 className="label mb-2">Related skills</h4>
              <ul className="flex flex-wrap gap-1.5">
                {related.map((s) => (
                  <li key={s}>
                    <button
                      type="button"
                      onClick={() => onOpen(s)}
                      className="chip min-h-8 gap-1.5 text-ink transition-colors hover:border-accent/60 hover:text-accent"
                    >
                      {techIcon(s) && <Image src={techIcon(s)!} alt="" width={12} height={12} />}
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
