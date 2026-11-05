import { RAMP_STEPS, THEMES } from './data.js';

const STORAGE_KEY = 'pa-theme';
const DEFAULT_KEY = 'sky';

export function themeByKey(key) {
  return THEMES.find((t) => t.key === key) ?? THEMES[0];
}

export function readSavedTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return THEMES.some((t) => t.key === saved) ? saved : DEFAULT_KEY;
  } catch {
    return DEFAULT_KEY;
  }
}

export function saveTheme(key) {
  try {
    localStorage.setItem(STORAGE_KEY, key);
  } catch {
    // Storage can be blocked (private mode); the theme still applies for this visit.
  }
}

// Sets the accent ramp on the document and a soft gradient ground on the page wrapper.
export function applyTheme(key, wrapper) {
  const theme = themeByKey(key);
  const root = document.documentElement.style;

  root.setProperty('--color-accent', theme.ramp[4]);
  RAMP_STEPS.forEach((step, i) => root.setProperty(`--color-accent-${step}`, theme.ramp[i]));

  if (wrapper) {
    wrapper.style.backgroundImage =
      `linear-gradient(135deg, ${theme.ramp[0]} 0%, #f3f2f2 42%, #f3f2f2 58%, ${theme.ramp[1]} 100%)`;
    wrapper.style.backgroundAttachment = 'fixed';
  }
}
