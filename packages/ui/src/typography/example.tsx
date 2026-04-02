"use client";

import { useState } from "react";
import { Typography, type TypographyScale, type TypographyTone } from "./index";

const controlRowStyle = {
  display: "flex",
  flexWrap: "wrap" as const,
  gap: "12px",
  alignItems: "center",
  marginBottom: "16px",
};

export function TypographyExample() {
  const [scale, setScale] = useState<TypographyScale>("body");
  const [tone, setTone] = useState<TypographyTone>("default");
  const [mono, setMono] = useState(false);

  return (
    <div>
      <div style={controlRowStyle}>
        <label>
          Scale{" "}
          <select
            value={scale}
            onChange={(event) => setScale(event.target.value as TypographyScale)}
          >
            <option value="label">label</option>
            <option value="body">body</option>
            <option value="title">title</option>
            <option value="display">display</option>
          </select>
        </label>

        <label>
          Tone{" "}
          <select
            value={tone}
            onChange={(event) => setTone(event.target.value as TypographyTone)}
          >
            <option value="default">default</option>
            <option value="soft">soft</option>
            <option value="muted">muted</option>
            <option value="brand">brand</option>
            <option value="info">info</option>
            <option value="success">success</option>
            <option value="warning">warning</option>
            <option value="danger">danger</option>
          </select>
        </label>

        <label>
          <input
            checked={mono}
            onChange={(event) => setMono(event.target.checked)}
            type="checkbox"
          />{" "}
          Mono
        </label>
      </div>

      <Typography mono={mono} scale={scale} tone={tone}>
        The quick brown fox jumps over the lazy dog.
      </Typography>
    </div>
  );
}
