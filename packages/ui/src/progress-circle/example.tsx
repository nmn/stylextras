"use client";

import { ProgressCircle } from "./index";
import { DemoFrame, DemoRow, DemoSection } from "../example-theme/demo";

export default function Example() {
  return (
    <DemoFrame title="Progress Circle" description="Circular progress works best for compact summaries where space is tight and the value remains secondary to the surrounding context.">
      <DemoSection title="Compact status" description="Avoid circular progress for long-running detailed workflows where linear bars communicate sequence more clearly.">
        <DemoRow>
          <ProgressCircle value={24} max={100} showValue size="sm" />
          <ProgressCircle value={58} max={100} showValue size="md" />
          <ProgressCircle value={92} max={100} showValue size="lg" />
        </DemoRow>
      </DemoSection>
    </DemoFrame>
  );
}

