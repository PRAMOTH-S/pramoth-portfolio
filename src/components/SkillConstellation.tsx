"use client";

// Neural-network style skill map: disciplines as nodes, connections as
// synapses that draw themselves in and illuminate on hover.

import { useState } from "react";
import { motion } from "framer-motion";

type Node = { id: string; label: string; x: number; y: number; hub?: boolean };

const NODES: Node[] = [
  { id: "robotics", label: "Robotics", x: 300, y: 125, hub: true },
  { id: "ros2", label: "ROS 2 · Nav2", x: 140, y: 55 },
  { id: "ai", label: "AI · Vision", x: 460, y: 55 },
  { id: "lang", label: "C++ · Python", x: 300, y: 28 },
  { id: "embedded", label: "Embedded", x: 110, y: 185 },
  { id: "cad", label: "CAD · Design", x: 490, y: 185 },
  { id: "web", label: "Web · UI", x: 300, y: 222 },
];

const LINKS: [string, string][] = [
  ["robotics", "ros2"],
  ["robotics", "ai"],
  ["robotics", "lang"],
  ["robotics", "embedded"],
  ["robotics", "cad"],
  ["robotics", "web"],
  ["ros2", "lang"],
  ["ai", "lang"],
  ["ros2", "embedded"],
  ["ai", "cad"],
];

const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));

export function SkillConstellation() {
  const [hot, setHot] = useState<string | null>(null);
  const linked = (id: string) => hot !== null && (id === hot || LINKS.some(([a, b]) => (a === hot && b === id) || (b === hot && a === id)));

  return (
    <figure
      aria-label="Skill map: ROS 2, AI and vision, C++ and Python, embedded systems, CAD design and web UI all connect through robotics"
      className="panel relative mx-auto mb-8 max-w-3xl overflow-hidden p-2"
    >
      <svg viewBox="0 0 600 250" className="h-auto w-full" onPointerLeave={() => setHot(null)}>
        {/* synapses draw themselves in */}
        {LINKS.map(([a, b], i) => {
          const A = byId[a];
          const B = byId[b];
          const lit = hot !== null && (a === hot || b === hot);
          return (
            <motion.line
              key={`${a}-${b}`}
              x1={A.x} y1={A.y} x2={B.x} y2={B.y}
              stroke={lit ? "#86ffb8" : "#34d27b"}
              strokeOpacity={hot === null ? 0.25 : lit ? 0.8 : 0.08}
              strokeWidth={lit ? 1.4 : 1}
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15 + i * 0.06, ease: "easeOut" }}
              className="transition-[stroke-opacity,stroke] duration-300"
            />
          );
        })}

        {NODES.map((n, i) => {
          const on = hot === null || linked(n.id);
          return (
            <motion.g
              key={n.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: `${n.x}px ${n.y}px` }}
              onPointerEnter={() => setHot(n.id)}
              className="cursor-default"
            >
              <circle
                cx={n.x} cy={n.y} r={n.hub ? 26 : 17}
                fill={n.hub ? "#0f3d24" : "#0c100e"}
                stroke={hot === n.id ? "#86ffb8" : "#34d27b"}
                strokeOpacity={on ? (n.hub ? 0.9 : 0.5) : 0.15}
                strokeWidth={hot === n.id ? 1.6 : 1.2}
                className="transition-all duration-300"
              />
              {/* pulse halo on the hub */}
              {n.hub && (
                <circle cx={n.x} cy={n.y} r="26" fill="none" stroke="#34d27b" strokeOpacity="0.35" className="animate-ping [transform-origin:center] motion-reduce:hidden" style={{ transformBox: "fill-box" }} />
              )}
              <text
                x={n.x} y={n.y + (n.hub ? 40 : 31)}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize="10"
                fill={hot === n.id ? "#86ffb8" : on ? "#93a097" : "#707e76"}
                opacity={on ? 1 : 0.4}
                className="transition-all duration-300"
              >
                {n.label}
              </text>
              <circle cx={n.x} cy={n.y} r="2.2" fill={on ? "#86ffb8" : "#28352e"} className="transition-colors duration-300" />
            </motion.g>
          );
        })}
      </svg>
    </figure>
  );
}
