import { expect, test, type Page } from "@playwright/test";
import portalConfig from "../../project42.config.json" with { type: "json" };

// DOES THE DEPLOYED HEADER TELL THE TRUTH ABOUT BEING SIGNED IN?
//
// Two defects were reported against the live site: the header never showed the
// owner as signed in, and they had to sign in again on every visit -- including
// from the installed app on an iPhone.
//
// The header used to render a "Sign in" button for every auth status that was
// not exactly "signed-in", so an account read that was merely in flight, or had
// failed, was presented as "you are signed out". Since the session lives in an
// HttpOnly cookie no script can read, the front end genuinely does not know in
// those moments and must say so. That made the second defect largely a symptom
// of the first: the owner was signing in again to fix a session that was fine.
//
// This spec proves the contract against what is actually being served, which is
// the only place the answer lives: the portal pins a platform release, GitHub
// Pages serves an export of it, and a green platform suite says nothing about
// which bytes reach the owner's phone.
//
//   $env:P42_SESSION_COOKIE = "<value of __Secure-project42_session>"
//   npx playwright test --config tests/production/session-header.config.ts
//
// The signed-in test needs a real session cookie and skips without one. The
// unknown-state test needs no credential at all and always runs.
//
// WHEN THIS FAILS, READ THE DIAGNOSIS LINE IT PRINTS. The status and error code
// from /v1/auth/session say which half of the system is at fault:
//
//   200                        the session is good; any wrong header is a UI bug
//   401 missing_access_token   the cookie never reached the API -- it was not
//                              stored, not sent, or is in a different storage
//                              jar (the installed-PWA signature on iOS)
//   401 session_expired        the API had the cookie but holds no such session
//   401 account_not_registered the session resolved but no active identity row
//                              matches it -- a production data problem, not a
//                              cookie problem
//   403                        authenticated but not authorised
//
// It is deliberately a separate config from ios-profile-menu: that one is
// credential-free and runs on every release, this one needs a cookie.

const TRIGGER_STATE = ".header-actions [data-account-state]";
const PANEL = ".header-actions .header-menu-panel";
const SESSION_PATH = "/v1/auth/session";

const apiOrigin = (portalConfig as { portal: { apiOrigin?: string } }).portal.apiOrigin;
const sessionCookie = process.env.P42_SESSION_COOKIE?.trim();

/** The registrable domain the session cookie is scoped to, e.g. .project-42.dev. */
function cookieDomainFor(origin: string): string {
  const labels = new URL(origin).hostname.split(".");
  return labels.length > 2 ? `.${labels.slice(-2).join(".")}` : `.${labels.join(".")}`;
}

/**
 * Watches the account read and reports what the API said. This is the whole
 * diagnostic value of the spec: a bare assertion failure would not distinguish
 * "the cookie never arrived" from "the UI ignored a good answer".
 */
function watchSessionRead(page: Page) {
  const seen: { status: number; code: string | null; sentCookie: boolean }[] = [];
  page.on("response", (response) => {
    const target = new URL(response.url());
    if (!target.pathname.startsWith(SESSION_PATH)) return;
    const sentCookie = (response.request().headers().cookie ?? "").includes(
      "__Secure-project42_session=",
    );
    void response
      .json()
      .then((body) => {
        seen.push({
          status: response.status(),
          code: (body as { error?: { code?: string } })?.error?.code ?? null,
          sentCookie,
        });
      })
      .catch(() => {
        seen.push({ status: response.status(), code: null, sentCookie });
      });
  });
  return {
    describe() {
      if (seen.length === 0) {
        return `No request to ${SESSION_PATH} was observed at all. The page never asked whether you are signed in -- check that the portal's apiOrigin (${apiOrigin}) is what this deployment actually calls.`;
      }
      return seen
        .map(
          (entry) =>
            `${SESSION_PATH} -> ${entry.status}${entry.code ? ` ${entry.code}` : ""}; the browser ${entry.sentCookie ? "DID" : "did NOT"} send __Secure-project42_session.`,
        )
        .join("\n  ");
    },
  };
}

test.describe("the deployed header, signed in", () => {
  test.skip(
    !sessionCookie,
    "Set P42_SESSION_COOKIE to the value of __Secure-project42_session to run this.",
  );

  test("a real session makes the header say who you are", async ({ page, baseURL }) => {
    const domain = cookieDomainFor(baseURL!);
    await page.context().addCookies([
      {
        name: "__Secure-project42_session",
        value: sessionCookie!,
        domain,
        path: "/",
        secure: true,
        httpOnly: true,
        sameSite: "Lax",
      },
    ]);
    const reads = watchSessionRead(page);

    await page.goto("/", { waitUntil: "domcontentloaded" });

    const state = page.locator(TRIGGER_STATE);
    // The header is allowed to be "unknown" while the read is in flight. What
    // it may never do is settle on "signed-out" with a valid session.
    await expect(
      state,
      `The header did not settle on "signed in" with a session cookie present.\n  ${reads.describe()}`,
    ).toHaveAttribute("data-account-state", "signed-in", { timeout: 30_000 });

    await page.locator(".header-actions .header-menu-trigger").click();
    await expect(page.locator(PANEL)).toBeVisible();
    await expect(
      page.locator(PANEL).getByText("Signed in as"),
      `The menu did not name the account.\n  ${reads.describe()}`,
    ).toBeVisible();
    // A signed-in header must not also be offering to sign in.
    await expect(
      page.locator(PANEL).getByRole("button", { name: "Sign in", exact: true }),
    ).toHaveCount(0);
    await expect(
      page.locator(PANEL).getByRole("button", { name: "Sign out" }),
    ).toBeVisible();
  });

  test("the session survives a full reload, which is the defect as reported", async ({
    page,
    baseURL,
  }) => {
    const domain = cookieDomainFor(baseURL!);
    await page.context().addCookies([
      {
        name: "__Secure-project42_session",
        value: sessionCookie!,
        domain,
        path: "/",
        secure: true,
        httpOnly: true,
        sameSite: "Lax",
      },
    ]);
    const reads = watchSessionRead(page);

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator(TRIGGER_STATE)).toHaveAttribute(
      "data-account-state",
      "signed-in",
      { timeout: 30_000 },
    );

    // "Every time I open the site." A reload is the closest a headless browser
    // gets to that, and it is the case the header used to get wrong.
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(
      page.locator(TRIGGER_STATE),
      `The header forgot the session across a reload.\n  ${reads.describe()}`,
    ).toHaveAttribute("data-account-state", "signed-in", { timeout: 30_000 });

    // The server must still be honouring the cookie, not just the UI.
    const stillValid = await page.evaluate(
      async (origin) =>
        (await fetch(`${origin}/v1/auth/session`, { credentials: "include" })).status,
      apiOrigin,
    );
    expect(
      stillValid,
      `The API stopped honouring the session cookie.\n  ${reads.describe()}`,
    ).toBe(200);
  });
});

test("when the account read fails, the header claims neither signed in nor signed out", async ({
  page,
}) => {
  // No credential needed: this proves the third state, which is what made a
  // signed-in reader sign in again. A failed read is not evidence of being
  // signed out, because the session is in a cookie the page cannot read.
  await page.route(`${apiOrigin}${SESSION_PATH}*`, (route) => route.abort("failed"));

  await page.goto("/", { waitUntil: "domcontentloaded" });

  const state = page.locator(TRIGGER_STATE);
  await expect(state).toHaveAttribute("data-account-state", "unknown", {
    timeout: 30_000,
  });

  await page.locator(".header-actions .header-menu-trigger").click();
  const panel = page.locator(PANEL);
  await expect(panel).toBeVisible();

  await expect(
    panel.getByRole("button", { name: "Sign in", exact: true }),
    "A failed account read must not offer to sign in: the reader is probably already signed in.",
  ).toHaveCount(0);
  await expect(
    panel.getByText("Signed in as"),
    "A failed account read must not claim the reader is signed in either.",
  ).toHaveCount(0);
  // It must offer a way forward that does not throw away the session.
  await expect(panel.getByRole("button", { name: "Try again" })).toBeVisible();
});

test("with no session at all the header still offers a sign-in", async ({ page }) => {
  // The third state must not have swallowed the ordinary one: a visitor who is
  // genuinely signed out still needs the control.
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const state = page.locator(TRIGGER_STATE);
  await expect(state).toHaveAttribute("data-account-state", "signed-out", {
    timeout: 30_000,
  });

  await page.locator(".header-actions .header-menu-trigger").click();
  await expect(
    page.locator(PANEL).getByRole("button", { name: "Sign in", exact: true }),
  ).toBeVisible();
});
