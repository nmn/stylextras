"use client";

import { Tooltip } from "./index";
import { DemoFrame, DemoStack } from "../example-theme/demo";
import { Button } from "../button";

export default function Example() {
  return (
    <>
      <DemoFrame title="Tooltip surface" description="Tooltip needs only a simple trigger and short hint text.">
        <DemoStack>
          <Button popoverTarget="tooltip-demo">Export token snapshot</Button>
          <Tooltip id="tooltip-demo">Creates a static JSON snapshot of the current theme.</Tooltip>
        </DemoStack>
      </DemoFrame>
    </>
  );
}

