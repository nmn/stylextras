"use client";

import { Button } from "../button";
import { Card } from "../card";
import { DemoFrame, DemoSection, DemoStack } from "../example-theme/demo";
import { Link } from "../link";
import { Sidebar } from "../sidebar";
import { SidebarLayout } from "./index";
import { Typography } from "../typography";

export default function Example() {
  return (
    <DemoFrame title="Sidebar Layout" description="A sidebar layout is easier to evaluate when it shows navigation, content, and local actions together. These demos use the layout as a small docs shell rather than a bare two-column frame.">
      <DemoSection title="Documentation shell" description="The sidebar carries the structure while the main region focuses on one page and its immediate controls.">
        <SidebarLayout
          sidebar={
            <Sidebar>
              <Link href="#intro">Introduction</Link>
              <Link href="#api">API</Link>
              <Link href="#examples">Examples</Link>
              <Link href="#accessibility">Accessibility</Link>
            </Sidebar>
          }
        >
          <Card elevation="flat">
            <DemoStack>
              <Typography as="h3" scale="title">Button</Typography>
              <span>The button primitive is intentionally small, themeable, and close to native HTML.</span>
              <Button type="button">Open source</Button>
            </DemoStack>
          </Card>
        </SidebarLayout>
      </DemoSection>
    </DemoFrame>
  );
}
