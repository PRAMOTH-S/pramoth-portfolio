// Server-side: links every skill to the projects that actually used it, so the
// client Skills console receives only light {slug, title, image} records
// (never full Project objects — their unfinished case-study text must not ship).
import { projects } from "@/data/projects";
import { skillGroups } from "@/data/skills";
import { slug } from "@/lib/slug";

export type SkillProject = { slug: string; title: string; image?: string };
export type SkillEvidence = { projects: SkillProject[]; variants: string[] };

// Skills a project's text states but its `tech` list doesn't name (sourced from the
// project summaries / features — keep this list truthful).
const STATED: Record<string, string[]> = {
  Odometry: ["autonomous-vacuum-robot"],
  "Coverage Path Planning": ["autonomous-vacuum-robot"],
  "Boustrophedon / Zig-Zag Coverage": ["autonomous-vacuum-robot"],
  "Autonomous Mobile Robots": ["autonomous-vacuum-robot"],
  "Sensor Integration": ["autonomous-vacuum-robot"],
  Encoders: ["autonomous-vacuum-robot"],
  "Motor Drivers": ["autonomous-vacuum-robot"],
  "Firmware Development": ["autonomous-vacuum-robot"],
  "Embedded Linux": ["autonomous-vacuum-robot"],
  "Linux / Ubuntu": ["autonomous-vacuum-robot"],
  "Hardware Integration": ["autonomous-vacuum-robot"],
  Sensors: ["autonomous-vacuum-robot", "smart-car-shed"],
  "Object Detection": ["helmet-detection", "shoplifting-detection", "moving-object-detection"],
  "Deep Learning": ["helmet-detection", "shoplifting-detection"],
  "Image Processing": ["moving-object-detection"],
};

const norm = (s: string) =>
  s.toLowerCase().replace(/\(.*?\)/g, "").replace(/[^a-z0-9+#. ]/g, " ").replace(/\s+/g, " ").trim();

function matches(skill: string, tech: string) {
  const a = norm(skill);
  const b = norm(tech);
  if (!a || !b) return false;
  if (a === b) return true;
  if (a.length <= 2 || b.length <= 2) return false;
  return a.includes(b) || b.includes(a);
}

function evidenceFor(skill: string): SkillEvidence {
  const aliases = skill.split("/").map((s) => s.trim());
  const variants = new Set<string>();
  const hits = projects.filter((p) => {
    const used = p.tech.filter((t) => aliases.some((a) => matches(a, t)));
    // "YOLO" → "YOLOv5", "YOLOv8": versions worth showing
    for (const t of used) if (aliases.some((a) => /^v?\d/.test(norm(t).slice(norm(a).length).trim()) && norm(t).startsWith(norm(a)) && norm(t) !== norm(a))) variants.add(t);
    return used.length > 0 || STATED[skill]?.includes(p.slug);
  });
  return {
    projects: hits.map((p) => ({ slug: p.slug, title: p.title, image: p.image })),
    variants: [...variants].sort(),
  };
}

export function skillEvidence(): Record<string, SkillEvidence> {
  return Object.fromEntries(skillGroups.flatMap((g) => g.items).map((s) => [s, evidenceFor(s)]));
}

/** "#skills/<discipline>/<tool>" for every name that is a listed skill (exact match), so other
 *  sections can link straight into the Skills console. */
export function skillLinks(names: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const n of names) {
    const g = skillGroups.find((x) => x.items.includes(n));
    if (g) out[n] = `#skills/${g.id}/${slug(n)}`;
  }
  return out;
}
