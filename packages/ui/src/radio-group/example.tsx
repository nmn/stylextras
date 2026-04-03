"use client";

import { Button } from "../button";
import { Card } from "../card";
import { DemoFrame, DemoGrid, DemoSection, DemoStack } from "../example-theme/demo";
import { RadioGroup } from "./index";
import { Typography } from "../typography";

export default function Example() {
  return (
    <DemoFrame title="Radio Group" description="Radio groups become clearer when the user can see the exact decision being made. These examples use exclusive choices inside realistic publishing and notification flows.">
      <DemoSection title="Exclusive choices" description="Use radio groups when the user must choose one path and the legend frames the decision clearly.">
        <DemoGrid>
          <Card elevation="flat">
            <DemoStack>
              <Typography as="h3" scale="title">Publish target</Typography>
              <RadioGroup legend="Where should this release go?" name="publish-target" options={["Preview only", "Staging", "Production"]} />
              <Button type="button">Continue</Button>
            </DemoStack>
          </Card>
          <Card elevation="flat">
            <DemoStack>
              <Typography as="h3" scale="title">Notification mode</Typography>
              <RadioGroup legend="How should the team be notified?" name="notify-mode" options={["Email", "Slack", "Both"]} />
            </DemoStack>
          </Card>
        </DemoGrid>
      </DemoSection>
    </DemoFrame>
  );
}
