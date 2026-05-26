"use client";

import { Grid } from "./index";
import { DemoFrame, DemoPanel, DemoStack } from "../example-theme/demo";

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Columns"
        description="Grid should show column presets directly."
      >
        <DemoStack>
          <Grid cols={2}>
            <DemoPanel>One</DemoPanel>
            <DemoPanel>Two</DemoPanel>
          </Grid>
          <Grid cols={3}>
            <DemoPanel>One</DemoPanel>
            <DemoPanel>Two</DemoPanel>
            <DemoPanel>Three</DemoPanel>
          </Grid>
          <Grid cols={4}>
            <DemoPanel>One</DemoPanel>
            <DemoPanel>Two</DemoPanel>
            <DemoPanel>Three</DemoPanel>
            <DemoPanel>Four</DemoPanel>
          </Grid>
        </DemoStack>
      </DemoFrame>
    </>
  );
}
