import type { VarGroup } from "@stylexjs/stylex";
import * as stylex from "@stylexjs/stylex";

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

type Ttypography = VarGroup<
  Readonly<{
    fontDisplay: string;
    fontMono: string;
    fontSans: string;
    fontSizeMax: string;
    fontSizeMin: string;
    lineHeightBody: string;
    lineHeightSnug: string;
    lineHeightTight: string;
    scaleMax: string;
    scaleMin: string;
    step0: string;
    step1: string;
    step2: string;
    step3: string;
    step4: string;
    step5: string;
    stepMinus1: string;
    stepMinus2: string;
    trackingNormal: string;
    trackingTight: string;
    trackingWide: string;
    weightBold: string;
    weightMedium: string;
    weightRegular: string;
    weightSemibold: string;
  }>
>;

export const typography: Ttypography = stylex.defineVars({
  fontSizeMin: "14px",
  fontSizeMax: "14px",
  scaleMin: "1.125",
  scaleMax: "1.2",
  fontSans: [
    "Geist",
    "Geist Sans",
    "ui-sans-serif",
    "system-ui",
    "sans-serif",
  ]
    .map((font) => (font.includes(" ") ? `"${font}"` : font))
    .join(", "),
  fontDisplay: [
    "Geist",
    "Geist Sans",
    "ui-sans-serif",
    "system-ui",
    "sans-serif",
  ]
    .map((font) => (font.includes(" ") ? `"${font}"` : font))
    .join(", "),
  fontMono: [
    "ui-monospace",
    "SFMono-Regular",
    "Menlo",
    "Monaco",
    "Consolas",
    "Liberation Mono",
    "monospace",
  ]
    .map((font) => (font.includes(" ") ? `"${font}"` : font))
    .join(", "),
  lineHeightTight: "1.2",
  lineHeightSnug: "1.35",
  lineHeightBody: "1.5",
  trackingTight: "-0.015em",
  trackingNormal: "0em",
  trackingWide: "0.015em",
  weightRegular: "400",
  weightMedium: "500",
  weightSemibold: "600",
  weightBold: "700",
  stepMinus2: () =>
    fluidTypeClamp(
      stepValue(typography.fontSizeMin, typography.scaleMin, -2),
      stepValue(typography.fontSizeMax, typography.scaleMax, -2),
    ),
  stepMinus1: () =>
    fluidTypeClamp(
      stepValue(typography.fontSizeMin, typography.scaleMin, -1),
      stepValue(typography.fontSizeMax, typography.scaleMax, -1),
    ),
  step0: () =>
    fluidTypeClamp(
      stepValue(typography.fontSizeMin, typography.scaleMin, 0),
      stepValue(typography.fontSizeMax, typography.scaleMax, 0),
    ),
  step1: () =>
    fluidTypeClamp(
      stepValue(typography.fontSizeMin, typography.scaleMin, 1),
      stepValue(typography.fontSizeMax, typography.scaleMax, 1),
    ),
  step2: () =>
    fluidTypeClamp(
      stepValue(typography.fontSizeMin, typography.scaleMin, 2),
      stepValue(typography.fontSizeMax, typography.scaleMax, 2),
    ),
  step3: () =>
    fluidTypeClamp(
      stepValue(typography.fontSizeMin, typography.scaleMin, 3),
      stepValue(typography.fontSizeMax, typography.scaleMax, 3),
    ),
  step4: () =>
    fluidTypeClamp(
      stepValue(typography.fontSizeMin, typography.scaleMin, 4),
      stepValue(typography.fontSizeMax, typography.scaleMax, 4),
    ),
  step5: () =>
    fluidTypeClamp(
      stepValue(typography.fontSizeMin, typography.scaleMin, 5),
      stepValue(typography.fontSizeMax, typography.scaleMax, 5),
    ),
});

export const typographyScaleConfig = stylex.defineConsts({
  minBasePx: typography.fontSizeMin,
  maxBasePx: typography.fontSizeMax,
  minScale: typography.scaleMin,
  maxScale: typography.scaleMax,
});
