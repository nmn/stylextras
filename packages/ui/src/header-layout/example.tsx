"use client";

import { HeaderLayout } from "./index";
import { DemoFrame, DemoStack } from "../example-theme/demo";
import { Button } from "../button";

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Header and content"
        description="Header Layout is best shown as a shell with a simple header and body."
      >
        <HeaderLayout header={<Button>Back</Button>}>
          <DemoStack>
            <strong>Page content</strong>
            <span>
              This layout keeps the header visually separate from the main
              content.
            </span>
          </DemoStack>
        </HeaderLayout>
      </DemoFrame>
    </>
  );
}
