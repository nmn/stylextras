"use client";

import { FileTrigger } from "./index";
import { DemoFrame, DemoSection, DemoStack } from "../example-theme/demo";

export default function Example() {
  return (
    <DemoFrame title="File Trigger" description="Use a file trigger when a compact upload affordance fits better than a larger drop zone.">
      <DemoSection title="Import theme JSON" description="Pair the trigger with surrounding copy so the user knows what will happen after the selection.">
        <DemoStack>
          <FileTrigger label="Choose theme file" accept="application/json" />
          <span>Accepted file type: .json</span>
        </DemoStack>
      </DemoSection>
    </DemoFrame>
  );
}

