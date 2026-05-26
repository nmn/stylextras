"use client";

import { Toggle } from "./index";
import { DemoFrame, DemoRow } from "../example-theme/demo";

export default function Example() {
  return (
    <DemoFrame
      title="Toggle states"
      description="Toggle buttons should act like on-off controls."
    >
      <DemoRow>
        <Toggle defaultChecked>Bold</Toggle>
        <Toggle>Italic</Toggle>
        <Toggle>Code</Toggle>
        <Toggle disabled defaultChecked>
          Locked
        </Toggle>
      </DemoRow>
    </DemoFrame>
  );
}
