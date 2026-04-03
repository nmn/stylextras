"use client";

import { useState } from "react";
import { ColorSwatchPicker } from "./index";
import { DemoFrame, DemoStack } from "../example-theme/demo";

function SwatchPickerDemo() {
  const [value, setValue] = useState("#2563eb");
  return (
    <DemoStack>
      <ColorSwatchPicker colors={["#2563eb", "#0f766e", "#9333ea", "#ea580c", "#dc2626"]} value={value} onValueChange={setValue} />
      <span>Selected: {value}</span>
    </DemoStack>
  );
}

export default function Example() {
  return (
    <>
      <DemoFrame title="Swatch Picker" description="Color Swatch Picker should show palette choice and the current selected value.">
        <SwatchPickerDemo />
      </DemoFrame>
    </>
  );
}

