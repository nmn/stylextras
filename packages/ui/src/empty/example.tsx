"use client";

import { Empty } from "./index";
import { Button } from "../button";
import { DemoFrame, DemoSection } from "../example-theme/demo";

export default function Example() {
  return (
    <DemoFrame title="Empty" description="Use an empty state to explain what is missing and what the user should do next.">
      <DemoSection title="No components yet" description="The best empty states reduce ambiguity and offer a single obvious next action.">
        <Empty>
          <strong>No components in this collection</strong>
          <p>Create the first component to start building a reusable UI kit.</p>
          <Button type="button">Create component</Button>
        </Empty>
      </DemoSection>
    </DemoFrame>
  );
}

