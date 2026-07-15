"use client";

import { TableOfContents } from "./index";
import { DemoFrame } from "../example-theme/demo";

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Outline"
        description="Table Of Contents should show a compact page outline."
      >
        <TableOfContents
          title="On this page"
          items={[
            { label: "Overview", href: "#overview" },
            { label: "Usage", href: "#usage" },
            { label: "Examples", href: "#examples" },
            { label: "Accessibility", href: "#accessibility" },
          ]}
        />
      </DemoFrame>
    </>
  );
}
