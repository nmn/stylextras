"use client";

import { Badge } from "../badge";
import { Button } from "../button";
import { DemoFrame, DemoGrid, DemoInset, DemoSection, DemoStack } from "../example-theme/demo";
import { Popover } from "./index";
import { Typography } from "../typography";

export default function Example() {
  return (
    <DemoFrame title="Popover" description="Popovers are best when they hold lightweight supporting UI that belongs near the trigger. These demos show both informative and interactive uses.">
      <DemoSection title="Quick details panel" description="This popover surfaces supporting information about a release without pulling the user away from the current page.">
        <DemoGrid>
          <div>
            <Button popoverTarget="release-popover" type="button">View release summary</Button>
            <Popover id="release-popover">
              <DemoStack>
                <Badge>Release 0.2.0</Badge>
                <Typography as="h3" scale="title">Native overlay update</Typography>
                <DemoInset>
                  <span>Replaced portal-based menu surfaces with `dialog` and `popover` implementations.</span>
                </DemoInset>
              </DemoStack>
            </Popover>
          </div>
          <DemoStack>
            <Typography as="h3" scale="title">Good popover content</Typography>
            <span>Keep it local, brief, and closely tied to the trigger. Once the task becomes primary, switch to a dialog or page.</span>
          </DemoStack>
        </DemoGrid>
      </DemoSection>

      <DemoSection title="Inline settings popover" description="A second example shows the same primitive used for a tiny interactive settings cluster that still belongs near the trigger.">
        <DemoGrid>
          <div>
            <Button popoverTarget="settings-popover" type="button">Open quick settings</Button>
            <Popover id="settings-popover">
              <DemoStack>
                <Typography as="h3" scale="title">Preview settings</Typography>
                <button type="button">Show grid</button>
                <button type="button">Toggle labels</button>
                <button type="button">Reset view</button>
              </DemoStack>
            </Popover>
          </div>
          <DemoStack>
            <Typography as="h3" scale="title">When this still works</Typography>
            <span>The controls are short-lived and local to the trigger. The interaction stays lightweight enough that a full dialog would be excessive.</span>
          </DemoStack>
        </DemoGrid>
      </DemoSection>
    </DemoFrame>
  );
}
