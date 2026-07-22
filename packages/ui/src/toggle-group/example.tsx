"use client";

import { Toggle } from "../toggle";
import type { ToggleProps } from "../toggle";
import { ToggleGroup } from "./index";
import { DemoFrame } from "../example-theme/demo";
import { useState } from "react";

type DemoToggleProps = Omit<ToggleProps, "aria-pressed" | "onClick"> & {
  defaultPressed?: boolean;
};

function DemoToggle({ defaultPressed = false, ...props }: DemoToggleProps) {
  const [pressed, setPressed] = useState(defaultPressed);
  return (
    <Toggle
      aria-pressed={pressed}
      onClick={() => setPressed((value) => !value)}
      {...props}
    />
  );
}

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Grouped toggles"
        description="Toggle Group is best shown as a short cluster of pressed states."
      >
        <ToggleGroup aria-label="Text formatting">
          <DemoToggle defaultPressed>Color</DemoToggle>
          <DemoToggle defaultPressed>Spacing</DemoToggle>
          <DemoToggle>Motion</DemoToggle>
        </ToggleGroup>
      </DemoFrame>
    </>
  );
}
