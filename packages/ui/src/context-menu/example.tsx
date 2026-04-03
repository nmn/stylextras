"use client";

import { ContextMenu } from "./index";
import { DemoFrame, DemoRow, DemoSection } from "../example-theme/demo";

export default function Example() {
  return (
    <DemoFrame title="Context Menu" description="The component renders the surfaced menu. The caller owns how and when it opens.">
      <DemoSection title="Manual invocation" description="Use a trigger button or another explicit affordance rather than relying on pointer-only interaction.">
        <DemoRow>
          <button popoverTarget="context-menu-demo" type="button">Open actions</button>
          <ContextMenu id="context-menu-demo">
            <button role="menuitem" type="button">Rename</button>
            <button role="menuitem" type="button">Duplicate</button>
            <button role="menuitem" type="button">Archive</button>
          </ContextMenu>
        </DemoRow>
      </DemoSection>
    </DemoFrame>
  );
}

