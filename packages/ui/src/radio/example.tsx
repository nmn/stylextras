"use client";

import { Radio } from "./index";
import { DemoFrame, DemoStack } from "../example-theme/demo";

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Radio options"
        description="Radio should show a simple set of single-choice options."
      >
        <fieldset>
          <legend>Publish target</legend>
          <DemoStack>
            <Radio name="publish-target" defaultChecked label="Preview only" />
            <Radio name="publish-target" label="Staging" />
            <Radio name="publish-target" label="Production" />
          </DemoStack>
        </fieldset>
      </DemoFrame>
    </>
  );
}
