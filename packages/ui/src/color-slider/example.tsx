"use client";

import { ColorSlider } from "./index";
import { DemoFrame, DemoSection, DemoStack } from "../example-theme/demo";

export default function Example() {
  return (
    <DemoFrame title="Color Slider" description="Use sliders for single-axis adjustments such as opacity, tint strength, or palette intensity.">
      <DemoSection title="Intensity controls" description="Keep the label and the unit close to the range when the value has meaning.">
        <DemoStack>
          <ColorSlider aria-label="Tint intensity" min={0} max={100} defaultValue={24} />
          <ColorSlider aria-label="Glow strength" min={0} max={100} defaultValue={68} />
        </DemoStack>
      </DemoSection>
    </DemoFrame>
  );
}

