"use client";

import { Button } from "../button";
import { Card } from "../card";
import { Checkbox } from "../checkbox";
import { Combobox } from "./index";
import { DemoFrame, DemoGrid, DemoMuted, DemoSection, DemoStack } from "../example-theme/demo";
import { Typography } from "../typography";

export default function Example() {
  return (
    <DemoFrame title="Combobox" description="A combobox example is more useful when it shows the surrounding decision flow. These demos place the control inside assignment and filtering tasks rather than treating it like a standalone input.">
      <DemoSection title="Assign a reviewer" description="The combobox works best when the list is small, familiar, and tied to a concrete task nearby.">
        <DemoGrid>
          <Card elevation="flat">
            <DemoStack>
              <Typography as="h3" scale="title">Review setup</Typography>
              <Combobox label="Primary reviewer" listId="reviewers" options={["Alex Kim", "Taylor Rivera", "Jordan Patel", "Sam Lee"]} />
              <Checkbox defaultChecked label="Request review immediately" />
              <Button type="button">Assign reviewer</Button>
            </DemoStack>
          </Card>
          <Card elevation="flat">
            <DemoStack>
              <Typography as="h3" scale="title">When to use it</Typography>
              <DemoMuted>Use a combobox when the user benefits from a familiar list with a bit of input flexibility, but the option set is still bounded and easy to understand.</DemoMuted>
            </DemoStack>
          </Card>
        </DemoGrid>
      </DemoSection>
    </DemoFrame>
  );
}
