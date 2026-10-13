import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Github } from "lucide-react";
import { getProject, projects } from "@/data/projects";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { CoverageViz, Pipeline, TfTree } from "@/components/Diagrams";
import { CLEAN_PIPELINE, NAV_PIPELINE } from "@/sections/Projects";

type Props = { params: Promise<{ slug: string }> };

// Content hygiene: anything still marked [ADD …]/[VERIFY …] is an authoring note, not public copy.
const NOTE = /\s*[—–-]?\s*\[(ADD|VERIFY|ALGORITHM|YEAR)[^\]]*\]/g;
const clean = (s: string) => s.replace(NOTE, "").trim();
const cleanList = (xs: string[]) => xs.map(clean).filter(Boolean);

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.summary,
    alternates: { canonical: `/projects/${p.slug}` },
    robots: { index: false, follow: true },
    openGraph: { title: p.title, description: p.summary, url: `/projects/${p.slug}` },
  };
}

function Block({ n, title, children, hidden = false }: { n: number; title: string; children: React.ReactNode; hidden?: boolean }) {
  if (hidden) return null;
  const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="grid gap-4 border-t border-line py-10 md:grid-cols-[220px_1fr] md:gap-10">
      <h2 id={`${id}-h`} className="font-mono text-xs uppercase tracking-[0.18em] text-dim">
        <span className="text-accent">{String(n).padStart(2, "0")}</span> — {title}
      </h2>
      <div className="min-w-0 space-y-4 text-muted">{children}</div>
    </section>
  );
}

const List = ({ items }: { items: string[] }) => (
  <ul className="space-y-2">
    {items.map((x, i) => (
      <li key={i} className="flex gap-3"><span className="text-accent">▹</span><span>{x}</span></li>
    ))}
  </ul>
);

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const c = p.caseStudy;
  const isFlagship = !!p.flagship;
  const hardware = cleanList(c.hardware);
  const software = cleanList(c.software);
  const implementation = cleanList(c.implementation);
  const challenges = cleanList(c.challenges);
  const testing = cleanList(c.testing);
  const results = cleanList(c.results);
  const future = cleanList(c.future);
  const algorithms = c.algorithms.map((a) => ({ name: clean(a.name), body: clean(a.body) })).filter((a) => a.name && a.body);
  const decisions = c.decisions.map((d) => ({ decision: clean(d.decision), why: clean(d.why) })).filter((d) => d.decision);
  const tech = p.tech.filter((t) => !t.includes("["));
  const inProgress = !isFlagship && [hardware, software, implementation, results].every((xs) => xs.length === 0);
  let n = 0;
  const next = () => ++n;

  return (
    <article className="pb-24 pt-28 md:pt-36">
      <div className="container">
        <Link href="/#projects" className="inline-flex min-h-6 items-center gap-2 font-mono text-xs text-muted hover:text-accent">
          <ArrowLeft size={14} /> All projects
        </Link>

        <header className="mt-8 max-w-4xl">
          <p className="label text-accent">{isFlagship ? "Flagship · " : ""}{p.category}</p>
          <h1 className="mt-3 text-balance font-display text-4xl font-semibold tracking-tight text-ink md:text-6xl">{p.title}</h1>
          <p className="mt-5 text-lg text-muted md:text-xl">{clean(p.summary)}</p>
          {(p.repo || p.demo) && (
            <div className="mt-8 flex flex-wrap gap-3">
              {p.repo && (
                <a href={p.repo} target="_blank" rel="noreferrer" className="btn-primary"><Github size={16} /> Source code</a>
              )}
              {p.demo && (
                <a href={p.demo} target="_blank" rel="noreferrer" className="btn-ghost">Video demo <ArrowUpRight size={16} /></a>
              )}
            </div>
          )}
          <ul className="mt-8 flex flex-wrap gap-1.5" aria-label="Technologies">
            {tech.map((t) => <li key={t} className="chip">{t}</li>)}
          </ul>
          {inProgress && (
            <p className="mt-8 max-w-2xl rounded-lg border border-line bg-surface px-4 py-3 text-sm text-muted">
              The detailed write-up for this project is in progress. {p.repo ? "The source code is available above." : "Happy to walk through it on a call."}
            </p>
          )}
        </header>

        <div className="mt-16">
          <Block n={next()} title="Overview"><p>{clean(c.overview)}</p></Block>
          <Block n={next()} title="Problem"><p>{clean(c.problem)}</p></Block>
          <Block n={clean(c.objective) ? next() : 0} title="Objective" hidden={!clean(c.objective)}><p>{clean(c.objective)}</p></Block>

          <Block n={clean(c.architecture) ? next() : 0} title="System Architecture" hidden={!clean(c.architecture)}>
            <p>{clean(c.architecture)}</p>
            {isFlagship && (
              <div className="space-y-6 pt-2">
                <ArchitectureDiagram />
                <div className="grid gap-6 lg:grid-cols-2">
                  <TfTree />
                  <Pipeline title="Sensor flow" steps={["LiDAR → /scan", "Encoders → ESP32", "ESP32 → /odom", "TF: odom → base_footprint", "SLAM + Nav2"]} />
                </div>
                <Pipeline title="Hardware architecture" steps={["Battery / power", "Raspberry Pi 5", "USB/UART link", "ESP32", "Motor driver", "DC motors + encoders", "Vacuum motor"]} />
              </div>
            )}
          </Block>

          <Block n={hardware.length ? next() : 0} title="Hardware" hidden={!hardware.length}><List items={hardware} /></Block>
          <Block n={software.length ? next() : 0} title="Software" hidden={!software.length}><List items={software} /></Block>
          <Block n={implementation.length ? next() : 0} title="Implementation" hidden={!implementation.length}><List items={implementation} /></Block>

          <Block n={algorithms.length || isFlagship ? next() : 0} title="Algorithms" hidden={!algorithms.length && !isFlagship}>
            <div className="grid gap-4 md:grid-cols-2">
              {algorithms.map((a) => (
                <div key={a.name} className="panel p-5">
                  <h3 className="font-display text-lg font-semibold text-ink">{a.name}</h3>
                  <p className="mt-2 text-sm">{a.body}</p>
                </div>
              ))}
            </div>
            {isFlagship && (
              <div className="space-y-6 pt-2">
                <Pipeline title="SLAM pipeline" steps={["/scan", "Scan matching", "Pose graph + odometry", "Occupancy grid", "/map + map → odom"]} />
                <Pipeline title="Nav2 pipeline" steps={["Goal / waypoint", "BT Navigator", "Global planner", "Controller", "Costmaps", "Recovery behaviors", "/cmd_vel"]} />
                <Pipeline title="Navigation pipeline" steps={NAV_PIPELINE} />
                <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
                  <Pipeline title="Cleaning / coverage pipeline" steps={CLEAN_PIPELINE} />
                  <CoverageViz />
                </div>
              </div>
            )}
          </Block>

          <Block n={challenges.length ? next() : 0} title="Challenges" hidden={!challenges.length}><List items={challenges} /></Block>

          <Block n={decisions.length ? next() : 0} title="Engineering Decisions" hidden={!decisions.length}>
            <dl className="space-y-4">
              {decisions.map((d, i) => (
                <div key={i} className="panel p-5">
                  <dt className="font-medium text-ink">{d.decision}</dt>
                  {d.why && <dd className="mt-1 text-sm">{d.why}</dd>}
                </div>
              ))}
            </dl>
          </Block>

          <Block n={testing.length || isFlagship ? next() : 0} title="Testing" hidden={!testing.length && !isFlagship}>
            <List items={testing} />
            {isFlagship && (
              <Pipeline title="Simulation → hardware workflow" steps={["URDF / model", "Gazebo simulation", "RViz validation", "Tune Nav2 & SLAM", "Bench test (ESP32 + motors)", "Floor trials"]} />
            )}
          </Block>

          <Block n={results.length ? next() : 0} title="Results" hidden={!results.length}><List items={results} /></Block>
          <Block n={future.length ? next() : 0} title="Future Improvements" hidden={!future.length}><List items={future} /></Block>

          <Block n={p.repo ? next() : 0} title="GitHub Repository" hidden={!p.repo}>
            {p.repo && (
              <a href={p.repo} target="_blank" rel="noreferrer" className="panel flex items-center justify-between gap-4 p-5 text-ink transition-colors hover:border-accent/60 hover:text-accent">
                <span className="flex items-center gap-3 font-mono text-sm"><Github size={18} /> {p.repo.replace("https://github.com/", "")}</span>
                <ArrowUpRight size={18} />
              </a>
            )}
          </Block>
        </div>
      </div>
    </article>
  );
}
