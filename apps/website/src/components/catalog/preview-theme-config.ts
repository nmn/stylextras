import type { BlurThemeName } from "@stylextras/ui/blur-themes";
import type { ColorThemeName } from "@stylextras/ui/color-themes";
import type { ElevationThemeName } from "@stylextras/ui/elevation-themes";
import type { MotionThemeName } from "@stylextras/ui/motion-themes";
import type { RadiusThemeName } from "@stylextras/ui/radius-themes";
import type { SpacingThemeName } from "@stylextras/ui/spacing-themes";
import type { StrokeThemeName } from "@stylextras/ui/stroke-themes";
import type { TypographyThemeName } from "@stylextras/ui/typography-themes";

export type PreviewAppearance = "light" | "dark";
export type PreviewStyleName =
  | "vega"
  | "nova"
  | "maia"
  | "lyra"
  | "mira"
  | "luma"
  | "sera"
  | "rhea";
export type PreviewStyleSelection = PreviewStyleName | "custom";

export type PreviewThemeSelection = {
  appearance: PreviewAppearance;
  blur: BlurThemeName;
  color: ColorThemeName;
  elevation: ElevationThemeName;
  motion: MotionThemeName;
  radius: RadiusThemeName;
  spacing: SpacingThemeName;
  stroke: StrokeThemeName;
  typography: TypographyThemeName;
};

export type StructuralThemeSelection = Omit<
  PreviewThemeSelection,
  "appearance" | "color"
>;

export const previewStylePresets: Record<
  PreviewStyleName,
  StructuralThemeSelection
> = {
  vega: {
    blur: "subtle",
    elevation: "soft",
    motion: "standard",
    radius: "rounded",
    spacing: "base",
    stroke: "base",
    typography: "ui",
  },
  nova: {
    blur: "crisp",
    elevation: "flat",
    motion: "snappy",
    radius: "subtle",
    spacing: "compact",
    stroke: "hairline",
    typography: "ui",
  },
  maia: {
    blur: "soft",
    elevation: "float",
    motion: "gentle",
    radius: "soft",
    spacing: "roomy",
    stroke: "base",
    typography: "ui",
  },
  lyra: {
    blur: "crisp",
    elevation: "hard",
    motion: "snappy",
    radius: "sharp",
    spacing: "compact",
    stroke: "bold",
    typography: "mono",
  },
  mira: {
    blur: "crisp",
    elevation: "flat",
    motion: "snappy",
    radius: "subtle",
    spacing: "tight",
    stroke: "hairline",
    typography: "ui",
  },
  luma: {
    blur: "soft",
    elevation: "soft",
    motion: "gentle",
    radius: "rounded",
    spacing: "cozy",
    stroke: "hairline",
    typography: "ui",
  },
  sera: {
    blur: "crisp",
    elevation: "flat",
    motion: "standard",
    radius: "sharp",
    spacing: "roomy",
    stroke: "base",
    typography: "editorial",
  },
  rhea: {
    blur: "hazy",
    elevation: "poster",
    motion: "expressive",
    radius: "pill",
    spacing: "poster",
    stroke: "poster",
    typography: "industrial",
  },
};

export const defaultPreviewTheme: PreviewThemeSelection = {
  appearance: "light",
  color: "neutral",
  ...previewStylePresets.vega,
};
