"use client";

import { useState } from "react";
import { Disclosure, type DisclosureSize } from "./index";

const controlRowStyle = {
  display: "flex",
  flexWrap: "wrap" as const,
  gap: "12px",
  alignItems: "center",
  marginBottom: "16px",
};

export function DisclosureExample() {
  const [size, setSize] = useState<DisclosureSize>("md");
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div style={controlRowStyle}>
        <label>
          Size{" "}
          <select
            value={size}
            onChange={(event) => setSize(event.target.value as DisclosureSize)}
          >
            <option value="md">md</option>
            <option value="lg">lg</option>
          </select>
        </label>

        <label>
          <input
            checked={open}
            onChange={(event) => setOpen(event.target.checked)}
            type="checkbox"
          />{" "}
          Open
        </label>
      </div>

      <Disclosure
        open={open}
        size={size}
        summary="What makes this implementation different?"
      >
        This uses native details and summary elements instead of a custom state
        machine, while still applying the shared token system.
      </Disclosure>
    </div>
  );
}
