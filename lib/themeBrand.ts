import config from "../project42.config.json";

import cosmicAnswer from "../public/themes/01-cosmic-answer/theme.json";
import learningPortal from "../public/themes/02-learning-portal/theme.json";
import modelConstellation from "../public/themes/03-model-constellation/theme.json";
import fieldSignal from "../public/themes/04-field-signal/theme.json";
import openOrbit from "../public/themes/05-open-orbit/theme.json";
import galacticGuide from "../public/themes/06-galactic-guide/theme.json";

// Browser chrome colours -- the manifest's theme_color and background_color,
// the meta theme-color, and the mask-icon colour -- are appearance, so they
// belong to the theme like every other colour. They used to be #090d16 and
// #f59e0b literals in core, which are 06-galactic-guide's values: switch the
// configured theme and the installed app's splash screen, task-switcher card
// and iOS status bar would still have worn the old theme's colours.
//
// The theme-boundary gate only scans CSS, so it could not have caught this.
// Reading the values from the installed bundle closes the hole at the source.
//
// The bundles are imported statically rather than read from disk because this
// module is evaluated in the Workers runtime during build, where there is no
// filesystem. sync-gallery-themes keeps the files in step with the Gallery and
// hash-locks them, and tokens:check asserts the vocabulary is complete.
const bundles: Record<string, { tokens: Record<string, string> }> = {
  "01-cosmic-answer": cosmicAnswer,
  "02-learning-portal": learningPortal,
  "03-model-constellation": modelConstellation,
  "04-field-signal": fieldSignal,
  "05-open-orbit": openOrbit,
  "06-galactic-guide": galacticGuide,
};

export interface ThemeBrandColors {
  /** Page background: the installed app's splash and status-bar ground. */
  background: string;
  /** Browser/OS chrome tint. */
  theme: string;
  /** Safari pinned-tab mask icon. */
  mask: string;
}

export function getThemeBrandColors(themeId?: string): ThemeBrandColors {
  const active = themeId || config.theme;
  const tokens = bundles[active]?.tokens;
  if (!tokens) throw new Error(`Unknown theme bundle: ${active}`);
  return {
    background: tokens["--p42-bg"],
    theme: tokens["--p42-bg"],
    mask: tokens["--p42-primary"],
  };
}
