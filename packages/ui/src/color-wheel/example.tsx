"use client";

import { ColorWheel } from "./index";
import { DemoFrame, DemoSection } from "../example-theme/demo";

export default function Example() {
  return (
    <DemoFrame title="Color Wheel" description="The current implementation keeps the wheel as a lightweight wrapper for native color entry.">
      <DemoSection title="Accent selection" description="Use it where a more expressive visual metaphor is helpful, but keep the rest of the workflow simple.">
        <ColorWheel aria-label="Wheel accent" defaultValue="#7c3aed" />
      </DemoSection>
    </DemoFrame>
  );
}

