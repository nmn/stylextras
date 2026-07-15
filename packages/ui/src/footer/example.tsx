"use client";

import { Footer } from "./index";
import { DemoFrame } from "../example-theme/demo";
import { Link } from "../link";

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Footer"
        description="Footer should be shown as a simple strip of secondary links."
      >
        <Footer>
          <Link href="#docs">Docs</Link>
          <Link href="#components">Components</Link>
          <Link href="#themes">Themes</Link>
        </Footer>
      </DemoFrame>
    </>
  );
}
