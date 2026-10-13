import type { Metadata } from "next";
import { isAuthorized, readVisits, type Visit } from "@/lib/visitors";

export const metadata: Metadata = { title: "Visitors", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const fmt = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Kolkata",
});

function device(ua?: string) {
  if (!ua) return "—";
  const os = /iPhone|iPad/.test(ua) ? "iOS" : /Android/.test(ua) ? "Android" : /Windows/.test(ua) ? "Windows" : /Mac OS/.test(ua) ? "macOS" : /Linux/.test(ua) ? "Linux" : "—";
  const br = /Edg\//.test(ua) ? "Edge" : /Brave/.test(ua) ? "Brave" : /Chrome\//.test(ua) ? "Chrome" : /Firefox\//.test(ua) ? "Firefox" : /Safari\//.test(ua) ? "Safari" : "—";
  return `${os} · ${br}`;
}

export default async function VisitorsPage({ searchParams }: { searchParams: Promise<{ key?: string }> }) {
  const { key } = await searchParams;
  const authed = isAuthorized(key);
  const visits = authed ? await readVisits() : [];
  const views = visits.filter((v) => v.type === "view");
  const uniqueDevices = new Set(views.map((v) => v.visitorId ?? v.ua)).size;

  return (
    <section className="container pb-20 pt-28">
      <p className="label mb-3">Owner only</p>
      <h1 className="font-display text-2xl font-semibold tracking-tight text-ink md:text-4xl">Who visited</h1>

      {!authed ? (
        <form method="get" className="mt-8 max-w-sm">
          <label className="label mb-1 block" htmlFor="key">
            Access key
          </label>
          <div className="flex gap-2">
            <input
              id="key"
              name="key"
              type="password"
              required
              className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink focus:border-accent"
            />
            <button type="submit" className="btn-primary !py-2 !text-sm">
              Open
            </button>
          </div>
          {key && <p className="mt-3 text-sm text-warn">Wrong key.</p>}
          <p className="mt-4 text-xs text-dim">The key is VISITOR_KEY in the project&apos;s .env.local file.</p>
        </form>
      ) : (
        <>
          <dl className="mt-8 grid max-w-sm grid-cols-2 gap-3">
            {[
              [views.length, "Page views"],
              [uniqueDevices, "Unique devices"],
            ].map(([n, l]) => (
              <div key={l} className="panel p-4">
                <dd className="font-display text-3xl font-bold text-accent">{n}</dd>
                <dt className="mt-1 text-xs text-muted">{l}</dt>
              </div>
            ))}
          </dl>

          <h2 className="label mb-4 mt-12">Recent page views</h2>
          <div className="overflow-x-auto rounded-xl border border-line">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface font-mono text-[11px] uppercase tracking-label text-dim">
                <tr>
                  <th className="px-4 py-3 font-normal">When (IST)</th>
                  <th className="px-4 py-3 font-normal">Device</th>
                  <th className="px-4 py-3 font-normal">Time zone</th>
                  <th className="px-4 py-3 font-normal">Came from</th>
                  <th className="px-4 py-3 font-normal">Page</th>
                  <th className="px-4 py-3 font-normal">IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {views.slice(0, 200).map((v: Visit, i) => (
                  <tr key={v.ts + i} className="text-muted">
                    <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs">{fmt.format(new Date(v.ts))}</td>
                    <td className="whitespace-nowrap px-4 py-2.5">{device(v.ua)}</td>
                    <td className="whitespace-nowrap px-4 py-2.5">{v.tz ?? "—"}</td>
                    <td className="max-w-[240px] truncate px-4 py-2.5">{v.referrer ?? "direct"}</td>
                    <td className="px-4 py-2.5 font-mono text-xs">{v.page ?? "/"}</td>
                    <td className="px-4 py-2.5 font-mono text-xs">{v.ip ?? "—"}</td>
                  </tr>
                ))}
                {views.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-muted">
                      No views logged yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-dim">
            IP shows only when the site is served behind a proxy that forwards it. Time zone and device come from the visitor&apos;s browser.
          </p>
        </>
      )}
    </section>
  );
}
