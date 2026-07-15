"use client";

import { SearchField } from "./index";
import { DemoFrame, DemoStack } from "../example-theme/demo";

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Search fields"
        description="Search Field should show scoped labels and placeholders directly."
      >
        <DemoStack>
          <SearchField
            label="Search components"
            placeholder="button, dialog, slider"
          />
          <SearchField
            label="Search themes"
            placeholder="ocean, mono, sunset"
          />
        </DemoStack>
      </DemoFrame>
    </>
  );
}
