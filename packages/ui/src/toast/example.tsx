"use client";

import { Toast } from "./index";
import { DemoFrame, DemoStack } from "../example-theme/demo";

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Toast messages"
        description="Toast should show a few concise message forms directly."
      >
        <DemoStack>
          <Toast>Theme saved successfully.</Toast>
          <Toast>Export completed.</Toast>
        </DemoStack>
      </DemoFrame>
    </>
  );
}
