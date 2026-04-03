"use client";

import { Card } from "../card";
import { DemoFrame, DemoGrid, DemoMuted, DemoSection, DemoStack } from "../example-theme/demo";
import { SearchField } from "./index";
import { Typography } from "../typography";

export default function Example() {
  return (
    <DemoFrame title="Search Field" description="Search field examples should show the searchable scope and the surrounding result context. A bare input is not enough to explain the pattern.">
      <DemoSection title="Scoped search" description="Good search labels tell the user what will be searched, and the nearby result preview makes the example feel real.">
        <DemoGrid>
          <Card elevation="flat">
            <DemoStack>
              <Typography as="h3" scale="title">Component docs</Typography>
              <SearchField label="Search components" placeholder="button, dialog, slider" />
              <DemoMuted>Try terms like button, menu, tooltip, or tokens.</DemoMuted>
            </DemoStack>
          </Card>
          <Card elevation="flat">
            <DemoStack>
              <Typography as="h3" scale="title">Recent matches</Typography>
              <span>Button</span>
              <span>Button Group</span>
              <span>Copy To Clipboard Button</span>
            </DemoStack>
          </Card>
        </DemoGrid>
      </DemoSection>
    </DemoFrame>
  );
}
