"use client";

import { RangeDatePicker } from "./index";
import { DemoFrame } from "../example-theme/demo";

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Range date pickers"
        description="Range Date Picker is shown here as its two-field form."
      >
        <RangeDatePicker />
      </DemoFrame>
    </>
  );
}
