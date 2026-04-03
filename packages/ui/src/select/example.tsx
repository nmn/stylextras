"use client";

import { Card } from "../card";
import { DemoFrame, DemoGrid, DemoSection, DemoStack } from "../example-theme/demo";
import { Select } from "./index";
import { Typography } from "../typography";

export default function Example() {
  return (
    <DemoFrame title="Select" description="Select demos are stronger when the option list and the surrounding task both feel concrete. These examples keep the data sets small and familiar.">
      <DemoSection title="Simple decision points" description="Native selects are a pragmatic fit when the options are stable and there is no need for inline searching.">
        <DemoGrid>
          <Card elevation="flat">
            <DemoStack>
              <Typography as="h3" scale="title">Workspace settings</Typography>
              <Select label="Environment" options={["Development", "Preview", "Production"]} />
              <Select label="Region" options={["US West", "US East", "Europe"]} />
            </DemoStack>
          </Card>
          <Card elevation="flat">
            <DemoStack>
              <Typography as="h3" scale="title">Documentation filters</Typography>
              <Select label="Category" options={["Buttons", "Form", "Navigation", "Overlays"]} />
              <Select label="Status" options={["Stable", "Experimental", "Legacy"]} />
            </DemoStack>
          </Card>
        </DemoGrid>
      </DemoSection>
    </DemoFrame>
  );
}
