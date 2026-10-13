import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Home-screen icon for iOS/Android (Safari ignores SVG favicons). */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0c100e, #0f3d24)",
          color: "#34d27b",
          fontSize: 84,
          fontWeight: 700,
          letterSpacing: -4,
          fontFamily: "monospace",
          borderRadius: 36,
        }}
      >
        PS
      </div>
    ),
    { ...size },
  );
}
