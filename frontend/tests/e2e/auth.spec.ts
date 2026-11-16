import { expect, test } from "@playwright/test";

const apiOrigin = "http://127.0.0.1:4100";

test("customer registration and login routes render without an admin role option", async ({
  page,
}) => {
  const signupResponse = await page.goto("/en/signup");
  expect(signupResponse?.status()).toBeLessThan(400);
  await expect(page.getByRole("heading", { name: "Create your account" })).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Password")).toHaveAttribute("type", "password");
  await expect(page.locator("select, input[name='role']")).toHaveCount(0);
  await expect(page.getByRole("button", { name: /google/i })).toBeVisible();

  const loginResponse = await page.goto("/en/login");
  expect(loginResponse?.status()).toBeLessThan(400);
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
});

test("owner sign-in is separate and no administrator signup route is exposed", async ({ page }) => {
  const loginResponse = await page.goto("/en/admin/login");
  expect(loginResponse?.status()).toBeLessThan(400);
  await expect(page.getByRole("heading", { name: "Administrator sign in" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Create an account" })).toHaveCount(0);

  const signupResponse = await page.goto("/en/admin/signup");
  expect(signupResponse?.status()).toBe(404);
});

test("direct owner API access rejects anonymous requests", async ({ page }) => {
  await page.goto("/en/admin/login");
  const status = await page.evaluate(async () => {
    const response = await fetch("/api/admin/activity", { credentials: "include" });
    return response.status;
  });
  expect(status).toBe(401);
});

test("API rejects untrusted mutations and does not expose a server-side signup endpoint", async ({
  page,
}) => {
  await page.goto("/en/signup");
  const untrustedResponse = await page.request.post(`${apiOrigin}/api/enquiries`, {
    headers: { Origin: "https://attacker.example" },
    data: {
      vehicleSlug: null,
      packageCode: null,
      pickupLocationSlug: null,
      pickupAt: "2030-01-01T10:00:00.000Z",
      returnAt: "2030-01-01T22:00:00.000Z",
    },
  });
  expect(untrustedResponse.status()).toBe(403);

  const registrationResponse = await page.request.post(`${apiOrigin}/api/auth/register`, {
    headers: { Origin: "http://127.0.0.1:3100" },
    data: {
      displayName: "Privilege escalation attempt",
      email: "customer@example.test",
      password: "a secure passphrase 123",
      role: "SUPER_ADMIN",
    },
  });
  expect(registrationResponse.status()).toBe(404);
});
