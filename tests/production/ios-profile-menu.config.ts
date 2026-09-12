import { defineConfig, devices } from "@playwright/test";
import portalConfig from "../../project42.config.json" with { type: "json" };

// Runs the phone profile-menu contract against a DEPLOYED origin, with no
// server of its own and no credentials:
//
//   npx playwright test --config tests/production/ios-profile-menu.config.ts
//
// The browser suite under tests/browser proves the contract against a build.
// This proves it against what is actually being served, which is the only place
// the answer to "is the iPhone fixed yet" lives: the portal pins a platform
// release, GitHub Pages serves an export of it, and a green local build says
// nothing about which of those is live.
const origin = process.env.PROJECT42_PROFILE_MENU_ORIGIN ?? portalConfig.portal.canonicalOrigin;
const url = new URL(origin);
if (url.protocol !== "https:" || url.pathname !== "/" || url.search || url.hash) {
  throw new Error("PROJECT42_PROFILE_MENU_ORIGIN must be an absolute production HTTPS origin.");
}

export default defineConfig({
  testDir: ".",
  testMatch: /ios-profile-menu\.acceptance\.spec\.ts/,
  timeout: 60_000,
  workers: 1,
  retries: 1,
  reporter: [["list"]],
  use: { baseURL: url.origin, headless: true, trace: "retain-on-failure" },
  projects: [
    { name: "iphone-se", use: { ...devices["iPhone SE"] } },
    { name: "iphone-14", use: { ...devices["iPhone 14"] } },
  ],
});
