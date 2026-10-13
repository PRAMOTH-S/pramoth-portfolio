"use client";

import { ArrowRight, ArrowUpRight, Award, BadgeCheck, Briefcase } from "lucide-react";
import { useCallback, useMemo } from "react";
import type { Certification } from "@/data/experience";
import { BackButton, DrillFrame, FilterPills, PrevNext, TITLE_FOCUS, slug, useDrill } from "@/components/Drill";

/* ──────────────────────────────────────────────────────────────────────────
   Licenses & certifications — compact list, one credential opened at a time.
   Deep-linkable: #certifications/<topic|all>/<certificate>.
   ────────────────────────────────────────────────────────────────────────── */

type View = { topic: string; cert?: string };
type Topic = { id: string; label: string };

const toHash = (v: View) => (v.topic || v.cert ? `#certifications/${v.topic || "all"}${v.cert ? `/${v.cert}` : ""}` : "#experience");

export function CertConsole({
  certs,
  topics,
  skillLinks,
  internshipCompanies,
}: {
  certs: Certification[];
  topics: readonly Topic[];
  /** subject → #skills/... link, for subjects that are listed skills */
  skillLinks: Record<string, string>;
  /** companies that also appear in the Internships section */
  internshipCompanies: string[];
}) {
  const fromHash = useCallback(
    (hash: string): View | undefined => {
      const m = hash.match(/^#certifications\/([^/]+)(?:\/([^/]+))?$/);
      if (!m) return undefined;
      const topic = topics.some((t) => t.id === m[1]) ? m[1] : "";
      const cert = m[2] && certs.some((c) => slug(c.name) === m[2]) ? m[2] : undefined;
      return { topic, cert };
    },
    [certs, topics],
  );
  const drill = useDrill<View>({ topic: "" }, toHash, fromHash);
  const { view, go } = drill;

  const list = useMemo(() => (view.topic ? certs.filter((c) => c.topic === view.topic) : certs), [certs, view.topic]);
  const cert = view.cert ? certs.find((c) => slug(c.name) === view.cert) : undefined;
  const topicLabel = (id: string) => topics.find((t) => t.id === id)?.label ?? "";

  return (
    <DrillFrame
      drill={drill}
      viewKey={cert ? `c-${view.cert}` : `list-${view.topic}`}
      onEscape={cert ? () => go({ topic: view.topic }) : undefined}
      top={
        <FilterPills
          label="Filter certifications by topic"
          items={[{ id: "", label: "All", count: certs.length }, ...topics.map((t) => ({ ...t, count: certs.filter((c) => c.topic === t.id).length }))]}
          active={view.topic}
          onPick={(id) => go({ topic: id })}
        />
      }
    >
      {!cert ? (
        <div>
          <h4 data-view-title tabIndex={-1} className="sr-only">
            {view.topic ? `${topicLabel(view.topic)} certifications` : "All certifications"}
          </h4>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((c) => (
              <li key={c.name}>
                <button
                  type="button"
                  onClick={() => go({ topic: view.topic, cert: slug(c.name) })}
                  className="group/row flex h-full min-h-[60px] w-full items-center gap-3 rounded-lg border border-line bg-surface2/50 px-3 py-2.5 text-left transition-[border-color,background-color] duration-200 hover:border-accent/50 hover:bg-surface2 active:scale-[0.99]"
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-accent/25 bg-accent/10 transition-transform duration-200 group-hover/row:scale-105">
                    <Award size={15} className="text-accent" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-2 block text-[13px] font-medium leading-snug text-ink">{c.name}</span>
                    <span className="mt-0.5 block truncate font-mono text-[10.5px] text-dim">
                      {c.issuer} · {c.date}
                    </span>
                  </span>
                  {c.url && <BadgeCheck size={15} className="shrink-0 text-accent" aria-label="Has a verification link" role="img" />}
                  <ArrowRight size={14} aria-hidden className="hidden shrink-0 text-dim transition-[color,transform] duration-200 group-hover/row:translate-x-0.5 group-hover/row:text-accent sm:block" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <CertDetail
          cert={cert}
          list={list}
          topicLabel={topicLabel(cert.topic)}
          backLabel={view.topic ? topicLabel(view.topic) : "All certificates"}
          skillLinks={skillLinks}
          internship={internshipCompanies.includes(cert.issuer) ? cert.issuer : undefined}
          onBack={() => go({ topic: view.topic })}
          onOpen={(c) => go({ topic: view.topic, cert: slug(c.name) })}
        />
      )}
    </DrillFrame>
  );
}

function CertDetail({
  cert,
  list,
  topicLabel,
  backLabel,
  skillLinks,
  internship,
  onBack,
  onOpen,
}: {
  cert: Certification;
  list: Certification[];
  topicLabel: string;
  backLabel: string;
  skillLinks: Record<string, string>;
  internship?: string;
  onBack: () => void;
  onOpen: (c: Certification) => void;
}) {
  const idx = Math.max(0, list.indexOf(cert));
  const prev = list[(idx - 1 + list.length) % list.length];
  const next = list[(idx + 1) % list.length];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <BackButton label={backLabel} onClick={onBack} />
        {list.length > 1 && (
          <PrevNext index={idx} total={list.length} onPrev={() => onOpen(prev)} onNext={() => onOpen(next)} prevLabel={prev.name} nextLabel={next.name} />
        )}
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:gap-8">
        <div className="min-w-0">
          <div className="flex items-start gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-accent/30 bg-accent/10">
              <Award size={22} className="text-accent" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="label">{topicLabel}</p>
              <h4 data-view-title tabIndex={-1} className={`mt-0.5 font-display text-xl font-semibold leading-snug text-ink ${TITLE_FOCUS}`}>
                {cert.name}
              </h4>
            </div>
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 text-sm sm:grid-cols-3">
            <div className="col-span-2 sm:col-span-1">
              <dt className="label mb-1">Issued by</dt>
              <dd className="text-ink">{cert.issuer}</dd>
            </div>
            <div>
              <dt className="label mb-1">Date</dt>
              <dd className="text-ink">{cert.date}</dd>
            </div>
            {cert.grade && (
              <div>
                <dt className="label mb-1">Result</dt>
                <dd>
                  <span className="rounded border border-accent/40 bg-accent/10 px-1.5 py-0.5 font-mono text-[11px] text-accent">{cert.grade}</span>
                </dd>
              </div>
            )}
          </dl>
        </div>

        <div className="min-w-0 space-y-5">
          {cert.covers.length > 0 && (
            <div>
              <h5 className="label mb-2">Subjects</h5>
              <ul className="flex flex-wrap gap-1.5">
                {cert.covers.map((s) => (
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
          )}

          {internship && (
            <div>
              <h5 className="label mb-2">Related internship</h5>
              <a
                href={`#internships/${slug(internship)}`}
                className="group/rel flex items-center gap-3 rounded-lg border border-line bg-surface2/60 px-3 py-2.5 transition-colors hover:border-accent/50"
              >
                <Briefcase size={15} className="shrink-0 text-accent" aria-hidden />
                <span className="min-w-0 flex-1 text-[13px] font-medium text-ink">{internship}</span>
                <ArrowUpRight size={14} aria-hidden className="shrink-0 text-dim group-hover/rel:text-accent" />
              </a>
            </div>
          )}

          {cert.url && (
            <a
              href={cert.url}
              target="_blank"
              rel="noreferrer"
              className="btn-primary !px-4 !py-2 !text-xs"
              aria-label={`Verify ${cert.name} credential (opens in a new tab)`}
            >
              <BadgeCheck size={14} aria-hidden /> Verify credential <ArrowUpRight size={13} aria-hidden />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
