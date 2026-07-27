/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
"use client";

import { usePathname } from "fumadocs-core/framework";
import { isActive } from "../../../lib/is-active";
import type { BaseLinkType, StyleXComponentProps } from "./index";
import { RouterLink } from "../../router-link";

export function BaseLinkItem({
  ref,
  item,
  xstyle,
  ...props
}: Omit<StyleXComponentProps<"a">, "href"> & { item: BaseLinkType }) {
  const pathname = usePathname();
  const activeType = item.active ?? "url";
  const active =
    activeType !== "none" &&
    isActive(item.url, pathname, activeType === "nested-url");

  return (
    <RouterLink
      external={item.external}
      href={item.url}
      ref={ref}
      {...props}
      sx={xstyle}
      data-active={active}
    >
      {props.children}
    </RouterLink>
  );
}
