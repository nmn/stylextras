"use client";

import { Badge } from "../badge";
import { Card } from "../card";
import { DemoEyebrow, DemoFrame, DemoGrid, DemoMuted, DemoSection, DemoStack } from "../example-theme/demo";
import { Typography } from "./index";

export default function Example() {
  return (
    <DemoFrame title="Typography" description="Typography examples should show hierarchy and rhythm, not just a list of token names. These examples use the type scale inside small editorial and product surfaces.">
      <DemoSection title="Editorial hierarchy" description="A good type system demo shows how display, title, body, and supporting text work together inside the same composition.">
        <Card elevation="flat">
          <DemoStack>
            <DemoEyebrow>Release notes</DemoEyebrow>
            <Typography as="h1" scale="display">Native-first overlays and token-driven examples</Typography>
            <Typography as="p" scale="body">The updated component demos now use real interface compositions, theme toggles, and supporting copy so the examples behave more like product surfaces than isolated specimens.</Typography>
            <DemoMuted>Published April 2026</DemoMuted>
          </DemoStack>
        </Card>
      </DemoSection>

      <DemoSection title="Product usage" description="The same type scale should also work inside denser UI such as cards, metadata rows, and compact status surfaces.">
        <DemoGrid>
          <Card elevation="sm">
            <DemoStack>
              <Badge>Stable</Badge>
              <Typography as="h3" scale="title">Button</Typography>
              <Typography as="p" scale="body">Use for clear, direct actions that move the user toward the next step.</Typography>
            </DemoStack>
          </Card>
          <Card elevation="sm">
            <DemoStack>
              <Badge>Experimental</Badge>
              <Typography as="h3" scale="title">Command</Typography>
              <Typography as="p" scale="body">A lightweight dialog shell for quick navigation and action palettes.</Typography>
            </DemoStack>
          </Card>
        </DemoGrid>
      </DemoSection>
    </DemoFrame>
  );
}
