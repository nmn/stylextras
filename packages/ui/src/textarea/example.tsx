"use client";

import { Textarea } from "./index";
import { DemoFrame, DemoStack } from "../example-theme/demo";

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Textarea forms"
        description="Textarea should show a short and a longer multiline field."
      >
        <DemoStack>
          <Textarea
            label="Summary"
            rows={4}
            defaultValue="Short multiline content."
          />
          <Textarea
            label="Notes"
            rows={6}
            defaultValue="Longer multiline content helps show the rhythm, spacing, and line height of the component without extra layout noise."
          />
        </DemoStack>
      </DemoFrame>
    </>
  );
}
