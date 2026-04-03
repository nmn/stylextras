"use client";

import { WindowSplitter } from "./index";
import { DemoFrame, DemoSection } from "../example-theme/demo";

export default function Example() {
  return (
    <DemoFrame title="Window Splitter" description="Use a splitter when two adjacent panes need a clear visual boundary and potential future resizability.">
      <DemoSection title="Editor layout" description="Even as a simple primitive, the splitter helps communicate the two-pane structure of the interface.">
        <WindowSplitter orientation="vertical" />
      </DemoSection>
    </DemoFrame>
  );
}

