"use client";

import { DateField } from "./index";
import { DemoFrame, DemoRow, DemoSection } from "../example-theme/demo";

export default function Example() {
  return (
    <DemoFrame title="Date Field" description="A small native date field wrapper for forms and admin tooling.">
      <DemoSection title="Publishing window" description="Pair start and end dates when the user is setting a bounded range.">
        <DemoRow>
          <DateField aria-label="Publish date" defaultValue="2026-05-01" />
          <DateField aria-label="Archive date" defaultValue="2026-06-01" />
        </DemoRow>
      </DemoSection>
    </DemoFrame>
  );
}

