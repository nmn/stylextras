"use client";

import { Button } from "../button";
import { Drawer } from "./index";
import { DemoFrame, DemoStack } from "../example-theme/demo";
import { Typography } from "../typography";

export default function Example() {
  return (
    <>
      <DemoFrame title="Drawer" description="Drawer should read as an adjacent task surface, not a full page.">
        <Drawer open>
          <DemoStack>
            <Typography as="h3" scale="title">Page settings</Typography>
            <span>Use a drawer for local settings that should stay near the current page context.</span>
            <Button>Save changes</Button>
          </DemoStack>
        </Drawer>
      </DemoFrame>
    </>
  );
}

