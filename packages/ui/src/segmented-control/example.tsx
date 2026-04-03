"use client";

import { SegmentedControl } from "./index";
import { DemoFrame, DemoStack } from "../example-theme/demo";

export default function Example() {
  return (
    <>
      <DemoFrame title="Segment sets" description="Segmented Control should show a couple of compact option groups directly.">
        <DemoStack>
          <SegmentedControl options={["Preview", "Code", "Tokens"]} defaultValue="Preview" />
          <SegmentedControl options={["General", "Tokens", "Publishing"]} defaultValue="Tokens" />
        </DemoStack>
      </DemoFrame>
    </>
  );
}

