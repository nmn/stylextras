"use client";

import { useState } from "react";
import { ExampleThemeFrame } from "../example-theme/index";
import { Kbd, type KbdSize } from "./index";

const controlRowStyle = {
  display: "flex",
  flexWrap: "wrap" as const,
  gap: "12px",
  alignItems: "center",
  marginBottom: "16px",
};

export function KbdExample() {
  const [size, setSize] = useState<KbdSize>("md");

  return (
    <div>
      <div style={controlRowStyle}>
        <label>
          Size{" "}
          <select
            value={size}
            onChange={(event) => setSize(event.target.value as KbdSize)}
          >
            <option value="sm">sm</option>
            <option value="md">md</option>
          </select>
        </label>
      </div>

      <ExampleThemeFrame>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <Kbd size={size}>⌘</Kbd>
          <Kbd size={size}>K</Kbd>
          <span>Open command menu</span>
        </div>
      </ExampleThemeFrame>
    </div>
  );
}
