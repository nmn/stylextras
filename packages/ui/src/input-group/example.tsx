"use client";

import { InputGroup } from "./index";
import { DemoFrame } from "../example-theme/demo";
import { TextField } from "../text-field";
import { Button } from "../button";

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Grouped input"
        description="Input Group is another case where minimal composition is the point of the component."
      >
        <InputGroup>
          <TextField label="Invite email" placeholder="teammate@example.com" />
          <Button>Invite</Button>
        </InputGroup>
      </DemoFrame>
    </>
  );
}
