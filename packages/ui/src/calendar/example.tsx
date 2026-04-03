"use client";

import { Calendar } from "./index";
import { DemoFrame, DemoRow, DemoSection } from "../example-theme/demo";

export default function Example() {
  return (
    <DemoFrame title="Calendar" description="The current implementation uses the native date input to keep the interaction model small and predictable.">
      <DemoSection title="Choose a launch date" description="Native date controls are a good baseline for lightweight admin flows.">
        <DemoRow>
          <Calendar aria-label="Launch date" defaultValue="2026-04-15" />
          <Calendar aria-label="Review date" defaultValue="2026-04-22" />
        </DemoRow>
      </DemoSection>
    </DemoFrame>
  );
}

