import { ImageResponse } from "next/og";

export const alt = "Zippy Car Rental — self-drive car rental in Pune";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Branded social image with logo and tagline on black background. */
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
      }}
    >
      {/* Logo */}
      <img
        src="https://www.zippycarrental.in/zippy_main_logo.png"
        alt="Zippy Car Rental Logo"
        width={300}
        height={200}
        style={{ marginBottom: 40 }}
      />
      
      {/* Tagline */}
      <div style={{ fontSize: 72, fontWeight: 700, letterSpacing: 2, textAlign: "center" }}>
        Self-Drive Car Rental
      </div>
      <div style={{ fontSize: 72, fontWeight: 700, letterSpacing: 2, textAlign: "center", color: "#d4b373" }}>
        in Pune
      </div>
    </div>,
    size,
  );
}
