"use client";

import { Avatar } from "../avatar";
import { DemoFrame, DemoGrid, DemoSection, DemoStack } from "../example-theme/demo";
import { HoverCard } from "./index";
import { Typography } from "../typography";

export default function Example() {
  return (
    <DemoFrame title="Hover Card" description="Hover cards work best as lightweight previews of nearby content. These demos use them for people and package summaries rather than full task flows.">
      <DemoSection title="Profile preview" description="Keep the content short and immediately useful, and always expose the trigger as a real focusable control.">
        <DemoGrid>
          <div>
            <button popoverTarget="profile-preview" type="button">Open maintainer preview</button>
            <HoverCard id="profile-preview">
              <DemoStack>
                <Avatar fallback="JP" />
                <Typography as="h3" scale="title">Jordan Patel</Typography>
                <span>Design systems engineer maintaining tokens, docs, and example quality.</span>
              </DemoStack>
            </HoverCard>
          </div>
          <div>
            <button popoverTarget="package-preview" type="button">Open package preview</button>
            <HoverCard id="package-preview">
              <DemoStack>
                <Typography as="h3" scale="title">@stylextras/ui</Typography>
                <span>Native-first component primitives, theme tokens, and colocated demos for documentation pages.</span>
              </DemoStack>
            </HoverCard>
          </div>
        </DemoGrid>
      </DemoSection>
    </DemoFrame>
  );
}
