"use client";

import { ArrowRight, ArrowUpRight, Award, BadgeCheck, BatteryCharging, BrainCircuit, CodeXml, Cpu, FolderCheck, MapPin, Network, ShieldCheck, Terminal } from "lucide-react";
import { useCallback } from "react";
import type { Internship } from "@/data/experience";
import { BackButton, DrillFrame, PrevNext, TITLE_FOCUS, slug, useDrill } from "@/components/Drill";

/* ──────────────────────────────────────────────────────────────────────────
   Internships — six compact cards; open one to read the details.
   Deep-linkable: #internships/<company>.
   ────────────────────────────────────────────────────────────────────────── */

const FOCUS_ICON = { ai: BrainCircuit, web: CodeXml, code: Terminal, chip: Cpu, ev: BatteryCharging, net: Network } as const;

type View = { it?: string };
const toHash = (v: View) => (v.it ? `#internships/${v.it}` : "#internships");

type Proof = { url: string; label: string; description: string; host: string };
type CertRef = { name: string; href: string };

export function InternshipConsole({
  internships,
  proof,
  skillLinks,
  certsByCompany,
}: {
  internships: Internship[];
  proof: Proof;
  skillLinks: Record<string, string>;
  certsByCompany: Record<string, CertRef[]>;
}) {
  const fromHash = useCallback(
    (hash: string): View | undefined => {
      const m = hash.match(/^#internships\/([^/]+)$/);
      return m && internships.some((i) => slug(i.company) === m[1]) ? { it: m[1] } : undefined;
    },
    [internships],
  );
  const drill = useDrill<View>({}, toHash, fromHash);
  const { view, go } = drill;
  const it = view.it ? internships.find((i) => slug(i.company) === view.it) : undefined;

  return (
    <DrillFrame
      drill={drill}
      viewKey={it ? `i-${view.it}` : "overview"}
      onEscape={it ? () => go({}) : undefined}
      footer={<ProofRow proof={proof} />}
    >
      {!it ? (
        <div>
          <h3 data-view-title tabIndex={-1} className="sr-only">
            All internships
          </h3>
          <ol className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {internships.map((x) => {
              const Icon = FOCUS_ICON[x.focus];
              return (
                <li key={x.company}>
                  <button
                    type="button"
                    onClick={() => go({ it: slug(x.company) })}
                    className="group/card flex h-full w-full items-start gap-3 rounded-lg border border-line bg-surface2/50 p-3 text-left transition-[border-color,background-color] duration-200 hover:border-accent/50 hover:bg-surface2 active:scale-[0.99] sm:p-4"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-accent/25 bg-accent/10 text-accent transition-transform duration-200 group-hover/card:scale-105">
                      <Icon size={17} aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14px] font-semibold leading-snug text-ink">{x.role}</span>
                      <span className="mt-0.5 block truncate text-[12.5px] text-accent">{x.company}</span>
                      <span className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[10.5px] text-dim">
                        <span>{x.period}</span>
                        <span aria-hidden>·</span>
                        <span>{x.duration}</span>
                        {x.remote && <span className="rounded border border-line px-1 text-muted">Remote</span>}
                        {x.certified && (
                          <span className="inline-flex items-center gap-0.5 text-accent">
                            <BadgeCheck size={11} aria-hidden /> Certified
                          </span>
                        )}
                      </span>
                    </span>
                    <ArrowRight size={14} aria-hidden className="mt-1 hidden shrink-0 text-dim transition-[color,transform] duration-200 group-hover/card:translate-x-0.5 group-hover/card:text-accent sm:block" />
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      ) : (
        <Detail
          it={it}
          list={internships}
          skillLinks={skillLinks}
          certs={certsByCompany[it.company] ?? []}
          onBack={() => go({})}
          onOpen={(x) => go({ it: slug(x.company) })}
        />
      )}
    </DrillFrame>
  );
}

function ProofRow({ proof }: { proof: Proof }) {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
      <p className="flex min-w-0 items-center gap-2.5 text-[13px] text-muted">
        <ShieldCheck size={16} className="shrink-0 text-accent" aria-hidden />
        <span>
          <span className="text-ink">{proof.label}</span>: certificates on Google Drive
        </span>
      </p>
      <a
        href={proof.url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-accent/40 bg-accent/10 px-3 py-1.5 font-mono text-xs text-accent transition-colors hover:border-accent hover:text-neon"
        aria-label="Open the internship documents folder on Google Drive (opens in a new tab)"
      >
        <FolderCheck size={13} aria-hidden /> Open folder <ArrowUpRight size={12} aria-hidden />
      </a>
    </div>
  );
}

function Detail({
  it,
  list,
  skillLinks,
  certs,
  onBack,
  onOpen,
}: {
  it: Internship;
  list: Internship[];
  skillLinks: Record<string, string>;
  certs: CertRef[];
  onBack: () => void;
  onOpen: (x: Internship) => void;
}) {
  const Icon = FOCUS_ICON[it.focus];
  const idx = list.indexOf(it);
  const prev = list[(idx - 1 + list.length) % list.length];
  const next = list[(idx + 1) % list.length];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <BackButton label="All internships" onClick={onBack} />
        <PrevNext index={idx} total={list.length} onPrev={() => onOpen(prev)} onNext={() => onOpen(next)} prevLabel={prev.company} nextLabel={next.company} />
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:gap-8">
        <div className="min-w-0">
          <div className="flex items-start gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-accent/30 bg-accent/10 text-accent">
              <Icon size={22} aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="label">{it.company}</p>
              <h3 data-view-title tabIndex={-1} className={`mt-0.5 font-display text-xl font-semibold leading-snug text-ink ${TITLE_FOCUS}`}>
                {it.role}
              </h3>
            </div>
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
            <div>
              <dt className="label mb-1">Period</dt>
              <dd className="text-ink">{it.period}</dd>
            </div>
            <div>
              <dt className="label mb-1">Duration</dt>
              <dd className="text-ink">{it.duration}</dd>
            </div>
            {it.location && (
              <div className="col-span-2">
                <dt className="label mb-1">Location</dt>
                <dd className="flex items-center gap-1.5 text-ink">
                  <MapPin size={13} className="text-accent" aria-hidden />
                  {it.location}
                  {it.remote && <span className="text-muted">· Remote</span>}
                </dd>
              </div>
            )}
          </dl>

          {it.summary && <p className="mt-5 text-sm leading-relaxed text-muted">{it.summary}</p>}
        </div>

        <div className="min-w-0 space-y-5">
          <div>
            <h4 className="label mb-2">Skills</h4>
            <ul className="flex flex-wrap gap-1.5">
              {it.skills.map((s) => (
                <li key={s}>
                  {skillLinks[s] ? (
                    <a href={skillLinks[s]} className="chip min-h-8 gap-1 text-ink transition-colors hover:border-accent/60 hover:text-accent">
                      {s} <ArrowUpRight size={11} aria-hidden />
                    </a>
                  ) : (
                    <span className="chip min-h-8">{s}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {certs.length > 0 && (
            <div>
              <h4 className="label mb-2">Certificates earned</h4>
              <ul className="space-y-2">
                {certs.map((c) => (
                  <li key={c.name}>
                    <a href={c.href} className="group/rel flex items-center gap-3 rounded-lg border border-line bg-surface2/60 px-3 py-2.5 transition-colors hover:border-accent/50">
                      <Award size={15} className="shrink-0 text-accent" aria-hidden />
                      <span className="min-w-0 flex-1 text-[13px] font-medium text-ink">{c.name}</span>
                      <ArrowUpRight size={14} aria-hidden className="shrink-0 text-dim group-hover/rel:text-accent" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {it.certified && (
            <p className="flex items-center gap-2 font-mono text-[11px] text-accent">
              <BadgeCheck size={14} aria-hidden /> Certified on completion
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
