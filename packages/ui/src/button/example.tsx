"use client";

import { Button } from "./index";
import { DemoFrame, DemoRow } from "../example-theme/demo";

export default function Example() {
  return (
    <>
      <DemoFrame title="Variants" description="Button should show the available variants directly, without surrounding workflow noise.">
        <DemoRow>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </DemoRow>
      </DemoFrame>
      <DemoFrame title="States and sizes" description="A second frame shows common states at a glance." showThemes={false}>
        <DemoRow>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button disabled>Disabled</Button>
        </DemoRow>
      </DemoFrame>
    </>
  );
}

