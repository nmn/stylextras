"use client";

import { Button } from "../button";
import { ButtonGroupActions } from "../button-group";
import { DemoFrame, DemoStack } from "../example-theme/demo";
import { Typography } from "../typography";
import {
  DialogTrigger,
  DrawerContent,
  type DrawerContentProps,
} from "../dialog";

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
          <ButtonGroupActions
            secondary={
              <Button type="submit" variant="secondary">
                Close
              </Button>
            }
            primary={<Button type="submit">Save changes</Button>}
          />
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
      <DialogTrigger content={() => Promise.resolve(DrawerExampleContent)}>
        Open drawer
      </DialogTrigger>
    </DemoFrame>
  );
}
