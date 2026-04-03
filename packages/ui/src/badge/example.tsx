"use client";

import { Badge } from "./index";
import { DemoFrame, DemoRow } from "../example-theme/demo";

export default function Example() {
  return (
    <>
      <DemoFrame title="Variants" description="Badge should read like a compact specimen sheet of statuses.">
        <DemoRow>
          <Badge variant="neutral">Neutral</Badge>
          <Badge variant="brand">Brand</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
        </DemoRow>
      </DemoFrame>
      <DemoFrame title="Sizes" description="Badge also has a small and medium form." showThemes={false}>
        <DemoRow>
          <Badge size="sm">Small</Badge>
          <Badge size="md">Medium</Badge>
        </DemoRow>
      </DemoFrame>
    </>
  );
}

