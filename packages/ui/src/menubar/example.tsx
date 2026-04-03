"use client";

import { Menubar } from "./index";
import { DemoFrame } from "../example-theme/demo";
import { Button } from "../button";

export default function Example() {
  return (
    <>
      <DemoFrame title="Top-level menu buttons" description="Menubar only needs a simple row of menu triggers.">
        <Menubar>
          <Button>File</Button>
          <Button variant="secondary">Edit</Button>
          <Button variant="secondary">View</Button>
          <Button variant="secondary">Help</Button>
        </Menubar>
      </DemoFrame>
    </>
  );
}

