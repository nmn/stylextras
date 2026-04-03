"use client";

import { Button } from "../button";
import { Checkbox } from "../checkbox";
import { Form } from "./index";
import { DemoFrame, DemoGrid, DemoSection, DemoStack } from "../example-theme/demo";
import { Select } from "../select";
import { TextField } from "../text-field";
import { Typography } from "../typography";

export default function Example() {
  return (
    <DemoFrame title="Form" description="A convincing form example uses several controls together so the layout, spacing, and action hierarchy are all visible.">
      <DemoSection title="Create workspace" description="This demo combines text input, select, and checkbox controls inside one focused task flow.">
        <DemoGrid>
          <Form>
            <DemoStack>
              <Typography as="h3" scale="title">Workspace details</Typography>
              <TextField label="Workspace name" placeholder="Marketing site" />
              <Select label="Environment" options={["Development", "Preview", "Production"]} />
              <Checkbox defaultChecked label="Create starter documentation pages" />
              <Button type="submit">Create workspace</Button>
            </DemoStack>
          </Form>
          <DemoStack>
            <Typography as="h3" scale="title">Why this works</Typography>
            <span>The example shows how multiple primitives sit together in one real task instead of treating the form wrapper as an empty box.</span>
          </DemoStack>
        </DemoGrid>
      </DemoSection>
    </DemoFrame>
  );
}
