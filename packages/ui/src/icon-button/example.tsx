"use client";

import { Badge } from "../badge";
import { Card } from "../card";
import { DemoFrame, DemoGrid, DemoSection, DemoStack } from "../example-theme/demo";
import { IconButton } from "./index";
import { Typography } from "../typography";

export default function Example() {
  return (
    <DemoFrame title="Icon Button" description="Icon button examples are stronger when the surrounding UI explains why an icon-only control is appropriate. These demos show them in toolbars and compact cards.">
      <DemoSection title="Toolbar controls" description="Use icon buttons where the action is common enough to be recognized quickly or where surrounding text already sets context.">
        <DemoGrid>
          <Card elevation="flat">
            <DemoStack>
              <Typography as="h3" scale="title">Editor tools</Typography>
              <div>
                <IconButton aria-label="Undo" size="sm">U</IconButton>
                <IconButton aria-label="Redo" size="sm">R</IconButton>
                <IconButton aria-label="Search" size="sm">S</IconButton>
              </div>
            </DemoStack>
          </Card>
          <Card elevation="flat">
            <DemoStack>
              <Badge>Compact card actions</Badge>
              <Typography as="h3" scale="title">Component card</Typography>
              <div>
                <IconButton aria-label="Favorite" size="md">F</IconButton>
                <IconButton aria-label="Open menu" size="md">M</IconButton>
              </div>
            </DemoStack>
          </Card>
        </DemoGrid>
      </DemoSection>
    </DemoFrame>
  );
}
