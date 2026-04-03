"use client";

import { Skeleton } from "./index";
import { DemoFrame, DemoSection, DemoStack } from "../example-theme/demo";

export default function Example() {
  return (
    <DemoFrame title="Skeleton" description="Skeletons are for short-lived loading placeholders that preserve layout and rhythm.">
      <DemoSection title="Card loading state" description="Mirror the final content shape closely enough that the page does not jump when real data arrives.">
        <DemoStack>
          <Skeleton aria-label="Loading title" />
          <Skeleton aria-label="Loading first paragraph" />
          <Skeleton aria-label="Loading second paragraph" />
        </DemoStack>
      </DemoSection>
    </DemoFrame>
  );
}

