"use client";

import { Button } from "../button";
import { Card } from "../card";
import { DemoFrame, DemoGrid, DemoMuted, DemoSection, DemoStack } from "../example-theme/demo";
import { Listbox } from "./index";
import { Typography } from "../typography";

export default function Example() {
  return (
    <DemoFrame title="Listbox" description="Listboxes make more sense when the visible options are part of a selection workflow. These demos use them for bounded multi-select tasks rather than generic option dumps.">
      <DemoSection title="Visible selection" description="A listbox works well when the options should stay on screen and the user may choose several of them at once.">
        <DemoGrid>
          <Card elevation="flat">
            <DemoStack>
              <Typography as="h3" scale="title">Choose modules</Typography>
              <Listbox aria-label="Enabled modules" options={["Tokens", "Components", "Themes", "Examples", "Docs"]} size={5} />
              <Button type="button">Save modules</Button>
            </DemoStack>
          </Card>
          <Card elevation="flat">
            <DemoStack>
              <Typography as="h3" scale="title">Why visible options help</Typography>
              <DemoMuted>The user can compare several choices at once, which makes listboxes a better fit than a collapsed select for multi-select and filter scenarios.</DemoMuted>
            </DemoStack>
          </Card>
        </DemoGrid>
      </DemoSection>
    </DemoFrame>
  );
}
