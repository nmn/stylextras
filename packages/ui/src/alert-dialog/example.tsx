"use client";

import { AlertDialog } from "./index";
import { Button } from "../button";
import { ButtonGroup } from "../button-group";
import { DemoFrame, DemoStack } from "../example-theme/demo";
import { Typography } from "../typography";
import { useRef } from "react";

export default function Example() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <DemoFrame
        title="Confirmation"
        description="Alert Dialog is easiest to evaluate as a direct confirmation surface."
      >
        <Button
          onClick={() => {
            // @ts-expect-error - showModal is not a property of HTMLDialogElement
            dialogRef.current?.showModal();
          }}
        >
          Open Dialog
        </Button>
        <AlertDialog ref={dialogRef}>
          <DemoStack>
            <Typography as="h3" scale="title">
              Delete draft?
            </Typography>
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
