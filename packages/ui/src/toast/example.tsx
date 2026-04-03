"use client";

import { Toast } from "./index";
import { DemoFrame, DemoSection } from "../example-theme/demo";

export default function Example() {
  return (
    <DemoFrame title="Toast" description="Toasts are best for short-lived status updates that do not require immediate detailed action.">
      <DemoSection title="Background confirmation" description="Keep the message brief and avoid pushing critical workflows entirely into a transient surface.">
        <Toast>Theme saved successfully.</Toast>
      </DemoSection>
    </DemoFrame>
  );
}

