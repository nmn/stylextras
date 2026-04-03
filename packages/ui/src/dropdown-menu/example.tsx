"use client";

import { DropdownMenu } from "./index";
import { DemoFrame, DemoStack } from "../example-theme/demo";

export default function Example() {
  return (
    <>
      <DemoFrame title="Menu surface" description="Dropdown Menu is easiest to evaluate as a direct trigger-and-surface example.">
        <DemoStack>
          <DropdownMenu label="Actions">
            <button role="menuitem" type="button">Open page</button>
            <button role="menuitem" type="button">Duplicate</button>
            <button role="menuitem" type="button">Archive</button>
          </DropdownMenu>
        </DemoStack>
      </DemoFrame>
    </>
  );
}

