"use client";

import { ProgressCircle } from "./index";
import { DemoFrame, DemoRow } from "../example-theme/demo";

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Sizes and values"
        description="Progress Circle should show size and progress differences at a glance."
      >
        <DemoRow>
          <ProgressCircle
            aria-label="Small progress"
            value={24}
            max={100}
            showValue
            size="sm"
          />
          <ProgressCircle
            aria-label="Medium progress"
            value={58}
            max={100}
            showValue
            size="md"
          />
          <ProgressCircle
            aria-label="Large progress"
            value={92}
            max={100}
            showValue
            size="lg"
          />
        </DemoRow>
      </DemoFrame>
    </>
  );
}
