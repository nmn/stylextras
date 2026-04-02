"use client";

import { useState } from "react";
import { Typography } from "../typography/index";
import { Card, type CardElevation } from "./index";

const controlRowStyle = {
  display: "flex",
  flexWrap: "wrap" as const,
  gap: "12px",
  alignItems: "center",
  marginBottom: "16px",
};

export function CardExample() {
  const [elevation, setElevation] = useState<CardElevation>("md");

  return (
    <div>
      <div style={controlRowStyle}>
        <label>
          Elevation{" "}
          <select
            value={elevation}
            onChange={(event) => setElevation(event.target.value as CardElevation)}
          >
            <option value="flat">flat</option>
            <option value="sm">sm</option>
            <option value="md">md</option>
            <option value="lg">lg</option>
          </select>
        </label>
      </div>

      <Card elevation={elevation}>
        <Typography scale="title">Project overview</Typography>
        <Typography tone="muted">
          This card uses the package tokens directly for surface, spacing, radius,
          border, blur, and elevation.
        </Typography>
      </Card>
    </div>
  );
}
