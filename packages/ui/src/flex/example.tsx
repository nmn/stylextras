"use client";

import { Flex } from "./index";
import {
  DemoFrame,
  DemoPanel,
  DemoRow,
  DemoStack,
} from "../example-theme/demo";

export function FlexDirectionsDemo() {
  return (
    <DemoFrame
      title="Directions"
      description="Flex should show row and column forms directly."
      showThemes={false}
    >
      <DemoStack>
        <Flex gap="md">
          <DemoPanel>One</DemoPanel>
          <DemoPanel>Two</DemoPanel>
          <DemoPanel>Three</DemoPanel>
        </Flex>
        <Flex direction="column" gap="md">
          <DemoPanel>One</DemoPanel>
          <DemoPanel>Two</DemoPanel>
          <DemoPanel>Three</DemoPanel>
        </Flex>
      </DemoStack>
    </DemoFrame>
  );
}

export function FlexAlignmentDemo() {
  return (
    <DemoFrame
      title="Alignment"
      description="A second frame shows different alignment and distribution options."
      showThemes={false}
    >
      <DemoRow>
        <Flex align="center" gap="sm">
          <DemoPanel>A</DemoPanel>
          <DemoPanel>B</DemoPanel>
        </Flex>
        <Flex justify="between" gap="sm">
          <DemoPanel>A</DemoPanel>
          <DemoPanel>B</DemoPanel>
        </Flex>
      </DemoRow>
    </DemoFrame>
  );
}

export default function Example() {
  return (
    <DemoStack>
      <FlexDirectionsDemo />
      <FlexAlignmentDemo />
    </DemoStack>
  );
}
