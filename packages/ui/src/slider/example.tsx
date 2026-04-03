"use client";

import { useState } from "react";
import { Card } from "../card";
import { DemoFrame, DemoGrid, DemoMuted, DemoSection, DemoStack } from "../example-theme/demo";
import { Slider } from "./index";
import { Typography } from "../typography";

export default function Example() {
  const [radiusValue, setRadiusValue] = useState(12);
  const [spacingValue, setSpacingValue] = useState(6);

  return (
    <DemoFrame title="Slider" description="Sliders are better demos when the value is reflected somewhere visible, so the user can immediately connect the control to a result.">
      <DemoSection title="Design tuning" description="These controls affect a small preview card so the relationship between the slider and the output is obvious.">
        <DemoGrid>
          <Card elevation="flat">
            <DemoStack>
              <Typography as="h3" scale="title">Controls</Typography>
              <Slider aria-label="Corner radius" min={0} max={32} value={radiusValue} onChange={(event) => setRadiusValue(Number(event.currentTarget.value))} />
              <DemoMuted>Corner radius: {radiusValue}px</DemoMuted>
              <Slider aria-label="Inner spacing" min={2} max={16} value={spacingValue} onChange={(event) => setSpacingValue(Number(event.currentTarget.value))} />
              <DemoMuted>Inner spacing: {spacingValue}px</DemoMuted>
            </DemoStack>
          </Card>
          <div
            style={{
              border: "1px solid currentColor",
              borderRadius: `${radiusValue}px`,
              padding: `${spacingValue * 4}px`,
              minHeight: "180px",
              display: "grid",
              gap: "12px",
              alignContent: "start",
            }}
          >
            <Typography as="h3" scale="title">Preview surface</Typography>
            <DemoMuted>The preview is intentionally simple. The point of the example is to make the slider feel like part of a real tuning workflow.</DemoMuted>
          </div>
        </DemoGrid>
      </DemoSection>
    </DemoFrame>
  );
}
