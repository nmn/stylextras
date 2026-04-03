"use client";

import { Tree } from "./index";
import { DemoFrame, DemoSection } from "../example-theme/demo";

export default function Example() {
  return (
    <DemoFrame title="Tree" description="Use trees when the content is inherently hierarchical and users need to read or traverse nested levels.">
      <DemoSection title="Token hierarchy" description="Keep the structure shallow enough that the nesting remains legible and the labels stay meaningful.">
        <Tree>
          <li>color
            <ul>
              <li>brand</li>
              <li>bg</li>
              <li>fg</li>
            </ul>
          </li>
          <li>spacing
            <ul>
              <li>base</li>
              <li>sm</li>
              <li>lg</li>
            </ul>
          </li>
        </Tree>
      </DemoSection>
    </DemoFrame>
  );
}

