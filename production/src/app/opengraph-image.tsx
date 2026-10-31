import { ImageResponse } from "next/og";

export const alt = "Zippy Car Rental — self-drive car rental in Pune";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Branded social image with cinematic highway background. */
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
        position: "relative",
        color: "#f3eee4",
      }}
    >
      {/* Background image with overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url(https://www.zippycarrental.in/images/hero-highway-perfect.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.4,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(10,10,11,0.7), rgba(10,10,11,0.9))",
        }}
      />
      
      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, display: "flex", fontSize: 28, letterSpacing: 8, color: "#d4b373" }}>
        ZIPPY CAR RENTAL
      </div>
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1.05 }}>Self-drive car rental</div>
        <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1.05, color: "#d4b373" }}>
          in Pune.
        </div>
      </div>
      <div style={{ position: "relative", zIndex: 1, display: "flex", height: 4, width: 160, background: "#d4b373" }} />
    </div>,
    size,
  );
}
