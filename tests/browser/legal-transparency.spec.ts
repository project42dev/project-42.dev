import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("exposes the review-gated Legal & Transparency page accessibly", async ({
  page,
}) => {
  await page.goto("/");
  const footer = page.getByRole("contentinfo");
  await expect(
    footer.getByRole("link", { name: "Legal & Transparency" }),
  ).toHaveCount(2);

  await footer
    .getByRole("link", { name: "Legal & Transparency" })
    .first()
    .focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/legal-transparency\/?$/);
  await expect(
    page.getByRole("heading", {
      name: "Open on purpose. Honest about the limits.",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Owner-accepted review draft" }),
  ).toBeVisible();
  await expect(page.getByText(/not yet effective legal terms/i)).toBeVisible();
  await expect(
    page.getByText(/accepted this review draft on July 28, 2026/i),
  ).toBeVisible();
  await expect(
    page.getByText(/qualified legal review/i).first(),
  ).toBeVisible();
  await expect(
    page.getByText(/Pending qualified legal review/i),
  ).toBeVisible();
  await expect(page.getByText("Owner accepted July 28, 2026")).toBeVisible();

  await expect(page.getByRole("main")).toHaveCount(1);
  await expect(page.getByRole("contentinfo")).toHaveCount(1);
  const contents = page.getByRole("navigation", { name: "On this page" });
  await expect(contents).toBeVisible();
  const contentsLinks = contents.getByRole("link");
  await expect(contentsLinks).toHaveCount(9);
  const targets = await contentsLinks.evaluateAll((links) =>
    links.map((link) => link.getAttribute("href")),
  );
  expect(new Set(targets).size).toBe(9);
  const targetHeights = await contentsLinks.evaluateAll((links) =>
    links.map((link) => link.getBoundingClientRect().height),
  );
  expect(targetHeights.every((height) => height >= 44)).toBe(true);
  for (const target of targets) {
    expect(target).toMatch(/^#[a-z][a-z0-9-]+$/);
    await expect(page.locator(target as string)).toHaveCount(1);
  }

  const footerLegalLink = page
    .getByRole("contentinfo")
    .getByRole("link", { name: "Legal & Transparency" })
    .first();
  await footerLegalLink.focus();
  await expect(footerLegalLink).toBeFocused();
  expect(
    await footerLegalLink.evaluate(
      (link) => getComputedStyle(link).outlineColor,
    ),
  ).toBe("rgb(201, 242, 95)");

  const reviewLink = contents.getByRole("link", { name: "Review status" });
  const peopleLink = contents.getByRole("link", {
    name: "People and responsibility",
  });
  await reviewLink.focus();
  await page.keyboard.press("Tab");
  await expect(peopleLink).toBeFocused();
  expect(
    await peopleLink.evaluate((link) => getComputedStyle(link).outlineStyle),
  ).not.toBe("none");
  expect(
    await peopleLink.evaluate((link) => getComputedStyle(link).outlineColor),
  ).toBe("rgb(11, 18, 37)");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#people-title$/);
  await expect(page.locator("#people-title")).toBeFocused();

  const accessibility = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(accessibility.violations).toEqual([]);
});

test("keeps Legal & Transparency readable at narrow width and text zoom", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/legal-transparency");
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
  });
  await expect(
    page.getByRole("heading", {
      name: "Open on purpose. Honest about the limits.",
    }),
  ).toBeVisible();
  const overflow = await page.evaluate(() => {
    const viewportWidth = document.documentElement.clientWidth;
    const elements = [...document.querySelectorAll<HTMLElement>("body *")];
    const offenders = elements
      .map((element) => {
        const bounds = element.getBoundingClientRect();
        return {
          element: element.tagName.toLowerCase(),
          className: element.className,
          clientWidth: element.clientWidth,
          scrollWidth: element.scrollWidth,
          left: Math.round(bounds.left),
          right: Math.round(bounds.right),
          parent: element.parentElement?.className,
          text: element.textContent?.trim().slice(0, 60),
        };
      })
      .filter((element) => element.right > viewportWidth + 1)
      .slice(0, 10);
    const scrollContainers = [
      document.documentElement,
      document.body,
      ...elements,
    ]
      .filter((element) => element.scrollWidth > element.clientWidth + 1)
      .map((element) => ({
        element: element.tagName.toLowerCase(),
        className: element.className,
        clientWidth: element.clientWidth,
        scrollWidth: element.scrollWidth,
      }))
      .slice(0, 10);
    return {
      pixels: document.documentElement.scrollWidth - viewportWidth,
      offenders,
      scrollContainers,
    };
  });
  expect(
    overflow.pixels,
    JSON.stringify({
      offenders: overflow.offenders,
      scrollContainers: overflow.scrollContainers,
    }),
  ).toBeLessThanOrEqual(1);
});

test("keeps legal navigation and the footer distinct in forced colors", async ({
  page,
}) => {
  await page.emulateMedia({ forcedColors: "active" });
  await page.goto("/legal-transparency");
  expect(
    await page.evaluate(() => matchMedia("(forced-colors: active)").matches),
  ).toBe(true);

  const contents = page.getByRole("navigation", { name: "On this page" });
  const contentsLink = contents.getByRole("link", { name: "Review status" });
  const footer = page.getByRole("contentinfo");
  const footerLink = footer
    .getByRole("link", { name: "Legal & Transparency" })
    .first();

  const forcedColorStyles = await page.evaluate(() => {
    const toc = document.querySelector<HTMLElement>(".legal-toc");
    const footerElement = document.querySelector<HTMLElement>(".site-footer");
    const tocLink = toc?.querySelector<HTMLElement>("a");
    const footerLegalLink = footerElement?.querySelector<HTMLElement>(
      'a[href="/legal-transparency"]',
    );
    if (!toc || !footerElement || !tocLink || !footerLegalLink) {
      throw new Error("Legal forced-colors fixtures are missing.");
    }
    const tocStyle = getComputedStyle(toc);
    const footerStyle = getComputedStyle(footerElement);
    return {
      tocBorderStyle: tocStyle.borderTopStyle,
      tocBorderWidth: tocStyle.borderTopWidth,
      tocLinkDecoration: getComputedStyle(tocLink).textDecorationLine,
      footerBorderStyle: footerStyle.borderTopStyle,
      footerBorderWidth: footerStyle.borderTopWidth,
      footerLinkDecoration:
        getComputedStyle(footerLegalLink).textDecorationLine,
    };
  });
  expect(forcedColorStyles).toMatchObject({
    tocBorderStyle: "solid",
    tocBorderWidth: "1px",
    tocLinkDecoration: "underline",
    footerBorderStyle: "solid",
    footerBorderWidth: "1px",
    footerLinkDecoration: "underline",
  });

  await contentsLink.focus();
  await expect(contentsLink).toBeFocused();
  expect(
    await contentsLink.evaluate((link) => getComputedStyle(link).outlineStyle),
  ).not.toBe("none");
  await footerLink.focus();
  await expect(footerLink).toBeFocused();
  expect(
    await footerLink.evaluate((link) => getComputedStyle(link).outlineStyle),
  ).not.toBe("none");
});

test("uses instant legal and footer navigation when reduced motion is requested", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/legal-transparency");
  const contentsLink = page
    .getByRole("navigation", { name: "On this page" })
    .getByRole("link", { name: "Service expectations" });
  const footerLink = page
    .getByRole("contentinfo")
    .getByRole("link", { name: "Legal & Transparency" })
    .first();

  const motionStyles = await page.evaluate(() => {
    const durationInMilliseconds = (value: string) =>
      Math.max(
        ...value.split(",").map((duration) => {
          const trimmed = duration.trim();
          return trimmed.endsWith("ms")
            ? Number.parseFloat(trimmed)
            : Number.parseFloat(trimmed) * 1_000;
        }),
      );
    const tocLink = document.querySelector<HTMLElement>(".legal-toc a");
    const footerLegalLink = document.querySelector<HTMLElement>(
      '.site-footer a[href="/legal-transparency"]',
    );
    if (!tocLink || !footerLegalLink) {
      throw new Error("Legal reduced-motion fixtures are missing.");
    }
    return {
      reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
      scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
      tocTransitionMs: durationInMilliseconds(
        getComputedStyle(tocLink).transitionDuration,
      ),
      footerTransitionMs: durationInMilliseconds(
        getComputedStyle(footerLegalLink).transitionDuration,
      ),
    };
  });
  expect(motionStyles.reducedMotion).toBe(true);
  expect(motionStyles.scrollBehavior).toBe("auto");
  expect(motionStyles.tocTransitionMs).toBeLessThanOrEqual(0.01);
  expect(motionStyles.footerTransitionMs).toBeLessThanOrEqual(0.01);

  await footerLink.focus();
  await expect(footerLink).toBeFocused();
  await contentsLink.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#service-title$/);
  await expect(page.locator("#service-title")).toBeFocused();
});
