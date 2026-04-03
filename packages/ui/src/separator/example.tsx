"use client";

import { useState } from "react";
import { ExampleThemeFrame } from "../example-theme/index";
import { Separator, type SeparatorEmphasis, type SeparatorOrientation } from "./index";

const controlRowStyle = {
  display: "flex",
  flexWrap: "wrap" as const,
  gap: "12px",
  alignItems: "center",
  marginBottom: "16px",
};

const cardStyle = {
  display: "grid",
  gap: "12px",
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
            onChange={(event) =>
              setEmphasis(event.target.value as SeparatorEmphasis)
            }
          >
            <option value="subtle">subtle</option>
            <option value="strong">strong</option>
          </select>
        </label>
      </div>

      <ExampleThemeFrame>
        {orientation === "horizontal" ? (
          <div style={cardStyle}>
            <div>
              <strong>Account</strong>
              <p style={{ margin: "6px 0 0", opacity: 0.72 }}>
                Email, password, and sign-in preferences.
              </p>
            </div>
            <Separator emphasis={emphasis} orientation="horizontal" />
            <div>
              <strong>Notifications</strong>
              <p style={{ margin: "6px 0 0", opacity: 0.72 }}>
                Product updates, comments, and billing reminders.
              </p>
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "stretch",
              gap: "12px",
              minHeight: "88px",
            }}
          >
            <div style={{ display: "grid", alignContent: "center", gap: "4px" }}>
              <strong>Views</strong>
              <span style={{ opacity: 0.72 }}>Summary metrics</span>
            </div>
            <Separator emphasis={emphasis} orientation="vertical" />
            <div style={{ display: "grid", alignContent: "center", gap: "4px" }}>
              <strong>Conversions</strong>
              <span style={{ opacity: 0.72 }}>Completed checkouts</span>
            </div>
          </div>
        )}
      </ExampleThemeFrame>
    </div>
  );
}
