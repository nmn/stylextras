"use client";

import { Toolbar } from "./index";
import { Button } from "../button";
import { DemoFrame } from "../example-theme/demo";

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Toolbar"
        description="Toolbar should show a short cluster of local actions."
      >
        <Toolbar>
          <Button size="icon" variant="outline" aria-label="Undo">U</Button>
          <Button size="icon" variant="outline" aria-label="Redo">R</Button>
          <Button variant="secondary">Preview</Button>
          <Button>Publish</Button>
        </Toolbar>
      </DemoFrame>
    </>
  );
}
