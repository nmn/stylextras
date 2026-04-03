"use client";

import { Footer } from "./index";
import { Link } from "../link";
import { DemoFrame, DemoSection } from "../example-theme/demo";

export default function Example() {
  return (
    <DemoFrame title="Footer" description="Footers hold low-frequency navigation, legal context, and secondary site information.">
      <DemoSection title="Site footer" description="Keep the footer useful, but avoid turning it into a duplicate of the primary navigation.">
        <Footer>
          <Link href="#docs">Docs</Link>
          <Link href="#components">Components</Link>
          <Link href="#themes">Themes</Link>
          <Link href="#github">GitHub</Link>
        </Footer>
      </DemoSection>
    </DemoFrame>
  );
}

