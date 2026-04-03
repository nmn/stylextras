"use client";

import { useState } from "react";
import { Button, type ButtonSize, type ButtonVariant } from "./index";
import { ExampleThemeFrame } from "../example-theme/index";

const controlRowStyle = {
  display: "flex",
  flexWrap: "wrap" as const,
  gap: "12px",
  alignItems: "center",
  marginBottom: "16px",
};

export function ButtonExample() {
  const [variant, setVariant] = useState<ButtonVariant>("primary");
  const [size, setSize] = useState<ButtonSize>("md");
  const [disabled, setDisabled] = useState(false);

  return (
    <div>
      <div style={controlRowStyle}>
        <label>
          Variant{" "}
          <select
            value={variant}
            onChange={(event) => setVariant(event.target.value as ButtonVariant)}
          >
            <option value="primary">primary</option>
            <option value="secondary">secondary</option>
            <option value="outline">outline</option>
            <option value="ghost">ghost</option>
            <option value="danger">danger</option>
          </select>
        </label>

        <label>
          Size{" "}
          <select
            value={size}
            onChange={(event) => setSize(event.target.value as ButtonSize)}
          >
            <option value="sm">sm</option>
            <option value="md">md</option>
            <option value="lg">lg</option>
          </select>
        </label>

        <label>
          <input
            checked={disabled}
            onChange={(event) => setDisabled(event.target.checked)}
            type="checkbox"
          />{" "}
          Disabled
        </label>
      </div>

      <ExampleThemeFrame>
        <Button disabled={disabled} size={size} variant={variant}>
          Continue
        </Button>
      </ExampleThemeFrame>
    </div>
  );
}
