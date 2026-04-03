"use client";

import { DateField } from "./index";
import { DemoFrame, DemoRow } from "../example-theme/demo";

export default function Example() {
  return (
    <>
      <DemoFrame title="Date fields" description="Date Field is best shown as a pair of simple date inputs.">
        <DemoRow>
          <DateField aria-label="Start date" defaultValue="2026-04-10" />
          <DateField aria-label="End date" defaultValue="2026-04-18" />
        </DemoRow>
      </DemoFrame>
    </>
  );
}

