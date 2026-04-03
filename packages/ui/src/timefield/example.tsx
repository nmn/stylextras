"use client";

import { Timefield } from "./index";
import { DemoFrame, DemoRow, DemoSection } from "../example-theme/demo";

export default function Example() {
  return (
    <DemoFrame title="Timefield" description="A token-styled native time input for schedules, reminders, and publishing windows.">
      <DemoSection title="Office hours" description="Time inputs work well when the user already thinks in concrete clock times rather than fuzzy durations.">
        <DemoRow>
          <Timefield aria-label="Start time" defaultValue="09:30" />
          <Timefield aria-label="End time" defaultValue="17:30" />
        </DemoRow>
      </DemoSection>
    </DemoFrame>
  );
}

