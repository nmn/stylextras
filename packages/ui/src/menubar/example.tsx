"use client";

import { Menubar } from "./index";
import { Button } from "../button";
import { DemoFrame, DemoSection } from "../example-theme/demo";

export default function Example() {
  return (
    <DemoFrame title="Menubar" description="Use a menubar layout when several top-level actions need to sit in a single horizontal command strip.">
      <DemoSection title="Editor menu" description="This implementation is intentionally lightweight and closer to a styled action bar than a full desktop-style menubar system.">
        <Menubar>
          <Button type="button">File</Button>
          <Button type="button">Edit</Button>
          <Button type="button">View</Button>
          <Button type="button">Help</Button>
        </Menubar>
      </DemoSection>
    </DemoFrame>
  );
}

