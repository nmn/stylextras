"use client";

import { useState } from "react";
import { Badge } from "../badge";
import { Button } from "./index";
import { ButtonGroup } from "../button-group";
import { Card } from "../card";
import { DemoFrame, DemoGrid, DemoInset, DemoMuted, DemoSection, DemoStack } from "../example-theme/demo";
import { TextField } from "../text-field";
import { Typography } from "../typography";

export default function Example() {
  const [status, setStatus] = useState("Draft");

  return (
    <DemoFrame title="Button" description="Buttons are most useful when the surrounding context makes the outcome obvious. These examples show buttons inside small task flows instead of isolated swatches.">
      <DemoSection title="Primary action group" description="A button rarely stands alone in product UI. Pair it with nearby status and secondary actions so the intent is obvious.">
        <Card elevation="sm">
          <DemoStack>
            <DemoInset>
              <Badge>{status}</Badge>
              <Typography as="h3" scale="title">Release 0.2.0</Typography>
              <DemoMuted>Ship the docs refresh and native overlay primitives before publishing the changelog.</DemoMuted>
            </DemoInset>
            <ButtonGroup>
              <Button type="button" onClick={() => setStatus("Ready")}>Mark ready</Button>
              <Button type="button" onClick={() => setStatus("Needs review")}>Request review</Button>
              <Button type="button" onClick={() => setStatus("Draft")}>Move to draft</Button>
            </ButtonGroup>
          </DemoStack>
        </Card>
      </DemoSection>

      <DemoSection title="Buttons inside forms" description="A good button demo should show the surrounding form controls too, because spacing, hierarchy, and rhythm matter as much as the button itself.">
        <DemoGrid>
          <Card elevation="flat">
            <DemoStack>
              <Typography as="h3" scale="title">Invite teammate</Typography>
              <TextField label="Email" placeholder="teammate@example.com" />
              <Button type="button">Send invite</Button>
            </DemoStack>
          </Card>
          <Card elevation="flat">
            <DemoStack>
              <Typography as="h3" scale="title">Dangerous action</Typography>
              <DemoMuted>Use direct button labels that say exactly what will happen next.</DemoMuted>
              <Button type="button">Archive project</Button>
            </DemoStack>
          </Card>
        </DemoGrid>
      </DemoSection>
    </DemoFrame>
  );
}
