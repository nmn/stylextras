"use client";

import { Skeleton } from "./index";
import { DemoFrame, DemoStack } from "../example-theme/demo";

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Placeholder lines"
        description="Skeleton should be shown as repeated placeholders, not as a full mock app."
      >
        <DemoStack>
          <Skeleton aria-label="Loading title" />
          <Skeleton aria-label="Loading paragraph one" />
          <Skeleton aria-label="Loading paragraph two" />
        </DemoStack>
      </DemoFrame>
    </>
  );
}
