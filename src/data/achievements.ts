// Achievements. Exact wording, rank and year must be verified before publishing.
export type Achievement = {
  title: string;
  event: string;
  detail: string;
  year: string;
  verified: boolean;
};

export const achievements: Achievement[] = [
  {
    title: "Finalist",
    event: "SAP Hackathon / HackFest",
    detail: "[VERIFY — exact placement wording and project built]",
    year: "[YEAR]",
    verified: false,
  },
  {
    title: "Winner",
    event: "UI/UX Design Competition",
    detail: "[VERIFY — organizer and what was designed]",
    year: "[YEAR]",
    verified: false,
  },
  {
    title: "Winner",
    event: "Project Presentation @ MSEC",
    detail: "[VERIFY — project presented]",
    year: "[YEAR]",
    verified: false,
  },
];
