"use client";

import { Toggle } from "./index";
import { DemoFrame, DemoRow, DemoSection } from "../example-theme/demo";

export default function Example() {
  return (
    <DemoFrame title="Toggle" description="Use toggles for individual pressed states such as editor controls or persistent filter chips.">
      <DemoSection title="Formatting tools" description="Pressed state should clearly communicate whether the action is currently active or inactive.">
        <DemoRow>
          <Toggle type="button" pressed>Bold</Toggle>
          <Toggle type="button">Italic</Toggle>
          <Toggle type="button">Code</Toggle>
        </DemoRow>
      </DemoSection>
    </DemoFrame>
  );
}

