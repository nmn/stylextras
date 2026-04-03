"use client";

import { Flex } from "./index";
import { Badge } from "../badge";
import { Button } from "../button";
import { DemoFrame, DemoPanel, DemoSection } from "../example-theme/demo";

export default function Example() {
  return (
    <DemoFrame title="Flex" description="A small flexbox layout primitive for building rows, stacks, and responsive clusters.">
      <DemoSection title="Inline composition" description="Flex is good for aligning small units of UI without introducing a heavier layout abstraction.">
        <DemoPanel>
          <Flex align="center" justify="between" gap="md" wrap>
            <Badge>Design system</Badge>
            <span>Ready for review</span>
            <Button type="button">Open preview</Button>
          </Flex>
        </DemoPanel>
      </DemoSection>
    </DemoFrame>
  );
}

