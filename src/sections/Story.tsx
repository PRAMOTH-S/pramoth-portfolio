import { Award } from "lucide-react";
import { about, site } from "@/data/site";
import { certifications, certTopics, experience, education, internshipProof, internships } from "@/data/experience";
import { projects } from "@/data/projects";
import { skillGroups } from "@/data/skills";
import { Fill, Section, SectionHeader } from "@/components/ui";
import { InternshipConsole } from "@/components/InternshipConsole";
import { CertConsole } from "@/components/CertConsole";
import { skillLinks } from "@/lib/skillEvidence";
import { slug as slugify } from "@/lib/slug";
import { Reveal } from "@/components/Motion";
import { Counter, TiltCard, TimelineDraw } from "@/components/Effects";
import { PointCloudMorph } from "@/components/PointCloudMorph";

export function About() {
  return (
    <Section id="about">
      <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <SectionHeader index="01" label="About" title="An engineer who builds the whole product." />
          <Reveal>
            <p className="max-w-2xl text-base leading-relaxed text-ink md:text-lg">{about.lead}</p>
            <dl className="mt-6 grid max-w-2xl gap-x-4 gap-y-5 border-t border-line pt-5 text-sm sm:grid-cols-3">
              <div>
                <dt className="label mb-1">Role</dt>
                <dd className="text-ink">{site.role}</dd>
              </div>
              <div>
                <dt className="label mb-1">Company</dt>
                <dd className="text-ink">{site.company}</dd>
              </div>
              <div>
                <dt className="label mb-1">Based in</dt>
                <dd className="text-ink">{site.location}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="label mb-1">Education</dt>
                <dd className="text-ink">{site.education} · Class of {site.graduationYear}</dd>
              </div>
              <div>
                <dt className="label mb-1">Languages</dt>
                <dd className="text-ink">{site.languages.join(" · ")}</dd>
              </div>
            </dl>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="mx-auto w-full max-w-[400px] lg:max-w-[460px]">
          <PointCloudMorph />
        </Reveal>
      </div>
    </Section>
  );
}

// Every number is derived from the data files — nothing hand-typed or estimated.
const STATS = [
  { value: projects.length, suffix: "", label: "Projects built" },
  { value: skillGroups.reduce((n, g) => n + g.items.length, 0), suffix: "", label: "Technologies" },
  { value: certifications.length, suffix: "", label: "Certifications" },
  { value: internships.length, suffix: "", label: "Internships" },
] as const;

export function Experience() {
  return (
    <Section id="experience">
      <SectionHeader index="02" label="Experience" title="Where I build." />
      <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-start">
        <ol className="relative pl-6">
          <TimelineDraw />
          {experience.map((e) => (
            <Reveal as="li" key={e.company + e.role} className="relative pb-8">
              <span className="absolute -left-[30px] top-1 h-2.5 w-2.5 rounded-full border-2 border-accent bg-bg" aria-hidden />
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-display text-lg font-semibold text-ink">{e.role}</h3>
                <p className="font-mono text-[11px] text-muted"><Fill>{e.period}</Fill></p>
              </div>
              <p className="mt-0.5 text-sm text-accent">
                {e.company}
                {e.location && <span className="text-dim"> · {e.location}</span>}
              </p>
              <p className="mt-2 text-sm text-muted"><Fill>{e.summary}</Fill></p>
              <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Areas">
                {e.areas.map((a) => <li key={a} className="chip">{a}</li>)}
              </ul>
            </Reveal>
          ))}
          <Reveal as="li" className="relative">
            <span className="absolute -left-[30px] top-1 h-2.5 w-2.5 rounded-full border-2 border-line-strong bg-bg" aria-hidden />
            <p className="label mb-1">Education</p>
            {education.map((e) => (
              <div key={e.institution} className="mb-4 last:mb-0">
                <h3 className="font-display text-base font-semibold text-ink">{e.degree}</h3>
                <p className="mt-0.5 text-sm text-muted">
                  {e.institution}
                  {e.period && <> · {e.period}</>}
                  {e.grade && <span className="text-accent"> · {e.grade}</span>}
                </p>
              </div>
            ))}
          </Reveal>
        </ol>

        <Reveal delay={0.1}>
          <TiltCard className="panel relative overflow-hidden p-6">
            <div aria-hidden className="bg-dots absolute inset-0 opacity-30" />
            <div className="relative">
              <p className="label mb-5">By the numbers</p>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-6">
                {STATS.map((s) => (
                  <div key={s.label}>
                    <dd className="font-display text-3xl font-bold text-accent">
                      <Counter to={s.value} suffix={s.suffix} />
                    </dd>
                    <dt className="mt-1 text-xs text-muted">{s.label}</dt>
                  </div>
                ))}
              </dl>
            </div>
          </TiltCard>
        </Reveal>
      </div>

      {certifications.length > 0 && (
        <div className="mt-14">
          <h3 className="label mb-5 flex items-center gap-2">
            <Award size={13} className="text-accent" aria-hidden />
            Licenses &amp; certifications
          </h3>
          <CertConsole
            certs={certifications}
            topics={certTopics}
            skillLinks={skillLinks(certifications.flatMap((c) => c.covers))}
            internshipCompanies={internships.map((i) => i.company)}
          />
        </div>
      )}
    </Section>
  );
}

// "2 mos" → 2, "1 mo" → 1, "2 wks" → 0.5; shown rounded.
const internMonths = Math.round(
  internships.reduce((n, it) => n + (parseInt(it.duration, 10) || 0) / (/wk/.test(it.duration) ? 4 : 1), 0),
);
const INTERN_STATS = [
  { value: internships.length, label: "Internships" },
  { value: internMonths, label: "Months of training" },
  { value: new Set(internships.map((i) => i.focus)).size, label: "Domains" },
  { value: new Set(internships.map((i) => i.location).filter(Boolean)).size, label: "Cities" },
] as const;

export function Internships() {
  if (internships.length === 0) return null;
  const chrono = [...internships].reverse();
  const first = chrono[0].period.split(" – ")[0];
  const last = chrono[chrono.length - 1].period.split(" – ").at(-1);
  const certsByCompany = Object.fromEntries(
    internships.map((i) => [
      i.company,
      certifications.filter((c) => c.issuer === i.company).map((c) => ({ name: c.name, href: `#certifications/all/${slugify(c.name)}` })),
    ]),
  );
  return (
    <Section id="internships">
      <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end">
        <SectionHeader
          index="05"
          label="Internships"
          title="Industry internships, verified."
          intro={`Six internships between ${first} and ${last} across AI & data, web, Python, VLSI, electric vehicles and network security.`}
        />
        <Reveal delay={0.1} className="mb-8 md:mb-10">
          <dl className="grid grid-cols-4 gap-3 rounded-xl border border-line bg-surface/60 p-4">
            {INTERN_STATS.map((s) => (
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
      <InternshipConsole
        internships={internships}
        proof={internshipProof}
        skillLinks={skillLinks(internships.flatMap((i) => i.skills))}
        certsByCompany={certsByCompany}
      />
    </Section>
  );
}
