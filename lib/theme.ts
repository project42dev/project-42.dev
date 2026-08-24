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
  return config.theme || "01-cosmic-answer";
}

export function getThemeAssets(themeId?: string) {
  const active = themeId || getActiveThemeId();
  return {
    id: active,
    mark: /themes//mark.svg,
    hero: /themes//hero.png,
    badges: {
      foundations: /themes//badges/badge-foundations.svg,
      practitioner: /themes//badges/badge-practitioner.svg,
      agentic: /themes//badges/badge-agentic.svg,
      evidence: /themes//badges/badge-evidence.svg,
    },
    tokensCss: /themes//tokens.css,
  };
}
