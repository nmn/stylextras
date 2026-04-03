"use client";

import { ColorArea } from "./index";
import { ColorSlider } from "../color-slider";
import { DemoFrame, DemoSection, DemoStack } from "../example-theme/demo";

export default function Example() {
  return (
    <DemoFrame title="Color Area" description="Use a color area when you want a lightweight custom color selection surface without a full design app interaction model.">
      <DemoSection title="Product accent" description="Pair the area with another control such as a slider or direct field input.">
        <DemoStack>
          <ColorArea defaultValue="#4f46e5" aria-label="Accent color" />
          <ColorSlider min={0} max={100} defaultValue={64} aria-label="Accent intensity" />
        </DemoStack>
      </DemoSection>
    </DemoFrame>
  );
}

