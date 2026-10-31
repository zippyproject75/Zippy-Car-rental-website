import { ImageResponse } from "next/og";

export const alt = "Zippy Car Rental — self-drive car rental in Pune";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Branded social image with solid background and typography (no external image dependencies). */
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        background: "#0a0a0b",
        color: "#f3eee4",
      }}
    >
      <div style={{ display: "flex", fontSize: 28, letterSpacing: 8, color: "#d4b373" }}>
        ZIPPY CAR RENTAL
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1.05 }}>Self-drive car rental</div>
        <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1.05, color: "#d4b373" }}>
          in Pune.
        </div>
      </div>
      <div style={{ display: "flex", height: 4, width: 160, background: "#d4b373" }} />
    </div>,
    size,
  );
}
