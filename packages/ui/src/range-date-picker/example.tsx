"use client";

import { RangeDatePicker } from "./index";
import { DemoFrame, DemoSection } from "../example-theme/demo";

export default function Example() {
  return (
    <DemoFrame title="Range Date Picker" description="A lightweight two-field date range input for booking, publishing, and reporting flows.">
      <DemoSection title="Reporting period" description="Use clear labels for the start and end values rather than relying on placement alone.">
        <RangeDatePicker />
      </DemoSection>
    </DemoFrame>
  );
}

