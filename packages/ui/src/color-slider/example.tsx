"use client";

import { ColorSlider } from "./index";
import { DemoFrame, DemoStack } from "../example-theme/demo";

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Color Slider"
        description="Color Slider should show a few values directly."
      >
        <DemoStack>
          <ColorSlider aria-label="Tint" min={0} max={100} defaultValue={24} />
          <ColorSlider aria-label="Glow" min={0} max={100} defaultValue={68} />
        </DemoStack>
      </DemoFrame>
    </>
  );
}
