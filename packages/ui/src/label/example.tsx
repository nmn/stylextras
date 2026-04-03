"use client";

import { Label } from "./index";
import { TextField } from "../text-field";
import { DemoFrame, DemoSection, DemoStack } from "../example-theme/demo";

export default function Example() {
  return (
    <DemoFrame title="Label" description="Use Label for compact field associations and standalone metadata chips.">
      <DemoSection title="Field labeling" description="Keep labels close to the control and make the wording specific to the task.">
        <DemoStack>
          <Label htmlFor="project-name-label-demo">Project name</Label>
          <TextField id="project-name-label-demo" label="Project name" placeholder="Apollo" />
        </DemoStack>
      </DemoSection>
    </DemoFrame>
  );
}

