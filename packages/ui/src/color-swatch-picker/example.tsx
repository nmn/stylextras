"use client";

import { useState } from "react";
import { ColorSwatchPicker } from "./index";
import { DemoFrame, DemoSection, DemoStack } from "../example-theme/demo";

export default function Example() {
  const [value, setValue] = useState("#2563eb");

  return (
    <DemoFrame title="Color Swatch Picker" description="Use a swatch picker when the palette is intentionally curated and small.">
      <DemoSection title="Choose an accent" description="This is better suited to product themes than freeform art tooling.">
        <DemoStack>
          <ColorSwatchPicker colors={["#2563eb", "#0f766e", "#9333ea", "#ea580c", "#dc2626"]} value={value} onValueChange={setValue} />
          <div>Selected value: {value}</div>
        </DemoStack>
      </DemoSection>
    </DemoFrame>
  );
}

