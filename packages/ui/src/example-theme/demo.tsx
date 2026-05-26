"use client";

import * as stylex from "@stylexjs/stylex";
import { useState } from "react";
import type { ReactNode } from "react";
import { colorThemes, type ColorThemeName } from "../color-themes";
import { elevationThemes, type ElevationThemeName } from "../elevation-themes";
import { radiusThemes, type RadiusThemeName } from "../radius-themes";
import { spacingThemes, type SpacingThemeName } from "../spacing-themes";
import { strokeThemes, type StrokeThemeName } from "../stroke-themes";
import {
  typographyThemes,
  type TypographyThemeName,
} from "../typography-themes";
import { colors } from "../tokens/color.stylex";
import { elevation } from "../tokens/elevation.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";
import { typography } from "../tokens/typography.stylex";
import { Typography } from "../typography";

type ThemeFieldProps<T extends string> = {
  label: string;
  onChange: (value: T) => void;
  options: readonly T[];
  value: T;
};

type DemoFrameProps = {
  children: ReactNode;
  description?: ReactNode;
  showThemes?: boolean;
  title: ReactNode;
};

type DemoChildrenProps = {
  children: ReactNode;
};

const colorThemeOptions = Object.keys(colorThemes) as ColorThemeName[];
const spacingThemeOptions = Object.keys(spacingThemes) as SpacingThemeName[];
const radiusThemeOptions = Object.keys(radiusThemes) as RadiusThemeName[];
const strokeThemeOptions = Object.keys(strokeThemes) as StrokeThemeName[];
const elevationThemeOptions = Object.keys(
  elevationThemes,
) as ElevationThemeName[];
const typographyThemeOptions = Object.keys(
  typographyThemes,
) as TypographyThemeName[];

export function DemoFrame({
  children,
  description,
  showThemes = true,
  title,
}: DemoFrameProps) {
  const [colorTheme, setColorTheme] = useState<ColorThemeName>("base");
  const [spacingTheme, setSpacingTheme] = useState<SpacingThemeName>("base");
  const [radiusTheme, setRadiusTheme] = useState<RadiusThemeName>("base");
  const [strokeTheme, setStrokeTheme] = useState<StrokeThemeName>("base");
  const [elevationTheme, setElevationTheme] =
    useState<ElevationThemeName>("base");
  const [typeTheme, setTypeTheme] = useState<TypographyThemeName>("ui");

  return (
    <div
      {...stylex.props(
        styles.shell,
        colorThemes[colorTheme],
        spacingThemes[spacingTheme],
        radiusThemes[radiusTheme],
        strokeThemes[strokeTheme],
        elevationThemes[elevationTheme],
        typographyThemes[typeTheme],
      )}
    >
      <div {...stylex.props(styles.header)}>
        <Typography as="h2" scale="title">
          {title}
        </Typography>

        {description ? (
          <Typography as="p" scale="label" tone="muted">
            {description}
          </Typography>
        ) : null}
      </div>

      {showThemes ? (
        <div {...stylex.props(styles.controls)}>
          <ThemeField
            label="Color"
            value={colorTheme}
            onChange={setColorTheme}
            options={colorThemeOptions}
          />
          <ThemeField
            label="Spacing"
            value={spacingTheme}
            onChange={setSpacingTheme}
            options={spacingThemeOptions}
          />
          <ThemeField
            label="Radius"
            value={radiusTheme}
            onChange={setRadiusTheme}
            options={radiusThemeOptions}
          />
          <ThemeField
            label="Stroke"
            value={strokeTheme}
            onChange={setStrokeTheme}
            options={strokeThemeOptions}
          />
          <ThemeField
            label="Shadow"
            value={elevationTheme}
            onChange={setElevationTheme}
            options={elevationThemeOptions}
          />
          <ThemeField
            label="Typography"
            value={typeTheme}
            onChange={setTypeTheme}
            options={typographyThemeOptions}
          />
        </div>
      ) : null}

      {children}
    </div>
  );
}

function ThemeField<T extends string>({
  label,
  onChange,
  options,
  value,
}: ThemeFieldProps<T>) {
  return (
    <label {...stylex.props(styles.field)}>
      <span {...stylex.props(styles.fieldLabel)}>{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.currentTarget.value as T)}
        {...stylex.props(styles.select)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function DemoRow({ children }: DemoChildrenProps) {
  return <div {...stylex.props(styles.row)}>{children}</div>;
}

export function DemoStack({ children }: DemoChildrenProps) {
  return <div {...stylex.props(styles.stack)}>{children}</div>;
}

export function DemoGrid({ children }: DemoChildrenProps) {
  return <div {...stylex.props(styles.grid)}>{children}</div>;
}

export function DemoPanel({ children }: DemoChildrenProps) {
  return <div {...stylex.props(styles.panel)}>{children}</div>;
}

export function DemoMuted({ children }: DemoChildrenProps) {
  return <div {...stylex.props(styles.muted)}>{children}</div>;
}

export function DemoEyebrow({ children }: DemoChildrenProps) {
  return <div {...stylex.props(styles.eyebrow)}>{children}</div>;
}

const styles = stylex.create({
  shell: {
    padding: spacing.lg,
    borderColor: colors.border,
    borderRadius: radius.xl,
    borderStyle: "solid",
    borderWidth: stroke.thin,
    gap: spacing.md,
    marginBlock: spacing.lg,
    alignItems: "flex-start",
    backgroundColor: colors.bgSubtle,
    boxShadow: elevation.sm,
    color: colors.fg,
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  header: {
    gap: spacing.xs,
    display: "grid",
  },
  controls: {
    padding: spacing.md,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderStyle: "solid",
    borderWidth: stroke.thin,
    gap: spacing.sm,
    backgroundColor: colors.bg,
    display: "flex",
    flexWrap: "wrap",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  },
  field: {
    gap: spacing.xs,
    display: "grid",
    flexShrink: 0,
  },
  fieldLabel: {
    color: colors.fgMuted,
    fontFamily: typography.fontSans,
    fontSize: typography.stepMinus1,
    fontWeight: typography.weightMedium,
  },
  select: {
    borderColor: colors.border,
    borderRadius: radius.md,
    borderStyle: "solid",
    borderWidth: stroke.thin,
    paddingBlock: spacing.xs,
    paddingInline: spacing.sm,
    backgroundColor: colors.bgRaised,
    color: colors.fg,
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    minHeight: spacing.xxxl,
  },
  row: {
    gap: spacing.sm,
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
  },
  stack: {
    gap: spacing.sm,
    display: "grid",
  },
  grid: {
    gap: spacing.sm,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  },
  panel: {
    padding: spacing.md,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderStyle: "solid",
    borderWidth: stroke.thin,
    gap: spacing.sm,
    backgroundColor: colors.bg,
    display: "grid",
  },
  muted: {
    color: colors.fgMuted,
    fontFamily: typography.fontSans,
    fontSize: typography.stepMinus1,
    lineHeight: typography.lineHeightBody,
  },
  eyebrow: {
    color: colors.fgMuted,
    fontFamily: typography.fontSans,
    fontSize: typography.stepMinus2,
    fontWeight: typography.weightSemibold,
    letterSpacing: typography.trackingWide,
    textTransform: "uppercase",
  },
});
