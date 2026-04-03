"use client";

import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { useState } from "react";
import { colorThemes, type ColorThemeName } from "../color-themes";
import { radiusThemes, type RadiusThemeName } from "../radius-themes";
import { spacingThemes, type SpacingThemeName } from "../spacing-themes";
import { typographyThemes, type TypographyThemeName } from "../typography-themes";
import { colors } from "../tokens/color.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";
import { typography } from "../tokens/typography.stylex";

type ExampleThemeFrameProps = {
  children: ReactNode;
};

/**
 * Renders a local example wrapper for switching token themes in demos.
 *
 * Search aliases: example theme frame, theme switcher, demo theme wrapper, preview frame.
 *
 * A11y notes:
 * - Intended for documentation examples rather than production UI.
 * - Theme controls are minimal and may not cover all announced state needs.
 */
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
    <div {...stylex.props(styles.shell)}>
      <div {...stylex.props(styles.controls)}>
        <label {...stylex.props(styles.control)}>
          <span {...stylex.props(styles.controlLabel)}>Color theme</span>
          <select
            value={colorTheme}
            onChange={(event) => setColorTheme(event.target.value as ColorThemeName)}
            {...stylex.props(styles.select)}
          >
            {Object.keys(colorThemes).map((theme) => (
              <option key={theme} value={theme}>
                {theme}
              </option>
            ))}
          </select>
        </label>

        <label {...stylex.props(styles.control)}>
          <span {...stylex.props(styles.controlLabel)}>Spacing</span>
          <select
            value={spacingTheme}
            onChange={(event) =>
              setSpacingTheme(event.target.value as SpacingThemeName)
            }
            {...stylex.props(styles.select)}
          >
            {Object.keys(spacingThemes).map((theme) => (
              <option key={theme} value={theme}>
                {theme}
              </option>
            ))}
          </select>
        </label>

        <label {...stylex.props(styles.control)}>
          <span {...stylex.props(styles.controlLabel)}>Radius</span>
          <select
            value={radiusTheme}
            onChange={(event) =>
              setRadiusTheme(event.target.value as RadiusThemeName)
            }
            {...stylex.props(styles.select)}
          >
            {Object.keys(radiusThemes).map((theme) => (
              <option key={theme} value={theme}>
                {theme}
              </option>
            ))}
          </select>
        </label>

        <label {...stylex.props(styles.control)}>
          <span {...stylex.props(styles.controlLabel)}>Typography</span>
          <select
            value={typographyTheme}
            onChange={(event) =>
              setTypographyTheme(event.target.value as TypographyThemeName)
            }
            {...stylex.props(styles.select)}
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
  shell: {
    display: "grid",
    gap: 16,
  },
  controls: {
    display: "grid",
    gridTemplateColumns: {
      default: "1fr",
      "@media (min-width: 720px)": "repeat(4, minmax(0, 1fr))",
    },
    gap: 12,
  },
  control: {
    display: "grid",
    gap: 6,
  },
  controlLabel: {
    color: colors.fgSoft,
    fontFamily: typography.fontSans,
    fontSize: typography.stepMinus1,
    fontWeight: typography.weightMedium,
  },
  select: {
    minHeight: "40px",
    paddingInline: "12px",
    borderStyle: "solid",
    borderWidth: stroke.thin,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.bgRaised,
    color: colors.fg,
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
  },
  preview: {
    display: "grid",
    gap: spacing.lg,
    padding: spacing.xl,
    borderStyle: "solid",
    borderWidth: stroke.thin,
    borderColor: colors.border,
    borderRadius: radius.xl,
    backgroundColor: colors.bg,
    color: colors.fg,
  },
});
