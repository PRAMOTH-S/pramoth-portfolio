import { site } from "@/data/site";

export type Repo = {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics?: string[];
  fork: boolean;
  pushed_at: string;
};

export type GitHubUser = {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
};

const headers = (): HeadersInit => {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  // Token is read server-side only and never sent to the browser.
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
};

async function gh<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`https://api.github.com${path}`, {
      headers: headers(),
      next: { revalidate: 3600 }, // refresh at most once an hour
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function getGitHubData() {
  const user = site.github.username;
  const [profile, repos] = await Promise.all([
    gh<GitHubUser>(`/users/${user}`),
    gh<Repo[]>(`/users/${user}/repos?per_page=100&sort=pushed`),
  ]);

  const own = (repos ?? []).filter((r) => !r.fork && r.name.toLowerCase() !== user.toLowerCase());
  const featuredSet = new Set<string>(site.featuredRepos.map((n) => n.toLowerCase()));
  const featured = own.filter((r) => featuredSet.has(r.name.toLowerCase()));
  const recent = own.filter((r) => !featuredSet.has(r.name.toLowerCase())).slice(0, 6);

  // Language mix across public, non-fork repos (by primary language)
  const langCount = new Map<string, number>();
  for (const r of own) if (r.language) langCount.set(r.language, (langCount.get(r.language) ?? 0) + 1);
  const languages = [...langCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);

  const totalStars = own.reduce((s, r) => s + r.stargazers_count, 0);

  return {
    ok: profile !== null && repos !== null,
    profile,
    featured,
    recent,
    languages,
    totalStars,
    repoCount: own.length,
  };
}

export const timeAgo = (iso: string) => {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days < 1) return "today";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
};
