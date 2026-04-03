"use client";

import { Avatar } from "./index";
import { DemoFrame, DemoRow, DemoSection, DemoStack } from "../example-theme/demo";

export default function Example() {
  return (
    <DemoFrame title="Avatar" description="Use avatars for profile identity, assignee chips, and presence-heavy interfaces.">
      <DemoSection title="Fallbacks and sizes" description="Fallbacks should still be meaningful when an image is absent.">
        <DemoStack>
          <DemoRow>
            <Avatar fallback="NM" size="sm" />
            <Avatar fallback="NM" size="md" />
            <Avatar fallback="NM" size="lg" />
          </DemoRow>
          <DemoRow>
            <Avatar fallback="JD" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&h=240&fit=crop&crop=faces" alt="Jordan Doe" />
            <span>Assignee: Jordan Doe</span>
          </DemoRow>
        </DemoStack>
      </DemoSection>
    </DemoFrame>
  );
}

