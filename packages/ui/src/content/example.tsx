"use client";

import { Content } from "./index";
import { Text } from "../text";
import { Typography } from "../typography";
import { DemoFrame, DemoSection } from "../example-theme/demo";

export default function Example() {
  return (
    <DemoFrame title="Content" description="A readable content wrapper for long-form sections, guides, and editorial surfaces.">
      <DemoSection title="Long-form layout" description="Use Content to constrain line length and keep prose blocks visually stable.">
        <Content>
          <Typography as="h2" scale="title">Building a smaller component foundation</Typography>
          <Text>Start with tokens that are easy to theme, keep primitives close to native HTML, and only add custom behavior where the platform does not cover the interaction.</Text>
          <Text>This approach keeps the API surface smaller, the styling model clearer, and the accessibility baseline easier to reason about.</Text>
        </Content>
      </DemoSection>
    </DemoFrame>
  );
}

