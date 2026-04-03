"use client";

import { Content } from "./index";
import { DemoFrame } from "../example-theme/demo";
import { Typography } from "../typography";
import { Text } from "../text";

export default function Example() {
  return (
    <>
      <DemoFrame title="Readable content" description="Content should be shown as a simple readable column, not as a feature demo.">
        <Content>
          <Typography as="h2" scale="title">Content wrapper</Typography>
          <Text>Use Content to constrain long-form copy into a readable column width.</Text>
          <Text>It works best for guides, articles, and documentation sections where line length matters more than interactive chrome.</Text>
        </Content>
      </DemoFrame>
    </>
  );
}

