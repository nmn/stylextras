"use client";

import { CopyToClipboardButton } from "./index";
import { DemoFrame, DemoRow } from "../example-theme/demo";

export default function Example() {
  return (
    <>
      <DemoFrame title="Copy actions" description="Copy To Clipboard Button is simplest when shown as a direct utility control.">
        <DemoRow>
          <CopyToClipboardButton value="npx create-stylextras app">Copy command</CopyToClipboardButton>
          <CopyToClipboardButton value="@stylextras/ui" copiedChildren="Copied package">Copy package name</CopyToClipboardButton>
        </DemoRow>
      </DemoFrame>
    </>
  );
}

