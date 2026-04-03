"use client";

import { Toggle } from "./index";
import { DemoFrame, DemoRow } from "../example-theme/demo";

export default function Example() {
  return (
    <>
      <DemoFrame title="Pressed states" description="Toggle should show pressed and unpressed forms side by side.">
        <DemoRow>
          <Toggle pressed>Bold</Toggle>
          <Toggle>Italic</Toggle>
          <Toggle>Code</Toggle>
        </DemoRow>
      </DemoFrame>
    </>
  );
}

