"use client";

import { Form } from "./index";
import { DemoFrame, DemoStack } from "../example-theme/demo";
import { TextField } from "../text-field";
import { Button } from "../button";

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Simple form"
        description="Form is one of the cases where a small composition is intrinsic to the component."
      >
        <Form>
          <DemoStack>
            <TextField label="Name" placeholder="Workspace name" />
            <TextField label="Slug" placeholder="workspace-name" />
            <Button type="submit">Create workspace</Button>
          </DemoStack>
        </Form>
      </DemoFrame>
    </>
  );
}
