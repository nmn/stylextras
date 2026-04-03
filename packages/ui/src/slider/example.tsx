"use client";

import { useState } from "react";
import { Slider, type SliderSize } from "./index";
import { ExampleThemeFrame } from "../example-theme/index";

const controlRowStyle = {
  display: "flex",
  flexWrap: "wrap" as const,
  gap: "12px",
  alignItems: "center",
  marginBottom: "16px",
};

export function SliderExample() {
  const [size, setSize] = useState<SliderSize>("md");
  const [disabled, setDisabled] = useState(false);
  const [value, setValue] = useState(40);

  return (
    <div>
      <div style={controlRowStyle}>
        <label>
          Size{" "}
          <select
            value={size}
            onChange={(event) => setSize(event.target.value as SliderSize)}
          >
            <option value="sm">sm</option>
            <option value="md">md</option>
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
        <Slider
          disabled={disabled}
          label={`Volume: ${value}%`}
          max={100}
          min={0}
          size={size}
          step={1}
          value={value}
          onChange={(event) => setValue(Number(event.target.value))}
        />
      </ExampleThemeFrame>
    </div>
  );
}
