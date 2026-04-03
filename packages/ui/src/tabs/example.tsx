"use client";

import { useState } from "react";
import { Card } from "../card";
import { DemoFrame, DemoGrid, DemoSection, DemoStack } from "../example-theme/demo";
import { Tabs } from "./index";
import { Typography } from "../typography";

const docsPanels: Record<string, string> = {
  Overview: "Use the overview tab for the short explanation of the primitive and its intended role.",
  Examples: "The examples tab should feel like a small product surface, not a specimen sheet.",
  Accessibility: "Document the current limitations clearly so consumers understand what they need to compose around.",
};

const settingsPanels: Record<string, string> = {
  General: "General settings cover naming, visibility, and other high-level workspace decisions.",
  Tokens: "Token settings affect base theme inputs and derived values that shape the whole interface.",
  Publishing: "Publishing settings group scheduling, visibility, and release-related choices.",
};

export default function Example() {
  const [docsValue, setDocsValue] = useState("Overview");
  const [settingsValue, setSettingsValue] = useState("General");

  return (
    <DemoFrame title="Tabs" description="Tabs are best when several peer views share the same overall context. Multiple examples help show both documentation-style and settings-style usage.">
      <DemoSection title="Documentation views" description="A tab example is stronger when the active tab affects nearby content rather than only showing the control itself.">
        <DemoGrid>
          <Card elevation="flat">
            <DemoStack>
              <Tabs tabs={["Overview", "Examples", "Accessibility"]} value={docsValue} onValueChange={setDocsValue} />
              <Typography as="h3" scale="title">{docsValue}</Typography>
              <span>{docsPanels[docsValue]}</span>
            </DemoStack>
          </Card>
          <Card elevation="flat">
            <DemoStack>
              <Typography as="h3" scale="title">Why tabs fit here</Typography>
              <span>Each view belongs to the same page and the user expects to switch between them quickly without opening a new route or dialog.</span>
            </DemoStack>
          </Card>
        </DemoGrid>
      </DemoSection>

      <DemoSection title="Settings sections" description="A second example shows tabs as a compact page-level organizer for related configuration areas.">
        <DemoGrid>
          <Card elevation="flat">
            <DemoStack>
              <Tabs tabs={["General", "Tokens", "Publishing"]} value={settingsValue} onValueChange={setSettingsValue} />
              <Typography as="h3" scale="title">{settingsValue}</Typography>
              <span>{settingsPanels[settingsValue]}</span>
            </DemoStack>
          </Card>
          <Card elevation="flat">
            <DemoStack>
              <Typography as="h3" scale="title">Why this is different</Typography>
              <span>The content is still peer-level and closely related, but the emphasis is on organizing a small settings surface instead of documenting one component.</span>
            </DemoStack>
          </Card>
        </DemoGrid>
      </DemoSection>
    </DemoFrame>
  );
}
