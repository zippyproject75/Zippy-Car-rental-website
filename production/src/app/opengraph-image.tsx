import { ImageResponse } from "next/og";

export const alt = "Zippy Car Rental — self-drive car rental in Pune";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Branded social image with Zippy logo and tagline on black background. */
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
      {/* Logo using absolute URL */}
      <img
        src="https://www.zippycarrental.in/zippy_main_logo.png"
        alt="Zippy Car Rental Logo"
        width={280}
        height={187}
        style={{ marginBottom: 40 }}
      />
      
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
