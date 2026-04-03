"use client";

import { Button } from "../button";
import { Card } from "../card";
import { DemoFrame, DemoGrid, DemoSection, DemoStack } from "../example-theme/demo";
import { Tooltip } from "./index";
import { Typography } from "../typography";

export default function Example() {
  return (
    <DemoFrame title="Tooltip" description="Tooltips should reinforce an already discoverable UI, not carry critical instructions by themselves. These demos show both action hints and supporting status explanations.">
      <DemoSection title="Action hints" description="Keep tooltip copy short and specific. If the content becomes primary, move it into a popover or dialog.">
        <DemoGrid>
          <Card elevation="flat">
            <DemoStack>
              <Typography as="h3" scale="title">Token export</Typography>
              <div>
                <Button popoverTarget="tooltip-export" type="button">Export token snapshot</Button>
                <Tooltip id="tooltip-export">Creates a static JSON snapshot of the current theme.</Tooltip>
              </div>
            </DemoStack>
          </Card>
          <Card elevation="flat">
            <DemoStack>
              <Typography as="h3" scale="title">Editor control</Typography>
              <div>
                <button popoverTarget="tooltip-autosave" type="button">Autosave</button>
                <Tooltip id="tooltip-autosave">Saves the draft every 30 seconds while changes are pending.</Tooltip>
              </div>
            </DemoStack>
          </Card>
        </DemoGrid>
      </DemoSection>

      <DemoSection title="Status explanation" description="A second example helps show the tooltip as a short explanation of a nearby status rather than only an action label.">
        <DemoGrid>
          <Card elevation="flat">
            <DemoStack>
              <Typography as="h3" scale="title">Build status</Typography>
              <div>
                <button popoverTarget="tooltip-build" type="button">Needs attention</button>
                <Tooltip id="tooltip-build">Two docs pages are still missing narrative accessibility notes.</Tooltip>
              </div>
            </DemoStack>
          </Card>
          <Card elevation="flat">
            <DemoStack>
              <Typography as="h3" scale="title">Why this helps</Typography>
              <span>The tooltip gives a short explanation of the status without requiring a full surface change or extra paragraph in the layout.</span>
            </DemoStack>
          </Card>
        </DemoGrid>
      </DemoSection>
    </DemoFrame>
  );
}
