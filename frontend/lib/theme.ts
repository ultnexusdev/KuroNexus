export const THEMES = ["purple", "orange", "navy"] as const;

export type Theme = (typeof THEMES)[number];

export const DEFAULT_THEME: Theme = "purple";

export const THEME_COOKIE = "kuronexus-theme";
