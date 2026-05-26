"use client";

import { Button } from "../button";
import { ButtonGroupActions } from "../button-group";
import { DemoFrame, DemoStack } from "../example-theme/demo";
import { Typography } from "../typography";
import {
  AlertDialogContent,
  type AlertDialogContentProps,
  AlertDialogTrigger,
} from "./index";

function AlertDialogExampleContent(props: AlertDialogContentProps) {
  return (
    <AlertDialogContent {...props}>
      <DemoStack>
        <Typography as="h3" scale="title">
          Delete draft?
        </Typography>
        <span>This action cannot be undone.</span>
        <form method="dialog">
          <ButtonGroupActions
            secondary={
              <Button variant="secondary" type="submit">
                Cancel
              </Button>
            }
            primary={
              <Button variant="danger" type="submit">
                Delete
              </Button>
            }
          />
        </form>
      </DemoStack>
    </AlertDialogContent>
  );
}

export default function Example() {
  return (
    <DemoFrame
      title="Confirmation"
      description="Alert Dialog is easiest to evaluate as a direct confirmation surface."
    >
      <AlertDialogTrigger
        content={() => Promise.resolve(AlertDialogExampleContent)}
        variant="primary"
      >
        Open Dialog
      </AlertDialogTrigger>
    </DemoFrame>
  );
}
