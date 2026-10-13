"use client";

import { useState } from "react";

type Node = {
  id: string;
  label: string;
  sub?: string;
  x: number;
  y: number;
  w?: number;
  info: string;
  topics?: string[];
};

const NODES: Node[] = [
  { id: "web", label: "Web Dashboard", x: 380, y: 40, info: "Operator interface for starting runs, viewing the map and monitoring robot state." },
  { id: "ros", label: "ROS 2 System", sub: "Raspberry Pi 5 · Jazzy", x: 380, y: 130, w: 220, info: "The Raspberry Pi 5 runs Ubuntu and ROS 2 Jazzy: SLAM Toolbox, Nav2, the coverage planner and the bridge to the dashboard." },
  { id: "slam", label: "SLAM", sub: "SLAM Toolbox", x: 150, y: 230, info: "Builds an occupancy-grid map from LiDAR scans and odometry, and estimates the robot's pose in it.", topics: ["/scan → in", "/map → out", "map → odom (TF)"] },
  { id: "nav2", label: "Nav2", sub: "BT Navigator", x: 380, y: 230, info: "Behavior-tree driven navigation: global and local costmaps, path planning, path following and recovery behaviors.", topics: ["/map → in", "/odom → in", "/cmd_vel → out"] },
  { id: "tele", label: "Telemetry", x: 610, y: 230, info: "Robot state streamed to the dashboard — pose, map and status." },
  { id: "lidar", label: "LiDAR", sub: "2D laser", x: 150, y: 330, info: "Publishes 360° range scans used for mapping, localization and obstacle detection.", topics: ["/scan"] },
  { id: "ctrl", label: "Planner / Controller", x: 380, y: 330, w: 200, info: "The planner computes a global path over the costmap; the controller turns it into velocity commands while avoiding local obstacles." },
  { id: "ui", label: "UI", x: 610, y: 330, info: "Visual map, robot position and run progress in the browser." },
  { id: "cmd", label: "/cmd_vel", x: 380, y: 420, info: "Linear and angular velocity commands from Nav2 to the base.", topics: ["geometry_msgs/Twist"] },
  { id: "esp", label: "ESP32", sub: "micro-ROS client", x: 380, y: 505, info: "Subscribes to /cmd_vel, drives the motor driver with PWM, reads wheel encoders and publishes /odom back to ROS 2.", topics: ["/cmd_vel → in", "/odom → out"] },
  { id: "motor", label: "Motors + Encoders", x: 380, y: 590, w: 200, info: "DC drive motors with encoders closing the speed loop and providing wheel odometry." },
  { id: "base", label: "Robot Base", sub: "+ vacuum motor", x: 380, y: 670, info: "Differential-drive chassis carrying the compute, sensors, battery and vacuum unit." },
];

const EDGES: [string, string, string?][] = [
  ["web", "ros"],
  ["ros", "slam"],
  ["ros", "nav2"],
  ["ros", "tele"],
  ["lidar", "slam", "/scan"],
  ["nav2", "ctrl"],
  ["tele", "ui"],
  ["ctrl", "cmd"],
  ["cmd", "esp"],
  ["esp", "motor", "PWM"],
  ["motor", "base"],
];

const H = 46;
const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));

export function ArchitectureDiagram() {
  const [sel, setSel] = useState<string>("ros");
  const node = byId[sel];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="panel overflow-x-auto p-3 md:p-5">
        <svg viewBox="0 0 760 710" className="min-w-[620px]" role="group" aria-label="AMR system architecture. Select a block to read about it.">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10 z" fill="#34d27b" />
            </marker>
          </defs>

          {EDGES.map(([a, b, label]) => {
            const A = byId[a];
            const B = byId[b];
            const flip = A.y > B.y; // lidar → slam goes upward
            const y1 = flip ? A.y - H / 2 : A.y + H / 2;
            const y2 = flip ? B.y + H / 2 : B.y - H / 2;
            const midY = (y1 + y2) / 2;
            const d = A.x === B.x ? `M${A.x} ${y1} V${y2}` : `M${A.x} ${y1} V${midY} H${B.x} V${y2}`;
            const on = sel === a || sel === b;
            return (
              <g key={a + b}>
                <path d={d} fill="none" stroke={on ? "#34d27b" : "#28352e"} strokeWidth={on ? 1.6 : 1.2} markerEnd="url(#arrow)" />
                {label && (
                  <text x={B.x + 10} y={midY + 4} fontSize="11" fontFamily="var(--font-mono)" fill="#86ffb8">
                    {label}
                  </text>
                )}
              </g>
            );
          })}

          {/* /odom feedback loop: ESP32 → ROS 2 */}
          <path d="M272 505 H40 V130 H268" fill="none" stroke={sel === "esp" || sel === "ros" ? "#34d27b" : "#28352e"} strokeDasharray="5 5" markerEnd="url(#arrow)" />
          <text x="48" y="320" fontSize="11" fontFamily="var(--font-mono)" fill="#86ffb8">/odom</text>
          <text x="48" y="336" fontSize="10" fontFamily="var(--font-mono)" fill="#707e76">encoder feedback</text>

          {NODES.map((n) => {
            const w = n.w ?? 170;
            const active = sel === n.id;
            return (
              <g
                key={n.id}
                role="button"
                tabIndex={0}
                aria-pressed={active}
                aria-label={n.label}
                className="cursor-pointer focus:outline-none"
                onClick={() => setSel(n.id)}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setSel(n.id))}
              >
                <rect
                  x={n.x - w / 2}
                  y={n.y - H / 2}
                  width={w}
                  height={H}
                  rx="8"
                  fill={active ? "#0f3d24" : "#0c100e"}
                  stroke={active ? "#34d27b" : "#28352e"}
                  strokeWidth={active ? 1.6 : 1}
                />
                <text x={n.x} y={n.sub ? n.y - 2 : n.y + 5} textAnchor="middle" fontSize="14" fontWeight="600" fill="#e7ece8">
                  {n.label}
                </text>
                {n.sub && (
                  <text x={n.x} y={n.y + 14} textAnchor="middle" fontSize="10" fontFamily="var(--font-mono)" fill="#93a097">
                    {n.sub}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <aside className="panel p-5" aria-live="polite">
        <p className="label mb-3">Selected block</p>
        <h4 className="font-display text-xl font-semibold text-accent">{node.label}</h4>
        {node.sub && <p className="mt-1 font-mono text-xs text-dim">{node.sub}</p>}
        <p className="mt-4 text-sm leading-relaxed text-muted">{node.info}</p>
        {node.topics && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {node.topics.map((t) => (
              <li key={t} className="chip">{t}</li>
            ))}
          </ul>
        )}
        <p className="mt-6 border-t border-line pt-4 text-xs text-dim">Tap or tab through blocks in the diagram to explore the data flow.</p>
      </aside>
    </div>
  );
}
