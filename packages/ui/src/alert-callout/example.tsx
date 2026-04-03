"use client";

import { useState } from "react";
import { ExampleThemeFrame } from "../example-theme/index";
import { Typography } from "../typography/index";
import { Alert, type AlertVariant } from "./index";

const controlRowStyle = {
  display: "flex",
  flexWrap: "wrap" as const,
  gap: "12px",
  alignItems: "center",
  marginBottom: "16px",
};

export function AlertExample() {
  const [variant, setVariant] = useState<AlertVariant>("neutral");

  return (
    <div>
      <div style={controlRowStyle}>
        <label>
          Variant{" "}
          <select
            value={variant}
            onChange={(event) => setVariant(event.target.value as AlertVariant)}
          >
            <option value="neutral">neutral</option>
            <option value="info">info</option>
            <option value="success">success</option>
            <option value="warning">warning</option>
            <option value="danger">danger</option>
          </select>
        </label>
      </div>

      <ExampleThemeFrame>
        <Alert variant={variant}>
          <Typography scale="title">Build status</Typography>
          <Typography tone="soft">
            This example swaps only the semantic variant prop while the spacing,
            border, and radius stay token-driven.
          </Typography>
        </Alert>
      </ExampleThemeFrame>
    </div>
  );
}
