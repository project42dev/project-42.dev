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
    page.getByRole("heading", { name: "Engineering-complete review draft" }),
  ).toBeVisible();
  await expect(page.getByText(/not yet effective legal terms/i)).toBeVisible();

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
