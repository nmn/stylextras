"use client";

import { useState } from "react";
import { Card } from "../card";
import { DemoFrame, DemoGrid, DemoSection, DemoStack } from "../example-theme/demo";
import { SegmentedControl } from "./index";
import { Typography } from "../typography";

const panels: Record<string, { title: string; body: string }> = {
  Preview: {
    title: "Preview mode",
    body: "Use this view when the goal is to inspect the composed UI and content hierarchy.",
  },
  Code: {
    title: "Code mode",
    body: "Switch here when the user needs implementation details, import paths, or token references.",
  },
  Tokens: {
    title: "Token mode",
    body: "This view emphasizes theme inputs and derived values rather than behavior or markup.",
  },
};

export default function Example() {
  const [value, setValue] = useState("Preview");

  return (
    <DemoFrame title="Segmented Control" description="Segmented controls are more persuasive when they visibly switch a nearby view. These demos pair the control with a changing panel so the relationship is immediate.">
      <DemoSection title="View switching" description="Keep the option count small and the choices equally prominent. Once the set grows or the content becomes more independent, tabs or navigation are clearer.">
        <DemoGrid>
          <Card elevation="flat">
            <DemoStack>
              <SegmentedControl options={["Preview", "Code", "Tokens"]} value={value} onValueChange={setValue} />
              <Typography as="h3" scale="title">{panels[value].title}</Typography>
              <span>{panels[value].body}</span>
            </DemoStack>
          </Card>
          <Card elevation="flat">
            <DemoStack>
              <Typography as="h3" scale="title">Why this component fits</Typography>
              <span>The modes all belong to the same immediate context and the user expects quick back-and-forth switching without leaving the page.</span>
            </DemoStack>
          </Card>
        </DemoGrid>
      </DemoSection>
    </DemoFrame>
  );
}
