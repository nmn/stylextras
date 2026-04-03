"use client";

import { Meter } from "./index";
import { DemoFrame, DemoStack } from "../example-theme/demo";

export default function Example() {
  return (
    <>
      <DemoFrame title="Meter values" description="Meter should show a few representative values directly.">
        <DemoStack>
          <Meter label="Coverage" min={0} max={100} value={25} />
          <Meter label="Coverage" min={0} max={100} value={50} />
          <Meter label="Coverage" min={0} max={100} value={80} />
        </DemoStack>
      </DemoFrame>
    </>
  );
}

