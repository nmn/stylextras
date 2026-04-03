"use client";

import { Badge } from "../badge";
import { Card } from "../card";
import { DemoFrame, DemoGrid, DemoSection, DemoStack } from "../example-theme/demo";
import { DropdownMenu } from "./index";
import { Typography } from "../typography";

export default function Example() {
  return (
    <DemoFrame title="Dropdown Menu" description="Menu examples are stronger when they live next to the object they act on. These demos show two different menu roles: object actions and utility actions.">
      <DemoSection title="Card actions" description="Put the trigger next to the thing it controls and keep the menu items direct and verb-based.">
        <DemoGrid>
          <Card elevation="flat">
            <DemoStack>
              <Badge>Experimental</Badge>
              <Typography as="h3" scale="title">Command palette docs</Typography>
              <DropdownMenu label="Actions">
                <button role="menuitem" type="button">Open page</button>
                <button role="menuitem" type="button">Duplicate draft</button>
                <button role="menuitem" type="button">Archive draft</button>
              </DropdownMenu>
            </DemoStack>
          </Card>
          <Card elevation="flat">
            <DemoStack>
              <Badge>Stable</Badge>
              <Typography as="h3" scale="title">Button docs</Typography>
              <DropdownMenu label="More">
                <button role="menuitem" type="button">Copy link</button>
                <button role="menuitem" type="button">Open source</button>
                <button role="menuitem" type="button">Report issue</button>
              </DropdownMenu>
            </DemoStack>
          </Card>
        </DemoGrid>
      </DemoSection>

      <DemoSection title="Utility menu" description="A second example helps show a lighter menu used for compact utilities rather than record-level actions.">
        <DemoGrid>
          <Card elevation="flat">
            <DemoStack>
              <Typography as="h3" scale="title">Theme tools</Typography>
              <DropdownMenu label="Theme tools">
                <button role="menuitem" type="button">Export JSON</button>
                <button role="menuitem" type="button">Duplicate theme</button>
                <button role="menuitem" type="button">Reset overrides</button>
              </DropdownMenu>
            </DemoStack>
          </Card>
          <Card elevation="flat">
            <DemoStack>
              <Typography as="h3" scale="title">Why two examples help</Typography>
              <span>The same primitive serves slightly different jobs depending on whether it belongs to a specific record or to a local tool cluster.</span>
            </DemoStack>
          </Card>
        </DemoGrid>
      </DemoSection>
    </DemoFrame>
  );
}
