"use client";

import { RangeCalendar } from "./index";
import { DemoFrame, DemoSection } from "../example-theme/demo";

export default function Example() {
  return (
    <DemoFrame title="Range Calendar" description="Use a range calendar when both the start and end dates belong to one scheduling decision.">
      <DemoSection title="Campaign window" description="Keep the paired dates visually close so the relationship stays obvious.">
        <RangeCalendar />
      </DemoSection>
    </DemoFrame>
  );
}

