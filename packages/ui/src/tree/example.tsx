"use client";

import { Tree } from "./index";
import { DemoFrame } from "../example-theme/demo";

export default function Example() {
  return (
    <>
      <DemoFrame title="Tree" description="Tree should show a small nested hierarchy directly.">
        <Tree>
          <li>color<ul><li>brand</li><li>bg</li><li>fg</li></ul></li>
          <li>spacing<ul><li>base</li><li>sm</li><li>lg</li></ul></li>
        </Tree>
      </DemoFrame>
    </>
  );
}

