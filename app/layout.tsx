import type { Metadata, Viewport } from "next";
import config from "../project42.config.json";
import "./globals.css";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { ProgressProvider } from "./components/ProgressProvider";
import { AuthProvider } from "./components/AuthProvider";
import { ProfilePreferencesProvider } from "./components/ProfilePreferencesProvider";
import { CanonicalOriginEnforcer } from "./components/CanonicalOriginEnforcer";
import { getThemeAssets } from "../lib/theme";
import { getLayoutAssets } from "../lib/layout";

const configuredTheme = config.theme;
const configuredLayout = config.layout.defaultPreset;
const themeAssets = getThemeAssets(configuredTheme);
const layoutAssets = getLayoutAssets(configuredLayout);

export const metadata: Metadata = {
  metadataBase: new URL("https://project-42.dev"),
  title: {
    default: "Project 42 — Learn AI with confidence",
    template: "%s · Project 42",
  },
  description:
    "Free, open, provider-neutral AI learning paths, knowledge checks, and practical activities.",
  applicationName: "Project 42",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      {
        url: themeAssets.mark,
        type: "image/svg+xml",
      },
    ],
    shortcut: themeAssets.mark,
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/brand/project-42-mark-mono.svg",
        color: "#f59e0b",
      },
    ],
  },
  keywords: [
    "AI learning",
    "agentic AI",
    "Anthropic",
    "OpenAI",
    "Claude",
    "ChatGPT",
    "free training",
  ],
  openGraph: {
    type: "website",
    siteName: "Project 42",
    title: "Project 42 — Learn AI with confidence",
    description:
      "Free learning paths from first principles to reliable agents.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Project 42 — Start curious. Become capable.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Project 42 — Learn AI with confidence",
    description:
      "Free learning paths from first principles to reliable agents.",
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: "#090d16",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme={configuredTheme} data-layout={configuredLayout} suppressHydrationWarning>
      <head>
        <link data-project42-theme-tokens rel="stylesheet" href={themeAssets.tokensCss} />
        <link data-project42-theme-components rel="stylesheet" href={themeAssets.componentsCss} />
        <link data-project42-layout rel="stylesheet" href={layoutAssets.stylesheet} />
        <script
          dangerouslySetInnerHTML={{
            // Theme is DEPLOYMENT-owned: it comes from project42.config.json
            // and nothing else, which is what makes "change one config field"
            // the whole interface for changing the site's identity. A stale
            // browser value must never override the configured presentation,
            // so any leftover key is cleared rather than read.
            //
            // Layout density IS a per-visitor preference and is read from
            // storage with the configured preset as the fallback. The two
            // axes are independent, and they are deliberately NOT symmetric.
            __html: `(function(){try{var defaultTheme="${configuredTheme}";var defaultLayout="${configuredLayout}";var l=localStorage.getItem("project42.layout.v1")||defaultLayout;localStorage.removeItem("project42.theme.v1");document.documentElement.setAttribute("data-theme",defaultTheme);document.documentElement.setAttribute("data-layout",l);}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <CanonicalOriginEnforcer
          canonicalOrigin={config.portal.canonicalOrigin}
          legacyOrigins={config.portal.legacyOrigins}
        />
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <AuthProvider>
          <ProfilePreferencesProvider>
            <ProgressProvider>
              <SiteHeader />
              <div id="main-content" tabIndex={-1}>
                {children}
              </div>
              <SiteFooter />
            </ProgressProvider>
          </ProfilePreferencesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
