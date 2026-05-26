/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import type { ReactNode } from "react";
import json from "@stylexjs/stylex/package.json";
const { version } = json;

export const versionTag = version.includes("beta") ? "@beta" : "";

export function VersionTag() {
  return <span>{versionTag}</span>;
}

export function IfBeta({ children }: { children: ReactNode }) {
  if (version.includes("beta")) {
    return children;
  }
  return null;
}

export function IfNotBeta({ children }: { children: ReactNode }) {
  if (version.includes("beta")) {
    return null;
  }
  return children;
}
