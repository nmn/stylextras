"use client";

import { AlertDialog } from "./index";
import { Button } from "../button";
import { ButtonGroup } from "../button-group";
import { DemoFrame, DemoSection, DemoStack } from "../example-theme/demo";

export default function Example() {
  return (
    <DemoFrame title="Alert Dialog" description="A native dialog surface used for higher-friction confirmation states.">
      <DemoSection title="Destructive confirmation" description="Keep the content concise and pair the action with clear next steps.">
        <AlertDialog open>
          <DemoStack>
            <strong>Delete project</strong>
            <p>This action removes the workspace, preview data, and saved invites.</p>
            <ButtonGroup>
              <Button type="button">Cancel</Button>
              <Button type="button">Delete project</Button>
            </ButtonGroup>
          </DemoStack>
        </AlertDialog>
      </DemoSection>
    </DemoFrame>
  );
}

