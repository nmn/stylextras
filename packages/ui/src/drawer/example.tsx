"use client";

import { Button } from "../button";
import { ButtonGroup } from "../button-group";
import { DemoFrame, DemoStack } from "../example-theme/demo";
import { Typography } from "../typography";
import { DrawerContent, type DrawerContentProps, DrawerTrigger } from "./index";

function DrawerExampleContent(props: DrawerContentProps) {
  return (
    <DrawerContent {...props}>
      <DemoStack>
        <Typography as="h3" scale="title">
          Page settings
        </Typography>
        <span>
          Use a drawer for nearby controls without leaving the current page.
        </span>
        <form method="dialog">
          <ButtonGroup>
            <Button type="submit" variant="secondary">
              Close
            </Button>
            <Button type="submit">Save changes</Button>
          </ButtonGroup>
        </form>
      </DemoStack>
    </DrawerContent>
  );
}

export default function Example() {
  return (
    <DemoFrame
      title="Drawer"
      description="Click the trigger to open the drawer."
    >
      <DrawerTrigger content={() => Promise.resolve(DrawerExampleContent)}>
        Open drawer
      </DrawerTrigger>
    </DemoFrame>
  );
}
