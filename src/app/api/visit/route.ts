import { NextResponse } from "next/server";
import { appendVisit, clientIp, isAuthorized, readVisits, type Visit } from "@/lib/visitors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const clip = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : undefined) || undefined;

/** Visitors post here: a `view` ping on load and an `intro` when the card is filled in. */
export async function POST(req: Request) {
  if ((Number(req.headers.get("content-length")) || 0) > 8_000) {
    return NextResponse.json({ ok: false }, { status: 413 });
  }
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const type = body.type === "intro" ? "intro" : "view";
  if (type === "intro" && !clip(body.name)) {
    return NextResponse.json({ ok: false, error: "name required" }, { status: 400 });
  }
  const visit: Visit = {
    ts: new Date().toISOString(),
    type,
    visitorId: clip(body.visitorId, 64),
    name: clip(body.name, 80),
    company: clip(body.company, 120),
    role: clip(body.role, 60),
    email: clip(body.email, 120),
    note: clip(body.note, 400),
    page: clip(body.page, 200),
    referrer: clip(body.referrer, 300),
    ip: clientIp(req.headers),
    ua: clip(req.headers.get("user-agent"), 300),
    lang: clip(req.headers.get("accept-language"), 60),
    tz: clip(body.tz, 60),
    screen: clip(body.screen, 20),
  };
  try {
    await appendVisit(visit);
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

/** Owner-only: `GET /api/visit?key=<VISITOR_KEY>` returns the log, newest first. */
export async function GET(req: Request) {
  const key = new URL(req.url).searchParams.get("key");
  if (!isAuthorized(key)) return NextResponse.json({ ok: false }, { status: 403 });
  const visits = await readVisits();
  return NextResponse.json({ ok: true, count: visits.length, visits });
}
