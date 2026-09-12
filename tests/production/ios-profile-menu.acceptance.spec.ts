import { expect, test } from "@playwright/test";

// THE IPHONE PROFILE MENU, ON THE DEPLOYED SITE.
//
// The profile control in the header did nothing on an iPhone -- in Mobile
// Safari and in the installed app alike -- while the same build worked in a
// desktop browser. The disclosure was never at fault: aria-expanded flipped and
// the panel was laid out. `.site-header` carried `overflow-x: clip`, and the
// panel is absolutely positioned below the header it lives in. Chromium and
// Gecko clip only the named axis, so a desktop was fine; WebKit clips both, so
// on iOS the menu opened flush-cut to nothing.
//
// The platform owns the fix and the build-time gate (see the phone gate in
// tests/browser/mobile-viewport.spec.ts, materialised from
// project42-platform/web). This file is the portal's half, and it exists
// because those two facts are not the same fact: this repository pins a
// platform release, GitHub Pages serves an export of that pin, and neither a
// green platform suite nor a green local build says anything about which bytes
// are being served to the owner's phone. Run it after a release lands.
//
// It is deliberately credential-free -- the home page signed out is enough --
// so it can be run against production by anyone, at any time, without touching
// a learner's data.
//
//   npx playwright test --config tests/production/ios-profile-menu.config.ts

const TRIGGER = ".header-actions .header-menu-trigger";
const PANEL = ".header-actions .header-menu-panel";

test("the deployed profile menu opens on a tap and is not clipped away", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const trigger = page.locator(TRIGGER);
  const panel = page.locator(PANEL);
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(panel).toBeHidden();
  // Every destination is in the served HTML whether the panel is open or shut.
  await expect(panel.locator("a")).not.toHaveCount(0);

  await trigger.tap();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(panel).toBeVisible();
  // A trial tap runs the full actionability hit test -- and names whatever
  // intercepts the point -- without following a protected link off to the
  // identity provider.
  await panel.getByRole("link", { name: "My progress" }).tap({ trial: true });

  const measured = await page.evaluate((selector) => {
    const element = document.querySelector<HTMLElement>(selector)!;
    const header = element.closest(".site-header")!;
    const clippers: string[] = [];
    for (let ancestor = element.parentElement; ancestor; ancestor = ancestor.parentElement) {
      const styles = getComputedStyle(ancestor);
      if (styles.overflowX === "visible" && styles.overflowY === "visible") continue;
      const name = `${ancestor.tagName.toLowerCase()}${String(ancestor.className).trim() ? `.${String(ancestor.className).trim().split(/\s+/)[0]}` : ""}`;
      clippers.push(`${name} {overflow-x: ${styles.overflowX}; overflow-y: ${styles.overflowY}}`);
    }
    return {
      clippers,
      overhang: element.getBoundingClientRect().bottom - header.getBoundingClientRect().bottom,
    };
  }, PANEL);

  // The clipping check is only worth anything while the panel really does hang
  // outside the header.
  expect(measured.overhang, "the profile panel no longer hangs below the header").toBeGreaterThan(0);
  expect(
    measured.clippers,
    `the deployed profile menu hangs ${Math.round(measured.overhang)}px below the header and these ancestors clip it:\n  ${measured.clippers.join("\n  ")}\nWebKit clips BOTH axes when either one is clip or hidden, so on an iPhone this menu opens invisible.`,
  ).toEqual([]);
});
