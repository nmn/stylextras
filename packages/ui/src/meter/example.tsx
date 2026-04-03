"use client";

import { Meter } from "./index";
import { DemoFrame, DemoSection, DemoStack } from "../example-theme/demo";

export default function Example() {
  return (
    <DemoFrame title="Meter" description="Meters are good for expressing a measurement inside a known range, such as storage or score quality.">
      <DemoSection title="Project health" description="Make the label carry meaning because the visual fill is only part of the story.">
        <DemoStack>
          <Meter label="Coverage" min={0} max={100} value={78} />
          <Meter label="Storage" min={0} max={100} value={42} />
        </DemoStack>
      </DemoSection>
    </DemoFrame>
  );
}

