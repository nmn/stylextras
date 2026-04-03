"use client";

import { AspectRatio } from "./index";
import { DemoFrame, DemoGrid, DemoMuted, DemoPanel, DemoSection } from "../example-theme/demo";

export default function Example() {
  return (
    <DemoFrame title="Aspect Ratio" description="Use aspect-ratio frames to keep media shells stable while content loads.">
      <DemoSection title="Common frames" description="The component exposes a few predefined ratio presets for editorial, avatar, and gallery layouts.">
        <DemoGrid>
          <DemoPanel><AspectRatio ratio="square"><DemoMuted>Square 1:1</DemoMuted></AspectRatio></DemoPanel>
          <DemoPanel><AspectRatio ratio="video"><DemoMuted>Video 16:9</DemoMuted></AspectRatio></DemoPanel>
          <DemoPanel><AspectRatio ratio="portrait"><DemoMuted>Portrait 4:5</DemoMuted></AspectRatio></DemoPanel>
          <DemoPanel><AspectRatio ratio="landscape"><DemoMuted>Landscape 4:3</DemoMuted></AspectRatio></DemoPanel>
        </DemoGrid>
      </DemoSection>
    </DemoFrame>
  );
}

