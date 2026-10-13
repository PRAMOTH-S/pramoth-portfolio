"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Bot, CodeXml, Cpu, Globe, PenTool, ScanEye } from "lucide-react";
import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { coreStack, skillGroups, type SkillGroup } from "@/data/skills";
import { projects } from "@/data/projects";
import { techIcon } from "@/lib/techIcons";

/* ───────────────────────────── config ───────────────────────────── */

const GROUP_ICON = { robotics: Bot, embedded: Cpu, ai: ScanEye, design: PenTool, software: CodeXml, web: Globe } as const;
// bento spans (6-col grid): robotics leads, the rest tile around it
const SPAN: Record<string, string> = {
  robotics: "md:col-span-4",
  embedded: "md:col-span-2",
  ai: "md:col-span-3",
  design: "md:col-span-3",
  software: "md:col-span-3",
  web: "md:col-span-3",
};
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function setSpot(e: ReactPointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
  e.currentTarget.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
}

/* ───────────────────────────── evidence: which projects used each skill ───────────────────────────── */

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/[^a-z0-9+#. ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

function matches(skill: string, tech: string) {
  const a = norm(skill);
  const b = norm(tech);
  if (!a || !b) return false;
  if (a === b) return true;
  if (a.length <= 2 || b.length <= 2) return false; // "C" must not match "OpenCV"
  return a.includes(b) || b.includes(a);
}

/** Projects whose tech list contains this skill (any "/"-separated alias). */
function usedIn(skill: string) {
  const aliases = skill.split("/").map((s) => s.trim());
  return projects.filter((p) => p.tech.some((t) => aliases.some((a) => matches(a, t))));
}
const EVIDENCE = new Map<string, string[]>();
for (const g of skillGroups) for (const s of g.items) EVIDENCE.set(s, usedIn(s).map((p) => p.title));

/* ───────────────────────────── core-stack orbit ───────────────────────────── */

function Ring({ items, radius, size, anim, reverse }: { items: readonly string[]; radius: number; size: number; anim: string; reverse: string }) {
  return (
    <div
      className={`absolute left-1/2 top-1/2 rounded-full border border-dashed border-line-strong/70 ${anim} group-hover:[animation-play-state:paused]`}
      style={{ width: radius * 2, height: radius * 2, marginLeft: -radius, marginTop: -radius }}
    >
      {items.map((label, i) => {
        const angle = (360 / items.length) * i;
        const icon = techIcon(label);
        return (
          <div
            key={label}
            className="absolute left-1/2 top-1/2"
            style={{ transform: `rotate(${angle}deg) translate(${radius}px) rotate(${-angle}deg)`, marginLeft: -size / 2, marginTop: -size / 2 }}
          >
            <div className={`group/logo relative ${reverse} group-hover:[animation-play-state:paused]`}>
              <div
                className="grid place-items-center rounded-2xl border border-line bg-surface/90 shadow-[0_8px_30px_rgb(0_0_0/0.45)] backdrop-blur transition-all duration-300 hover:scale-110 hover:border-accent hover:shadow-[0_0_28px_rgb(52_210_123/0.45)]"
                style={{ width: size, height: size }}
              >
                {icon ? <Image src={icon} alt="" width={size * 0.5} height={size * 0.5} className="opacity-90" /> : <span className="font-mono text-[10px] text-accent">{label.slice(0, 3)}</span>}
              </div>
              <span className="pointer-events-none absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap rounded border border-line bg-bg/90 px-1.5 py-0.5 font-mono text-[10px] text-ink opacity-0 transition-opacity duration-200 group-hover/logo:opacity-100">
                {label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CoreOrbit() {
  const all = [...coreStack.inner, ...coreStack.outer].join(", ");
  return (
    <figure
      aria-label={`Core stack: ${all}, centred on robotics`}
      className="group relative mx-auto mb-16 h-[300px] w-full max-w-[300px] select-none sm:h-[360px] sm:max-w-[360px] md:mb-20 md:h-[420px] md:max-w-[420px]"
    >
      <div aria-hidden className="absolute inset-0">
        <div className="absolute inset-[18%] rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute inset-0 origin-center scale-[0.71] sm:scale-[0.86] md:scale-100">
          <Ring items={coreStack.outer} radius={196} size={48} anim="animate-orbit-out" reverse="animate-orbit-out-rev" />
          <Ring items={coreStack.inner} radius={118} size={52} anim="animate-orbit-in" reverse="animate-orbit-in-rev" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <span className="absolute -inset-5 rounded-full border border-accent/30 motion-safe:animate-[ping_3s_ease-out_infinite]" />
            <span className="absolute -inset-2 rounded-full bg-accent/15 blur-md" />
            <div className="relative grid h-[76px] w-[76px] place-items-center rounded-full border border-accent/50 bg-[radial-gradient(circle_at_30%_30%,#143b26,#0c100e_70%)] shadow-[0_0_40px_rgb(52_210_123/0.35)]">
              <Bot size={30} className="text-neon" />
            </div>
          </div>
        </div>
      </div>
      <figcaption className="absolute inset-x-0 -bottom-12 text-center font-mono text-[11px] uppercase tracking-label text-dim">Core stack · hover to pause</figcaption>
    </figure>
  );
}

/* ───────────────────────────── bento cards ───────────────────────────── */

const listVariants = { hidden: {}, shown: { transition: { staggerChildren: 0.035, delayChildren: 0.15 } } };
const chipVariants = {
  hidden: { opacity: 0, y: 8, scale: 0.9, filter: "blur(4px)" },
  shown: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transition: { duration: 0.45, ease: EASE } },
};

const PULL = 110; // px radius of the magnetic field around the cursor

function GroupCard({ g, index }: { g: SkillGroup; index: number }) {
  const Icon = GROUP_ICON[g.id as keyof typeof GROUP_ICON] ?? CodeXml;
  const [open, setOpen] = useState(false);
  const [focus, setFocus] = useState<string | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const limit = SPAN[g.id] === "md:col-span-4" ? 12 : 7;
  const visible = open ? g.items : g.items.slice(0, limit);
  const hidden = g.items.length - visible.length;
  const evidence = focus ? EVIDENCE.get(focus) ?? [] : [];

  // Chips lean toward the cursor like filings in a magnetic field.
  const onMove = (e: ReactPointerEvent<HTMLUListElement>) => {
    const ul = listRef.current;
    if (!ul || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    for (const li of ul.children as HTMLCollectionOf<HTMLElement>) {
      const r = li.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy);
      if (d < PULL) {
        const k = ((1 - d / PULL) * 7) / Math.max(d, 1);
        li.style.transform = `translate(${dx * k}px, ${dy * k}px)`;
      } else if (li.style.transform) li.style.transform = "";
    }
  };
  const onLeave = () => {
    const ul = listRef.current;
    if (!ul) return;
    for (const li of ul.children as HTMLCollectionOf<HTMLElement>) li.style.transform = "";
    setFocus(null);
  };

  return (
    <motion.li
      initial={{ opacity: 0, y: 18, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.08, ease: EASE }}
      className={`group ${SPAN[g.id] ?? "md:col-span-3"}`}
    >
      <article
        onPointerMove={setSpot}
        className="panel relative flex h-full flex-col overflow-hidden rounded-2xl p-5 transition-[border-color,box-shadow] duration-500 group-hover:border-accent/50 group-hover:shadow-[0_24px_60px_-24px_rgb(52_210_123/0.35)] md:p-6"
      >
        <div aria-hidden className="beam opacity-0 transition-opacity duration-500 group-hover:opacity-100 motion-reduce:hidden" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: "radial-gradient(360px circle at var(--mx,50%) var(--my,50%), rgb(52 210 123 / 0.12), transparent 60%)" }}
        />
        <div aria-hidden className="bg-dots absolute inset-0 opacity-20" />
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-1/3 overflow-hidden opacity-0 group-hover:opacity-100">
          <div className="h-full w-full bg-gradient-to-r from-transparent via-neon/10 to-transparent group-hover:motion-safe:animate-sweepx" />
        </div>

        <header className="relative flex items-start gap-3.5">
          <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-accent/30 bg-accent/10">
            <span aria-hidden className="absolute inset-0 rounded-xl border border-accent/40 opacity-0 transition-all duration-500 group-hover:scale-125 group-hover:opacity-100 group-hover:blur-[1px]" />
            <Icon size={20} className="text-accent transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110" aria-hidden />
          </span>
          <div className="min-w-0">
            <h3 className="font-display text-base font-semibold text-ink md:text-lg">{g.title}</h3>
            <p className="mt-0.5 text-xs leading-relaxed text-muted md:text-sm">{g.summary}</p>
          </div>
        </header>

        <motion.ul
          ref={listRef}
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          variants={listVariants}
          initial="hidden"
          whileInView="shown"
          viewport={{ once: true, margin: "-40px" }}
          className="relative mt-4 flex flex-wrap gap-1.5"
          aria-label={`${g.title} skills`}
        >
          {visible.map((s) => {
            const icon = techIcon(s);
            const n = EVIDENCE.get(s)?.length ?? 0;
            return (
              <motion.li key={s} variants={chipVariants} className="transition-transform duration-150 ease-out will-change-transform">
                <button
                  type="button"
                  onPointerEnter={() => setFocus(s)}
                  onFocus={() => setFocus(s)}
                  onBlur={() => setFocus(null)}
                  aria-label={n ? `${s}, used in ${n} project${n > 1 ? "s" : ""}` : s}
                  className={`chip relative gap-1.5 transition-colors duration-300 hover:border-accent/60 hover:text-ink focus-visible:border-accent ${focus === s ? "!border-accent/60 !text-ink" : ""}`}
                >
                  {icon && <Image src={icon} alt="" width={13} height={13} className="opacity-90" />}
                  {s}
                  {n > 0 && <span aria-hidden className="absolute -right-1 -top-1 h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_6px_rgb(52_210_123/0.8)]" />}
                </button>
              </motion.li>
            );
          })}
          {hidden > 0 && (
            <li>
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="chip gap-1 text-accent transition-colors hover:border-accent/50 hover:text-neon"
                aria-label={`Show ${hidden} more ${g.title} skills`}
              >
                +{hidden} more
              </button>
            </li>
          )}
        </motion.ul>

        {/* evidence readout: where this skill was actually used */}
        <p className="relative mt-4 min-h-[18px] border-t border-line pt-3 font-mono text-[11px] leading-relaxed text-dim" aria-live="polite">
          {focus ? (
            evidence.length ? (
              <>
                <span className="text-accent">{focus}</span> → {evidence.join(" · ")}
              </>
            ) : (
              <>
                <span className="text-accent">{focus}</span> → used in coursework, internships and prototypes
              </>
            )
          ) : (
            <>Hover a skill to see where I used it · <span className="text-accent">●</span> = in a published project</>
          )}
        </p>
      </article>
    </motion.li>
  );
}

/* ───────────────────────────── export ───────────────────────────── */

export function SkillsShowcase() {
  return (
    <>
      <CoreOrbit />
      <ul className="grid gap-4 md:grid-cols-6">
        {skillGroups.map((g, i) => (
          <GroupCard key={g.id} g={g} index={i} />
        ))}
      </ul>
    </>
  );
}
