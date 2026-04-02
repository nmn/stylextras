import * as stylex from '@stylexjs/stylex';

const VIEWPORT_MIN_PX = 360;
const VIEWPORT_MAX_PX = 1240;
const ROOT_FONT_SIZE_PX = 16;

const round = (value: number, precision = 4) =>
  Number(value.toFixed(precision));

const toRem = (px: number) => `${round(px / ROOT_FONT_SIZE_PX)}rem`;

const fluidTypeClamp = (
  minBasePx: number,
  maxBasePx: number,
  minScale: number,
  maxScale: number,
  step: number,
) =>
  `clamp(${toRem(minBasePx * minScale ** step)}, ${toRem(
    minBasePx * minScale ** step -
      ((maxBasePx * maxScale ** step - minBasePx * minScale ** step) /
        (VIEWPORT_MAX_PX - VIEWPORT_MIN_PX)) *
        VIEWPORT_MIN_PX,
  )} + ${round(
    ((maxBasePx * maxScale ** step - minBasePx * minScale ** step) /
      (VIEWPORT_MAX_PX - VIEWPORT_MIN_PX)) *
      100,
  )}vw, ${toRem(maxBasePx * maxScale ** step)})`;

const TYPE_CONFIG = {
  minBasePx: 18,
  maxBasePx: 20,
  minScale: 1.2,
  maxScale: 1.25,
} as const;

export const typography_core = stylex.defineVars({
  fontSans: [
    'InterVariable',
    'Inter',
    'ui-sans-serif',
    'system-ui',
    'sans-serif',
  ]
    .map((font) => (font.includes(' ') ? `"${font}"` : font))
    .join(', '),
  fontDisplay: [
    'InterVariable',
    'Inter',
    'ui-sans-serif',
    'system-ui',
    'sans-serif',
  ]
    .map((font) => (font.includes(' ') ? `"${font}"` : font))
    .join(', '),
  fontMono: [
    'ui-monospace',
    'SFMono-Regular',
    'Menlo',
    'Monaco',
    'Consolas',
    'Liberation Mono',
    'monospace',
  ]
    .map((font) => (font.includes(' ') ? `"${font}"` : font))
    .join(', '),
  lineHeightTight: '1.15',
  lineHeightSnug: '1.3',
  lineHeightBody: '1.5',
  trackingTight: '-0.02em',
  trackingNormal: '0em',
  trackingWide: '0.02em',
  weightRegular: '400',
  weightMedium: '500',
  weightSemibold: '600',
  weightBold: '700',
});

export const typography_derived = stylex.defineVars({
  stepMinus2: fluidTypeClamp(
    TYPE_CONFIG.minBasePx,
    TYPE_CONFIG.maxBasePx,
    TYPE_CONFIG.minScale,
    TYPE_CONFIG.maxScale,
    -2,
  ),
  stepMinus1: fluidTypeClamp(
    TYPE_CONFIG.minBasePx,
    TYPE_CONFIG.maxBasePx,
    TYPE_CONFIG.minScale,
    TYPE_CONFIG.maxScale,
    -1,
  ),
  step0: fluidTypeClamp(
    TYPE_CONFIG.minBasePx,
    TYPE_CONFIG.maxBasePx,
    TYPE_CONFIG.minScale,
    TYPE_CONFIG.maxScale,
    0,
  ),
  step1: fluidTypeClamp(
    TYPE_CONFIG.minBasePx,
    TYPE_CONFIG.maxBasePx,
    TYPE_CONFIG.minScale,
    TYPE_CONFIG.maxScale,
    1,
  ),
  step2: fluidTypeClamp(
    TYPE_CONFIG.minBasePx,
    TYPE_CONFIG.maxBasePx,
    TYPE_CONFIG.minScale,
    TYPE_CONFIG.maxScale,
    2,
  ),
  step3: fluidTypeClamp(
    TYPE_CONFIG.minBasePx,
    TYPE_CONFIG.maxBasePx,
    TYPE_CONFIG.minScale,
    TYPE_CONFIG.maxScale,
    3,
  ),
  step4: fluidTypeClamp(
    TYPE_CONFIG.minBasePx,
    TYPE_CONFIG.maxBasePx,
    TYPE_CONFIG.minScale,
    TYPE_CONFIG.maxScale,
    4,
  ),
  step5: fluidTypeClamp(
    TYPE_CONFIG.minBasePx,
    TYPE_CONFIG.maxBasePx,
    TYPE_CONFIG.minScale,
    TYPE_CONFIG.maxScale,
    5,
  ),
});

export const typography = stylex.defineConsts({
  fontSans: typography_core.fontSans,
  fontDisplay: typography_core.fontDisplay,
  fontMono: typography_core.fontMono,
  lineHeightTight: typography_core.lineHeightTight,
  lineHeightSnug: typography_core.lineHeightSnug,
  lineHeightBody: typography_core.lineHeightBody,
  trackingTight: typography_core.trackingTight,
  trackingNormal: typography_core.trackingNormal,
  trackingWide: typography_core.trackingWide,
  weightRegular: typography_core.weightRegular,
  weightMedium: typography_core.weightMedium,
  weightSemibold: typography_core.weightSemibold,
  weightBold: typography_core.weightBold,
  stepMinus2: typography_derived.stepMinus2,
  stepMinus1: typography_derived.stepMinus1,
  step0: typography_derived.step0,
  step1: typography_derived.step1,
  step2: typography_derived.step2,
  step3: typography_derived.step3,
  step4: typography_derived.step4,
  step5: typography_derived.step5,
});

export const typographyScaleConfig = stylex.defineConsts({
  minBasePx: `${TYPE_CONFIG.minBasePx}px`,
  maxBasePx: `${TYPE_CONFIG.maxBasePx}px`,
  minScale: String(TYPE_CONFIG.minScale),
  maxScale: String(TYPE_CONFIG.maxScale),
});
