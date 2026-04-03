"use client";

import { ColorPicker } from "./index";
import { DemoFrame, DemoRow, DemoSection } from "../example-theme/demo";

export default function Example() {
  return (
    <DemoFrame title="Color Picker" description="This component keeps color picking intentionally simple and native.">
      <DemoSection title="Theme accents" description="A small palette is often enough for settings screens and content authoring tools.">
        <DemoRow>
          <ColorPicker aria-label="Brand color" defaultValue="#0f766e" />
          <ColorPicker aria-label="Callout color" defaultValue="#b45309" />
        </DemoRow>
      </DemoSection>
    </DemoFrame>
  );
}

