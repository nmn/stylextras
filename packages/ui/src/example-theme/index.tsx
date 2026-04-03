"use client";

import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { useState } from "react";
import {
  colorThemes,
  type ColorThemeName,
} from "../color-themes";
import {
  radiusThemes,
  type RadiusThemeName,
} from "../radius-themes";
import {
  spacingThemes,
  type SpacingThemeName,
} from "../spacing-themes";
import {
  typographyThemes,
  type TypographyThemeName,
} from "../typography-themes";
import { colors } from "../tokens/color.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";

type ExampleThemeFrameProps = {
  children: ReactNode;
};

const controlRowStyle = {
  display: "flex",
  flexWrap: "wrap" as const,
  gap: "12px",
  alignItems: "center",
  marginBottom: "16px",
};

export function ExampleThemeFrame({ children }: ExampleThemeFrameProps) {
  const [colorTheme, setColorTheme] = useState<ColorThemeName>("base");
  const [spacingTheme, setSpacingTheme] = useState<SpacingThemeName>("base");
  const [radiusTheme, setRadiusTheme] = useState<RadiusThemeName>("base");
  const [typographyTheme, setTypographyTheme] =
    useState<TypographyThemeName>("ui");

  const [colorThemeCore, colorThemeDerived] = colorThemes[colorTheme];
  const [spacingThemeCore, spacingThemeDerived] = spacingThemes[spacingTheme];
  const [radiusThemeCore, radiusThemeDerived] = radiusThemes[radiusTheme];
  const [typographyThemeCore, typographyThemeDerived] =
    typographyThemes[typographyTheme];

  return (
    <div>
      <div style={controlRowStyle}>
        <label>
          Color{" "}
          <select
            value={colorTheme}
            onChange={(event) => setColorTheme(event.target.value as ColorThemeName)}
          >
            {Object.keys(colorThemes).map((theme) => (
              <option key={theme} value={theme}>
                {theme}
              </option>
            ))}
          </select>
        </label>

        <label>
          Spacing{" "}
          <select
            value={spacingTheme}
            onChange={(event) =>
              setSpacingTheme(event.target.value as SpacingThemeName)
            }
          >
            {Object.keys(spacingThemes).map((theme) => (
              <option key={theme} value={theme}>
                {theme}
              </option>
            ))}
          </select>
        </label>

        <label>
          Radius{" "}
          <select
            value={radiusTheme}
            onChange={(event) => setRadiusTheme(event.target.value as RadiusThemeName)}
          >
            {Object.keys(radiusThemes).map((theme) => (
              <option key={theme} value={theme}>
                {theme}
              </option>
            ))}
          </select>
        </label>

        <label>
          Type{" "}
          <select
            value={typographyTheme}
            onChange={(event) =>
              setTypographyTheme(event.target.value as TypographyThemeName)
            }
          >
            {Object.keys(typographyThemes).map((theme) => (
              <option key={theme} value={theme}>
                {theme}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div
        {...stylex.props(
          styles.preview,
          colorThemeCore,
          colorThemeDerived,
          spacingThemeCore,
          spacingThemeDerived,
          radiusThemeCore,
          radiusThemeDerived,
          typographyThemeCore,
          typographyThemeDerived,
        )}
      >
        {children}
      </div>
    </div>
  );
}

const styles = stylex.create({
  preview: {
    display: "grid",
    gap: spacing.md,
    padding: spacing.xl,
    borderStyle: "solid",
    borderWidth: stroke.thin,
    borderColor: colors.border,
    borderRadius: radius.xl,
    backgroundColor: colors.bg,
    color: colors.fg,
  },
});
