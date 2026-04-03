"use client";

import { Toggle } from "../toggle";
import { ToggleGroup } from "./index";
import { DemoFrame, DemoSection } from "../example-theme/demo";

export default function Example() {
  return (
    <DemoFrame title="Toggle Group" description="A toggle group works well for dense filters and editor controls that can be combined.">
      <DemoSection title="Visible columns" description="Unlike segmented controls, toggles in a group do not need to be mutually exclusive.">
        <ToggleGroup>
          <Toggle type="button" pressed>Color</Toggle>
          <Toggle type="button" pressed>Spacing</Toggle>
          <Toggle type="button">Motion</Toggle>
        </ToggleGroup>
      </DemoSection>
    </DemoFrame>
  );
}

