"use client";

import { ContextMenu } from "./index";
import { DemoFrame, DemoStack } from "../example-theme/demo";

export default function Example() {
  return (
    <>
      <DemoFrame title="Context Menu surface" description="Context Menu needs only a simple trigger and surfaced menu.">
        <DemoStack>
          <button popoverTarget="context-menu-demo" type="button">Open context menu</button>
          <ContextMenu id="context-menu-demo">
            <button role="menuitem" type="button">Rename</button>
            <button role="menuitem" type="button">Duplicate</button>
            <button role="menuitem" type="button">Archive</button>
          </ContextMenu>
        </DemoStack>
      </DemoFrame>
    </>
  );
}

