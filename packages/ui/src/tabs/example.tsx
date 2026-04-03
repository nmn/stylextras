"use client";

import { Tabs } from "./index";
import { DemoFrame, DemoStack } from "../example-theme/demo";

export default function Example() {
  return (
    <>
      <DemoFrame title="Documentation tabs" description="Tabs should show the component's tab-strip forms directly.">
        <DemoStack>
          <Tabs tabs={["Overview", "Examples", "Accessibility"]} defaultValue="Overview" />
          <Tabs tabs={["General", "Tokens", "Publishing"]} defaultValue="Tokens" />
        </DemoStack>
      </DemoFrame>
    </>
  );
}

