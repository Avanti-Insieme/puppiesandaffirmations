export const PRESETS = [
  'You are doing better than you think you are.',
  'Rest is productive too.',
  "You don't have to earn softness today.",
  'Small steps still count as moving forward.',
  'Someone is glad you exist.',
];

export const DEFAULT_AFFIRMATION = PRESETS[0];

// Shared lightness/chroma schedule (100 → 900), matching the design system's own
// ramps so every theme carries the same visual weight. The 500 step (the accent
// base) is deliberately darker than a typical mid-ramp step, because it backs
// .btn-primary and the calendar's "today" fill, both paired with near-white text.
export const RAMP_STEPS = [100, 200, 300, 400, 500, 600, 700, 800, 900];
const RAMP_L = [96, 90, 81, 67, 52, 43, 34, 26, 18];
const RAMP_C = [0.02, 0.045, 0.075, 0.108, 0.13, 0.115, 0.095, 0.07, 0.05];
const NEUTRAL_C = [0.01, 0.014, 0.018, 0.02, 0.022, 0.02, 0.018, 0.014, 0.01];

function buildRamp(hue, chroma) {
  return RAMP_L.map((l, i) => `oklch(${l}% ${chroma[i]} ${hue})`);
}

export const THEMES = [
  { key: 'sky', label: 'Sky Blue', ramp: buildRamp(235, RAMP_C) },
  { key: 'sage', label: 'Sage Green', ramp: buildRamp(140, RAMP_C) },
  { key: 'lavender', label: 'Lavender', ramp: buildRamp(295, RAMP_C) },
  { key: 'taupe', label: 'Warm Taupe', ramp: buildRamp(70, NEUTRAL_C) },
  { key: 'blush', label: 'Blush Pink', ramp: buildRamp(8, RAMP_C) },
];
