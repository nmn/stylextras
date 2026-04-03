"use client";

import { Badge } from "../badge";
import { Button } from "../button";
import { ButtonGroup } from "../button-group";
import { Card } from "../card";
import { Command } from "./index";
import { DemoFrame, DemoGrid, DemoSection, DemoStack } from "../example-theme/demo";
import { SearchField } from "../search-field";
import { Typography } from "../typography";

export default function Example() {
  return (
    <DemoFrame title="Command" description="Command surfaces work best when they look like quick navigation or action panels, not generic empty dialogs. These demos show two different command patterns.">
      <DemoSection title="Quick jump palette" description="This first example focuses on fast navigation and direct jumps to common docs destinations.">
        <DemoGrid>
          <Command open>
            <DemoStack>
              <Badge>Quick jump</Badge>
              <SearchField label="Search commands" placeholder="button, tokens, examples" />
              <ButtonGroup>
                <Button type="button">Open button docs</Button>
                <Button type="button">Jump to color tokens</Button>
                <Button type="button">Open get started</Button>
              </ButtonGroup>
            </DemoStack>
          </Command>
          <Card elevation="flat">
            <DemoStack>
              <Typography as="h3" scale="title">Why this works</Typography>
              <span>The dialog behaves like a focused command palette: one input, a short list of actions, and no unnecessary structure.</span>
            </DemoStack>
          </Card>
        </DemoGrid>
      </DemoSection>

      <DemoSection title="Object actions" description="A second example shows how the same shell can serve as a compact action launcher for a selected object.">
        <DemoGrid>
          <Command open>
            <DemoStack>
              <Badge>Selected: Card</Badge>
              <ButtonGroup>
                <Button type="button">Duplicate card</Button>
                <Button type="button">Move to content</Button>
                <Button type="button">Archive component</Button>
              </ButtonGroup>
            </DemoStack>
          </Command>
          <Card elevation="flat">
            <DemoStack>
              <Typography as="h3" scale="title">When to prefer this</Typography>
              <span>Use a tighter action-only command surface when the user already has context and only needs a quick launch point for the next step.</span>
            </DemoStack>
          </Card>
        </DemoGrid>
      </DemoSection>
    </DemoFrame>
  );
}
