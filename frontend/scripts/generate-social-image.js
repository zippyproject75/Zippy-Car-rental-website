import { mkdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));

async function generateSocialImage() {
  const publicDir = path.resolve(scriptDirectory, "..", "public");
  const imagesDir = path.join(publicDir, "images");
  const logoPath = path.join(publicDir, "zippy_main_logo.png");
  const outputPath = path.join(imagesDir, "zippy-car-rental-social-preview.jpg");

  console.log("Creating social preview image...");

  await mkdir(imagesDir, { recursive: true });
  const logoMetadata = await sharp(logoPath).metadata();
  console.log(`Logo dimensions: ${logoMetadata.width}x${logoMetadata.height}`);

  const logoHeight = 120;
  if (!logoMetadata.width || !logoMetadata.height) {
    throw new Error("The logo image has no readable dimensions.");
  }
  const logoWidth = Math.round((logoMetadata.width / logoMetadata.height) * logoHeight);

  const resizedLogo = await sharp(logoPath)
    .resize(logoWidth, logoHeight, {
      fit: "inside",
    })
    .toBuffer();

  const svgContent = `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#16213e;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#0f3460;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bg-gradient)"/>
      <rect x="0" y="0" width="1200" height="630" fill="#1a1a2e" opacity="0.3"/>
      <text x="600" y="320" font-family="Arial, Helvetica, sans-serif" font-size="56" font-weight="bold" fill="#ffffff" text-anchor="middle">
        Zippy Car Rental
      </text>
      <text x="600" y="380" font-family="Arial, Helvetica, sans-serif" font-size="32" fill="#e0e0e0" text-anchor="middle">
        Self-Drive Cars in Pune
      </text>
      <rect x="450" y="410" width="300" height="5" fill="#4ade80" rx="2.5"/>
      <text x="600" y="460" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="#a0a0a0" text-anchor="middle">
        Maruti Suzuki Fleet • WhatsApp Enquiry
      </text>
    </svg>
  `;

  const svgBuffer = Buffer.from(svgContent);

  const bgImage = await sharp(svgBuffer).jpeg({ quality: 90 }).toBuffer();

  console.log("Composing final image with logo...");
  await sharp(bgImage)
    .composite([
      {
        input: resizedLogo,
        left: Math.round((1200 - logoWidth) / 2),
        top: 60,
      },
    ])
    .jpeg({
      quality: 90,
      progressive: true,
    })
    .toFile(outputPath);

  console.log(`Social preview image created: ${outputPath}`);
  const stats = await stat(outputPath);
  console.log(`File size: ${stats.size} bytes`);
  console.log("Dimensions: 1200x630");

  return outputPath;
}

generateSocialImage().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
