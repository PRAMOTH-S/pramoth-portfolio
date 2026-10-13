// Skills grouped by category. Order reflects the portfolio's priority.
// `featured` = the skills used most / known best; they render highlighted. Must be a subset of `items`.
export type SkillGroup = { id: string; title: string; summary: string; items: string[]; featured: string[] };

export const skillGroups: SkillGroup[] = [
  {
    id: "robotics",
    title: "Robotics & Autonomy",
    summary: "Mapping, localization and navigation for mobile robots.",
    items: [
      "ROS 2 (Jazzy)", "Nav2", "SLAM Toolbox", "URDF", "Gazebo", "RViz", "TF / TF2", "LiDAR",
      "Odometry", "Behavior Trees", "Coverage Path Planning", "Boustrophedon / Zig-Zag Coverage",
      "Autonomous Mobile Robots", "Sensor Integration",
    ],
    featured: ["ROS 2 (Jazzy)", "Nav2", "SLAM Toolbox", "Gazebo"],
  },
  {
    id: "embedded",
    title: "Embedded Systems",
    summary: "Firmware and real-time control on microcontrollers and SBCs.",
    items: [
      "ESP32", "Raspberry Pi 5", "Arduino", "micro-ROS", "UART", "I2C", "SPI", "PWM",
      "Encoders", "Motor Drivers", "Sensors", "Embedded Linux", "Firmware Development",
    ],
    featured: ["ESP32", "Raspberry Pi 5", "Arduino", "micro-ROS"],
  },
  {
    id: "ai",
    title: "AI & Computer Vision",
    summary: "Perception models from training to edge deployment.",
    items: [
      "PyTorch", "YOLO", "OpenCV", "MediaPipe", "ONNX", "NCNN", "CUDA", "NumPy", "Pandas",
      "Deep Learning", "Object Detection", "Image Processing",
    ],
    featured: ["YOLO", "OpenCV", "PyTorch"],
  },
  {
    id: "design",
    title: "Product Design",
    summary: "Mechanical design and prototypes that house the electronics.",
    items: [
      "Fusion 360", "SolidWorks", "3D CAD", "Mechanical Product Design", "Prototype Development",
      "Hardware Integration", "Product Visualization",
    ],
    featured: ["Fusion 360", "SolidWorks"],
  },
  {
    id: "software",
    title: "Software",
    summary: "Languages and tooling across the stack.",
    items: ["Python", "C++", "C", "SQL", "Git", "GitHub", "Linux / Ubuntu", "VS Code", "Arduino CLI", "Docker"],
    featured: ["Python", "C++", "Linux / Ubuntu", "Git"],
  },
  {
    id: "web",
    title: "Web & UI",
    summary: "Dashboards and interfaces for the products I build.",
    items: ["HTML", "CSS", "JavaScript", "Web Development", "Figma", "UI/UX"],
    featured: ["JavaScript", "Figma"],
  },
];

// Logos that orbit the robotics hub in the Skills section (inner ring = daily drivers).
export const coreStack = {
  inner: ["ROS 2", "Python", "C++", "OpenCV", "PyTorch"],
  outer: ["ESP32", "Raspberry Pi 5", "Arduino", "Fusion 360", "SolidWorks", "Linux / Ubuntu", "Git", "Docker"],
} as const;

// Ecosystem diagram: three disciplines converging into robotics → product
export const ecosystem = [
  { id: "hardware", title: "Hardware", items: ["ESP32", "Raspberry Pi 5", "Sensors", "Motors & drivers", "CAD"] },
  { id: "software", title: "Software", items: ["C++", "Python", "ROS 2", "Nav2", "micro-ROS"] },
  { id: "ai", title: "AI", items: ["PyTorch", "YOLO", "OpenCV", "ONNX", "NCNN"] },
] as const;
