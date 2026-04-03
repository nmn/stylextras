"use client";

import { AlertCallout } from "../alert-callout";
import { Button } from "../button";
import { ButtonGroup } from "../button-group";
import { Dialog } from "./index";
import { DemoFrame, DemoGrid, DemoSection, DemoStack } from "../example-theme/demo";
import { TextField } from "../text-field";
import { Typography } from "../typography";

export default function Example() {
  return (
    <DemoFrame title="Dialog" description="Dialog examples should show concrete task boundaries. These demos use one dialog for inline editing and another for a stronger confirmation moment.">
      <DemoSection title="Editing dialog" description="This example shows a focused editing task with form controls, a contextual warning, and the actions needed to finish or cancel.">
        <DemoGrid>
          <Dialog open>
            <DemoStack>
              <Typography as="h3" scale="title">Rename component</Typography>
              <TextField label="Display name" defaultValue="Segmented Control" />
              <AlertCallout variant="warning">Updating the display name does not change the package import path.</AlertCallout>
              <ButtonGroup>
                <Button type="button">Save</Button>
                <Button type="button">Cancel</Button>
              </ButtonGroup>
            </DemoStack>
          </Dialog>
          <DemoStack>
            <Typography as="h3" scale="title">Why this works</Typography>
            <span>The dialog contains a self-contained task, short supporting copy, and explicit next actions.</span>
          </DemoStack>
        </DemoGrid>
      </DemoSection>

      <DemoSection title="Confirmation dialog" description="A second example helps show when a dialog should be simpler and more interruptive: confirming an irreversible action.">
        <DemoGrid>
          <Dialog open>
            <DemoStack>
              <Typography as="h3" scale="title">Delete release notes draft?</Typography>
              <span>This removes the draft and its pending comments. The action cannot be undone.</span>
              <ButtonGroup>
                <Button type="button">Keep draft</Button>
                <Button type="button">Delete draft</Button>
              </ButtonGroup>
            </DemoStack>
          </Dialog>
          <DemoStack>
            <Typography as="h3" scale="title">When to use this pattern</Typography>
            <span>Use a shorter dialog like this when the user mostly needs to confirm intent rather than edit several fields.</span>
          </DemoStack>
        </DemoGrid>
      </DemoSection>
    </DemoFrame>
  );
}
