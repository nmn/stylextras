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

const shortcutRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "16px",
  flexWrap: "wrap" as const,
};

const keysStyle = {
  display: "flex",
  gap: "8px",
  alignItems: "center",
  flexWrap: "wrap" as const,
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
        <div style={{ display: "grid", gap: "16px" }}>
          <div style={shortcutRowStyle}>
            <span>Open command menu</span>
            <div style={keysStyle}>
              <Kbd size={size}>⌘</Kbd>
              <Kbd size={size}>K</Kbd>
            </div>
          </div>

          <div style={shortcutRowStyle}>
            <span>Duplicate current selection</span>
            <div style={keysStyle}>
              <Kbd size={size}>⌥</Kbd>
              <Kbd size={size}>Shift</Kbd>
              <Kbd size={size}>D</Kbd>
            </div>
          </div>

          <div style={shortcutRowStyle}>
            <span>Publish changes</span>
            <div style={keysStyle}>
              <Kbd size={size}>⌘</Kbd>
              <Kbd size={size}>↵</Kbd>
            </div>
          </div>
        </div>
      </ExampleThemeFrame>
    </div>
  );
}
