# ATS-friendly résumé (LaTeX, Overleaf-ready)

This is the single-column, ATS-safe rewrite of the old two-column Deedy résumé. It keeps every fact from that
version (phone, CGPA 7.87, HSC 85% / SSLC 78%, internship details, 90% / 88% / 40% project metrics, SAP HackFest'24
Top 50, MSEC UI/UX winner) and adds the newer ones from the portfolio (Scrapify role, AMR flagship, Zoho internship,
TN Skill Corporation A+). The same content is served live at `/resume` (print → Save as PDF) and as `/resume.tex`.

## What changed for the score (80 → target 90+)

- Summary rewritten in third person (no "I" / "my"), with hard numbers: 14 projects, 6 internships, 10 certifications.
- Every bullet opens with an action verb (Engineered, Achieved, Built, Reduced, Designed, Compared, Completed, Trained).
- Quantified results wherever a verified figure exists: 90% accuracy, 88% precision, ~40% less manual monitoring, 4 substrates, 3 internship tracks, 2-week / 2-month durations, Top 50 teams, CGPA 7.87, 85% / 78%.
- US spelling throughout (localization, optimized, visualization, behavior) and consistent ASCII punctuation; fixed "A+ , 91%" → "A+, 91%" and "WiFi" → "Wi-Fi".

## Why this layout scores well with ATS parsers

- One column, top-to-bottom reading order (two-column `minipage` layouts are read in the wrong order or merged).
- Standard section names: Professional Summary, Work Experience, Projects, Technical Skills, Internships, Education,
  Achievements, Certifications.
- Real text only: no icons, images, text boxes or layout tables; `\pdfgentounicode=1` makes the PDF text layer clean.
- Plain ASCII punctuation, consistent `Mon YYYY - Mon YYYY` dates, contact line with phone, email, LinkedIn and GitHub.
- Standard fonts (Latin Modern) and pdfLaTeX — no XeLaTeX-only fonts that can be missing or embedded as outlines.
- One A4 page.

## How to use

1. Overleaf → New Project → Blank Project, replace `main.tex` with the code below (or use the "Open in Overleaf"
   button on `/resume`). Compiler: **pdfLaTeX**.
2. Menu → Download PDF. Check it stays on one page; if a line spills, shorten a project bullet or drop one certification.
3. To change any fact, edit `src/data/*.ts` in the portfolio and run `./update-site.sh` — this file is a snapshot of
   `/resume.tex`, regenerate it with: `curl -s localhost:3005/resume.tex > /tmp/r.tex` and paste.

## LaTeX source

```latex
%-------------------------
% Resume of Pramoth S - generated from the portfolio data files.
% Compile with pdfLaTeX (Overleaf default). Single column, ATS-friendly.
%-------------------------
\documentclass[a4paper,10pt]{article}

\usepackage{latexsym}
\usepackage[empty]{fullpage}
\usepackage{titlesec}
\usepackage[usenames,dvipsnames]{color}
\usepackage{enumitem}
\usepackage[hidelinks]{hyperref}
\usepackage{fancyhdr}
\usepackage[english]{babel}
\usepackage{tabularx}
\usepackage[T1]{fontenc}
\usepackage{lmodern}
\input{glyphtounicode}

\pagestyle{fancy}
\fancyhf{}
\fancyfoot{}
\renewcommand{\headrulewidth}{0pt}
\renewcommand{\footrulewidth}{0pt}

% Margins
\addtolength{\oddsidemargin}{-0.55in}
\addtolength{\evensidemargin}{-0.55in}
\addtolength{\textwidth}{1.1in}
\addtolength{\topmargin}{-0.7in}
\addtolength{\textheight}{1.4in}

\urlstyle{same}
\raggedbottom
\raggedright
\setlength{\tabcolsep}{0in}

% Section headings
\titleformat{\section}{
  \vspace{-5pt}\scshape\raggedright\large
}{}{0em}{}[\color{black}\titlerule \vspace{-5pt}]

% Ensure the PDF text layer is machine-readable (ATS)
\pdfgentounicode=1

%-------------------------
% Custom commands
\newcommand{\resumeItem}[1]{
  \item\small{{#1 \vspace{-2pt}}}
}

\newcommand{\resumeSubheading}[4]{
  \vspace{-2pt}\item
    \begin{tabular*}{0.97\textwidth}[t]{l@{\extracolsep{\fill}}r}
      \textbf{#1} & #2 \\
      \textit{\small#3} & \textit{\small #4} \\
    \end{tabular*}\vspace{-7pt}
}

\newcommand{\resumeProjectHeading}[2]{
    \item
    \begin{tabular*}{0.97\textwidth}{l@{\extracolsep{\fill}}r}
      \small#1 & \textit{\small #2} \\
    \end{tabular*}\vspace{-7pt}
}

\newcommand{\resumeLine}[2]{
    \item
    \begin{tabular*}{0.97\textwidth}{l@{\extracolsep{\fill}}r}
      \small#1 & \small #2 \\
    \end{tabular*}\vspace{-6pt}
}

\renewcommand\labelitemii{$\vcenter{\hbox{\tiny$\bullet$}}$}

\newcommand{\resumeSubHeadingListStart}{\begin{itemize}[leftmargin=0.15in, label={}]}
\newcommand{\resumeSubHeadingListEnd}{\end{itemize}}
\newcommand{\resumeItemListStart}{\begin{itemize}[leftmargin=0.15in]}
\newcommand{\resumeItemListEnd}{\end{itemize}\vspace{-5pt}}

%-------------------------------------------
\begin{document}

%----------HEADING----------
\begin{center}
    \textbf{\Huge \scshape Pramoth S} \\ \vspace{2pt}
    \small Product Development Engineer \\ \vspace{3pt}
    \small Chennai, India $|$
    \href{tel:+919176762903}{+91 91767 62903} $|$
    \href{mailto:pramothsekar@gmail.com}{pramothsekar@gmail.com} $|$
    \href{https://www.linkedin.com/in/pramoth-s-299806222/}{linkedin.com/in/pramoth-s-299806222} $|$
    \href{https://github.com/PRAMOTH-S}{github.com/PRAMOTH-S}
\end{center}

%-----------SUMMARY-----------
\section{Professional Summary}
  \small{Product Development Engineer and Electronics and Communication Engineering graduate (B.E., 2025) building intelligent physical products end to end: robotics (ROS 2), embedded systems, computer vision / AI and product design. Delivered 14 projects including an autonomous mobile cleaning robot, completed 6 internships and earned 10 certifications.}

%-----------EXPERIENCE-----------
\section{Work Experience}
  \resumeSubHeadingListStart
    \resumeSubheading
      {Scrapify Ecotech Pvt Ltd}{Apr 2026 - Present}
      {Product Development Engineer}{iTNT Hub, Anna University, Guindy, Chennai}
      \resumeItemListStart
        \resumeItem{Develop intelligent hardware products end to end - robotics, embedded systems, AI and computer vision - from concept to working prototype.}
        \resumeItem{Own 5 product areas (Product development, Robotics, Embedded systems, AI / Computer Vision, Prototyping): specify sensors, compute and motor electronics, then integrate firmware, ROS 2 and perception models.}
      \resumeItemListEnd
  \resumeSubHeadingListEnd

%-----------PROJECTS-----------
\section{Projects}
    \resumeSubHeadingListStart
    \resumeProjectHeading
      {\textbf{Autonomous Mobile Robot (AMR)} $|$ \emph{ROS 2 Jazzy, Nav2, SLAM Toolbox, URDF, Gazebo, RViz}}{Robotics}
      \resumeItemListStart
        \resumeItem{Engineered an autonomous cleaning robot on ROS 2 Jazzy: LiDAR SLAM mapping, Nav2 navigation with costmap obstacle avoidance and a boustrophedon coverage planner that turns the map into full-floor waypoints.}
        \resumeItem{Closed the motor loop on an ESP32 with wheel-encoder odometry over micro-ROS, split compute across Raspberry Pi 5 and ESP32, and validated the stack in Gazebo / RViz before hardware trials.}
      \resumeItemListEnd
    \resumeProjectHeading
      {\textbf{Helmet Detection} $|$ \emph{YOLOv8, OpenCV, Python}}{AI / Perception}
      \resumeItemListStart
        \resumeItem{Achieved 90\% helmet / no-helmet accuracy on live traffic video with a YOLOv8 + OpenCV pipeline handling multiple riders per frame; automated annotated violation snapshots for enforcement.}
      \resumeItemListEnd
    \resumeProjectHeading
      {\textbf{Shoplifting Detection} $|$ \emph{YOLOv5, PyTorch, OpenCV, NumPy, CUDA, Python}}{AI / Perception}
      \resumeItemListStart
        \resumeItem{Built a YOLOv5 retail theft detector that flags item concealment with 88\% precision and real-time alerts on a CUDA-accelerated PyTorch / OpenCV pipeline, cutting manual camera monitoring by about 40\%.}
      \resumeItemListEnd
    \resumeProjectHeading
      {\textbf{Metasurface Microstrip Antenna for Next-Gen Wi-Fi} $|$ \emph{Microstrip Antenna, SRR Metasurface, RF Design}}{Research / RF}
      \resumeItemListStart
        \resumeItem{Designed a split-ring-resonator metasurface microstrip antenna for next-generation Wi-Fi and 5G (n77 / n78), comparing 4 substrates (LCP, PTFE, Rogers) in simulation to improve matching, return loss and radiation efficiency.}
      \resumeItemListEnd
    \resumeSubHeadingListEnd

%-----------SKILLS-----------
\section{Technical Skills}
 \begin{itemize}[leftmargin=0.15in, label={}]
    \small{\item{
     \textbf{Robotics \& Autonomy}{: ROS 2 (Jazzy), Nav2, SLAM Toolbox, Gazebo, URDF, RViz, TF / TF2, LiDAR} \\
     \textbf{Embedded Systems}{: ESP32, Raspberry Pi 5, Arduino, micro-ROS, UART, I2C, SPI, PWM} \\
     \textbf{AI \& Computer Vision}{: YOLO, OpenCV, PyTorch, MediaPipe, ONNX, NCNN, CUDA, NumPy} \\
     \textbf{Product Design}{: Fusion 360, SolidWorks, 3D CAD, Mechanical Product Design, Prototype Development, Hardware Integration} \\
     \textbf{Software}{: Python, C++, Linux / Ubuntu, Git, C, SQL, GitHub, VS Code} \\
     \textbf{Web \& UI}{: JavaScript, Figma, HTML, CSS, Web Development, UI/UX} \\
    }}
 \end{itemize}

%-----------INTERNSHIPS-----------
\section{Internships}
  \resumeSubHeadingListStart
    \resumeLine{\textbf{AI, ML \& Data Analytics Intern}, NoviTech R\&D Pvt Ltd, Chennai, Remote}{Dec 2025 - Jan 2026}
      \resumeItemListStart
        \resumeItem{Completed 3 tracks (AI, Machine Learning, Data Analytics): data preprocessing, model training, algorithms; earned 2 certifications.}
      \resumeItemListEnd
    \resumeLine{\textbf{Web Development Intern}, Cognifyz Technologies, Hyderabad, Remote}{Aug 2024 - Sep 2024}
    \resumeLine{\textbf{Python Programming Intern}, CodSoft, Bangalore, Remote}{Jul 2024 - Aug 2024}
    \resumeLine{\textbf{VLSI Intern}, Adventure Technology Solutions Pvt Ltd, Chennai}{Jun 2023 - Jul 2023}
      \resumeItemListStart
        \resumeItem{Worked on CMOS logic and digital circuit design; performed schematic design and circuit simulation.}
      \resumeItemListEnd
    \resumeLine{\textbf{Electric Vehicle Intern}, NSIC Technical Services Centre, Chennai}{Feb 2023}
      \resumeItemListStart
        \resumeItem{Trained hands-on in EV architecture, battery management systems, components, safety standards and charging technologies.}
      \resumeItemListEnd
    \resumeLine{\textbf{Network \& Security Intern}, Zoho Corporation Pvt Ltd, Estancia IT Park, Chengalpattu}{Feb 2023}
      \resumeItemListStart
        \resumeItem{Completed 2-week network and security training; rated Excellent for performance and conduct.}
      \resumeItemListEnd
  \resumeSubHeadingListEnd

%-----------EDUCATION-----------
\section{Education}
  \resumeSubHeadingListStart
    \resumeLine{\textbf{B.E. Electronics and Communication Engineering}, Meenakshi Sundararajan Engineering College}{2021 - 2025 | CGPA 7.87}
    \resumeLine{\textbf{HSC (Class XII)}, All Angels Matric. Hr. Sec. School, Chennai}{2021 | 85\%}
    \resumeLine{\textbf{SSLC (Class X)}, All Angels Matric. Hr. Sec. School, Chennai}{2019 | 78\%}
  \resumeSubHeadingListEnd

%-----------ACHIEVEMENTS-----------
\section{Achievements}
  \resumeSubHeadingListStart
    \resumeLine{\textbf{Top 50 teams, SAP HackFest'24} -- national hackathon with SAP India, Loco Wind Dynamo wind-energy concept}{2024}
    \resumeLine{\textbf{Winner, UI/UX Design Competition (MSEC)} -- Figma shoe-shopping app design}{}
  \resumeSubHeadingListEnd

%-----------CERTIFICATIONS-----------
\section{Certifications}
  \resumeSubHeadingListStart
    \resumeLine{Artificial Intelligence Programmer - Skill Competency Program, TN Skill Corporation (A+, 91\%)}{2026}
    \resumeLine{Artificial Intelligence, NoviTech R\&D Pvt Ltd}{Nov 2025}
    \resumeLine{Data Analytics, NoviTech R\&D Pvt Ltd}{Dec 2025}
    \resumeLine{Quantum Professional, Q-CTRL}{Oct 2024}
    \resumeLine{Python 101 for Data Science, IBM}{Jul 2024}
  \resumeSubHeadingListEnd
  \vspace{2pt}\small{\textbf{Languages}: Tamil, English}

\end{document}
```
