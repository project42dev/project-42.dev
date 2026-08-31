import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const galacticTokens = {
  "--p42-bg": "#090d16",
  "--p42-surface": "#0c1220",
  "--p42-primary": "#f59e0b",
  "--p42-accent": "#10b981",
  "--p42-text-title": "#fef3c7",
  "--p42-text-body": "#e2e8f0",
  "--p42-text-muted": "#94a3b8",
} as const;

const publicRouteFamilies = [
  "/",
  "/learn",
  "/learn/ai-foundations",
  "/learn/ai-foundations/what-ai-does",
  "/guide",
  "/guide/resources/agent-safety-checklist",
  "/guide/diagrams",
  "/guide/diagrams/agent-orchestration",
  "/diagrams",
  "/diagrams/agent-orchestration",
  "/resources/agent-safety-checklist",
  "/ondemand",
  "/ondemand/ai-foundations/agents-and-guardrails",
  "/transfer-progress",
  "/account",
  "/learner-data",
  "/about",
  "/roadmap",
  "/releases",
  "/platform",
  "/support",
  "/legal-transparency",
] as const;

const protectedRouteFamilies = [
  "/profile",
  "/import-progress",
] as const;

test("matches the authoritative Galactic Gallery poster and design tokens", async ({
  page,
  request,
}) => {
  await page.goto("/");

  await expect(page.locator("html")).toHaveAttribute("data-theme", "06-galactic-guide");
  await expect(page.locator(".galactic-poster-hero")).toHaveCSS(
    "background-image",
    /\/themes\/06-galactic-guide\/hero\.png/,
  );
  await expect(page.locator(".galactic-floating-card")).toHaveCSS(
    "background-color",
    "rgba(13, 20, 36, 0.94)",
  );
  await expect(page.locator(".galactic-floating-card")).toHaveCSS(
    "border-top-color",
    "rgba(245, 158, 11, 0.45)",
  );
  await expect(page.locator(".galactic-actions a").first()).toHaveCSS(
    "background-color",
    "rgb(245, 158, 11)",
  );
  await expect(page.locator(".galactic-system-bar")).toHaveCSS(
    "background-color",
    "rgb(12, 18, 32)",
  );
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "The Answer to AI, Agents, and Everything.",
  );
  await expect(page.locator(".galactic-badge-card")).toHaveCount(4);

  const loadedAssets = await page
    .locator(".galactic-brand-mark, .galactic-badge-card img")
    .evaluateAll((images) =>
      images.every((image) => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0),
    );
  expect(loadedAssets).toBe(true);

  for (const asset of [
    "hero.png",
    "mark.svg",
    "badges/badge-foundations.svg",
    "badges/badge-practitioner.svg",
    "badges/badge-agentic.svg",
    "badges/badge-evidence.svg",
  ]) {
    const response = await request.get(`/themes/06-galactic-guide/${asset}`);
    expect(response.status(), `${asset} should load`).toBe(200);
    expect((await response.body()).length, `${asset} should not be empty`).toBeGreaterThan(100);
  }

  const computedTokens = await page.locator("html").evaluate((element, names) => {
    const styles = getComputedStyle(element);
    return Object.fromEntries(names.map((name) => [name, styles.getPropertyValue(name).trim()]));
  }, Object.keys(galacticTokens));
  expect(computedTokens).toEqual(galacticTokens);
});

test("keeps every public route family inside the Galactic presentation boundary", async ({
  page,
}) => {
  for (const viewport of [
    { width: 1440, height: 1000 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);

    for (const route of publicRouteFamilies) {
      const response = await page.goto(route);
      expect(response?.status(), route).toBe(200);
      await expect(page.locator("html"), route).toHaveAttribute(
        "data-theme",
        "06-galactic-guide",
      );
      await expect(page.locator("body"), route).toHaveCSS(
        "background-color",
        "rgb(9, 13, 22)",
      );
      await expect(page.locator("main"), route).toBeVisible();
      await expect(page.locator(".site-header"), route).toHaveCSS(
        "background-color",
        "rgba(9, 13, 22, 0.96)",
      );

      const presentation = await page.evaluate(() => {
        const heading = document.querySelector("main h1, main h2");
        const headingStyles = heading ? getComputedStyle(heading) : null;
        return {
          bodyFont: getComputedStyle(document.body).fontFamily,
          headingFont: headingStyles?.fontFamily ?? "",
          headingColor: headingStyles?.color ?? "",
          hasHorizontalOverflow:
            document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        };
      });

      expect(presentation.bodyFont, `${route} body font`).toContain("Inter");
      expect(presentation.headingFont, `${route} heading font`).toContain(
        "Bricolage Grotesque",
      );
      expect(presentation.headingColor, `${route} heading color`).toBe("rgb(254, 243, 199)");
      expect(presentation.hasHorizontalOverflow, `${route} horizontal overflow`).toBe(false);
    }
  }
});

test("preserves accessible focus, hover, reduced-motion, and contrast states", async ({
  page,
}) => {
  await page.goto("/");
  const primaryAction = page.locator(".galactic-actions a").first();

  await primaryAction.hover();
  await expect(primaryAction).toHaveCSS("background-color", "rgb(251, 191, 36)");

  await primaryAction.focus();
  await expect(primaryAction).toBeFocused();
  const focusIndicator = await primaryAction.evaluate((element) => {
    const styles = getComputedStyle(element);
    return `${styles.outlineStyle} ${styles.outlineWidth} ${styles.boxShadow}`;
  });
  expect(focusIndicator).not.toBe("none 0px none");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(primaryAction).toHaveCSS("transition-duration", "0s");

  const accessibility = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(accessibility.violations).toEqual([]);
});

test("preserves the protected-profile authentication boundary", async ({ page }) => {
  for (const route of protectedRouteFamilies) {
    await page.goto(route);
    await page.waitForURL(/project42dev\.ciamlogin\.com\/.*\/oauth2\/v2\.0\/authorize/);

    const authorizationUrl = new URL(page.url());
    expect(authorizationUrl.protocol).toBe("https:");
    expect(authorizationUrl.hostname).toBe("project42dev.ciamlogin.com");
    expect(authorizationUrl.searchParams.get("response_type")).toBe("code");

    const returnUrl = authorizationUrl.searchParams.get("redirect_uri");
    expect(returnUrl).toBeTruthy();
    expect(new URL(returnUrl!).protocol).toBe("https:");
  }
});

test("serves the machine-readable policy and keeps admin theming isolated", async ({
  page,
  request,
}) => {
  const policyResponse = await request.get("/learner-data/policy");
  expect(policyResponse.status()).toBe(200);
  expect(policyResponse.headers()["content-type"]).toContain("application/json");
  expect(await policyResponse.json()).toMatchObject({ policyVersion: expect.any(String) });

  await page.goto("/admin");
  await expect(page.locator(".admin-portal-root")).toHaveAttribute(
    "data-theme",
    "admin-control",
  );
  await expect(page.locator(".admin-portal-root")).toBeVisible();
});
