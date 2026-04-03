"use client";

import { Drawer } from "./index";
import { Button } from "../button";
import { DemoFrame, DemoSection, DemoStack } from "../example-theme/demo";

export default function Example() {
  return (
    <DemoFrame title="Drawer" description="Use a drawer for adjacent tasks that should not fully replace the current page context.">
      <DemoSection title="Inspector panel" description="Keep the content task-focused and avoid turning a drawer into a second full page.">
        <Drawer open>
          <DemoStack>
            <strong>Page settings</strong>
            <span>Control visibility, SEO metadata, and publication status without leaving the current screen.</span>
            <Button type="button">Save changes</Button>
          </DemoStack>
        </Drawer>
      </DemoSection>
    </DemoFrame>
  );
}

