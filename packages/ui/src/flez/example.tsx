"use client";

import { Flez } from "./index";
import { Badge } from "../badge";
import { DemoFrame, DemoSection } from "../example-theme/demo";

export default function Example() {
  return (
    <DemoFrame title="Flez" description="The legacy compatibility layout primitive kept for older integrations.">
      <DemoSection title="Compatibility layout" description="Prefer Flex for new code. Keep Flez only where a stable legacy export is still useful.">
        <Flez>
          <Badge>Legacy</Badge>
          <span>Used in an older settings surface</span>
        </Flez>
      </DemoSection>
    </DemoFrame>
  );
}

