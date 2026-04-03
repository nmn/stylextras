"use client";

import { useState } from "react";
import { TextField, type TextFieldSize } from "./index";
import { ExampleThemeFrame } from "../example-theme/index";

const controlRowStyle = {
  display: "flex",
  flexWrap: "wrap" as const,
  gap: "12px",
  alignItems: "center",
  marginBottom: "16px",
};

export function TextFieldExample() {
  const [size, setSize] = useState<TextFieldSize>("md");
  const [invalid, setInvalid] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [value, setValue] = useState("");

  return (
    <div>
      <div style={controlRowStyle}>
        <label>
          Size{" "}
          <select
            value={size}
            onChange={(event) => setSize(event.target.value as TextFieldSize)}
          >
            <option value="sm">sm</option>
            <option value="md">md</option>
          </select>
        </label>

        <label>
          <input
            checked={invalid}
            onChange={(event) => setInvalid(event.target.checked)}
            type="checkbox"
          />{" "}
          Invalid
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
        <TextField
          description="Use a concise, readable title."
          disabled={disabled}
          error={invalid ? "A title is required." : undefined}
          invalid={invalid}
          label="Project name"
          placeholder="Stylextras UI"
          size={size}
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      </ExampleThemeFrame>
    </div>
  );
}
