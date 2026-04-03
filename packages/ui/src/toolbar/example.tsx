"use client";

import { Toolbar } from "./index";
import { Button } from "../button";
import { IconButton } from "../icon-button";
import { DemoFrame } from "../example-theme/demo";

export default function Example() {
  return (
    <>
      <DemoFrame title="Toolbar" description="Toolbar should show a short cluster of local actions.">
        <Toolbar>
          <IconButton aria-label="Undo">U</IconButton>
          <IconButton aria-label="Redo">R</IconButton>
          <Button variant="secondary">Preview</Button>
          <Button>Publish</Button>
        </Toolbar>
      </DemoFrame>
    </>
  );
}

