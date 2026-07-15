"use client";

import { ColorField } from "./index";
import { DemoFrame, DemoRow } from "../example-theme/demo";

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Color Field"
        description="Color Field is simplest when shown as a row of native color inputs."
      >
        <DemoRow>
          <ColorField aria-label="Blue" defaultValue="#2563eb" />
          <ColorField aria-label="Pink" defaultValue="#ec4899" />
          <ColorField aria-label="Orange" defaultValue="#ea580c" />
        </DemoRow>
      </DemoFrame>
    </>
  );
}
