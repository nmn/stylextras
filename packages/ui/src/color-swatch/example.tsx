"use client";

import { ColorSwatch } from "./index";
import { DemoFrame, DemoRow } from "../example-theme/demo";

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Swatches"
        description="Color Swatch should show a palette at a glance."
      >
        <DemoRow>
          <ColorSwatch color="#2563eb" aria-label="Blue" />
          <ColorSwatch color="#9333ea" aria-label="Purple" />
          <ColorSwatch color="#db2777" aria-label="Pink" />
          <ColorSwatch color="#ea580c" aria-label="Orange" />
        </DemoRow>
      </DemoFrame>
    </>
  );
}
