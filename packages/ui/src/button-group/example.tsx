"use client";

import { Button } from "../button";
import { ButtonGroup } from "./index";
import { DemoFrame, DemoStack } from "../example-theme/demo";

export default function Example() {
  return (
    <>
      <DemoFrame title="Grouped actions" description="Button Group only needs a simple grouped specimen.">
        <DemoStack>
          <ButtonGroup>
            <Button>Approve</Button>
            <Button variant="secondary">Comment</Button>
            <Button variant="outline">Request changes</Button>
          </ButtonGroup>
        </DemoStack>
      </DemoFrame>
    </>
  );
}

