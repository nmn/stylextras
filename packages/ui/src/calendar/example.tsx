"use client";

import { Calendar } from "./index";
import { DemoFrame, DemoRow } from "../example-theme/demo";

export default function Example() {
  return (
    <>
      <DemoFrame title="Native date inputs" description="Calendar is currently a lightweight date-input wrapper.">
        <DemoRow>
          <Calendar aria-label="Start date" defaultValue="2026-04-10" />
          <Calendar aria-label="Review date" defaultValue="2026-04-18" />
        </DemoRow>
      </DemoFrame>
    </>
  );
}

