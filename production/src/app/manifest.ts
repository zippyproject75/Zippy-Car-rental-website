import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Zippy Car Rental",
    short_name: "Zippy",
    description: "Self-drive car rental in Pune, Maharashtra. Five Maruti Suzuki cars available for enquiry.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0b",
    theme_color: "#d4b373",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
    categories: ["travel", "automotive"],
  };
}
