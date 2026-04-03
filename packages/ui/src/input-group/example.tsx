"use client";

import { InputGroup } from "./index";
import { Button } from "../button";
import { TextField } from "../text-field";
import { DemoFrame, DemoSection } from "../example-theme/demo";

export default function Example() {
  return (
    <DemoFrame title="Input Group" description="Use an input group when several controls form one compact task, such as search or invite entry.">
      <DemoSection title="Invite by email" description="The layout wrapper keeps related fields visually connected without imposing extra semantics.">
        <InputGroup>
          <TextField label="Invite email" placeholder="teammate@example.com" />
          <Button type="button">Invite</Button>
        </InputGroup>
      </DemoSection>
    </DemoFrame>
  );
}

