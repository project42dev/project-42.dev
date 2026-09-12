import { defineConfig, devices } from "@playwright/test";
import portalConfig from "../../project42.config.json" with { type: "json" };

// Runs the signed-in header contract against a DEPLOYED origin.
//
//   $env:P42_SESSION_COOKIE = "<value of __Secure-project42_session>"
//   npx playwright test --config tests/production/session-header.config.ts
//
// The cookie is supplied through the environment and is never written to this
// repository. Nothing here logs it, and the one place it is used hands it
// straight to the browser context. Without it the signed-in tests skip and the
// signed-out ones still run, so this file is safe to run in CI unattended.
//
// Getting the value on a desktop: sign in at the portal, open DevTools ->
// Application -> Cookies -> https://project-42.dev, copy the VALUE of
// __Secure-project42_session. It is a bearer of the session for its remaining
// lifetime -- treat it like a password, and sign out afterwards to revoke it.
const origin = process.env.PROJECT42_SESSION_ORIGIN ?? portalConfig.portal.canonicalOrigin;
const url = new URL(origin);
if (url.protocol !== "https:" || url.pathname !== "/" || url.search || url.hash) {
  throw new Error("PROJECT42_SESSION_ORIGIN must be an absolute production HTTPS origin.");
}

export default defineConfig({
  testDir: ".",
  testMatch: /session-header\.acceptance\.spec\.ts/,
  timeout: 60_000,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  use: { baseURL: url.origin, headless: true, trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "iphone-14", use: { ...devices["iPhone 14"] } },
  ],
});
