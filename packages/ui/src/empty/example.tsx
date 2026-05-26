"use client";

import { Empty } from "./index";
import { DemoFrame, DemoStack } from "../example-theme/demo";

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Empty state"
        description="Empty is a presentation container, so the example should stay simple."
      >
        <Empty>
          <DemoStack>
            <strong>No items yet</strong>
            <span>Create the first item to populate this view.</span>
          </DemoStack>
        </Empty>
      </DemoFrame>
    </>
  );
}
