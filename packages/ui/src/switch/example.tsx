"use client";

import { Card } from "../card";
import { DemoFrame, DemoGrid, DemoSection, DemoStack } from "../example-theme/demo";
import { Switch } from "./index";
import { Typography } from "../typography";

export default function Example() {
  return (
    <DemoFrame title="Switch" description="Switches are clearest when they represent an immediate on or off state. These demos keep the choices binary and direct.">
      <DemoSection title="Immediate settings" description="Use switches for controls that take effect right away or represent an already-active state.">
        <DemoGrid>
          <Card elevation="flat">
            <DemoStack>
              <Typography as="h3" scale="title">Workspace behavior</Typography>
              <Switch defaultChecked label="Enable preview deployments" />
              <Switch defaultChecked label="Publish changelog to docs" />
              <Switch label="Pause analytics collection" />
            </DemoStack>
          </Card>
          <Card elevation="flat">
            <DemoStack>
              <Typography as="h3" scale="title">Appearance</Typography>
              <Switch defaultChecked label="Use editorial type theme" />
              <Switch label="Show status badges in the sidebar" />
            </DemoStack>
          </Card>
        </DemoGrid>
      </DemoSection>
    </DemoFrame>
  );
}
