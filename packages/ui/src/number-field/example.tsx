"use client";

import { useState } from "react";
import { Card } from "../card";
import { DemoFrame, DemoGrid, DemoMuted, DemoSection, DemoStack } from "../example-theme/demo";
import { NumberField } from "./index";
import { Typography } from "../typography";

export default function Example() {
  const [columns, setColumns] = useState(12);
  const [gutter, setGutter] = useState(24);

  return (
    <DemoFrame title="Number Field" description="Number field examples should make the numeric input feel intentional. These demos connect the values to layout and configuration decisions so the numbers are not arbitrary.">
      <DemoSection title="Layout configuration" description="Use numeric fields where the user is really setting quantities, lengths, or counts rather than freeform text.">
        <DemoGrid>
          <Card elevation="flat">
            <DemoStack>
              <Typography as="h3" scale="title">Grid settings</Typography>
              <NumberField label="Columns" min={1} max={24} value={columns} onChange={(event) => setColumns(Number(event.currentTarget.value))} />
              <NumberField label="Gutter" min={0} max={64} value={gutter} onChange={(event) => setGutter(Number(event.currentTarget.value))} />
            </DemoStack>
          </Card>
          <Card elevation="flat">
            <DemoStack>
              <Typography as="h3" scale="title">Current values</Typography>
              <DemoMuted>Columns: {columns}</DemoMuted>
              <DemoMuted>Gutter: {gutter}px</DemoMuted>
              <DemoMuted>The field feels more grounded once the surrounding UI makes the unit and purpose explicit.</DemoMuted>
            </DemoStack>
          </Card>
        </DemoGrid>
      </DemoSection>
    </DemoFrame>
  );
}
