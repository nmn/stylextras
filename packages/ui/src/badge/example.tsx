"use client";

import { useState } from "react";
import { ExampleThemeFrame } from "../example-theme/index";
import { Badge, type BadgeSize, type BadgeVariant } from "./index";

const controlRowStyle = {
  display: "flex",
  flexWrap: "wrap" as const,
  gap: "12px",
  alignItems: "center",
  marginBottom: "16px",
};

const rowStyle = {
  display: "flex",
  flexWrap: "wrap" as const,
  gap: "10px",
  alignItems: "center",
};

const variants: BadgeVariant[] = [
  "neutral",
  "brand",
  "info",
  "success",
  "warning",
  "danger",
];

export function BadgeExample() {
  const [variant, setVariant] = useState<BadgeVariant>("neutral");
  const [size, setSize] = useState<BadgeSize>("md");

  return (
    <div>
      <div style={controlRowStyle}>
        <label>
          Variant{" "}
          <select
            value={variant}
            onChange={(event) => setVariant(event.target.value as BadgeVariant)}
          >
            {variants.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label>
          Size{" "}
          <select
            value={size}
            onChange={(event) => setSize(event.target.value as BadgeSize)}
          >
            <option value="sm">sm</option>
            <option value="md">md</option>
          </select>
        </label>
      </div>

      <ExampleThemeFrame>
        <div style={rowStyle}>
          <Badge size={size} variant={variant}>
            Current selection
          </Badge>
          <Badge size={size} variant="success">
            Production
          </Badge>
          <Badge size={size} variant="warning">
            Needs review
          </Badge>
        </div>

        <div style={rowStyle}>
          {variants.map((item) => (
            <Badge key={item} size={size} variant={item}>
              {item}
            </Badge>
          ))}
        </div>
      </ExampleThemeFrame>
    </div>
  );
}
