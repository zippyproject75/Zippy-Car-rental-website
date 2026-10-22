import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0b",
        borderRadius: "40px",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        style={{ width: "80%", height: "80%" }}
      >
        <rect width="32" height="32" rx="7" fill="#0a0a0b" />
        <path
          d="M9 10h14l-10 12h10"
          fill="none"
          stroke="#d4b373"
          strokeWidth="2.6"
          strokeLinecap="square"
        />
      </svg>
    </div>,
    size,
  );
}
