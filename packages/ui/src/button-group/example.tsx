"use client";

import { Button } from "../button";
import { IconButton } from "../icon-button";
import { ButtonGroup, ButtonGroupActions } from "./index";
import { DemoFrame, DemoStack } from "../example-theme/demo";

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Grouped actions"
        description="Button Group only needs a simple grouped specimen."
      >
        <DemoStack>
          <ButtonGroup>
            <Button>Approve</Button>
            <Button variant="secondary">Comment</Button>
            <Button variant="outline">Request changes</Button>
          </ButtonGroup>
        </DemoStack>
      </DemoFrame>
      <DemoFrame
        title="Dialog actions"
        description="Action rows keep the primary and secondary buttons equal width and aligned to the end."
      >
        <DemoStack>
          <ButtonGroupActions
            secondary={
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            }
            primary={<Button type="button">Save changes</Button>}
          />
          <ButtonGroupActions
            leading={
              <IconButton label="More actions" type="button">
                +
              </IconButton>
            }
            secondary={
              <Button type="button" variant="secondary">
                Back
              </Button>
            }
            primary={<Button type="button">Continue</Button>}
          />
        </DemoStack>
      </DemoFrame>
    </>
  );
}
