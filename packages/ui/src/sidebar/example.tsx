"use client";

import { Sidebar } from "./index";
import { Link } from "../link";
import { DemoFrame, DemoSection } from "../example-theme/demo";

export default function Example() {
  return (
    <DemoFrame title="Sidebar" description="Use a sidebar for persistent navigation, filters, or a stable table of contents.">
      <DemoSection title="Docs navigation" description="A sidebar should keep the hierarchy clear without trying to become a second content column.">
        <Sidebar>
          <Link href="#buttons">Buttons</Link>
          <Link href="#forms">Form</Link>
          <Link href="#navigation">Navigation</Link>
          <Link href="#overlays">Overlays</Link>
        </Sidebar>
      </DemoSection>
    </DemoFrame>
  );
}

