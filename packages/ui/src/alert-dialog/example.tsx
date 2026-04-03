"use client";

import { AlertDialog } from "./index";
import { Button } from "../button";
import { ButtonGroup } from "../button-group";
import { DemoFrame, DemoStack } from "../example-theme/demo";
import { Typography } from "../typography";

export default function Example() {
  return (
    <>
      <DemoFrame title="Confirmation" description="Alert Dialog is easiest to evaluate as a direct confirmation surface.">
        <AlertDialog open>
          <DemoStack>
            <Typography as="h3" scale="title">Delete draft?</Typography>
            <span>This action cannot be undone.</span>
            <ButtonGroup>
              <Button type="button">Cancel</Button>
              <Button type="button">Delete</Button>
            </ButtonGroup>
          </DemoStack>
        </AlertDialog>
      </DemoFrame>
    </>
  );
}

