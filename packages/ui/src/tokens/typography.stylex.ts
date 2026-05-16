import * as stylex from '@stylexjs/stylex';

const stepValue = (base: string, scale: string, step: number) =>
  step === -2
    ? `calc(${base} / ${scale} / ${scale})`
    : step === -1
      ? `calc(${base} / ${scale})`
      : step === 0
        ? base
        : step === 1
          ? `calc(${base} * ${scale})`
          : step === 2
            ? `calc(${base} * ${scale} * ${scale})`
            : step === 3
              ? `calc(${base} * ${scale} * ${scale} * ${scale})`
              : step === 4
                ? `calc(${base} * ${scale} * ${scale} * ${scale} * ${scale})`
                : `calc(${base} * ${scale} * ${scale} * ${scale} * ${scale} * ${scale})`;

const fluidTypeClamp = (minValue: string, maxValue: string) =>
  `clamp(${minValue}, calc(${minValue} - ((${maxValue} - ${minValue}) / 880px) * 360px + (((${maxValue} - ${minValue}) / 880px) * 100) * 1vw), ${maxValue})`;

export const typography_core = stylex.defineVars({
  fontSizeMin: '16px',
  fontSizeMax: '18px',
  scaleMin: '1.25',
  scaleMax: '1.414',
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
    stepValue(typography_core.fontSizeMin, typography_core.scaleMin, -2),
    stepValue(typography_core.fontSizeMax, typography_core.scaleMax, -2),
  ),
  stepMinus1: fluidTypeClamp(
    stepValue(typography_core.fontSizeMin, typography_core.scaleMin, -1),
    stepValue(typography_core.fontSizeMax, typography_core.scaleMax, -1),
  ),
  step0: fluidTypeClamp(
    stepValue(typography_core.fontSizeMin, typography_core.scaleMin, 0),
    stepValue(typography_core.fontSizeMax, typography_core.scaleMax, 0),
  ),
  step1: fluidTypeClamp(
    stepValue(typography_core.fontSizeMin, typography_core.scaleMin, 1),
    stepValue(typography_core.fontSizeMax, typography_core.scaleMax, 1),
  ),
  step2: fluidTypeClamp(
    stepValue(typography_core.fontSizeMin, typography_core.scaleMin, 2),
    stepValue(typography_core.fontSizeMax, typography_core.scaleMax, 2),
  ),
  step3: fluidTypeClamp(
    stepValue(typography_core.fontSizeMin, typography_core.scaleMin, 3),
    stepValue(typography_core.fontSizeMax, typography_core.scaleMax, 3),
  ),
  step4: fluidTypeClamp(
    stepValue(typography_core.fontSizeMin, typography_core.scaleMin, 4),
    stepValue(typography_core.fontSizeMax, typography_core.scaleMax, 4),
  ),
  step5: fluidTypeClamp(
    stepValue(typography_core.fontSizeMin, typography_core.scaleMin, 5),
    stepValue(typography_core.fontSizeMax, typography_core.scaleMax, 5),
  ),
});

export const typography = stylex.defineConsts({
  fontSizeMin: typography_core.fontSizeMin,
  fontSizeMax: typography_core.fontSizeMax,
  scaleMin: typography_core.scaleMin,
  scaleMax: typography_core.scaleMax,
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
  minBasePx: typography_core.fontSizeMin,
  maxBasePx: typography_core.fontSizeMax,
  minScale: typography_core.scaleMin,
  maxScale: typography_core.scaleMax,
});
