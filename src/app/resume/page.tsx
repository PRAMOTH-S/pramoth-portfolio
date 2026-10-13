import type { Metadata } from "next";
import Link from "next/link";
import { PrintButton } from "@/components/PrintButton";
import { RESUME_FILENAME, resume } from "@/lib/resumeContent";
import { buildResumeTex } from "@/lib/resumeTex";

export const metadata: Metadata = {
  title: "Résumé",
  description: `Résumé of ${resume.name} — ${resume.role}. Robotics (ROS 2), embedded systems, computer vision and product design.`,
  alternates: { canonical: "/resume" },
};

/* ATS-first résumé: single column, real text, standard section names, one A4 page in print.
   Wording comes from resumeContent so the LaTeX (Overleaf) version is identical. */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-4 first:mt-0">
      <h2 className="print-accent mb-1.5 border-b border-line pb-1 font-sans text-[12px] font-bold uppercase tracking-[0.12em] text-accent">{title}</h2>
      {children}
    </section>
  );
}

function Row({ left, right }: { left: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4">
      <span>{left}</span>
      {right && <span className="text-muted">{right}</span>}
    </div>
  );
}

export default function ResumePage() {
  const r = resume;
  const encodedSnip = encodeURIComponent(buildResumeTex());

  return (
    <div className="container pb-20 pt-24 md:pt-28">
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-4">
        <Link href="/" className="inline-flex min-h-6 items-center gap-2 font-mono text-xs text-muted hover:text-accent">
          ← Back to portfolio
        </Link>
        <div className="flex flex-wrap items-center gap-2.5">
          <form method="post" action="https://www.overleaf.com/docs" target="_blank" className="contents">
            <input type="hidden" name="encoded_snip" value={encodedSnip} />
            <input type="hidden" name="snip_name" value={RESUME_FILENAME} />
            <input type="hidden" name="engine" value="pdflatex" />
            <button type="submit" className="btn-primary !px-4 !py-2 !text-sm">
              Open in Overleaf ↗
            </button>
          </form>
          <a href="/resume.tex" download={`${RESUME_FILENAME}.tex`} className="btn-ghost !px-4 !py-2 !text-sm">
            Download .tex
          </a>
          <PrintButton />
        </div>
      </div>
      <p className="no-print mx-auto mb-6 max-w-[800px] text-xs leading-relaxed text-dim">
        Overleaf compiles the LaTeX version to a one-page PDF (Menu → Download PDF). &ldquo;Save as PDF&rdquo; prints this page instead. Both are single-column and
        plain-text for applicant tracking systems.
      </p>

      <article className="resume panel mx-auto max-w-[800px] p-6 text-[13px] leading-snug text-ink md:p-10" aria-label="Résumé">
        <header className="text-center">
          <h1 className="font-sans text-[26px] font-bold tracking-tight text-ink">{r.name}</h1>
          <p className="print-accent mt-0.5 text-[13px] font-semibold text-accent">{r.role}</p>
          <p className="mt-1.5 text-[12px] text-muted">
            {r.location} | <a href={`tel:${r.phone.replace(/\s/g, "")}`} className="inline-flex min-h-6 items-center">{r.phone}</a> | <a href={`mailto:${r.email}`} className="inline-flex min-h-6 items-center">{r.email}</a> |{" "}
            <a href={r.linkedin} target="_blank" rel="noreferrer" className="inline-flex min-h-6 items-center">
              {r.linkedinHandle}
            </a>{" "}
            |{" "}
            <a href={r.github} target="_blank" rel="noreferrer" className="inline-flex min-h-6 items-center">
              {r.githubHandle}
            </a>
          </p>
        </header>

        <div className="mt-4">
          <Section title="Professional Summary">
            <p>{r.summary}</p>
          </Section>

          <Section title="Work Experience">
            {r.experience.map((e) => (
              <div key={e.company + e.role}>
                <Row
                  left={
                    <h3 className="inline font-bold text-ink">
                      {e.role}, {e.company}
                    </h3>
                  }
                  right={e.period}
                />
                {e.location && <p className="text-muted">{e.location}</p>}
                <ul className="mt-1 list-disc space-y-0.5 pl-5">
                  {e.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </Section>

          <Section title="Projects">
            <ul className="space-y-2">
              {r.projects.map((p) => (
                <li key={p.title}>
                  <Row left={<h3 className="inline font-bold text-ink">{p.title}</h3>} right={p.tech.join(", ")} />
                  <ul className="list-disc space-y-0.5 pl-5">
                    {p.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Technical Skills">
            <ul className="space-y-0.5">
              {r.skills.map((g) => (
                <li key={g.title}>
                  <span className="font-bold text-ink">{g.title}: </span>
                  {g.items.join(", ")}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Internships">
            <ul className="space-y-0.5">
              {r.internships.map((it) => (
                <li key={it.role + it.where}>
                  <Row
                    left={
                      <>
                        <span className="font-bold text-ink">{it.role}</span>, {it.where}
                      </>
                    }
                    right={it.period}
                  />
                  {it.bullet && (
                    <ul className="list-disc pl-5">
                      <li>{it.bullet}</li>
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Education">
            <ul className="space-y-0.5">
              {r.education.map((e) => (
                <li key={e.degree}>
                  <Row
                    left={
                      <>
                        <span className="font-bold text-ink">{e.degree}</span>, {e.institution}
                      </>
                    }
                    right={[e.period, e.grade].filter(Boolean).join(" | ")}
                  />
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Achievements">
            <ul className="space-y-0.5">
              {r.achievements.map((a) => (
                <li key={a.title}>
                  <Row
                    left={
                      <>
                        <span className="font-bold text-ink">{a.title}</span> - {a.detail}
                      </>
                    }
                    right={a.year || undefined}
                  />
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Certifications">
            <ul className="space-y-0.5 md:columns-2 print:columns-2">
              {r.certifications.map((c) => (
                <li key={c.name} className="break-inside-avoid">
                  {c.name}, {c.issuer}
                  {c.grade && ` (${c.grade})`}, {c.date}
                </li>
              ))}
            </ul>
            <p className="mt-1 text-muted">Languages: {r.languages.join(", ")}</p>
          </Section>
        </div>
      </article>
    </div>
  );
}
