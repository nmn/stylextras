"use client";

import { Checkbox } from "./index";
import { DemoFrame, DemoStack } from "../example-theme/demo";

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Checkbox states"
        description="Checkbox should show checked, unchecked, disabled, and size differences directly."
      >
        <DemoStack>
          <Checkbox defaultChecked label="Checked" />
          <Checkbox label="Unchecked" />
          <Checkbox disabled label="Disabled" />
          <Checkbox size="sm" label="Small" />
        </DemoStack>
      </DemoFrame>
    </>
  );
}
