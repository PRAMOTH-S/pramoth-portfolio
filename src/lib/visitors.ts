import { appendFile, mkdir, readFile } from "node:fs/promises";
import { homedir } from "node:os";
import path from "node:path";

/** One line per event in a JSONL file. `view` = page load, `intro` = the visitor filled the card. */
export type Visit = {
  ts: string;
  type: "view" | "intro";
  visitorId?: string;
  name?: string;
  company?: string;
  role?: string;
  email?: string;
  note?: string;
  page?: string;
  referrer?: string;
  ip?: string;
  ua?: string;
  lang?: string;
  tz?: string;
  screen?: string;
};

export const logPath =
  process.env.VISITOR_LOG ?? path.join(homedir(), ".local", "state", "pramoth-portfolio-visitors.jsonl");

export async function appendVisit(v: Visit) {
  await mkdir(path.dirname(logPath), { recursive: true });
  await appendFile(logPath, JSON.stringify(v) + "\n", "utf8");
}

export async function readVisits(): Promise<Visit[]> {
  try {
    const raw = await readFile(logPath, "utf8");
    return raw
      .split("\n")
      .filter(Boolean)
      .map((l) => {
        try {
          return JSON.parse(l) as Visit;
        } catch {
          return null;
        }
      })
      .filter((v): v is Visit => v !== null)
      .reverse();
  } catch {
    return [];
  }
}

export function isAuthorized(key: string | null | undefined) {
  const expected = process.env.VISITOR_KEY;
  return Boolean(expected) && key === expected;
}

/** Best-effort client address: only present when a proxy forwards it. */
export function clientIp(headers: Headers) {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    headers.get("cf-connecting-ip") ||
    undefined
  );
}
