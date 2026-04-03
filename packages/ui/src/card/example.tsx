"use client";

import { Badge } from "../badge";
import { Button } from "../button";
import { Card } from "./index";
import { DemoFrame, DemoGrid, DemoInset, DemoMuted, DemoSection, DemoStack } from "../example-theme/demo";
import { Typography } from "../typography";

export default function Example() {
  return (
    <DemoFrame title="Card" description="Cards work best when they gather one small unit of information and its immediate actions. These examples show how elevation changes the role of the surface in a layout.">
      <DemoSection title="Different elevations" description="Use flatter cards inside dense dashboards and stronger elevation when the surface needs to feel more isolated from the page.">
        <DemoGrid>
          <Card elevation="flat">
            <DemoStack>
              <Badge>Flat</Badge>
              <Typography as="h3" scale="title">Inline documentation note</Typography>
              <DemoMuted>Best for dense collections where the page already provides enough separation.</DemoMuted>
            </DemoStack>
          </Card>
          <Card elevation="sm">
            <DemoStack>
              <Badge>Small</Badge>
              <Typography as="h3" scale="title">Settings module</Typography>
              <DemoMuted>Useful for related controls inside a settings page or inspector panel.</DemoMuted>
            </DemoStack>
          </Card>
          <Card elevation="md">
            <DemoStack>
              <Badge>Medium</Badge>
              <Typography as="h3" scale="title">Workspace overview</Typography>
              <DemoMuted>A balanced default for dashboard sections and feature summaries.</DemoMuted>
            </DemoStack>
          </Card>
          <Card elevation="lg">
            <DemoStack>
              <Badge>Large</Badge>
              <Typography as="h3" scale="title">Focused callout</Typography>
              <DemoMuted>Reserve stronger elevation for moments that need separation and emphasis.</DemoMuted>
            </DemoStack>
          </Card>
        </DemoGrid>
      </DemoSection>

      <DemoSection title="Composed content" description="A card becomes more useful when it demonstrates real composition: status, hierarchy, supporting copy, and actions.">
        <Card elevation="sm">
          <DemoStack>
            <DemoInset>
              <Badge>Experimental</Badge>
              <Typography as="h3" scale="title">Native menu primitives</Typography>
              <DemoMuted>The current menu surfaces use `popover` and anchor positioning instead of portals, which keeps the DOM shape simpler.</DemoMuted>
            </DemoInset>
            <Button type="button">Read implementation notes</Button>
          </DemoStack>
        </Card>
      </DemoSection>
    </DemoFrame>
  );
}
