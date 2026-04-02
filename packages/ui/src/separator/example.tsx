"use client";

import { useState } from "react";
import {
  Separator,
  type SeparatorEmphasis,
  type SeparatorOrientation,
} from "./index";

const controlRowStyle = {
  display: "flex",
  flexWrap: "wrap" as const,
  gap: "12px",
  alignItems: "center",
  marginBottom: "16px",
};

export function SeparatorExample() {
  const [orientation, setOrientation] =
    useState<SeparatorOrientation>("horizontal");
  const [emphasis, setEmphasis] = useState<SeparatorEmphasis>("subtle");

  return (
    <div>
      <div style={controlRowStyle}>
        <label>
          Orientation{" "}
          <select
            value={orientation}
            onChange={(event) =>
              setOrientation(event.target.value as SeparatorOrientation)
            }
          >
            <option value="horizontal">horizontal</option>
            <option value="vertical">vertical</option>
          </select>
        </label>

        <label>
          Emphasis{" "}
          <select
            value={emphasis}
            onChange={(event) => setEmphasis(event.target.value as SeparatorEmphasis)}
          >
            <option value="subtle">subtle</option>
            <option value="strong">strong</option>
          </select>
        </label>
      </div>

      {orientation === "horizontal" ? (
        <div>
          <div>Above</div>
          <Separator emphasis={emphasis} orientation={orientation} />
          <div>Below</div>
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "stretch", height: "72px" }}>
          <div>Left</div>
          <Separator emphasis={emphasis} orientation={orientation} />
          <div>Right</div>
        </div>
      )}
    </div>
  );
}
