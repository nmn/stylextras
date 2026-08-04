/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { RouterLink } from "@/components/router-link";
import { ComponentProps } from "react";
import * as stylex from "@stylexjs/stylex";
import { colors } from "@stylextras/ui/tokens/color.stylex";

export default function MDXLink({
  xstyle,
  ...props
}: Omit<ComponentProps<typeof RouterLink>, "className" | "style"> & {
  xstyle?: stylex.StyleXStyles;
}) {
  return (
    <RouterLink sx={[styles.base, xstyle]} {...props}>
      {props.children}
    </RouterLink>
  );
}

const styles = stylex.create({
  base: {
    color: {
      default: colors.primary,
      [stylex.when.descendant(":is(code)")]: colors.code,
    },
    textDecorationColor: {
      default: "transparent",
      ":focus-visible": "color-mix(in srgb, currentColor 50%, transparent)",
      ":hover": "color-mix(in srgb, currentColor 50%, transparent)",
    },
  },
});
