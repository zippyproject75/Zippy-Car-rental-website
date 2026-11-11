import { existsSync } from "node:fs";
import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.E2E_PORT ?? 3100);
const systemChromium = ["/usr/bin/chromium", "/usr/bin/chromium-browser"].find((p) =>
  existsSync(p),
);
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ?? systemChromium;
const launchOptions = executablePath ? { executablePath } : {};

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: {
    baseURL: process.env.E2E_BASE_URL ?? `http://127.0.0.1:${port}`,
    timezoneId: "America/New_York",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], launchOptions } },
    {
      name: "mobile",
      use: { ...devices["Pixel 7"], launchOptions },
      testIgnore: /a11y|seo/,
    },
  ],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : [
        {
          command: "corepack pnpm --dir ../backend dev",
          url: "http://127.0.0.1:4100/healthz",
          reuseExistingServer: !process.env.CI,
          timeout: 120_000,
          env: {
            PORT: "4100",
            HOST: "127.0.0.1",
            FRONTEND_ORIGIN: `http://127.0.0.1:${port}`,
            AUTH_SECRET: "zippy-e2e-auth-secret-at-least-32-bytes",
            DATABASE_URL: "",
            SUPABASE_URL: "",
            SUPABASE_ANON_KEY: "",
          },
        },
        {
          command: `corepack pnpm dev --port ${port}`,
          url: `http://127.0.0.1:${port}`,
          reuseExistingServer: !process.env.CI,
          timeout: 120_000,
          env: { BACKEND_API_URL: "http://127.0.0.1:4100" },
        },
      ],
});
