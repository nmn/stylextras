"use client";

import { Separator } from "./index";
import { DemoFrame, DemoRow, DemoStack } from "../example-theme/demo";

export default function Example() {
  return (
    <>
      <DemoFrame title="Horizontal and vertical" description="Separator should show both orientations plainly.">
        <DemoStack>
          <span>Above</span>
          <Separator />
          <span>Below</span>
        </DemoStack>
      </DemoFrame>
      <DemoFrame title="Vertical" description="A second frame shows the vertical form." showThemes={false}>
        <DemoRow>
          <span>Left</span>
          <Separator orientation="vertical" />
          <span>Right</span>
        </DemoRow>
      </DemoFrame>
    </>
  );
}

