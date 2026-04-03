"use client";

import { Sidebar } from "./index";
import { DemoFrame } from "../example-theme/demo";
import { Link } from "../link";

export default function Example() {
  return (
    <>
      <DemoFrame title="Sidebar" description="Sidebar should show a simple vertical navigation list.">
        <Sidebar>
          <Link href="#buttons">Buttons</Link>
          <Link href="#form">Form</Link>
          <Link href="#navigation">Navigation</Link>
          <Link href="#overlays">Overlays</Link>
        </Sidebar>
      </DemoFrame>
    </>
  );
}

