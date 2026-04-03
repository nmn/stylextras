"use client";

import { Button } from "../button";
import { Card } from "../card";
import { Checkbox } from "./index";
import { DemoFrame, DemoGrid, DemoSection, DemoStack } from "../example-theme/demo";
import { Typography } from "../typography";

export default function Example() {
  return (
    <DemoFrame title="Checkbox" description="Checkboxes are strongest when the user can see that each option is independent. These demos use them inside settings and task-list flows.">
      <DemoSection title="Independent preferences" description="Each checkbox should read like a complete statement that can be toggled on its own.">
        <DemoGrid>
          <Card elevation="flat">
            <DemoStack>
              <Typography as="h3" scale="title">Notifications</Typography>
              <Checkbox defaultChecked label="Email me when a review is requested" />
              <Checkbox defaultChecked label="Send deploy failures to Slack" />
              <Checkbox label="Mute low-priority changes" />
            </DemoStack>
          </Card>
          <Card elevation="flat">
            <DemoStack>
              <Typography as="h3" scale="title">Release checklist</Typography>
              <Checkbox defaultChecked label="Examples are updated" />
              <Checkbox label="Docs copy is reviewed" />
              <Checkbox label="All export paths are stable" />
              <Button type="button">Save checklist</Button>
            </DemoStack>
          </Card>
        </DemoGrid>
      </DemoSection>
    </DemoFrame>
  );
}
