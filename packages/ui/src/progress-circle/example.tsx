"use client";

import { ProgressCircle } from "./index";
import { DemoFrame, DemoRow } from "../example-theme/demo";

export default function Example() {
  return (
    <>
      <DemoFrame title="Sizes and values" description="Progress Circle should show size and progress differences at a glance.">
        <DemoRow>
          <ProgressCircle value={24} max={100} showValue size="sm" />
          <ProgressCircle value={58} max={100} showValue size="md" />
          <ProgressCircle value={92} max={100} showValue size="lg" />
        </DemoRow>
      </DemoFrame>
    </>
  );
}

