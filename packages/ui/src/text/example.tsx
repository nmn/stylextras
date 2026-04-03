"use client";

import { Text } from "./index";
import { DemoFrame, DemoSection, DemoStack } from "../example-theme/demo";

export default function Example() {
  return (
    <DemoFrame title="Text" description="Use Text for body copy and short supporting descriptions around richer interface elements.">
      <DemoSection title="Supporting copy" description="The primitive keeps the API small while remaining theme-driven through the typography tokens.">
        <DemoStack>
          <Text>Use short, specific sentences around interactive controls.</Text>
          <Text>Longer paragraphs belong inside a content wrapper or a more structured editorial surface.</Text>
        </DemoStack>
      </DemoSection>
    </DemoFrame>
  );
}

