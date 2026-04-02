"use client";

import { useState } from "react";
import { Badge, type BadgeSize, type BadgeVariant } from "./index";

const controlRowStyle = {
  display: "flex",
  flexWrap: "wrap" as const,
  gap: "12px",
  alignItems: "center",
  marginBottom: "16px",
};

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
            <option value="neutral">neutral</option>
            <option value="brand">brand</option>
            <option value="info">info</option>
            <option value="success">success</option>
            <option value="warning">warning</option>
            <option value="danger">danger</option>
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

      <Badge size={size} variant={variant}>
        Stable
      </Badge>
    </div>
  );
}
