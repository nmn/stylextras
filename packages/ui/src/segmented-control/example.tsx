"use client";

import { DemoFrame, DemoStack } from "../example-theme/demo";
import { SegmentedControl } from "./index";

export function BasicSegmentedControlDemo() {
  return (
    <DemoFrame
      title="View switcher"
      description="Use a segmented control when the choices are short and mutually exclusive."
      showThemes={false}
    >
      <SegmentedControl
        defaultValue="preview"
        legend="View"
        options={[
          { label: "Preview", value: "preview" },
          { label: "Code", value: "code" },
          { label: "Tokens", value: "tokens" },
        ]}
      />
    </DemoFrame>
  );
}

export function DensitySegmentedControlDemo() {
  return (
    <DemoFrame
      title="Range selector"
      description="Short labels work well for dense toolbars and dashboard filters."
      showThemes={false}
    >
      <SegmentedControl
        defaultValue="week"
        legend="Range"
        options={[
          { label: "Day", value: "day" },
          { label: "Week", value: "week" },
          { label: "Month", value: "month" },
          { label: "Quarter", value: "quarter" },
        ]}
      />
    </DemoFrame>
  );
}

export function DescriptiveSegmentedControlDemo() {
  return (
    <DemoFrame
      title="Descriptive choices"
      description="Descriptions are supported when the choices need a little more context."
      showThemes={false}
    >
      <SegmentedControl
        defaultValue="balanced"
        legend="Processing mode"
        options={[
          {
            label: "Fast",
            value: "fast",
            description: "Lower latency",
          },
          {
            label: "Balanced",
            value: "balanced",
            description: "Recommended",
          },
          {
            label: "Detailed",
            value: "detailed",
            description: "More depth",
          },
        ]}
      />
    </DemoFrame>
  );
}

export default function Example() {
  return (
    <DemoStack>
      <BasicSegmentedControlDemo />
      <DensitySegmentedControlDemo />
      <DescriptiveSegmentedControlDemo />
    </DemoStack>
  );
}
