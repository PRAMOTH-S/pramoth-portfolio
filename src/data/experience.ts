// Experience timeline. Replace every [PLACEHOLDER] with verified information.
export type Experience = {
  company: string;
  role: string;
  period: string;
  location?: string;
  summary: string;
  areas: string[];
  highlights: string[];
};

export const experience: Experience[] = [
  {
    company: "Scrapify Ecotech Pvt Ltd",
    role: "Product Development Engineer",
    period: "Apr 2026 – Present",
    location: "iTNT Hub, Anna University, Guindy, Chennai",
    summary:
      "Developing intelligent hardware products end to end — robotics, embedded systems, AI and computer vision — from concept to working prototype.",
    areas: ["Product development", "Robotics", "Embedded systems", "AI / Computer Vision", "Prototyping"],
    highlights: [],
  },
];

// ─────────────────────────────────────────────────────────────
// Internships — copied from the LinkedIn Experience page, newest first.
// `focus` picks the card icon. Only add details you can verify.
// ─────────────────────────────────────────────────────────────
export type Internship = {
  role: string;
  company: string;
  period: string;
  duration: string;
  location?: string;
  remote?: boolean;
  summary?: string;
  skills: string[];
  focus: "ai" | "web" | "code" | "chip" | "ev" | "net";
  certified?: boolean;
  /** Per-card "Verify" link (certificate / documents). Omit to show no link on that card. */
  proofUrl?: string;
};

/** Shared Google Drive folder holding the internship certificates / documents.
 *  The folder must be shared as "Anyone with the link → Viewer" or recruiters hit a sign-in wall. */
export const internshipProof = {
  url: "https://drive.google.com/drive/folders/1N1xlLmnXTBBdy-_TRd5QVulxeOs5rq8O",
  label: "Internship documents",
  description:
    "Certificates and supporting documents for the internships above, shared on Google Drive so anyone can verify them.",
  host: "drive.google.com",
} as const;

export const internships: Internship[] = [
  {
    role: "AI, ML & Data Analytics Intern",
    company: "NoviTech R&D Pvt Ltd",
    period: "Dec 2025 – Jan 2026",
    duration: "2 mos",
    location: "Chennai",
    remote: true,
    summary: "AI / ML internship with practical exposure to data preprocessing, model training, algorithm implementation and real-world problem solving, alongside a Data Analytics track.",
    skills: ["Artificial Intelligence", "Machine Learning", "Data Analytics"],
    focus: "ai",
    certified: true,
  },
  {
    role: "Web Development Intern",
    company: "Cognifyz Technologies",
    period: "Aug 2024 – Sep 2024",
    duration: "2 mos",
    location: "Hyderabad",
    remote: true,
    skills: ["Web Development"],
    focus: "web",
  },
  {
    role: "Python Programming Intern",
    company: "CodSoft",
    period: "Jul 2024 – Aug 2024",
    duration: "2 mos",
    location: "Bangalore",
    remote: true,
    skills: ["Python"],
    focus: "code",
  },
  {
    role: "VLSI Intern",
    company: "Adventure Technology Solutions Pvt Ltd",
    period: "Jun 2023 – Jul 2023",
    duration: "2 mos",
    location: "Chennai",
    summary: "Worked on CMOS logic and digital circuit design concepts; performed schematic design and circuit simulation.",
    skills: ["VLSI", "CMOS Logic", "Circuit Simulation"],
    focus: "chip",
  },
  {
    role: "Electric Vehicle Intern",
    company: "NSIC Technical Services Centre",
    period: "Feb 2023",
    duration: "1 mo",
    location: "Chennai",
    summary: "Hands-on training in electric vehicle architecture, battery management systems, EV components, safety standards and charging technologies.",
    skills: ["Electric Vehicles", "Battery Management"],
    focus: "ev",
  },
  {
    // From the Zoho internship certificate (dated 14 Feb 2023): training in Network and Security,
    // 01-Feb-23 to 14-Feb-23, performance and conduct rated "Excellent".
    role: "Network & Security Intern",
    company: "Zoho Corporation Pvt Ltd",
    period: "Feb 2023",
    duration: "2 wks",
    location: "Estancia IT Park, Chengalpattu",
    summary: "Two-week internship training in network and security at Zoho; performance and conduct rated Excellent.",
    skills: ["Networking", "Network Security"],
    focus: "net",
    certified: true,
  },
];

// ─────────────────────────────────────────────────────────────
// Certifications / licenses, sourced from the LinkedIn profile.
// Only add `url` once the link is confirmed to show your name.
// ─────────────────────────────────────────────────────────────
export type Certification = {
  name: string;
  issuer: string;
  date: string;
  grade?: string;
  url?: string;
  /** filter group in the certifications console */
  topic: "ai" | "programming" | "quantum";
  /** subjects named in the certificate title — nothing inferred beyond that */
  covers: string[];
};

export const certTopics = [
  { id: "ai", label: "AI & Data" },
  { id: "programming", label: "Programming" },
  { id: "quantum", label: "Quantum" },
] as const;

export const certifications: Certification[] = [
  {
    name: "Artificial Intelligence Programmer — Skill Competency Program",
    issuer: "TN Skill Corporation",
    date: "2026",
    grade: "A+ · 91%",
    url: "https://lnkd.in/p/dt3-nbbH", // LinkedIn post showing the certificate
    topic: "ai",
    covers: ["Artificial Intelligence"],
  },
  { name: "Artificial Intelligence", issuer: "NoviTech R&D Pvt Ltd", date: "Nov 2025", topic: "ai", covers: ["Artificial Intelligence"] },
  { name: "Data Analytics", issuer: "NoviTech R&D Pvt Ltd", date: "Dec 2025", topic: "ai", covers: ["Data Analytics"] },
  { name: "Quantum Professional", issuer: "Q-CTRL", date: "Oct 2024", topic: "quantum", covers: ["Quantum Computing"] },
  {
    name: "Python 101 for Data Science",
    issuer: "IBM",
    date: "Jul 2024",
    url: "https://courses.cognitiveclass.ai/certificates/46638693f5cc4f61a92f8d04b1c70291",
    topic: "ai",
    covers: ["Python", "Data Science"],
  },
  { name: "Data Science with Python", issuer: "Great Learning", date: "Jul 2024", topic: "ai", covers: ["Python", "Data Science"] },
  {
    name: "Python",
    issuer: "GUVI Geek Networks, IITM Research Park",
    date: "Jul 2024",
    url: "https://www.guvi.in/verify-certificate?id=1jr542R4O121dV5327",
    topic: "programming",
    covers: ["Python"],
  },
  { name: "MongoDB Java Developer Path", issuer: "MongoDB", date: "Jul 2024", topic: "programming", covers: ["Java", "MongoDB"] },
  { name: "Java Programming for Beginners", issuer: "Simplilearn", date: "Aug 2024", topic: "programming", covers: ["Java"] },
  { name: "Advanced Programming — C Language", issuer: "Bharathiar University, Coimbatore", date: "Mar 2018", topic: "programming", covers: ["C"] },
];

export type Education = { degree: string; institution: string; period: string; grade?: string };

export const education: Education[] = [
  {
    degree: "Bachelor of Engineering — Electronics & Communication Engineering",
    institution: "Meenakshi Sundararajan Engineering College",
    period: "2021 – 2025",
  },
  {
    degree: "Higher Secondary Certificate (HSC)",
    institution: "All Angels Matriculation Higher Secondary School, KK Nagar, Chennai",
    period: "2021",
  },
  {
    degree: "Secondary School Leaving Certificate (SSLC)",
    institution: "All Angels Matriculation Higher Secondary School, KK Nagar, Chennai",
    period: "2019",
  },
];

// Verified achievements (from the candidate's own résumé).
export const achievements = [
  { title: "Top 50 teams, SAP HackFest'24", detail: "national hackathon with SAP India, Loco Wind Dynamo wind-energy concept", year: "2024" },
  { title: "Winner, UI/UX Design Competition (MSEC)", detail: "Figma shoe-shopping app design", year: "" },
] as const;
