"use client";

import { Button } from "../button";
import { ButtonGroupActions } from "../button-group";
import { DemoFrame, DemoStack } from "../example-theme/demo";
import { TextField } from "../text-field";
import { Typography } from "../typography";
import { DialogContent, type DialogContentProps, DialogTrigger } from "./index";

function DialogExampleContent(props: DialogContentProps) {
  return (
    <DialogContent {...props}>
      <DemoStack>
        <Typography as="h3" scale="title">
          Rename component
        </Typography>
        <TextField label="Display name" defaultValue="Segmented Control" />
        <form method="dialog">
          <ButtonGroupActions
            secondary={
              <Button type="submit" variant="secondary">
                Cancel
              </Button>
            }
            primary={<Button type="submit">Save</Button>}
          />
        </form>
      </DemoStack>
    </DialogContent>
  );
}

export default function Example() {
  return (
    <DemoFrame
      title="Editing dialog"
      description="Click the trigger to open the dialog."
    >
      <DialogTrigger content={() => Promise.resolve(DialogExampleContent)}>
        Open dialog
      </DialogTrigger>
    </DemoFrame>
  );
}
