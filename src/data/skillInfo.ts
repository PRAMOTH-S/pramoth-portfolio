// Plain-language explanation for every skill, so a visitor who has never heard
// of a tool still understands what it is and where it fits in the work.
// `what` = what the tool is (one sentence, no jargon). `use` = where it fits in my work.
export type SkillInfo = { what: string; use: string };

export const skillInfo: Record<string, SkillInfo> = {
  /* ── Robotics & Autonomy ───────────────────────────────────────────────── */
  "ROS 2 (Jazzy)": {
    what: "The Robot Operating System: the software framework that lets a robot's sensors, planners and motors talk to each other as independent programs.",
    use: "The backbone of my autonomous mobile robot — every node, topic and launch file runs on ROS 2 Jazzy.",
  },
  Nav2: {
    what: "ROS 2's navigation stack: given a map and a goal, it plans a path, follows it and steers around obstacles.",
    use: "Plans and drives the cleaning routes of my AMR, with costmaps for obstacle avoidance.",
  },
  "SLAM Toolbox": {
    what: "Simultaneous Localization and Mapping — builds a map of a room from laser scans while working out where the robot is inside it.",
    use: "Builds the floor map my robot navigates on, from 2D LiDAR scans.",
  },
  URDF: {
    what: "An XML description of a robot's body: links, joints, sensor positions and dimensions.",
    use: "Describes my robot's chassis, wheels and LiDAR so simulation, visualisation and coordinate frames all agree.",
  },
  Gazebo: {
    what: "A physics simulator for robots — test the robot in a virtual world before risking real hardware.",
    use: "Where SLAM, Nav2 and the coverage logic were proven before the first floor run.",
  },
  RViz: {
    what: "ROS's 3D visualiser: see the map, laser scans, planned path and the robot's own idea of where it is, live.",
    use: "My debugging window for maps, TF frames and planned paths.",
  },
  "TF / TF2": {
    what: "The coordinate-frame system of ROS — keeps track of where every sensor and part is relative to the robot and the map.",
    use: "Links base_footprint, base_link and lidar_link so each scan lands in the right place on the map.",
  },
  LiDAR: {
    what: "A spinning laser rangefinder that measures distances all around the robot many times a second.",
    use: "The primary sensor for mapping and obstacle detection on my AMR.",
  },
  Odometry: {
    what: "Estimating how far a robot has moved from its wheel rotations.",
    use: "Computed on the ESP32 from wheel encoders and published to ROS 2 to feed SLAM and Nav2.",
  },
  "Behavior Trees": {
    what: "A way to script robot decisions as a tree of small tasks — 'if stuck, back up, then retry'.",
    use: "Drive Nav2's navigation and recovery behaviours on the robot.",
  },
  "Coverage Path Planning": {
    what: "Planning a route that passes over every reachable part of a floor, not just from A to B.",
    use: "Turns the map into a complete cleaning route for the AMR.",
  },
  "Boustrophedon / Zig-Zag Coverage": {
    what: "The lawn-mower pattern: sweep back and forth in parallel lanes until the whole area is covered.",
    use: "The pattern my coverage planner generates as waypoints for Nav2.",
  },
  "Autonomous Mobile Robots": {
    what: "Robots that move around a space on their own — mapping, localising and avoiding obstacles without a remote control.",
    use: "My flagship project: an industrial-style cleaning robot, from motors to navigation.",
  },
  "Sensor Integration": {
    what: "Wiring sensors into a system and turning their raw signals into data the software can trust.",
    use: "LiDAR, wheel encoders and cameras brought together into one consistent robot.",
  },

  /* ── Embedded Systems ─────────────────────────────────────────────────── */
  ESP32: {
    what: "A low-cost microcontroller with Wi-Fi and Bluetooth, used as the real-time brain in small devices.",
    use: "Runs the motor control and encoder reading on my robot, talking to ROS 2 over micro-ROS.",
  },
  "Raspberry Pi 5": {
    what: "A credit-card-sized Linux computer powerful enough to run robot software and vision models.",
    use: "The main compute on my AMR, running Ubuntu, ROS 2, SLAM and Nav2.",
  },
  Arduino: {
    what: "The classic beginner-friendly microcontroller platform for reading sensors and driving motors.",
    use: "Powers my keypad smart lock and early prototypes.",
  },
  "micro-ROS": {
    what: "A slimmed-down ROS 2 that runs on microcontrollers, so tiny chips can publish and subscribe like full computers.",
    use: "The bridge between my ESP32 and the ROS 2 stack: /cmd_vel in, /odom out.",
  },
  UART: {
    what: "A simple serial connection — two wires carrying data between chips or to a computer.",
    use: "The link between the Raspberry Pi and the ESP32 on the robot.",
  },
  I2C: {
    what: "A two-wire bus that lets a microcontroller talk to many sensors using addresses.",
    use: "Connecting sensors and small peripherals in embedded builds.",
  },
  SPI: {
    what: "A fast serial bus for displays, memory and high-rate sensors.",
    use: "High-speed peripherals in embedded prototypes.",
  },
  PWM: {
    what: "Pulse-Width Modulation — switching a pin on and off quickly to control motor speed or LED brightness.",
    use: "Sets wheel speeds through the motor driver on the AMR.",
  },
  Encoders: {
    what: "Sensors on a wheel or motor shaft that count rotation, so the robot knows how far it has travelled.",
    use: "Feed wheel odometry to the ESP32 and on to SLAM and Nav2.",
  },
  "Motor Drivers": {
    what: "The power electronics between a microcontroller's tiny signals and the current a motor actually needs.",
    use: "Drive the AMR's DC motors from ESP32 PWM signals.",
  },
  Sensors: {
    what: "Devices that turn the physical world — distance, light, temperature, motion — into electrical signals.",
    use: "Selecting, wiring and reading sensors is the first step of every product I build.",
  },
  "Embedded Linux": {
    what: "Running a full Linux system on a small board like a Raspberry Pi, with services, drivers and networking.",
    use: "Ubuntu on the Raspberry Pi 5 hosting the whole ROS 2 stack.",
  },
  "Firmware Development": {
    what: "Writing the low-level code that runs directly on a microcontroller, often with strict timing.",
    use: "The ESP32 control loop: read encoders, apply PWM, publish odometry — on time, every time.",
  },

  /* ── AI & Computer Vision ─────────────────────────────────────────────── */
  PyTorch: {
    what: "The most widely used framework for building and training deep-learning models.",
    use: "Training and fine-tuning detection models for my vision projects.",
  },
  YOLO: {
    what: "'You Only Look Once' — a family of fast object-detection models that find and label objects in a single pass over an image.",
    use: "YOLOv8 for helmet detection and YOLOv5 for shoplifting detection, both in real time.",
  },
  OpenCV: {
    what: "The standard open-source toolkit for working with images and video in code.",
    use: "Frame capture, preprocessing and drawing results in every computer-vision project.",
  },
  MediaPipe: {
    what: "Google's ready-made models for faces, hands and body pose that run fast on ordinary hardware.",
    use: "Face and landmark tracking in perception experiments such as drowsiness detection.",
  },
  ONNX: {
    what: "A universal file format for trained models so they can run outside the framework they were trained in.",
    use: "Exporting PyTorch models for deployment on edge devices.",
  },
  NCNN: {
    what: "A lightweight inference engine built for running neural networks on phones and small boards.",
    use: "Running detection models efficiently on low-power hardware.",
  },
  CUDA: {
    what: "NVIDIA's platform for running computation on the graphics card, which makes training and inference many times faster.",
    use: "GPU-accelerated pipeline behind the real-time shoplifting detector.",
  },
  NumPy: {
    what: "Python's core library for fast numerical arrays — the data structure every image and model tensor is built on.",
    use: "Image arrays, bounding-box maths and data wrangling across all vision work.",
  },
  Pandas: {
    what: "Python's spreadsheet-like library for cleaning and analysing tabular data.",
    use: "Dataset preparation and results analysis in the AI / data-analytics internship work.",
  },
  "Deep Learning": {
    what: "Machine learning with many-layered neural networks that learn features directly from data.",
    use: "The approach behind every detection and recognition model I have trained.",
  },
  "Object Detection": {
    what: "Finding what objects are in an image and exactly where, drawing a box around each one.",
    use: "Helmets, riders, concealed items, road signs — the core task of my vision projects.",
  },
  "Image Processing": {
    what: "Classical techniques — thresholds, filters, contours, frame differencing — that extract information from pixels without training a model.",
    use: "Motion detection and preprocessing before models run.",
  },

  /* ── Product Design ───────────────────────────────────────────────────── */
  "Fusion 360": {
    what: "Autodesk's cloud 3D CAD tool for designing parts and assemblies that can be 3D-printed or machined.",
    use: "Chassis, mounts and enclosures for the robots and devices I build.",
  },
  SolidWorks: {
    what: "Industry-standard 3D CAD software for detailed mechanical design and assemblies.",
    use: "Mechanical design and drawings for product prototypes.",
  },
  "3D CAD": {
    what: "Computer-aided design: modelling physical parts precisely in three dimensions before making them.",
    use: "Every physical part starts as a CAD model so electronics, motors and sensors fit first time.",
  },
  "Mechanical Product Design": {
    what: "Designing the physical form of a product: structure, materials, tolerances and how it is assembled.",
    use: "Designing enclosures and frames that house the electronics in my products.",
  },
  "Prototype Development": {
    what: "Turning a design into a working first version quickly, then iterating on what fails.",
    use: "My default loop: build early, test on real hardware, refine.",
  },
  "Hardware Integration": {
    what: "Making boards, sensors, motors, power and mechanics work together as one reliable device.",
    use: "Bringing compute, firmware and mechanics together on the AMR and IoT builds.",
  },
  "Product Visualization": {
    what: "Rendering a design so stakeholders can see the finished product before it exists.",
    use: "Renders and visuals used to present prototypes and concepts.",
  },

  /* ── Software ─────────────────────────────────────────────────────────── */
  Python: {
    what: "A readable, general-purpose programming language — the default for AI, data and robotics scripting.",
    use: "ROS 2 nodes, vision pipelines and automation across almost every project.",
  },
  "C++": {
    what: "A fast, compiled language used where performance and hardware control matter.",
    use: "Performance-critical ROS 2 nodes and embedded firmware.",
  },
  C: {
    what: "The classic low-level language that most microcontroller firmware is written in.",
    use: "Microcontroller code on Arduino and ESP32.",
  },
  SQL: {
    what: "The language for storing and querying data in relational databases.",
    use: "Patient and donor records in the Medical Assistant web app.",
  },
  Git: {
    what: "Version control: a history of every change to the code, with the ability to branch and merge safely.",
    use: "Every project is versioned in Git.",
  },
  GitHub: {
    what: "The hosting platform where Git repositories live and are shared.",
    use: "Where my public project code is published.",
  },
  "Linux / Ubuntu": {
    what: "The open-source operating system that runs most servers, robots and development machines.",
    use: "Daily development environment and the OS on my robot's Raspberry Pi.",
  },
  "VS Code": {
    what: "A lightweight, extensible code editor.",
    use: "My editor for Python, C++ and firmware work.",
  },
  "Arduino CLI": {
    what: "Command-line tools to compile and flash Arduino boards without the desktop IDE.",
    use: "Scripted builds and flashing of microcontroller firmware.",
  },
  Docker: {
    what: "Packages software with everything it needs into containers that run the same way anywhere.",
    use: "Reproducible ROS 2 and tooling environments.",
  },

  /* ── Web & UI ─────────────────────────────────────────────────────────── */
  HTML: {
    what: "The markup that structures every web page.",
    use: "Structure of the Medical Assistant platform and the PRANAV 2k24 event site.",
  },
  CSS: {
    what: "The styling language that controls how web pages look.",
    use: "Layout and styling of the web projects.",
  },
  JavaScript: {
    what: "The programming language of the browser — it makes web pages interactive.",
    use: "Interactivity and data handling in the Medical Assistant app.",
  },
  "Web Development": {
    what: "Building websites and web applications end to end.",
    use: "Event sites and dashboards for the products I build.",
  },
  Figma: {
    what: "A collaborative design tool for creating app and website interfaces before they are coded.",
    use: "Designed the award-winning shoe-shopping app concept.",
  },
  "UI/UX": {
    what: "User-interface and user-experience design: making products clear, usable and pleasant.",
    use: "Interfaces for dashboards and apps, from wireframe to polished screens.",
  },
};
