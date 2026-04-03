"use client";

import { FileDropZone } from "./index";
import { DemoFrame, DemoSection } from "../example-theme/demo";

export default function Example() {
  return (
    <DemoFrame title="File Drop Zone" description="A light native wrapper for drag-and-drop or click-to-upload flows.">
      <DemoSection title="Asset upload" description="Use direct language so the user knows the accepted file types and the expected outcome.">
        <FileDropZone label="Drop images here or click to browse" />
      </DemoSection>
    </DemoFrame>
  );
}

