"use client";

import { AlertCallout } from "./index";
import { Button } from "../button";
import { ButtonGroup } from "../button-group";
import { Card } from "../card";
import { DemoFrame, DemoGrid, DemoMuted, DemoSection, DemoStack } from "../example-theme/demo";
import { Typography } from "../typography";

export default function Example() {
  return (
    <DemoFrame title="Alert Callout" description="Alerts are most convincing when they are placed inside the kind of workflow that would actually produce them. These examples focus on message tone and the next action.">
      <DemoSection title="Operational states" description="Keep alert copy short and action-oriented. The user should know what happened and what to do next in one scan.">
        <DemoGrid>
          <AlertCallout variant="neutral">
            <DemoStack>
              <Typography as="strong" scale="label">Preview build queued</Typography>
              <DemoMuted>A new preview deployment will be available in a minute.</DemoMuted>
            </DemoStack>
          </AlertCallout>
          <AlertCallout variant="success">
            <DemoStack>
              <Typography as="strong" scale="label">Theme saved</Typography>
              <DemoMuted>The new radius and spacing settings are already applied in the docs preview.</DemoMuted>
            </DemoStack>
          </AlertCallout>
          <AlertCallout variant="warning">
            <DemoStack>
              <Typography as="strong" scale="label">Missing docs coverage</Typography>
              <DemoMuted>Several new components ship without narrative guidance yet.</DemoMuted>
            </DemoStack>
          </AlertCallout>
          <AlertCallout variant="danger">
            <DemoStack>
              <Typography as="strong" scale="label">Breaking export change</Typography>
              <DemoMuted>An alias path was removed and downstream imports may fail until they are updated.</DemoMuted>
            </DemoStack>
          </AlertCallout>
        </DemoGrid>
      </DemoSection>

      <DemoSection title="Callout with follow-up actions" description="The alert surface becomes more useful when it is tied directly to the action the user is expected to take next.">
        <Card elevation="flat">
          <DemoStack>
            <AlertCallout variant="info">
              <DemoStack>
                <Typography as="strong" scale="label">Token migration required</Typography>
                <DemoMuted>The spacing foundation changed, and two example pages still need to be reviewed for visual regressions.</DemoMuted>
              </DemoStack>
            </AlertCallout>
            <ButtonGroup>
              <Button type="button">Open affected pages</Button>
              <Button type="button">Dismiss for now</Button>
            </ButtonGroup>
          </DemoStack>
        </Card>
      </DemoSection>
    </DemoFrame>
  );
}
