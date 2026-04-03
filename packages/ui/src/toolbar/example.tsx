"use client";

import { Button } from "../button";
import { Card } from "../card";
import { DemoFrame, DemoGrid, DemoSection, DemoStack } from "../example-theme/demo";
import { IconButton } from "../icon-button";
import { Toolbar } from "./index";
import { Typography } from "../typography";

export default function Example() {
  return (
    <DemoFrame title="Toolbar" description="Toolbar examples should show a small cluster of related controls acting on one local piece of content. These demos place the toolbar inside realistic editor and preview surfaces.">
      <DemoSection title="Local editing controls" description="A toolbar is most convincing when the user can see the object or content the controls relate to.">
        <DemoGrid>
          <Card elevation="flat">
            <DemoStack>
              <Typography as="h3" scale="title">Editor toolbar</Typography>
              <Toolbar>
                <IconButton aria-label="Undo">U</IconButton>
                <IconButton aria-label="Redo">R</IconButton>
                <Button type="button">Preview</Button>
                <Button type="button">Publish</Button>
              </Toolbar>
            </DemoStack>
          </Card>
          <Card elevation="flat">
            <DemoStack>
              <Typography as="h3" scale="title">Selection tools</Typography>
              <Toolbar>
                <Button type="button">Duplicate</Button>
                <Button type="button">Group</Button>
                <Button type="button">Delete</Button>
              </Toolbar>
            </DemoStack>
          </Card>
        </DemoGrid>
      </DemoSection>
    </DemoFrame>
  );
}
