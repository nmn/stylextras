/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
"use client";

import type { SVGProps } from "react";
import { useTheme } from "next-themes";
import { useLayoutEffect, useState } from "react";
import * as stylex from "@stylexjs/stylex";
import { StyleXAttributes } from "./layout/shared";
import { Toggle } from "@stylextras/ui/toggle";
import { ToggleGroup } from "@stylextras/ui/toggle-group";

type ThemeKey = "light" | "dark" | "system";

const items: { key: ThemeKey; Icon: typeof SunIcon; label: string }[] = [
  { key: "light", Icon: SunIcon, label: "Light theme" },
  { key: "dark", Icon: MoonIcon, label: "Dark theme" },
  { key: "system", Icon: SparklesIcon, label: "System theme" },
];

export function ThemeToggle({
  xstyle,
  mode = "light-dark-system",
  ...props
}: StyleXAttributes<HTMLElement> & {
  mode?: "light-dark" | "light-dark-system";
}) {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  const current =
    mode === "light-dark"
      ? mounted
        ? (resolvedTheme ?? null)
        : null
      : mounted
        ? (theme as ThemeKey | null)
        : null;

  const visibleItems =
    mode === "light-dark" ? items.filter((i) => i.key !== "system") : items;

  return (
    <ToggleGroup
      aria-label="Color theme"
      data-theme-toggle=""
      {...props}
      sx={[styles.container, xstyle]}
    >
      {visibleItems.map(({ key, Icon, label }) => {
        const isActive = current === key;

        const nextTheme =
          mode === "light-dark" && key === "system" ? "system" : key;

        return (
          <Toggle
            aria-label={label}
            aria-pressed={isActive}
            key={key}
            onClick={() => setTheme(nextTheme)}
            size="sm"
            sx={visibleItems.length === 3 ? styles.itemGrow : undefined}
          >
            <Icon {...stylex.props(styles.icon)} />
          </Toggle>
        );
      })}
    </ToggleGroup>
  );
}

function SunIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function MoonIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />
    </svg>
  );
}

function SparklesIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
      <path d="M20 2v4" />
      <path d="M22 4h-4" />
      <circle cx="4" cy="20" r="2" />
    </svg>
  );
}

const styles = stylex.create({
  container: {
    display: { default: "inline-flex", "@media (max-width: 420px)": "none" },
  },
  itemGrow: {
    flexGrow: 1,
    width: "auto",
  },
  icon: {
    width: 16,
    height: 16,
  },
});
