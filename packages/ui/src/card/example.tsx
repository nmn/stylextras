"use client";

import { AspectRatio } from "../aspect-ratio";
import { Badge } from "../badge";
import { Button } from "../button";
import { Card } from "./index";
import {
  DemoFrame,
  DemoGrid,
  DemoMuted,
  DemoStack,
} from "../example-theme/demo";
import { Typography } from "../typography";

export function CardElevationsDemo() {
  return (
    <DemoFrame
      title="Elevations"
      description="Card is one of the few components where composition helps show the component clearly."
      showThemes={false}
    >
      <DemoGrid>
        <Card elevation="flat">
          <DemoStack>
            <Badge>Flat</Badge>
            <Typography as="h3" scale="title">
              Flat card
            </Typography>
            <DemoMuted>Dense surfaces.</DemoMuted>
          </DemoStack>
        </Card>
        <Card elevation="sm">
          <DemoStack>
            <Badge>Small</Badge>
            <Typography as="h3" scale="title">
              Small card
            </Typography>
            <DemoMuted>Light separation.</DemoMuted>
          </DemoStack>
        </Card>
        <Card elevation="md">
          <DemoStack>
            <Badge>Medium</Badge>
            <Typography as="h3" scale="title">
              Medium card
            </Typography>
            <DemoMuted>Balanced default.</DemoMuted>
          </DemoStack>
        </Card>
        <Card elevation="lg">
          <DemoStack>
            <Badge>Large</Badge>
            <Typography as="h3" scale="title">
              Large card
            </Typography>
            <DemoMuted>Focused surface.</DemoMuted>
          </DemoStack>
        </Card>
      </DemoGrid>
    </DemoFrame>
  );
}

export function CardCompositionDemo() {
  return (
    <DemoFrame
      title="Composed content"
      description="A second frame shows the card with typical content."
      showThemes={false}
    >
      <Card elevation="sm">
        <DemoStack>
          <AspectRatio ratio="video">Preview</AspectRatio>
          <Badge>Experimental</Badge>
          <Typography as="h3" scale="title">
            Native popups
          </Typography>
          <DemoMuted>
            Use card composition to see how spacing, radius, and elevation work
            together.
          </DemoMuted>
          <Button>Read more</Button>
        </DemoStack>
      </Card>
    </DemoFrame>
  );
}

export default function Example() {
  return (
    <DemoStack>
      <CardElevationsDemo />
      <CardCompositionDemo />
    </DemoStack>
  );
}
