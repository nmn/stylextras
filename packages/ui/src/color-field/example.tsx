"use client";

import { ColorField } from "./index";
import { DemoFrame, DemoRow, DemoSection } from "../example-theme/demo";

export default function Example() {
  return (
    <DemoFrame title="Color Field" description="A token-styled native color input for simple accent picking.">
      <DemoSection title="Direct input" description="Use the native color field when you want immediate, low-friction selection.">
        <DemoRow>
          <ColorField aria-label="Primary accent" defaultValue="#2563eb" />
          <ColorField aria-label="Secondary accent" defaultValue="#ec4899" />
        </DemoRow>
      </DemoSection>
    </DemoFrame>
  );
}

