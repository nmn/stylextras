"use client";

import { useId, useState } from "react";
import { ExampleThemeFrame } from "../example-theme/index";
import { Popover, type PopoverBehavior, type PopoverSize } from "./index";

const controlRowStyle = {
  display: "flex",
  flexWrap: "wrap" as const,
  gap: "12px",
  alignItems: "center",
  marginBottom: "16px",
};

export function PopoverExample() {
  const [size, setSize] = useState<PopoverSize>("md");
  const [behavior, setBehavior] = useState<PopoverBehavior>("auto");
  const popoverId = useId();

  return (
    <div>
      <div style={controlRowStyle}>
        <label>
          Size{" "}
          <select
            value={size}
            onChange={(event) => setSize(event.target.value as PopoverSize)}
          >
            <option value="sm">sm</option>
            <option value="md">md</option>
            <option value="lg">lg</option>
          </select>
        </label>

        <label>
          Behavior{" "}
          <select
            value={behavior}
            onChange={(event) => setBehavior(event.target.value as PopoverBehavior)}
          >
            <option value="auto">auto</option>
            <option value="manual">manual</option>
          </select>
        </label>

        <button popoverTarget={popoverId} type="button">
          Toggle popover
        </button>
      </div>

      <ExampleThemeFrame>
        <button popoverTarget={popoverId} type="button">
          Toggle popover
        </button>

        <Popover behavior={behavior} id={popoverId} size={size}>
          Native popovers can be connected directly to triggers through the
          `popovertarget` attribute.
        </Popover>
      </ExampleThemeFrame>
    </div>
  );
}
