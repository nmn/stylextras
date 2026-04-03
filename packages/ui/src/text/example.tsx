"use client";

import { Text } from "./index";
import { DemoFrame, DemoStack } from "../example-theme/demo";

export default function Example() {
  return (
    <>
      <DemoFrame title="Body text" description="Text should show a few straightforward body-copy examples.">
        <DemoStack>
          <Text>Use short, specific sentences around interactive controls.</Text>
          <Text tone="muted">Muted text is useful for supporting descriptions and secondary notes.</Text>
          <Text mono>Monospace body text can help with code-like labels and values.</Text>
        </DemoStack>
      </DemoFrame>
    </>
  );
}

