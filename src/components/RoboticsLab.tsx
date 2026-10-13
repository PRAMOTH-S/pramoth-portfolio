"use client";

import { useState, type ReactNode } from "react";
import { Activity, Battery, Cpu, Gauge, Map, Navigation, Radar } from "lucide-react";

// Every value here is ILLUSTRATIVE — it explains the concept, it is not live robot data.

function LidarView() {
  const rays = Array.from({ length: 72 }, (_, i) => {
    const a = (i / 72) * Math.PI * 2;
    // simple rectangular room seen from the centre + one obstacle
    const rx = Math.abs(Math.cos(a)) > 1e-3 ? 110 / Math.abs(Math.cos(a)) : 999;
    const ry = Math.abs(Math.sin(a)) > 1e-3 ? 80 / Math.abs(Math.sin(a)) : 999;
    let r = Math.min(rx, ry);
    if (a > 0.5 && a < 0.9) r = Math.min(r, 52);
    return [130 + Math.cos(a) * r, 100 + Math.sin(a) * r] as const;
  });
  return (
    <svg viewBox="0 0 260 200" className="w-full" aria-hidden>
      {rays.map(([x, y], i) => (
        <line key={i} x1="130" y1="100" x2={x} y2={y} stroke="#34d27b" strokeOpacity="0.08" />
      ))}
      {rays.map(([x, y], i) => (
        <circle key={`p${i}`} cx={x} cy={y} r="1.8" fill="#86ffb8" />
      ))}
      <g className="origin-[130px_100px] animate-sweep motion-reduce:animate-none">
        <line x1="130" y1="100" x2="250" y2="100" stroke="#34d27b" strokeWidth="1.5" />
      </g>
      <circle cx="130" cy="100" r="7" fill="#0c100e" stroke="#34d27b" />
    </svg>
  );
}

function OccupancyView({ costmap = false }: { costmap?: boolean }) {
  const cols = 26, rows = 18, s = 10;
  const occ = (c: number, r: number) =>
    r === 0 || c === 0 || r === rows - 1 || c === cols - 1 || (c >= 8 && c <= 10 && r >= 5 && r <= 9) || (c >= 17 && c <= 20 && r >= 10 && r <= 12);
  const near = (c: number, r: number) => {
    for (let dc = -2; dc <= 2; dc++) for (let dr = -2; dr <= 2; dr++) if (occ(c + dc, r + dr)) return Math.max(Math.abs(dc), Math.abs(dr));
    return 99;
  };
  return (
    <svg viewBox={`0 0 ${cols * s} ${rows * s}`} className="w-full" aria-hidden>
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((__, c) => {
          const o = occ(c, r);
          const d = costmap ? near(c, r) : 99;
          const fill = o ? "#e7ece8" : d === 1 ? "#e5b84a" : d === 2 ? "#5c4a1c" : "#0c100e";
          return <rect key={`${r}-${c}`} x={c * s} y={r * s} width={s - 1} height={s - 1} fill={fill} fillOpacity={o ? 0.85 : 1} />;
        }),
      )}
      {costmap && (
        <path d="M35 145 C 60 140, 60 40, 130 45 S 230 60, 225 150" fill="none" stroke="#34d27b" strokeWidth="2.2" strokeDasharray="5 4" />
      )}
      <circle cx="35" cy="145" r="5" fill="#34d27b" />
    </svg>
  );
}

function OdomView() {
  return (
    <div className="space-y-4 font-mono text-sm">
      <div className="rounded-md border border-line bg-bg p-4 text-ink">
        <p>v = (v<sub>R</sub> + v<sub>L</sub>) / 2</p>
        <p className="mt-1">ω = (v<sub>R</sub> − v<sub>L</sub>) / L</p>
        <p className="mt-3 text-dim">x += v·cos θ·Δt &nbsp; y += v·sin θ·Δt &nbsp; θ += ω·Δt</p>
      </div>
      <p className="text-xs text-dim">L = wheel separation · v<sub>R</sub>, v<sub>L</sub> from encoder ticks per Δt</p>
    </div>
  );
}

function BarsView({ bars }: { bars: { k: string; v: number }[] }) {
  return (
    <div className="space-y-4">
      {bars.map((b) => (
        <div key={b.k}>
          <div className="mb-1.5 flex justify-between font-mono text-xs text-muted">
            <span>{b.k}</span>
            <span>{b.v}%</span>
          </div>
          <div className="h-2 rounded-full bg-surface2">
            <div className="h-2 rounded-full bg-accent" style={{ width: `${b.v}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function GraphView() {
  const nodes = ["/lidar_driver", "/slam_toolbox", "/bt_navigator", "/controller_server", "/micro_ros_agent"];
  return (
    <ul className="space-y-2 font-mono text-xs">
      {nodes.map((n) => (
        <li key={n} className="flex items-center gap-3 rounded-md border border-line bg-bg px-3 py-2 text-ink">
          <span className="h-2 w-2 animate-blink rounded-full bg-accent motion-reduce:animate-none" />
          {n}
        </li>
      ))}
    </ul>
  );
}

type Tab = {
  id: string;
  label: string;
  icon: ReactNode;
  title: string;
  explain: string;
  example: [string, string][];
  view: ReactNode;
};

const TABS: Tab[] = [
  {
    id: "ros", label: "ROS 2", icon: <Cpu size={15} />, title: "ROS 2 node graph",
    explain: "Independent nodes exchange data over typed topics. Drivers, SLAM, navigation and the micro-ROS bridge to the ESP32 each run as their own process.",
    example: [["Distro", "Jazzy"], ["Compute", "Raspberry Pi 5"], ["Bridge", "micro-ROS agent"]],
    view: <GraphView />,
  },
  {
    id: "lidar", label: "LiDAR", icon: <Radar size={15} />, title: "LiDAR /scan",
    explain: "A rotating laser measures distance at many angles per revolution. Each sweep is published as a LaserScan message on /scan.",
    example: [["Topic", "/scan"], ["Message", "sensor_msgs/LaserScan"], ["Frame", "lidar_link"]],
    view: <LidarView />,
  },
  {
    id: "slam", label: "SLAM", icon: <Map size={15} />, title: "Occupancy grid map",
    explain: "SLAM Toolbox matches consecutive scans to build a grid of free, occupied and unknown cells while estimating the robot's pose.",
    example: [["Output", "/map"], ["TF", "map → odom"], ["Cell", "free · occupied · unknown"]],
    view: <OccupancyView />,
  },
  {
    id: "nav2", label: "Nav2", icon: <Navigation size={15} />, title: "Costmap + planned path",
    explain: "Obstacles are inflated by the robot radius into a costmap. The planner finds a low-cost path; the controller follows it and publishes /cmd_vel.",
    example: [["Input", "/map, /odom, /scan"], ["Output", "/cmd_vel"], ["Logic", "Behavior tree"]],
    view: <OccupancyView costmap />,
  },
  {
    id: "odom", label: "Odometry", icon: <Activity size={15} />, title: "Differential-drive odometry",
    explain: "Encoder ticks give each wheel's speed. Combining them yields forward and turning velocity, integrated over time into a pose published on /odom.",
    example: [["Topic", "/odom"], ["Source", "ESP32 + encoders"], ["TF", "odom → base_footprint"]],
    view: <OdomView />,
  },
  {
    id: "motor", label: "Motors", icon: <Gauge size={15} />, title: "Motor state",
    explain: "The ESP32 converts /cmd_vel into left and right wheel targets and drives the motor driver with PWM, using encoder feedback to hold speed.",
    example: [["Input", "/cmd_vel"], ["Drive", "PWM → motor driver"], ["Feedback", "Wheel encoders"]],
    view: <BarsView bars={[{ k: "Left PWM (example)", v: 42 }, { k: "Right PWM (example)", v: 47 }, { k: "Vacuum (example)", v: 70 }]} />,
  },
  {
    id: "power", label: "Battery", icon: <Battery size={15} />, title: "Power & sensors",
    explain: "A battery system powers compute, drive motors and the vacuum. Monitoring charge lets the robot plan when to stop a run.",
    example: [["Battery", "[VERIFY spec]"], ["Sensors", "LiDAR, encoders"], ["Loads", "Pi 5, motors, vacuum"]],
    view: <BarsView bars={[{ k: "Charge (example)", v: 76 }]} />,
  },
];

export function RoboticsLab() {
  const [active, setActive] = useState(TABS[1].id);
  const tab = TABS.find((t) => t.id === active)!;

  return (
    <div className="panel overflow-hidden">
      <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-3 md:px-6">
        <p className="flex items-center gap-2 font-mono text-xs text-muted">
          <span className="h-2 w-2 rounded-full bg-accent" /> nexva · lab console
        </p>
        <span className="rounded border border-warn/40 bg-warn/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-warn">
          Illustrative demo · not live data
        </span>
      </div>

      <div role="tablist" aria-label="Robot subsystems" className="flex gap-1 overflow-x-auto border-b border-line px-2 py-2 md:px-4">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={active === t.id}
            aria-controls={`panel-${t.id}`}
            onClick={() => setActive(t.id)}
            className={`flex shrink-0 items-center gap-2 rounded-md px-3 py-2 font-mono text-xs transition-colors ${
              active === t.id ? "bg-accent-deep text-accent" : "text-muted hover:text-ink"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`panel-${tab.id}`} aria-labelledby={`tab-${tab.id}`} className="grid gap-6 p-4 md:grid-cols-2 md:p-6">
        <div className="flex min-h-[220px] items-center justify-center rounded-lg border border-line bg-bg p-4">{tab.view}</div>
        <div>
          <h4 className="font-display text-xl font-semibold text-ink">{tab.title}</h4>
          <p className="mt-3 text-sm leading-relaxed text-muted">{tab.explain}</p>
          <dl className="mt-6 divide-y divide-line rounded-lg border border-line">
            {tab.example.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 px-4 py-2.5 text-sm">
                <dt className="font-mono text-xs uppercase tracking-wider text-dim">{k}</dt>
                <dd className="text-right font-mono text-xs text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
