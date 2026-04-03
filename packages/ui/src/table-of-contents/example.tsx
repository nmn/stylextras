"use client";

import { TableOfContents } from "./index";
import { DemoFrame, DemoSection } from "../example-theme/demo";

export default function Example() {
  return (
    <DemoFrame title="Table Of Contents" description="Use a table of contents for long docs pages where users need quick internal navigation.">
      <DemoSection title="Page outline" description="Keep labels short and structurally meaningful so the list reads well on its own.">
        <TableOfContents title="On this page" items={[{ label: "Overview", href: "#overview" }, { label: "Usage", href: "#usage" }, { label: "Examples", href: "#examples" }, { label: "Accessibility", href: "#accessibility" }]} />
      </DemoSection>
    </DemoFrame>
  );
}

