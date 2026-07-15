/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
"use client";

import { createContext, useState } from "react";
import type { ReactNode } from "react";

export const SidebarContext = createContext<
  [
    null | boolean,
    (_val: ((_old: null | boolean) => boolean) | boolean) => void,
  ]
>([true, () => {}]);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(null);
  const value = [open, setOpen];

  return <SidebarContext value={value as any}>{children}</SidebarContext>;
}
