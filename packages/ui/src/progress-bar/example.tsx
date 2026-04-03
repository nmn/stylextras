"use client";

import { ProgressBar } from "./index";
import { DemoFrame, DemoSection, DemoStack } from "../example-theme/demo";

export default function Example() {
  return (
    <DemoFrame title="Progress Bar" description="Progress bars communicate completion toward a task with a clear endpoint.">
      <DemoSection title="Deployment status" description="Use a descriptive label and, when possible, nearby task details so the bar is not doing all the explanatory work.">
        <DemoStack>
          <ProgressBar label="Build assets" max={100} value={32} />
          <ProgressBar label="Run checks" max={100} value={86} />
        </DemoStack>
      </DemoSection>
    </DemoFrame>
  );
}

