"use client";

import { Calendar } from "./index";
import { DemoFrame } from "../example-theme/demo";

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Release calendar"
        description="An Intl-backed calendar grid with roving focus and bounded date selection."
      >
        <Calendar
          aria-label="Choose a release date"
          defaultValue="2026-07-11"
          min="2026-07-01"
          max="2026-08-31"
        />
      </DemoFrame>
    </>
  );
}
