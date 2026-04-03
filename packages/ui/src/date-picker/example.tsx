"use client";

import { DatePicker } from "./index";
import { DemoFrame, DemoSection } from "../example-theme/demo";

export default function Example() {
  return (
    <DemoFrame title="Date Picker" description="Use the native date picker for straightforward scheduling flows.">
      <DemoSection title="Schedule review" description="The native control is a pragmatic default when localization and keyboard support matter more than custom chrome.">
        <DatePicker aria-label="Review date" defaultValue="2026-04-18" />
      </DemoSection>
    </DemoFrame>
  );
}

