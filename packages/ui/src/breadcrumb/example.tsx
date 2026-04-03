"use client";

import { Breadcrumb } from "./index";
import { DemoFrame, DemoSection } from "../example-theme/demo";

export default function Example() {
  return (
    <DemoFrame title="Breadcrumb" description="A compact path for showing where a screen sits inside a larger product hierarchy.">
      <DemoSection title="Project hierarchy" description="Use concise labels and keep the final item to the current page.">
        <Breadcrumb items={[{ label: "Workspace", href: "#workspace" }, { label: "Design System", href: "#design-system" }, { label: "Buttons" }]} />
      </DemoSection>
    </DemoFrame>
  );
}

