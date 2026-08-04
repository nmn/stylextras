import type { ReactNode } from "react";
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as stylex from "@stylexjs/stylex";
import { colors } from "@stylextras/ui/tokens/color.stylex";
import { RouterButtonLink } from "./router-link";

export default function CtaButton({
  children,
  color,
  to,
}: {
  children: ReactNode;
  color: "pink" | "blue";
  to: string;
}) {
  return (
    <RouterButtonLink
      href={to}
      size="lg"
      sx={[
        styles.base,
        color === "pink" && styles.pink,
        color === "blue" && styles.blue,
      ]}
      variant="primary"
    >
      {children}
    </RouterButtonLink>
  );
}
const styles = stylex.create({
  base: {
    height: 60,
    paddingBlock: "1rem",
    paddingInline: "2rem",
    fontWeight: 400,
    whiteSpace: "nowrap",
    textDecoration: "none",
    borderColor: "currentColor",
    borderWidth: 2,
    borderRadius: 10,
    scale: {
      default: "1",
      ":hover": "1.02",
      ":active": "0.98",
    },
    transitionDuration: {
      default: "0.2s",
      ":active": "0.05s",
    },
    transitionProperty: "scale, color, background-color",
  },
  pink: {
    color: {
      default: colors.primaryForeground,
      ":focus-visible": colors.primary,
      ":hover": colors.primary,
    },
    backgroundColor: {
      default: colors.primary,
      ":focus-visible": colors.primaryForeground,
      ":hover": colors.primaryForeground,
    },
    borderColor: colors.primary,
  },
  blue: {
    color: {
      default: colors.accentText,
      ":focus-visible": colors.accent,
      ":hover": colors.accent,
    },
    backgroundColor: {
      default: colors.accent,
      ":focus-visible": colors.accentText,
      ":hover": colors.accentText,
    },
    borderColor: colors.accentText,
  },
});
