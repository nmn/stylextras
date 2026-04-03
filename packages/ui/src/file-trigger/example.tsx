"use client";

import { FileTrigger } from "./index";
import { DemoFrame, DemoRow } from "../example-theme/demo";

export default function Example() {
  return (
    <>
      <DemoFrame title="File triggers" description="File Trigger works as a compact file-selection control.">
        <DemoRow>
          <FileTrigger label="Choose image" accept="image/*" />
          <FileTrigger label="Choose JSON" accept="application/json" />
        </DemoRow>
      </DemoFrame>
    </>
  );
}

