"use client";

import { FileDropZone } from "./index";
import { DemoFrame, DemoStack } from "../example-theme/demo";

export default function Example() {
  return (
    <>
      <DemoFrame title="Drop zones" description="File Drop Zone should stay simple and direct in the example.">
        <DemoStack>
          <FileDropZone label="Drop images here or click to browse" />
          <FileDropZone label="Drop JSON files here or click to browse" />
        </DemoStack>
      </DemoFrame>
    </>
  );
}

