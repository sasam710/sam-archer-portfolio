import { ImageResponse } from "next/og";

export const alt = "Sam Archer, product support specialist";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f3efe6",
          color: "#1c1915",
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 4, color: "#0f5c45" }}>
          SAM ARCHER
        </div>
        <div style={{ display: "flex", fontSize: 68, lineHeight: 1.05, maxWidth: 900 }}>
          Support specialist who turns queues into systems.
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#3c362e" }}>
          Product support at Fyxer. Austin, TX.
        </div>
      </div>
    ),
    { ...size },
  );
}
