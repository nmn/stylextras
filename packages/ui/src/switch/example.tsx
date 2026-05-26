"use client";

import { Switch } from "./index";
import { DemoFrame, DemoStack } from "../example-theme/demo";

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Switch states"
        description="Switch should show checked, unchecked, and size differences directly."
      >
        <DemoStack>
          <Switch defaultChecked label="Enabled" />
          <Switch label="Disabled" />
          <Switch size="sm" defaultChecked label="Small switch" />
        </DemoStack>
      </DemoFrame>
    </>
  );
}
