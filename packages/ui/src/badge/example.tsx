"use client";

import { Badge } from "./index";
import { DemoFrame, DemoRow, DemoStack } from "../example-theme/demo";

export function BadgeVariantsDemo() {
  return (
    <DemoFrame
      title="Variants"
      description="Badge should read like a compact specimen sheet of statuses."
      showThemes={false}
    >
      <DemoRow>
        <Badge variant="neutral">Neutral</Badge>
        <Badge variant="brand">Brand</Badge>
        <Badge variant="info">Info</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="danger">Danger</Badge>
      </DemoRow>
    </DemoFrame>
  );
}

export function BadgeSizesDemo() {
  return (
    <DemoFrame
      title="Sizes"
      description="Badge also has a small and medium form."
      showThemes={false}
    >
      <DemoRow>
        <Badge size="sm">Small</Badge>
        <Badge size="md">Medium</Badge>
      </DemoRow>
    </DemoFrame>
  );
}

export default function Example() {
  return (
    <DemoStack>
      <BadgeVariantsDemo />
      <BadgeSizesDemo />
    </DemoStack>
  );
}
