"use client";

import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
import {
  ArrowUpRight,
  BadgeCheck,
  BatteryCharging,
  BrainCircuit,
  CodeXml,
  Cpu,
  ExternalLink,
  FolderCheck,
  MapPin,
  Network,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { internshipProof, internships, type Internship } from "@/data/experience";
import { SectionHeader, TechChip } from "@/components/ui";
import { Reveal } from "@/components/Motion";
import { Counter, Magnetic, TiltCard } from "@/components/Effects";

/* ───────────────────────────── data helpers ───────────────────────────── */

const FOCUS_ICON = { ai: BrainCircuit, web: CodeXml, code: Terminal, chip: Cpu, ev: BatteryCharging, net: Network } as const;

// Oldest → newest: the signal travels down the trace through time.
const chrono = [...internships].reverse();
// "2 mos" → 2, "1 mo" → 1, "2 wks" → 0.5; shown rounded.
const months = Math.round(
  internships.reduce((n, it) => {
    const v = parseInt(it.duration, 10) || 0;
    return n + (/wk/.test(it.duration) ? v / 4 : v);
  }, 0),
);
const STATS = [
  { value: internships.length, label: "Internships" },
  { value: months, label: "Months of training" },
  { value: new Set(internships.map((i) => i.focus)).size, label: "Domains" },
  { value: new Set(internships.map((i) => i.location).filter(Boolean)).size, label: "Cities" },
] as const;
const firstDate = chrono[0]?.period.split(" – ")[0] ?? "";
const lastParts = chrono[chrono.length - 1]?.period.split(" – ") ?? [];
const lastDate = lastParts[lastParts.length - 1] ?? "";
const pad = (n: number) => String(n).padStart(2, "0");

function setSpot(e: ReactPointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
  e.currentTarget.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
}

/* ───────────────────────────── internship card ───────────────────────────── */

function InternCard({ it, index, lit }: { it: Internship; index: number; lit: boolean }) {
  return (
    <TiltCard max={4} className="group h-full">
      <article
        onPointerMove={setSpot}
        className={`panel relative flex h-full flex-col overflow-hidden rounded-2xl p-6 transition-[border-color,box-shadow,opacity] duration-700 group-hover:border-accent/50 group-hover:shadow-[0_24px_60px_-20px_rgb(52_210_123/0.35)] ${
          lit ? "opacity-100" : "opacity-60"
        }`}
      >
        <div aria-hidden className="beam opacity-0 transition-opacity duration-500 group-hover:opacity-100 motion-reduce:hidden" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: "radial-gradient(380px circle at var(--mx,50%) var(--my,50%), rgb(52 210 123 / 0.12), transparent 60%)" }}
        />
        <div aria-hidden className="bg-dots absolute inset-0 opacity-20" />

        <div className="relative flex items-start justify-between gap-3">
          <p className="label">
            <span className="text-accent">{pad(index + 1)}</span> <span className="text-line-strong">/</span> {it.period}{" "}
            <span className="text-line-strong">/</span> {it.duration}
          </p>
          {it.certified && (
            <span className="flex shrink-0 items-center gap-1 rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-accent">
              <BadgeCheck size={11} aria-hidden /> Certified
            </span>
          )}
        </div>

        <div className="relative mt-4">
          <h3 className="font-display text-xl font-semibold leading-snug text-ink">{it.role}</h3>
          <p className="mt-1 text-sm text-accent">{it.company}</p>
          {it.summary && <p className="mt-3 text-sm leading-relaxed text-muted">{it.summary}</p>}
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Focus areas">
            {it.skills.map((s) => (
              <li key={s}>
                <TechChip label={s} />
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-line pt-4 font-mono text-[11px] text-muted">
          {(it.location || it.remote) && (
            <span className="flex items-center gap-1.5">
              <MapPin size={13} aria-hidden />
              {[it.remote && "Remote", it.location].filter(Boolean).join(" · ")}
            </span>
          )}
          {it.proofUrl && (
            <a
              href={it.proofUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`Verify ${it.role} at ${it.company} — opens the certificate folder in a new tab`}
              className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 text-accent transition-all duration-300 hover:border-accent hover:bg-accent/20 hover:text-neon hover:shadow-[0_0_16px_rgb(52_210_123/0.35)]"
            >
              <BadgeCheck size={12} aria-hidden /> Verify
              <ArrowUpRight size={12} aria-hidden className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          )}
        </div>
      </article>
    </TiltCard>
  );
}

/* ───────────────────────────── circuit-trace timeline ───────────────────────────── */

function CircuitTimeline() {
  const ref = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(-1);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 72%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 26 });
  const packetTop = useTransform(progress, (v) => `${v * 100}%`);
  const n = chrono.length;
  // a node lights up when the signal reaches its row
  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(Math.floor(v * n + 0.15)));

  return (
    <ol ref={ref} className="relative mt-4 md:mt-8">
      {/* spine: dim trace + scroll-filled glow + travelling packet */}
      <div aria-hidden className="absolute bottom-0 left-5 top-0 w-px md:left-1/2 md:-translate-x-1/2">
        <div className="absolute inset-0 bg-line-strong" />
        <motion.div style={{ scaleY: progress }} className="absolute inset-0 origin-top bg-gradient-to-b from-accent via-neon to-accent" />
        <motion.span
          style={{ top: packetTop }}
          className="absolute left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon shadow-[0_0_18px_4px_rgb(134_255_184/0.55)] motion-reduce:hidden"
        />
      </div>

      {chrono.map((it, i) => {
        const Icon = FOCUS_ICON[it.focus];
        const lit = i <= active;
        const right = i % 2 === 1; // desktop zig-zag
        return (
          <li key={it.role + it.company} className="relative pb-10 last:pb-0 md:pb-14">
            {/* node on the spine */}
            <span
              aria-hidden
              className={`absolute left-5 top-7 z-10 grid h-10 w-10 -translate-x-1/2 place-items-center rounded-xl border bg-bg transition-all duration-700 md:left-1/2 ${
                lit ? "border-accent text-accent shadow-[0_0_24px_rgb(52_210_123/0.45)]" : "border-line-strong text-dim"
              }`}
            >
              <Icon size={18} />
            </span>
            {/* connector trace from spine to card */}
            <span
              aria-hidden
              className={`absolute top-12 hidden h-px w-[calc(50%-5.5rem)] transition-colors duration-700 md:block ${
                right ? "left-1/2 ml-5" : "right-1/2 mr-5"
              } ${lit ? "bg-gradient-to-r from-accent/70 to-accent/20" : "bg-line-strong"}`}
            />
            <span
              aria-hidden
              className={`absolute left-10 top-12 h-px w-4 transition-colors duration-700 md:hidden ${lit ? "bg-accent/60" : "bg-line-strong"}`}
            />

            <Reveal zoom className={`ml-14 md:ml-0 md:w-[calc(50%-5.5rem)] ${right ? "md:ml-auto" : ""}`}>
              <InternCard it={it} index={i} lit={lit} />
            </Reveal>
          </li>
        );
      })}
    </ol>
  );
}

/* ───────────────────────────── verification vault ───────────────────────────── */

function Vault() {
  return (
    <Reveal zoom className="relative mt-10 md:mt-14">
      {/* the trace terminates in the vault */}
      <span aria-hidden className="absolute -top-10 left-5 h-10 w-px bg-gradient-to-b from-accent to-neon md:-top-14 md:left-1/2 md:h-14" />
      <TiltCard max={2} className="group">
        <div className="relative overflow-hidden rounded-2xl border border-accent/40 bg-[linear-gradient(140deg,#0f1a14,#0c100e_50%,#0f3d24_160%)] p-6 shadow-[0_0_48px_-12px_rgb(52_210_123/0.45)] md:p-8">
          <div aria-hidden className="beam motion-reduce:hidden" />
          <div aria-hidden className="foil absolute inset-0 opacity-70 motion-reduce:hidden" />
          <div aria-hidden className="bg-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_right,black,transparent_70%)]" />
          <div className="relative grid gap-6 md:grid-cols-[auto_1fr_auto] md:items-center">
            <span className="relative grid h-14 w-14 place-items-center rounded-2xl border border-accent/40 bg-accent/10">
              <span aria-hidden className="absolute -inset-1 rounded-2xl border border-dashed border-accent/40 motion-safe:animate-spin-slower" />
              <ShieldCheck size={26} className="text-neon" aria-hidden />
            </span>
            <div>
              <p className="label flex items-center gap-2">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-neon motion-safe:animate-blink" /> Verification · Google Drive
              </p>
              <h3 className="mt-2 font-display text-xl font-semibold leading-snug text-ink">{internshipProof.label}</h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">{internshipProof.description}</p>
            </div>
            <div className="md:text-right">
              <Magnetic strength={0.18}>
                <a
                  href={internshipProof.url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary group/btn !px-4 !py-2.5 !text-xs md:!text-sm"
                  aria-label="Open the internship verification folder on Google Drive (opens in a new tab)"
                >
                  <FolderCheck size={15} aria-hidden /> Open verification folder
                  <ArrowUpRight size={14} aria-hidden className="transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                </a>
              </Magnetic>
              <p className="mt-3 flex items-center gap-1.5 font-mono text-[11px] text-dim md:justify-end">
                <ExternalLink size={11} aria-hidden /> {internshipProof.host}
              </p>
            </div>
          </div>
        </div>
      </TiltCard>
    </Reveal>
  );
}

/* ───────────────────────────── section ───────────────────────────── */

export function InternshipShowcase() {
  return (
    <section id="internships" className="cv-auto relative border-t border-line py-12 md:py-16">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
      <div className="container">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <SectionHeader
            index="05"
            label="Internships"
            title="Industry internships, verified."
            intro={`Six internships between ${firstDate} and ${lastDate} across AI & data, web, Python, VLSI, electric vehicles and network security. `}
          />
          <Reveal delay={0.1} className="mb-8 md:mb-10">
            <dl className="grid grid-cols-4 gap-3 rounded-xl border border-line bg-surface/60 p-4 backdrop-blur">
              {STATS.map((s) => (
                <div key={s.label} className="text-center">
                  <dd className="font-display text-2xl font-bold text-accent md:text-3xl">
                    <Counter to={s.value} />
                  </dd>
                  <dt className="mt-1 text-[11px] leading-tight text-muted">{s.label}</dt>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <CircuitTimeline />
        <Vault />
      </div>
    </section>
  );
}
