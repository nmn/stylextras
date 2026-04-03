"use client";

import { Timefield } from "./index";
import { DemoFrame, DemoRow } from "../example-theme/demo";

export default function Example() {
  return (
    <>
      <DemoFrame title="Time inputs" description="Timefield is currently a native time input wrapper.">
        <DemoRow>
          <Timefield aria-label="Start time" defaultValue="09:30" />
          <Timefield aria-label="End time" defaultValue="17:30" />
        </DemoRow>
      </DemoFrame>
    </>
  );
}

