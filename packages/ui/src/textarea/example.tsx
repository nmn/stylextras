"use client";

import { Button } from "../button";
import { Card } from "../card";
import { DemoFrame, DemoGrid, DemoMuted, DemoSection, DemoStack } from "../example-theme/demo";
import { Textarea } from "./index";
import { Typography } from "../typography";

export default function Example() {
  return (
    <DemoFrame title="Textarea" description="Textarea examples should show the kind of longer content the user would actually enter. These demos use editorial and product-writing scenarios.">
      <DemoSection title="Long-form input" description="A multiline field becomes more persuasive when the content around it explains what kind of answer belongs there.">
        <DemoGrid>
          <Card elevation="flat">
            <DemoStack>
              <Typography as="h3" scale="title">Release notes</Typography>
              <Textarea label="Summary" rows={6} defaultValue="Native overlays now use dialog and popover without portals. Documentation examples have been updated to feel more like product UI." />
              <Button type="button">Save summary</Button>
            </DemoStack>
          </Card>
          <Card elevation="flat">
            <DemoStack>
              <Typography as="h3" scale="title">Writing guidance</Typography>
              <DemoMuted>Keep release-note fields specific, short, and task-oriented. The point is to help the reader understand what changed and why it matters.</DemoMuted>
            </DemoStack>
          </Card>
        </DemoGrid>
      </DemoSection>
    </DemoFrame>
  );
}
