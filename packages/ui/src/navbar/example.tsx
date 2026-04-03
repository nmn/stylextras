"use client";

import { Navbar } from "./index";
import { Link } from "../link";
import { DemoFrame, DemoSection } from "../example-theme/demo";

export default function Example() {
  return (
    <DemoFrame title="Navbar" description="A simple top navigation shell for site-level movement and global actions.">
      <DemoSection title="Primary navigation" description="Keep the nav narrow in purpose. If every action lands here, the bar loses meaning fast.">
        <Navbar>
          <Link href="#docs">Docs</Link>
          <Link href="#components">Components</Link>
          <Link href="#themes">Themes</Link>
          <Link href="#github">GitHub</Link>
        </Navbar>
      </DemoSection>
    </DemoFrame>
  );
}

