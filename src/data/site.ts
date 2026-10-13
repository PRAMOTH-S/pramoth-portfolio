// ─────────────────────────────────────────────────────────────
// Global site content. Edit this file to change personal details.
// Anything in [BRACKETS] is a placeholder you should fill in.
// ─────────────────────────────────────────────────────────────

export const site = {
  name: "Pramoth S",
  role: "Product Development Engineer",
  education: "B.E. — Electronics & Communication Engineering (ECE)",
  headline:
    "ECE Graduate | Product Development Engineer | ROS 2 & Robotics | Embedded Systems | Computer Vision & AI/ML | Python | Web Development | Product Design",
  tagline:
    "Building intelligent products across robotics, embedded systems, AI, computer vision and product design.",
  secondaryLine: "From concept to prototype to intelligent product.",
  positioning:
    "Product Development Engineer building intelligent systems at the intersection of robotics, embedded systems, AI, computer vision, and product design.",
  company: "Scrapify Ecotech Pvt Ltd",
  companyLocation: "iTNT Hub, Anna University, Guindy, Chennai",
  // Public URL. Leave NEXT_PUBLIC_SITE_URL unset until the domain exists — canonical/OG/sitemap then stay silent instead of pointing at a placeholder.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "",
  location: "Chennai, India",
  languages: ["Tamil", "English"],
  graduationYear: 2025,
  email: "pramothsekar@gmail.com",
  phone: "+91 91767 62903", // shown on the résumé only
  github: { username: "PRAMOTH-S", url: "https://github.com/PRAMOTH-S" },
  linkedin: "https://www.linkedin.com/in/pramoth-s-299806222/",
  // Repositories shown first in the GitHub section (must be public repo names).
  featuredRepos: ["nexva_ws"],
  focusAreas: [
    "Product Development",
    "Robotics / ROS 2",
    "Embedded Systems",
    "AI / Computer Vision",
    "Product / CAD Design",
    "Software / Web",
  ],
} as const;

export const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "internships", label: "Internships" },
  { id: "contact", label: "Contact" },
] as const;

export const about = {
  lead:
    "I am an Electronics & Communication Engineering graduate and Product Development Engineer focused on building intelligent physical products. My work combines embedded systems, robotics, computer vision, AI/ML, and software to turn engineering concepts into functional systems.",
  approach: [
    {
      title: "Learn by building",
      body: "I understand a system best once I have wired it, flashed it, broken it and fixed it. Prototypes come early.",
    },
    {
      title: "Hardware + software as one system",
      body: "Firmware, ROS 2 nodes, vision models and the UI are designed together, so the interfaces between them are deliberate.",
    },
    {
      title: "Simulate, then prove on hardware",
      body: "Gazebo and RViz first to de-risk the logic, then real sensors, real motors and real floors.",
    },
    {
      title: "Product thinking",
      body: "Every build answers a real problem — who uses it, where it runs, and what it costs to make it reliable.",
    },
  ],
} as const;

// "From idea to product" pipeline
export const journey = [
  { step: "Idea", note: "Define the problem and the user" },
  { step: "Research", note: "Prior art, constraints, feasibility" },
  { step: "System Design", note: "Architecture, interfaces, data flow" },
  { step: "CAD / Hardware", note: "Mechanical design, electronics selection" },
  { step: "Firmware", note: "Microcontroller logic, drivers, real-time control" },
  { step: "ROS 2 / Software", note: "Nodes, topics, navigation, application layer" },
  { step: "AI / Vision", note: "Perception models, edge inference" },
  { step: "Prototype", note: "Integrate hardware and software end to end" },
  { step: "Testing", note: "Simulation, bench and field validation" },
  { step: "Deployment", note: "Hardening, documentation, hand-off" },
] as const;
