"use client";

import { Kbd } from "./index";
import { DemoFrame, DemoRow } from "../example-theme/demo";

export default function Example() {
  return (
    <>
      <DemoFrame title="Shortcuts" description="Kbd should show common shortcut combinations directly.">
        <DemoRow>
          <Kbd>cmd</Kbd><Kbd>k</Kbd>
          <Kbd>cmd</Kbd><Kbd>s</Kbd>
          <Kbd>shift</Kbd><Kbd>enter</Kbd>
        </DemoRow>
      </DemoFrame>
    </>
  );
}

