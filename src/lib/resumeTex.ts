import { RESUME_FILENAME, resume } from "@/lib/resumeContent";

export { RESUME_FILENAME };

/* ──────────────────────────────────────────────────────────────────────────
   LaTeX résumé generator (Overleaf-ready, pdfLaTeX). Single column in the
   widely used "Jake's Resume" structure, which ATS parsers read reliably:
   real text, standard section names, no layout tables, no graphics,
   \pdfgentounicode for a clean text layer. Content comes from resumeContent.
   ────────────────────────────────────────────────────────────────────────── */

/** Escape LaTeX specials (text is already ASCII-normalized upstream). */
export function tex(s: string): string {
  return s
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/([&%$#_{}])/g, "\\$1")
    .replace(/~/g, "\\textasciitilde{}")
    .replace(/\^/g, "\\textasciicircum{}")
    .replace(/'/g, "'")
    .replace(/[""]/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

export function buildResumeTex(): string {
  const r = resume;

  const expBlocks = r.experience
    .map(
      (e) => `    \\resumeSubheading
      {${tex(e.company)}}{${tex(e.period)}}
      {${tex(e.role)}}{${tex(e.location)}}
      \\resumeItemListStart
${e.bullets.map((b) => `        \\resumeItem{${tex(b)}}`).join("\n")}
      \\resumeItemListEnd`,
    )
    .join("\n");

  const projBlocks = r.projects
    .map(
      (p) => `    \\resumeProjectHeading
      {\\textbf{${tex(p.title)}} $|$ \\emph{${tex(p.tech.join(", "))}}}{${tex(p.category)}}
      \\resumeItemListStart
${p.bullets.map((b) => `        \\resumeItem{${tex(b)}}`).join("\n")}
      \\resumeItemListEnd`,
    )
    .join("\n");

  const skillLines = r.skills.map((g) => `     \\textbf{${tex(g.title)}}{: ${tex(g.items.join(", "))}} \\\\`).join("\n");

  const internLines = r.internships
    .map((it) => {
      const head = `    \\resumeLine{\\textbf{${tex(it.role)}}, ${tex(it.where)}}{${tex(it.period)}}`;
      return it.bullet ? `${head}\n      \\resumeItemListStart\n        \\resumeItem{${tex(it.bullet)}}\n      \\resumeItemListEnd` : head;
    })
    .join("\n");

  const eduLines = r.education
    .map((e) => `    \\resumeLine{\\textbf{${tex(e.degree)}}, ${tex(e.institution)}}{${tex([e.period, e.grade].filter(Boolean).join(" | "))}}`)
    .join("\n");

  const achLines = r.achievements.map((a) => `    \\resumeLine{\\textbf{${tex(a.title)}} -- ${tex(a.detail)}}{${tex(a.year)}}`).join("\n");

  const certLines = r.certifications
    .map((c) => `    \\resumeLine{${tex(c.name)}, ${tex(c.issuer)}${c.grade ? ` (${tex(c.grade)})` : ""}}{${tex(c.date)}}`)
    .join("\n");

  return `%-------------------------
% Resume of ${tex(r.name)} - generated from the portfolio data files.
% Compile with pdfLaTeX (Overleaf default). Single column, ATS-friendly.
%-------------------------
\\documentclass[a4paper,10pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\usepackage[T1]{fontenc}
\\usepackage{lmodern}
\\input{glyphtounicode}

\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Margins
\\addtolength{\\oddsidemargin}{-0.55in}
\\addtolength{\\evensidemargin}{-0.55in}
\\addtolength{\\textwidth}{1.1in}
\\addtolength{\\topmargin}{-0.7in}
\\addtolength{\\textheight}{1.4in}

\\urlstyle{same}
\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Section headings
\\titleformat{\\section}{
  \\vspace{-5pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

% Ensure the PDF text layer is machine-readable (ATS)
\\pdfgentounicode=1

%-------------------------
% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{{#1 \\vspace{-2pt}}}
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & \\textit{\\small #2} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeLine}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & \\small #2 \\\\
    \\end{tabular*}\\vspace{-6pt}
}

\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}[leftmargin=0.15in]}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

%-------------------------------------------
\\begin{document}

%----------HEADING----------
\\begin{center}
    \\textbf{\\Huge \\scshape ${tex(r.name)}} \\\\ \\vspace{2pt}
    \\small ${tex(r.role)} \\\\ \\vspace{3pt}
    \\small ${tex(r.location)} $|$
    \\href{tel:${r.phone.replace(/\s/g, "")}}{${tex(r.phone)}} $|$
    \\href{mailto:${r.email}}{${tex(r.email)}} $|$
    \\href{${r.linkedin}}{${tex(r.linkedinHandle)}} $|$
    \\href{${r.github}}{${tex(r.githubHandle)}}
\\end{center}

%-----------SUMMARY-----------
\\section{Professional Summary}
  \\small{${tex(r.summary)}}

%-----------EXPERIENCE-----------
\\section{Work Experience}
  \\resumeSubHeadingListStart
${expBlocks}
  \\resumeSubHeadingListEnd

%-----------PROJECTS-----------
\\section{Projects}
    \\resumeSubHeadingListStart
${projBlocks}
    \\resumeSubHeadingListEnd

%-----------SKILLS-----------
\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
${skillLines}
    }}
 \\end{itemize}

%-----------INTERNSHIPS-----------
\\section{Internships}
  \\resumeSubHeadingListStart
${internLines}
  \\resumeSubHeadingListEnd

%-----------EDUCATION-----------
\\section{Education}
  \\resumeSubHeadingListStart
${eduLines}
  \\resumeSubHeadingListEnd

%-----------ACHIEVEMENTS-----------
\\section{Achievements}
  \\resumeSubHeadingListStart
${achLines}
  \\resumeSubHeadingListEnd

%-----------CERTIFICATIONS-----------
\\section{Certifications}
  \\resumeSubHeadingListStart
${certLines}
  \\resumeSubHeadingListEnd
  \\vspace{2pt}\\small{\\textbf{Languages}: ${tex(r.languages.join(", "))}}

\\end{document}
`;
}
