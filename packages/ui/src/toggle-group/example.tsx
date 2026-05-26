"use client";

import { Toggle } from "../toggle";
import { ToggleGroup } from "./index";
import { DemoFrame } from "../example-theme/demo";

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Grouped toggles"
        description="Toggle Group is best shown as a short cluster of pressed states."
      >
        <ToggleGroup>
          <Toggle defaultChecked>Color</Toggle>
          <Toggle defaultChecked>Spacing</Toggle>
          <Toggle>Motion</Toggle>
        </ToggleGroup>
      </DemoFrame>
    </>
  );
}
