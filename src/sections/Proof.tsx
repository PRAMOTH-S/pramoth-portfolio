import Image from "next/image";
import { GitFork, Github, Star, Trophy } from "lucide-react";
import { achievements } from "@/data/achievements";
import { site } from "@/data/site";
import { getGitHubData, timeAgo, type Repo } from "@/lib/github";
import { Fill, Section, SectionHeader } from "@/components/ui";
import { Reveal } from "@/components/Motion";
import { TiltCard } from "@/components/Effects";

export function Achievements() {
  return (
    <Section id="achievements">
      <SectionHeader index="07" label="Achievements" title="Recognition." />
      <ul className="grid gap-5 md:grid-cols-3">
        {achievements.map((a, i) => (
          <Reveal as="li" key={a.event} delay={i * 0.06} className="h-full">
            <TiltCard className="panel relative h-full overflow-hidden p-6 transition-all duration-300 hover:border-accent/50 hover:glow-accent">
              <div aria-hidden className="bg-grid absolute inset-0 opacity-40" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-lg border border-accent/30 bg-accent/10">
                    <Trophy size={18} className="text-accent" aria-hidden />
                  </span>
                  <span className="font-mono text-xs text-muted"><Fill>{a.year}</Fill></span>
                </div>
                <p className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-accent">{a.title}</p>
                <h3 className="mt-2 font-display text-xl font-semibold text-ink">{a.event}</h3>
                <p className="mt-3 text-sm text-muted"><Fill>{a.detail}</Fill></p>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}

function RepoCard({ r, featured = false }: { r: Repo; featured?: boolean }) {
  return (
    <article className={`panel flex h-full flex-col p-5 transition-colors hover:border-accent/50 ${featured ? "border-accent/40" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <h3 className="break-all font-mono text-sm font-semibold text-ink">{r.name}</h3>
        {featured && <span className="chip border-accent/40 text-accent">featured</span>}
      </div>
      <p className="mt-2 line-clamp-3 text-sm text-muted">{r.description ?? "No description on GitHub yet."}</p>
      {r.topics && r.topics.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {r.topics.slice(0, 4).map((t) => <li key={t} className="chip">{t}</li>)}
        </ul>
      )}
      <div className="mt-auto flex flex-wrap items-center gap-4 pt-5 font-mono text-xs text-dim">
        {r.language && (
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-accent" />{r.language}</span>
        )}
        <span className="flex items-center gap-1"><Star size={12} aria-hidden />{r.stargazers_count}<span className="sr-only">stars</span></span>
        <span className="flex items-center gap-1"><GitFork size={12} aria-hidden />{r.forks_count}<span className="sr-only">forks</span></span>
        <span>updated {timeAgo(r.pushed_at)}</span>
      </div>
      <a href={r.html_url} target="_blank" rel="noreferrer" className="link-underline mt-4 text-sm text-ink">
        View repository<span className="sr-only">: {r.name}</span>
      </a>
    </article>
  );
}

export async function GitHubSection() {
  const gh = await getGitHubData();
  const user = site.github.username;

  return (
    <Section id="github" className="bg-surface/40">
      <SectionHeader
        index="08"
        label="GitHub"
        title="The work, in the open."
        intro="Pulled live from the GitHub API and refreshed hourly."
      />

      {gh.ok && gh.profile ? (
        <>
          <Reveal>
            <div className="panel flex flex-col gap-6 p-5 md:flex-row md:items-center md:justify-between md:p-6">
              <div className="flex items-center gap-4">
                <Image src={gh.profile.avatar_url} alt={`${user} GitHub avatar`} width={56} height={56} className="rounded-full border border-line-strong" />
                <div>
                  <p className="font-display text-lg font-semibold text-ink">{gh.profile.name ?? user}</p>
                  <a href={gh.profile.html_url} target="_blank" rel="noreferrer" className="font-mono text-xs text-accent hover:underline">@{gh.profile.login}</a>
                </div>
              </div>
              <dl className="grid grid-cols-3 gap-6 text-center md:text-left">
                {[
                  ["Repositories", gh.repoCount],
                  ["Stars", gh.totalStars],
                  ["Followers", gh.profile.followers],
                ].map(([k, v]) => (
                  <div key={k} className="flex flex-col-reverse">
                    <dt className="label mt-1">{k}</dt>
                    <dd className="font-display text-2xl font-semibold text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>

          {gh.languages.length > 0 && (
            <Reveal>
              <div className="panel mt-5 p-5 md:p-6">
                <p className="label mb-4">Primary languages across public repositories</p>
                <div className="flex h-2 overflow-hidden rounded-full bg-surface2">
                  {gh.languages.map(([lang, n], i) => (
                    <span key={lang} style={{ width: `${(n / gh.repoCount) * 100}%`, opacity: 1 - i * 0.13 }} className="bg-accent" />
                  ))}
                </div>
                <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-muted">
                  {gh.languages.map(([lang, n]) => (
                    <li key={lang}>{lang} <span className="text-dim">· {n}</span></li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )}

          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[...gh.featured.map((r) => ({ r, f: true })), ...gh.recent.map((r) => ({ r, f: false }))].map(({ r, f }) => (
              <li key={r.name}><RepoCard r={r} featured={f} /></li>
            ))}
          </ul>
        </>
      ) : (
        <div className="panel p-6 text-muted">
          GitHub data could not be loaded right now.{" "}
          <a className="link-underline text-ink" href={site.github.url} target="_blank" rel="noreferrer">
            View the profile on GitHub
          </a>
          .
        </div>
      )}

      <Reveal>
        <figure className="panel mt-8 overflow-x-auto p-5 md:p-6">
          <figcaption className="label mb-4">Contribution activity</figcaption>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://ghchart.rshah.org/34d27b/${user}`}
            alt={`${user} GitHub contribution calendar`}
            loading="lazy"
            className="min-w-[640px] w-full opacity-90 [filter:invert(0.92)_hue-rotate(180deg)]"
          />
        </figure>
      </Reveal>

      <div className="mt-8">
        <a href={site.github.url} target="_blank" rel="noreferrer" className="btn-ghost">
          <Github size={16} /> All repositories
        </a>
      </div>
    </Section>
  );
}
