"use client";

import { CopyToClipboardButton } from "./index";
import { DemoFrame, DemoSection, DemoStack } from "../example-theme/demo";

export default function Example() {
  return (
    <DemoFrame title="Copy To Clipboard Button" description="Use this control when a stable string value should be copied directly from the UI.">
      <DemoSection title="Code snippet" description="A short feedback state is enough for this pattern as long as the copied value is obvious.">
        <DemoStack>
          <code>npx create-stylextras app</code>
          <CopyToClipboardButton value="npx create-stylextras app">Copy install command</CopyToClipboardButton>
        </DemoStack>
      </DemoSection>
    </DemoFrame>
  );
}

