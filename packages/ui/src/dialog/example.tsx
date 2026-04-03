"use client";

import { Button } from "../button";
import { ButtonGroup } from "../button-group";
import { Dialog } from "./index";
import { DemoFrame, DemoStack } from "../example-theme/demo";
import { TextField } from "../text-field";
import { Typography } from "../typography";

export default function Example() {
  return (
    <>
      <DemoFrame title="Editing dialog" description="Dialog should be shown as a focused sheet with just enough structure to understand its role.">
        <Dialog open>
          <DemoStack>
            <Typography as="h3" scale="title">Rename component</Typography>
            <TextField label="Display name" defaultValue="Segmented Control" />
            <ButtonGroup>
              <Button>Save</Button>
              <Button variant="secondary">Cancel</Button>
            </ButtonGroup>
          </DemoStack>
        </Dialog>
      </DemoFrame>
    </>
  );
}

