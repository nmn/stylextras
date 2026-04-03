"use client";

import { Popover } from "./index";
import { DemoFrame, DemoStack } from "../example-theme/demo";
import { Button } from "../button";

export default function Example() {
  return (
    <>
      <DemoFrame title="Popover surface" description="Popover should show a simple trigger and a small surfaced panel.">
        <DemoStack>
          <Button popoverTarget="popover-demo">Open popover</Button>
          <Popover id="popover-demo">
            <DemoStack>
              <strong>Quick details</strong>
              <span>Short supporting content belongs here.</span>
            </DemoStack>
          </Popover>
        </DemoStack>
      </DemoFrame>
    </>
  );
}

