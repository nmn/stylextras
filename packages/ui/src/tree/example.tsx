"use client";

import { Tree } from "./index";
import { DemoFrame } from "../example-theme/demo";

export default function Example() {
  return (
    <DemoFrame
      title="Tree"
      description="Tree should show nested branches with expandable sections."
    >
      <Tree>
        <ul>
          <li>
            tokens
            <ul>
              <li>
                color
                <ul>
                  <li>brand</li>
                  <li>bg</li>
                  <li>fg</li>
                </ul>
              </li>
              <li>
                spacing
                <ul>
                  <li>base</li>
                  <li>sm</li>
                  <li>lg</li>
                </ul>
              </li>
            </ul>
          </li>
          <li>
            components
            <ul>
              <li>button</li>
              <li>card</li>
              <li>dialog</li>
            </ul>
          </li>
        </ul>
      </Tree>
    </DemoFrame>
  );
}
