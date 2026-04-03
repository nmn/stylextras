"use client";

import { ColorSwatch } from "./index";
import { DemoFrame, DemoRow, DemoSection } from "../example-theme/demo";

export default function Example() {
  return (
    <DemoFrame title="Color Swatch" description="Swatches are useful for showing current color choices inside menus, palettes, and filters.">
      <DemoSection title="Preset palette" description="A swatch should work as a visual hint, not the only expression of state.">
        <DemoRow>
          <ColorSwatch color="#2563eb" aria-label="Blue" />
          <ColorSwatch color="#9333ea" aria-label="Purple" />
          <ColorSwatch color="#db2777" aria-label="Pink" />
          <ColorSwatch color="#ea580c" aria-label="Orange" />
        </DemoRow>
      </DemoSection>
    </DemoFrame>
  );
}

