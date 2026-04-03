"use client";

import { Spinner } from "./index";
import { DemoFrame, DemoRow, DemoSection } from "../example-theme/demo";

export default function Example() {
  return (
    <DemoFrame title="Spinner" description="Spinners are best for very short waits or indeterminate loading states where progress is unknown.">
      <DemoSection title="Indeterminate states" description="For anything longer than a brief wait, a progress bar or richer status message is usually more useful.">
        <DemoRow>
          <Spinner aria-label="Loading tokens" />
          <span>Fetching token previews...</span>
        </DemoRow>
      </DemoSection>
    </DemoFrame>
  );
}

