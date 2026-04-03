"use client";

import { Button } from "../button";
import { ButtonGroup } from "./index";
import { Card } from "../card";
import { DemoFrame, DemoGrid, DemoSection, DemoStack } from "../example-theme/demo";
import { Typography } from "../typography";

export default function Example() {
  return (
    <DemoFrame title="Button Group" description="Button groups are easier to understand when the buttons clearly belong to one small decision. These demos show the group inside realistic local contexts.">
      <DemoSection title="Review workflow" description="Keep grouped actions tightly related. The more unrelated the actions feel, the less helpful the grouping becomes.">
        <DemoGrid>
          <Card elevation="flat">
            <DemoStack>
              <Typography as="h3" scale="title">Code review</Typography>
              <ButtonGroup>
                <Button type="button">Approve</Button>
                <Button type="button">Request changes</Button>
                <Button type="button">Comment</Button>
              </ButtonGroup>
            </DemoStack>
          </Card>
          <Card elevation="flat">
            <DemoStack>
              <Typography as="h3" scale="title">Publishing</Typography>
              <ButtonGroup>
                <Button type="button">Preview</Button>
                <Button type="button">Schedule</Button>
                <Button type="button">Publish now</Button>
              </ButtonGroup>
            </DemoStack>
          </Card>
        </DemoGrid>
      </DemoSection>
    </DemoFrame>
  );
}
