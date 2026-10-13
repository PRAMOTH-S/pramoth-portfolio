// ─────────────────────────────────────────────────────────────
// Project content. UI components read from here — edit freely.
// Nothing here should be invented: replace [ADD INFORMATION] / [VERIFY]
// with facts from the repository before publishing.
// ─────────────────────────────────────────────────────────────

export const TBD = "[ADD INFORMATION]";

export type Category =
  | "Robotics"
  | "AI / Perception"
  | "Embedded / IoT"
  | "Research / RF"
  | "Energy / Hardware"
  | "Web & Apps";

export type CaseStudy = {
  overview: string;
  problem: string;
  objective: string;
  architecture: string;
  hardware: string[];
  software: string[];
  implementation: string[];
  algorithms: { name: string; body: string }[];
  challenges: string[];
  decisions: { decision: string; why: string }[];
  testing: string[];
  results: string[];
  future: string[];
};

export type Project = {
  slug: string;
  title: string;
  category: Category;
  flagship?: boolean;
  status: "verified" | "needs-details";
  summary: string;
  problem: string;
  solution: string;
  tech: string[];
  features: string[];
  repo?: string;
  demo?: string;
  image?: string; // put files in /public/projects and reference as "/projects/x.jpg"
  caseStudy: CaseStudy;
};

const placeholderCase = (overview: string, problem: string): CaseStudy => ({
  overview,
  problem,
  objective: TBD,
  architecture: TBD,
  hardware: [TBD],
  software: [TBD],
  implementation: [TBD],
  algorithms: [{ name: "[ALGORITHM / MODEL]", body: TBD }],
  challenges: [TBD],
  decisions: [{ decision: TBD, why: TBD }],
  testing: [TBD],
  results: ["[ADD VERIFIED RESULTS — do not estimate]"],
  future: [TBD],
});

export const projects: Project[] = [
  // ───────────────────────── FLAGSHIP ─────────────────────────
  {
    slug: "autonomous-vacuum-robot",
    image: "/projects/autonomous-vacuum-robot.jpg",
    title: "Autonomous Mobile Robot (AMR)",
    category: "Robotics",
    flagship: true,
    status: "verified",
    summary:
      "An industrial-style autonomous cleaning robot built on ROS 2 Jazzy — LiDAR SLAM, Nav2 navigation, ESP32 motor control with encoder feedback, and a boustrophedon coverage planner for systematic cleaning.",
    problem:
      "Industrial and commercial floor-cleaning robots must navigate indoor spaces safely and systematically while avoiding obstacles and keeping a reliable estimate of where they are.",
    solution:
      "An autonomous mobile robot that maps its environment with LiDAR SLAM, plans and follows paths with Nav2, closes the motor loop on an ESP32 with encoder feedback, and generates zig-zag coverage waypoints from the map.",
    tech: [
      "ROS 2 Jazzy", "Nav2", "SLAM Toolbox", "URDF", "Gazebo", "RViz", "TF2", "micro-ROS",
      "Raspberry Pi 5", "ESP32", "LiDAR", "Python", "C++", "Behavior Trees",
    ],
    features: [
      "LiDAR-based mapping and localization (SLAM Toolbox)",
      "Nav2 path planning, control and costmap-based obstacle avoidance",
      "ESP32 motor control with wheel-encoder odometry over micro-ROS",
      "Boustrophedon / zig-zag coverage path planning for cleaning",
      "Gazebo simulation and RViz visualization before hardware runs",
      "Web interface for operation and telemetry",
    ],
    repo: "https://github.com/PRAMOTH-S/nexva_ws",
    caseStudy: {
      overview:
        "This AMR is a ROS 2-based autonomous cleaning robot. A Raspberry Pi 5 runs the ROS 2 stack — SLAM, Nav2 and the coverage planner — while an ESP32 handles real-time motor control and encoder feedback, exchanging /cmd_vel and /odom with ROS 2 through micro-ROS.",
      problem:
        "Cleaning robots in industrial and commercial spaces need to cover every reachable area of a floor, not just reach a single goal. That requires an accurate map, dependable localization, safe obstacle handling and a planner that turns free space into a systematic sweep.",
      objective:
        "Build an autonomous mobile robot that can map an indoor area, localize itself within it, plan full-coverage cleaning routes and execute them safely on real hardware.",
      architecture:
        "A web dashboard talks to the ROS 2 system on the Raspberry Pi 5. SLAM Toolbox builds the map from LiDAR /scan data; Nav2 plans and controls motion and publishes /cmd_vel; the ESP32 drives the motors, reads the encoders and publishes /odom. TF links base_footprint, base_link and lidar_link so every sensor reading lands in the right frame.",
      hardware: [
        "Raspberry Pi 5 — main compute running Ubuntu and ROS 2 Jazzy",
        "ESP32 — real-time motor control and encoder reading (micro-ROS client)",
        "LiDAR — 2D laser scans for mapping and obstacle detection",
        "Motor driver + DC drive motors with wheel encoders",
        "Vacuum motor",
        "Battery / power system — [VERIFY specification]",
      ],
      software: [
        "Ubuntu + ROS 2 Jazzy",
        "SLAM Toolbox — mapping and localization",
        "Nav2 — planners, controllers, costmaps, behavior trees",
        "Gazebo + RViz — simulation and visualization",
        "micro-ROS — ESP32 ↔ ROS 2 bridge",
        "Python and C++ ROS 2 nodes",
        "Web interface — [VERIFY framework]",
      ],
      implementation: [
        "Modeled the robot and its frames (base_footprint → base_link → lidar_link) and validated the TF tree in RViz.",
        "Ran SLAM Toolbox on LiDAR /scan with wheel odometry to build the map.",
        "Configured Nav2 planners, controllers and global/local costmaps for the robot footprint.",
        "Implemented ESP32 firmware that subscribes to /cmd_vel, drives the motors and publishes encoder-based /odom over micro-ROS.",
        "Built the coverage pipeline that converts the map into zig-zag waypoints executed through Nav2.",
        "[ADD INFORMATION — further implementation details from the repository]",
      ],
      algorithms: [
        {
          name: "SLAM (SLAM Toolbox)",
          body: "Scan matching over LiDAR data, combined with odometry, builds an occupancy-grid map while estimating the robot's pose within it.",
        },
        {
          name: "Costmaps",
          body: "Nav2 layers static map, obstacle and inflation data into global and local costmaps. Inflation around obstacles keeps the robot's footprint at a safe distance.",
        },
        {
          name: "Boustrophedon coverage",
          body: "Free space from the map is constrained by inflated obstacles, decomposed into cells, and swept in parallel back-and-forth lanes. Lane endpoints become waypoints sent to Nav2.",
        },
        {
          name: "Recovery behaviors",
          body: "When the robot gets stuck or a plan fails, Nav2's behavior tree triggers recovery actions such as clearing costmaps, spinning, backing up or waiting. [VERIFY which are configured]",
        },
      ],
      challenges: [TBD, TBD],
      decisions: [
        {
          decision: "Split compute between Raspberry Pi 5 and ESP32",
          why: "The Pi runs the heavy ROS 2 stack (SLAM, Nav2, planning) while the ESP32 keeps motor control and encoder timing deterministic.",
        },
        {
          decision: "micro-ROS for the microcontroller link",
          why: "The ESP32 publishes /odom and subscribes to /cmd_vel as a native ROS 2 participant, keeping one consistent topic interface.",
        },
        {
          decision: "Simulation first",
          why: "Gazebo and RViz allow SLAM, Nav2 and coverage logic to be tested before risking hardware.",
        },
      ],
      testing: [
        "Simulation runs in Gazebo with RViz visualization",
        "[ADD INFORMATION — hardware test environment and procedure]",
      ],
      results: ["[ADD VERIFIED RESULTS — e.g. mapped area, coverage achieved, run time. Do not estimate.]"],
      future: [TBD],
    },
  },

  // ─────────────── MORE PROJECTS (display order) ───────────────
  {
    slug: "helmet-detection",
    image: "/projects/helmet-detection.jpg",
    title: "Helmet Detection",
    category: "AI / Perception",
    status: "verified",
    summary:
      "A real-time YOLOv8 traffic-monitoring system that finds every two-wheeler rider in the frame, isolates the head region and classifies it as helmet or no-helmet — drawing boxes with confidence scores and flagging violations instantly, across moving traffic and varied camera angles.",
    problem: "Helmet enforcement relies on manual monitoring, which is inconsistent and inefficient in heavy traffic.",
    solution: "YOLOv8 detects riders frame by frame, isolates head regions and classifies each as helmet or no-helmet in real time.",
    tech: ["YOLOv8", "OpenCV", "Python"],
    features: ["90% detection accuracy on helmet / no-helmet classification", "Automated snapshot storage of violations", "Multiple riders per frame, varied angles and occlusion"],
    demo: "https://lnkd.in/p/gZfmPbxa",
    caseStudy: placeholderCase("AI-powered helmet detection for real-time traffic monitoring.", "Helmet enforcement relies on manual monitoring, which is inconsistent and inefficient in heavy traffic."),
  },
  {
    slug: "smart-car-shed",
    image: "/projects/smart-car-shed.jpg",
    title: "Smart Car Shed",
    category: "Embedded / IoT",
    status: "verified",
    summary:
      "An RFID access system for a car shed: when the car's RFID tag matches the registered ID, the shed door opens automatically and the owner receives a WhatsApp notification — hands-free convenience with a built-in security alert.",
    problem: "Opening a shed by hand is inconvenient and gives the owner no record of access.",
    solution: "An RFID reader verifies the car's tag, triggers the door and notifies the owner through the WhatsApp API.",
    tech: ["RFID", "WhatsApp API", "IoT"],
    features: ["RFID tag verification", "Automatic door actuation", "WhatsApp owner alerts"],
    caseStudy: placeholderCase("RFID-based automatic car shed with WhatsApp notifications.", "Opening a shed by hand is inconvenient and gives the owner no record of access."),
  },
  {
    slug: "smart-locking-system",
    image: "/projects/smart-locking-system.jpg",
    title: "Smart Locking System",
    category: "Embedded / IoT",
    status: "verified",
    summary:
      "A password-protected lock built on Arduino: a keypad takes the PIN and a servo motor drives the latch only when it matches — an affordable, reliable alternative to a traditional mechanical lock.",
    problem: "Traditional locks depend on physical keys that can be lost or copied.",
    solution: "Keypad PIN entry verified on an Arduino, with a servo motor actuating the lock on a match.",
    tech: ["Arduino", "Keypad", "Servo Motor"],
    features: ["PIN-based access control", "Servo-driven latch", "Low-cost hardware"],
    caseStudy: placeholderCase("Arduino keypad and servo password lock.", "Traditional locks depend on physical keys that can be lost or copied."),
  },
  {
    slug: "metasurface-antenna",
    image: "/projects/metasurface-antenna.jpg",
    title: "Metasurface Microstrip Antenna for Next-Gen WiFi",
    category: "Research / RF",
    status: "verified",
    summary:
      "Collaborative research (Jan – May 2025) on a microstrip antenna for next-gen WiFi, 5G and sub-6 GHz systems targeting the n77 / n78 bands — using a split-ring-resonator (SRR) metasurface to improve impedance matching, reduce return loss and raise radiation efficiency, with a comparative study of four substrates including LCP, PTFE and Rogers.",
    problem: "Next-gen WiFi and 5G n77 / n78 bands demand compact antennas with better matching and efficiency.",
    solution: "An SRR metasurface integrated with a microstrip patch, evaluated across four substrate materials.",
    tech: ["Microstrip Antenna", "SRR Metasurface", "RF Design"],
    features: ["Gain, bandwidth and efficiency optimised through simulation", "Improved impedance matching and lower return loss", "Four-substrate comparison (LCP, PTFE, Rogers)"],
    caseStudy: placeholderCase("Metasurface-integrated microstrip antenna for next-gen WiFi and 5G.", "Next-gen WiFi and 5G n77 / n78 bands demand compact antennas with better matching and efficiency."),
  },
  {
    slug: "shoplifting-detection",
    image: "/projects/shoplifting-detection.jpg",
    title: "Shoplifting Detection",
    category: "AI / Perception",
    status: "verified",
    summary:
      "A YOLOv5 retail theft detection system that watches camera footage for item concealment and raises real-time alerts on a CUDA-accelerated pipeline — 88% precision, and about 40% less manual monitoring for staff.",
    problem: "Retail staff cannot watch every camera feed continuously, so theft often goes unnoticed in real time.",
    solution: "A YOLOv5 object-detection pipeline that identifies item concealment with 88% precision and supports real-time alerts on a CUDA-accelerated pipeline.",
    tech: ["YOLOv5", "PyTorch", "OpenCV", "NumPy", "CUDA", "Python"],
    features: ["88% precision on item-concealment detection", "Reduced manual monitoring by about 40%", "Real-time alerts, CUDA-accelerated"],
    caseStudy: placeholderCase(
      "YOLO-based shoplifting detection system. [ADD INFORMATION]",
      "Retail staff cannot watch every camera feed continuously, so theft often goes unnoticed in real time.",
    ),
  },
  {
    slug: "road-sign-recognition",
    image: "/projects/road-sign-recognition.jpg",
    title: "Road Sign Recognition (ADAS)",
    category: "AI / Perception",
    status: "needs-details",
    summary:
      "A vision model that detects and classifies road signs from the driver's view — a building block for advanced driver-assistance systems that must read signage reliably.",
    problem: "Drivers can miss road signs; assistance systems need to read them reliably.",
    solution: "A vision model that detects and classifies traffic signs. [VERIFY approach]",
    tech: ["Python"],
    features: [TBD],
    repo: "https://github.com/PRAMOTH-S/Road-sign-Recoginzation-ADAS",
    caseStudy: placeholderCase("Road sign recognition for ADAS. [ADD INFORMATION]", "Drivers can miss road signs; assistance systems need to read them reliably."),
  },
  {
    slug: "loco-wind-dynamo",
    image: "/projects/loco-wind-dynamo.jpg",
    title: "Loco Wind Dynamo",
    category: "Energy / Hardware",
    status: "verified",
    summary:
      "A renewable-energy concept that mounts Savonius wind turbines on train roofs: a permanent-magnet generator turns the airflow into electricity, LiFePO4 batteries store it and an inverter powers onboard systems. Built for Hackfest'24, a national-level climate-change hackathon organised with SAP India.",
    problem: "Trains rely heavily on conventional energy; rail transport needs cleaner onboard power.",
    solution: "Roof-mounted Savonius turbines driving a PM generator, with LiFePO4 storage and an inverter for onboard loads.",
    tech: ["Savonius Turbine", "PM Generator", "LiFePO4"],
    features: ["Wind energy harvesting", "Battery storage", "Inverter to onboard loads"],
    repo: "https://github.com/PRAMOTH-S/Loco-Wind-Dynamo",
    caseStudy: placeholderCase("Train-mounted wind energy harvesting (Hackfest'24).", "Trains rely heavily on conventional energy; rail transport needs cleaner onboard power."),
  },
  {
    slug: "drowsiness-detection",
    image: "/projects/drowsiness-detection.jpg",
    title: "Drowsiness Detection",
    category: "AI / Perception",
    status: "needs-details",
    summary:
      "A real-time system that watches the driver's face for fatigue cues and raises an alert when drowsiness is detected — a safety net for a risk drivers can't judge themselves.",
    problem: "Driver fatigue is a safety risk that is hard to self-assess.",
    solution: "A vision system that tracks facial cues and raises an alert when drowsiness is detected. [VERIFY approach]",
    tech: ["Python"],
    features: [TBD],
    repo: "https://github.com/PRAMOTH-S/Drowsiness-detection-",
    caseStudy: placeholderCase("Driver drowsiness detection. [ADD INFORMATION]", "Driver fatigue is a safety risk that is hard to self-assess."),
  },
  {
    slug: "face-recognition-attendance",
    image: "/projects/face-recognition-attendance.jpg",
    title: "Face Recognition Attendance",
    category: "AI / Perception",
    status: "needs-details",
    summary:
      "A face-recognition pipeline with an SVM classifier that identifies registered people and logs attendance automatically — faster than manual registers and much harder to falsify.",
    problem: "Manual attendance is slow and easy to falsify.",
    solution: "A face-recognition pipeline (SVM classifier) that identifies registered people and logs attendance.",
    tech: ["Python", "SVM"],
    features: [TBD],
    repo: "https://github.com/PRAMOTH-S/Face-Recognition-Attendance-System-SVM-",
    caseStudy: placeholderCase("Face recognition attendance system. [ADD INFORMATION]", "Manual attendance is slow and easy to falsify."),
  },
  {
    slug: "moving-object-detection",
    image: "/projects/moving-object-detection.jpg",
    title: "Moving Object Detection",
    category: "AI / Perception",
    status: "verified",
    summary:
      "A lightweight real-time motion detector built with OpenCV: each webcam frame is converted to grayscale, denoised and compared with a reference background, and any significant change is boxed and reported live — core vision techniques running efficiently on standard hardware.",
    problem: "Many monitoring tasks need motion detection that runs in real time on ordinary hardware.",
    solution: "Frame differencing with thresholding and contour detection to box moving regions live.",
    tech: ["OpenCV", "Python"],
    features: ["Frame differencing", "Thresholding and contours", "Live detection status"],
    repo: "https://github.com/PRAMOTH-S/Ai-projects/tree/main/Moving%20object%20detection",
    caseStudy: placeholderCase("Real-time moving object detection with OpenCV.", "Many monitoring tasks need motion detection that runs in real time on ordinary hardware."),
  },
  {
    slug: "medical-assistant-app",
    image: "/projects/medical-assistant-app.jpg",
    title: "Medical Assistant App",
    category: "Web & Apps",
    status: "verified",
    summary:
      "A healthcare web platform that helps people find nearby blood donors, hospitals, laboratories and pharmacies, consult a doctor online, get medicines delivered to their door and look up lab results by patient ID. Built at Hackintym'24.",
    problem: "Finding blood donors, pharmacies and medical services quickly is hard, especially at odd hours.",
    solution: "One platform for medical search, online consultation, medicine delivery and lab results.",
    tech: ["HTML", "CSS", "JavaScript", "SQL"],
    features: ["Blood donor search", "Online consultation", "Medicine home delivery"],
    repo: "https://github.com/PRAMOTH-S/Hackintym-24",
    caseStudy: placeholderCase("Healthcare assistant web platform (Hackintym'24).", "Finding blood donors, pharmacies and medical services quickly is hard, especially at odd hours."),
  },
  {
    slug: "shoe-app",
    image: "/projects/shoe-app.jpg",
    title: "Shoe App — UI/UX Design",
    category: "Web & Apps",
    status: "verified",
    summary:
      "A shoe-shopping app designed end to end in Figma, focused on intuitive navigation, product filtering and a smooth checkout flow.",
    problem: "Shopping apps often bury products behind cluttered navigation and long checkouts.",
    solution: "A Figma prototype built around fast filtering and a streamlined checkout.",
    tech: ["Figma", "UI/UX"],
    features: ["Intuitive navigation", "Product filtering", "Smooth checkout"],
    caseStudy: placeholderCase("Shoe shopping app UI/UX design in Figma.", "Shopping apps often bury products behind cluttered navigation and long checkouts."),
  },
  {
    slug: "pranav-2k24-website",
    image: "/projects/pranav-2k24-website.jpg",
    title: "PRANAV 2k24 Website",
    category: "Web & Apps",
    status: "verified",
    summary:
      "Event website built for PRANAV 2k24, the technical symposium at Meenakshi Sundararajan Engineering College.",
    problem: "The symposium needed an online home for participants.",
    solution: "A dedicated event website for PRANAV 2k24.",
    tech: ["Web Development"],
    features: [],
    caseStudy: placeholderCase("Website for the PRANAV 2k24 technical symposium.", "The symposium needed an online home for participants."),
  },
];

export const categories: Category[] = [
  "Robotics",
  "AI / Perception",
  "Embedded / IoT",
  "Research / RF",
  "Energy / Hardware",
  "Web & Apps",
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

/** The subset of a project the home-page cards need — keeps unfinished case-study text out of the client payload. */
export type ProjectCardData = Pick<Project, "slug" | "title" | "category" | "summary" | "tech" | "repo" | "demo" | "image">;
export const toCardData = (p: Project): ProjectCardData => ({
  slug: p.slug, title: p.title, category: p.category, summary: p.summary, tech: p.tech, repo: p.repo, demo: p.demo, image: p.image,
});
