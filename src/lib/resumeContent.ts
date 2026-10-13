import { site } from "@/data/site";
import { achievements, certifications, education, experience, internships } from "@/data/experience";
import { projects } from "@/data/projects";
import { skillGroups } from "@/data/skills";

/* ──────────────────────────────────────────────────────────────────────────
   Single source for the résumé wording used by /resume (HTML) and the
   LaTeX generator. ATS-oriented: third person, every bullet opens with an
   action verb, measurable results wherever a verified figure exists, US
   spelling, ASCII punctuation, one page.
   ────────────────────────────────────────────────────────────────────────── */

/** US spelling + punctuation normalization for résumé text. */
export function rz(s: string): string {
  const US: [RegExp, (m: string) => string][] = [
    [/\blocalis(ation|ing|e|es|ed)\b/gi, (m) => m.replace(/is/, "iz")],
    [/\boptimis(ation|ing|e|es|ed)\b/gi, (m) => m.replace(/is/, "iz")],
    [/\bvisualis(ation|ing|e|es|ed|er)\b/gi, (m) => m.replace(/is/, "iz")],
    [/\borganis(ation|ing|e|es|ed)\b/gi, (m) => m.replace(/is/, "iz")],
    [/\brecognis(ing|e|es|ed)\b/gi, (m) => m.replace(/is/, "iz")],
    [/\banalys(ing|e|es|ed)\b/gi, (m) => m.replace(/ys/, "yz")],
    [/\bbehaviours?\b/gi, (m) => m.replace("ou", "o")],
    [/\bmodelling\b/gi, () => "modeling"],
    [/\bmodelled\b/gi, () => "modeled"],
    [/\blabelled\b/gi, () => "labeled"],
    [/\bcolour/gi, () => "color"],
  ];
  let out = s;
  for (const [re, rep] of US) out = out.replace(re, rep);
  return out
    .replace(/[–—]/g, "-")
    .replace(/\s*·\s*/g, ", ")
    .replace(/\bWiFi\b/g, "Wi-Fi")
    .replace(/\s+,/g, ",")
    .replace(/\s+/g, " ")
    .trim();
}

const bySlug = (slug: string) => projects.find((p) => p.slug === slug);
const clean = (xs: string[]) => xs.filter((x) => !x.includes("["));
const count = (n: number, one: string, many = one + "s") => `${n} ${n === 1 ? one : many}`;

export const RESUME_FILENAME = "Pramoth_S_Resume";

export const resume = {
  name: site.name,
  role: site.role,
  location: site.location,
  phone: site.phone,
  email: site.email,
  linkedin: site.linkedin,
  linkedinHandle: site.linkedin.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""),
  github: site.github.url,
  githubHandle: site.github.url.replace(/^https?:\/\//, ""),
  languages: site.languages,

  summary: rz(
    `Product Development Engineer and Electronics and Communication Engineering graduate (B.E., 2025) building intelligent physical products end to end: robotics (ROS 2), embedded systems, computer vision / AI and product design. Delivered ${count(projects.length, "project")} including an autonomous mobile cleaning robot, completed ${count(internships.length, "internship")} and earned ${count(certifications.length, "certification")}.`,
  ),

  experience: experience.map((e) => ({
    role: e.role,
    company: e.company,
    location: e.location ?? "",
    period: rz(e.period),
    bullets: [
      rz("Develop intelligent hardware products end to end - robotics, embedded systems, AI and computer vision - from concept to working prototype."),
      rz(`Own ${e.areas.length} product areas (${e.areas.join(", ")}): specify sensors, compute and motor electronics, then integrate firmware, ROS 2 and perception models.`),
    ],
  })),

  projects: (
    [
      {
        slug: "autonomous-vacuum-robot",
        bullets: [
          "Engineered an autonomous cleaning robot on ROS 2 Jazzy: LiDAR SLAM mapping, Nav2 navigation with costmap obstacle avoidance and a boustrophedon coverage planner that turns the map into full-floor waypoints.",
          "Closed the motor loop on an ESP32 with wheel-encoder odometry over micro-ROS, split compute across Raspberry Pi 5 and ESP32, and validated the stack in Gazebo / RViz before hardware trials.",
        ],
      },
      {
        slug: "helmet-detection",
        bullets: [
          "Achieved 90% helmet / no-helmet accuracy on live traffic video with a YOLOv8 + OpenCV pipeline handling multiple riders per frame; automated annotated violation snapshots for enforcement.",
        ],
      },
      {
        slug: "shoplifting-detection",
        bullets: [
          "Built a YOLOv5 retail theft detector that flags item concealment with 88% precision and real-time alerts on a CUDA-accelerated PyTorch / OpenCV pipeline, cutting manual camera monitoring by about 40%.",
        ],
      },
      {
        slug: "metasurface-antenna",
        bullets: [
          "Designed a split-ring-resonator metasurface microstrip antenna for next-generation Wi-Fi and 5G (n77 / n78), comparing 4 substrates (LCP, PTFE, Rogers) in simulation to improve matching, return loss and radiation efficiency.",
        ],
      },
    ] as const
  ).map((x) => {
    const p = bySlug(x.slug)!;
    return { title: rz(p.title), category: p.category, tech: clean(p.tech).slice(0, 6), bullets: x.bullets.map(rz) };
  }),

  skills: skillGroups.map((g) => ({
    title: rz(g.title),
    items: [...g.featured, ...g.items.filter((s) => !g.featured.includes(s))].slice(0, g.id === "design" ? 6 : 8).map(rz),
  })),

  internships: internships.map((it) => {
    const where = [it.company, it.location, it.remote ? "Remote" : ""].filter(Boolean).join(", ");
    const byCompany: Record<string, string> = {
      "NoviTech R&D Pvt Ltd": "Completed 3 tracks (AI, Machine Learning, Data Analytics): data preprocessing, model training, algorithms; earned 2 certifications.",
      "Adventure Technology Solutions Pvt Ltd": "Worked on CMOS logic and digital circuit design; performed schematic design and circuit simulation.",
      "NSIC Technical Services Centre": "Trained hands-on in EV architecture, battery management systems, components, safety standards and charging technologies.",
      "Zoho Corporation Pvt Ltd": "Completed 2-week network and security training; rated Excellent for performance and conduct.",
    };
    return { role: it.role, where: rz(where), period: rz(it.period), bullet: rz(byCompany[it.company] ?? "") };
  }),

  education: education.map((e) => ({
    degree: rz(
      e.degree
        .replace("Bachelor of Engineering — Electronics & Communication Engineering", "B.E. Electronics and Communication Engineering")
        .replace("Higher Secondary Certificate (HSC)", "HSC (Class XII)")
        .replace("Secondary School Leaving Certificate (SSLC)", "SSLC (Class X)"),
    ),
    institution: rz(e.institution.replace("All Angels Matriculation Higher Secondary School, KK Nagar, Chennai", "All Angels Matric. Hr. Sec. School, Chennai")),
    period: rz(e.period),
    grade: e.grade ?? "",
  })),

  achievements: achievements.map((a) => ({ title: rz(a.title), detail: rz(a.detail), year: a.year })),

  certifications: certifications.slice(0, 5).map((c) => ({
    name: rz(c.name),
    issuer: rz(c.issuer),
    grade: c.grade ? rz(c.grade) : "",
    date: c.date,
  })),
};
