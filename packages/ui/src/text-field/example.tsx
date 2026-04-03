"use client";

import { useState } from "react";
import { Button } from "../button";
import { Card } from "../card";
import { DemoFrame, DemoGrid, DemoMuted, DemoSection, DemoStack } from "../example-theme/demo";
import { TextField } from "./index";
import { Typography } from "../typography";

export default function Example() {
  const [slug, setSlug] = useState("native-overlays-without-portals");

  return (
    <DemoFrame title="Text Field" description="Text fields read best in context. These demos show them inside editorial and settings flows where labels, copy, and actions work together.">
      <DemoSection title="Article settings" description="A field example is stronger when the user can see the surrounding information hierarchy and the action that consumes the value.">
        <DemoGrid>
          <Card elevation="flat">
            <DemoStack>
              <Typography as="h3" scale="title">Draft metadata</Typography>
              <TextField label="Title" defaultValue="Native overlays without portals" />
              <TextField label="Slug" value={slug} onChange={(event) => setSlug(event.currentTarget.value)} />
              <Button type="button">Save metadata</Button>
            </DemoStack>
          </Card>
          <Card elevation="flat">
            <DemoStack>
              <Typography as="h3" scale="title">Live preview</Typography>
              <DemoMuted>The slug below updates as you type so the example behaves like a real settings panel.</DemoMuted>
              <code>/docs/articles/{slug}</code>
            </DemoStack>
          </Card>
        </DemoGrid>
      </DemoSection>

      <DemoSection title="Small utility fields" description="The component also works well in smaller utility flows where the field is the main interaction and the copy stays concise.">
        <DemoStack>
          <TextField label="Component search" placeholder="button, dialog, color picker" />
          <TextField label="Package name" defaultValue="@stylextras/ui" />
        </DemoStack>
      </DemoSection>
    </DemoFrame>
  );
}
