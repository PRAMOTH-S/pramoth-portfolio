import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const OG_SIZE = { width: 1200, height: 630 };

/** Social-preview card shared by opengraph-image and twitter-image. */
export function renderOgImage() {
  const chips = ["ROS 2", "Embedded", "Computer Vision", "AI / ML", "Product Design"];
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #070908 0%, #0c100e 60%, #0f3d24 160%)",
          color: "#e7ece8",
          fontFamily: "Inter, system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* engineering grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(to right, rgba(52,210,123,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(52,210,123,0.08) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div style={{ position: "absolute", right: -120, top: -120, width: 520, height: 520, borderRadius: 999, background: "rgba(52,210,123,0.18)", filter: "blur(120px)" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 22, letterSpacing: 6, color: "#34d27b", fontFamily: "monospace" }}>
          <div style={{ display: "flex", width: 44, height: 44, alignItems: "center", justifyContent: "center", borderRadius: 8, border: "2px solid #34d27b", fontSize: 18 }}>
            PS
          </div>
          PORTFOLIO
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: -3, lineHeight: 1 }}>{site.name}</div>
          <div style={{ fontSize: 30, color: "#34d27b", fontFamily: "monospace", letterSpacing: 4, textTransform: "uppercase" }}>{site.role}</div>
          <div style={{ fontSize: 26, color: "#93a097", maxWidth: 900, lineHeight: 1.35 }}>{site.tagline}</div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          {chips.map((c) => (
            <div
              key={c}
              style={{
                display: "flex",
                padding: "10px 18px",
                borderRadius: 8,
                border: "1px solid rgba(52,210,123,0.45)",
                background: "rgba(52,210,123,0.10)",
                color: "#e7ece8",
                fontSize: 20,
                fontFamily: "monospace",
              }}
            >
              {c}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
