import config from "../project42.config.json";

export interface ThemeMetadata {
  id: string;
  name: string;
  tagline: string;
  description: string;
  author: string;
  version: string;
  font: string;
  tokens: Record<string, string>;
  subbrands: {
    learn: string;
    guide: string;
  };
}

export function getActiveThemeId(): string {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_THEME) {
    return process.env.NEXT_PUBLIC_THEME;
  }
  return config.theme || "04-field-signal";
}

export function getThemeAssets(themeId?: string) {
  const active = themeId || getActiveThemeId();
  return {
    id: active,
    mark: "/themes/" + active + "/mark.svg",
    hero: "/themes/" + active + "/hero.png",
    badges: {
      foundations: "/themes/" + active + "/badges/badge-foundations.svg",
      practitioner: "/themes/" + active + "/badges/badge-practitioner.svg",
      agentic: "/themes/" + active + "/badges/badge-agentic.svg",
      evidence: "/themes/" + active + "/badges/badge-evidence.svg",
    },
    tokensCss: "/themes/" + active + "/tokens.css",
  };
}
