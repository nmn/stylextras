"use client";

import { HoverCard } from "./index";
import { DemoFrame, DemoStack } from "../example-theme/demo";

export default function Example() {
  return (
    <>
      <DemoFrame title="Preview surface" description="Hover Card should show a simple trigger and compact preview.">
        <DemoStack>
          <button popoverTarget="hover-card-demo" type="button">Open preview</button>
          <HoverCard id="hover-card-demo">
            <DemoStack>
              <strong>Package preview</strong>
              <span>Lightweight summary content belongs here.</span>
            </DemoStack>
          </HoverCard>
        </DemoStack>
      </DemoFrame>
    </>
  );
}

