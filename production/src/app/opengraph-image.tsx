import { ImageResponse } from "next/og";

export const alt = "Zippy Car Rental — self-drive car rental in Pune";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Branded social image with Zippy branding on black background. */
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#000000",
        color: "#ffffff",
        padding: 60,
      }}
    >
      {/* Brand name */}
      <div style={{ fontSize: 48, fontWeight: 700, letterSpacing: 6, color: "#d4b373", marginBottom: 30 }}>
        ZIPPY
      </div>
      <div style={{ fontSize: 48, fontWeight: 700, letterSpacing: 6, color: "#d4b373", marginBottom: 50 }}>
        CAR RENTAL
      </div>
      
      {/* Tagline */}
      <div style={{ fontSize: 64, fontWeight: 800, letterSpacing: 1, textAlign: "center", lineHeight: 1.2 }}>
        Self-Drive Car Rental
      </div>
      <div style={{ fontSize: 64, fontWeight: 800, letterSpacing: 1, textAlign: "center", color: "#d4b373", lineHeight: 1.2 }}>
        in Pune
      </div>
      
      {/* Accent line */}
      <div style={{ width: 200, height: 4, background: "#d4b373", marginTop: 50 }} />
    </div>,
    size,
  );
}
