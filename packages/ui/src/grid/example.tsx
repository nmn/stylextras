"use client";

import { Grid } from "./index";
import { Card } from "../card";
import { DemoFrame, DemoSection } from "../example-theme/demo";

export default function Example() {
  return (
    <DemoFrame title="Grid" description="Use Grid for repeated cards and dashboard surfaces that need stable column rhythm.">
      <DemoSection title="Three-column dashboard" description="The primitive keeps the API small while still being good enough for card collections and settings pages.">
        <Grid cols={3}>
          <Card>Analytics</Card>
          <Card>Releases</Card>
          <Card>Tokens</Card>
          <Card>Accessibility</Card>
          <Card>Components</Card>
          <Card>Deployments</Card>
        </Grid>
      </DemoSection>
    </DemoFrame>
  );
}

